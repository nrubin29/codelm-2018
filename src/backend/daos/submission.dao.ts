import mongoose = require('mongoose');
import { isGradedSubmission, SubmissionModel, TestCaseSubmissionModel } from '../../common/models/submission.model';
import { GradedProblemModel, TestCaseOutputMode } from '../../common/models/problem.model';
import { ModelPopulateOptions } from 'mongoose';
import { SocketManager } from '../socket.manager';
import { UpdateTeamPacket } from '../../common/packets/update.team.packet';
import { ProblemUtil } from '../../common/utils/problem.util';

type SubmissionType = SubmissionModel & mongoose.Document;

const TestCaseSubmissionSchema = new mongoose.Schema({
  hidden: Boolean,
  input: String,
  correctOutput: String,
  output: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

function isTrue(str: string): boolean {
  return str === 'true' || str === 'True' || str === '1';
}

function isFalse(str: string): boolean {
  return str === 'false' || str === 'False' || str === '0';
}

function isTestCaseSubmissionCorrect(testCase: TestCaseSubmissionModel, problem: GradedProblemModel): boolean {
  if (!testCase.output) {
    return false;
  }

  switch (problem.testCaseOutputMode) {
    case TestCaseOutputMode.CaseSensitive: {
      return testCase.output === testCase.correctOutput;
    }
    case TestCaseOutputMode.CaseInsensitive: {
      return testCase.output.toLowerCase() === testCase.correctOutput.toLowerCase();
    }
    case TestCaseOutputMode.Number: {
      return parseFloat(testCase.output).toFixed(5) === parseFloat(testCase.correctOutput).toFixed(5);
    }
    case TestCaseOutputMode.Boolean: {
      return (isTrue(testCase.output) && isTrue(testCase.correctOutput)) || (isFalse(testCase.output) && isFalse(testCase.correctOutput));
    }
    default: {
      throw new Error(`No support for output mode ${problem.testCaseOutputMode}`);
    }
  }
}

TestCaseSubmissionSchema.virtual('correct').get(function() {
  return isTestCaseSubmissionCorrect(this, this.parent().problem);
});

const SubmissionFileSchema = new mongoose.Schema({
  name: String,
  contents: String
});

const SubmissionSchema = new mongoose.Schema({
  team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
  problem: {type: mongoose.Schema.Types.ObjectId, ref: 'Problem'},
  language: String,
  code: String,
  files: [SubmissionFileSchema],
  test: {type: Boolean, default: false},
  testCases: [TestCaseSubmissionSchema],
  error: String,
  overrideCorrect: {type: Boolean, default: false},
  datetime: {type: Date, default: Date.now},
  dispute: {
    open: Boolean,
    message: String
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export function sanitizeSubmission(submission: SubmissionModel): SubmissionModel {
  if (isGradedSubmission(submission)) {
    submission.problem.testCases = submission.problem.testCases.filter(testCase => !testCase.hidden);

    if (submission.testCases) {
      submission.testCases = submission.testCases.filter(testCase => !testCase.hidden);
    }
  }

  return submission;
}

SubmissionSchema.virtual('result').get(function() {
  if (this.overrideCorrect) {
    return 'Override correct';
  }

  else if (this.error) {
    return 'Error';
  }

  else {
    return ((this.testCases.filter(testCase => isTestCaseSubmissionCorrect(testCase, this.problem)).length / this.testCases.length) * 100).toFixed(0) + '%';
  }
});

// TODO: Lock the question after a certain number of incorrect submissions.
SubmissionSchema.virtual('points').get(function() {
  if (isGradedSubmission(this)) {
    if (this.test) {
      return 0;
    }

    else if (this.overrideCorrect) {
      return ProblemUtil.getPoints(this.problem, this.team);
    }

    else if (this.error) {
      return 0;
    }

    else if (this.testCases.every(testCase => testCase.toObject().correct)) {
      return ProblemUtil.getPoints(this.problem, this.team);
    }

    else {
      return 0;
    }
  }

  else {
    return this.points;
  }
});

const Submission = mongoose.model<SubmissionType>('Submission', SubmissionSchema);

export class SubmissionDao {
  private static readonly problemPopulationPath: ModelPopulateOptions = {path: 'problem', model: 'Problem', populate: {path: 'divisions.division', model: 'Division'}};
  private static readonly teamPopulationPath: ModelPopulateOptions = {path: 'team', model: 'Team', populate: {path: 'division', model: 'Division'}};

  static getSubmission(id: string): Promise<SubmissionType> {
    return Submission.findById(id).populate(SubmissionDao.problemPopulationPath).populate(SubmissionDao.teamPopulationPath).exec();
  }

  static getSubmissionsForTeam(teamId: string): Promise<SubmissionModel[]> {
    return Submission.find({team: teamId}).populate(SubmissionDao.problemPopulationPath).populate(SubmissionDao.teamPopulationPath).exec();
  }

  static getDisputedSubmissions(): Promise<SubmissionModel[]> {
    return Submission.find({'dispute.open': true}).populate(SubmissionDao.problemPopulationPath).populate(SubmissionDao.teamPopulationPath).exec();
  }

  static async getScoreForTeam(teamId: string): Promise<number> {
    // This is needed because if the score is calculated in team.dao, there is circular population.
    const submissions = await Submission.find({team: teamId}).populate(SubmissionDao.problemPopulationPath).populate(SubmissionDao.teamPopulationPath).exec();
    return submissions.reduce(((previousValue: number, currentValue: any) => previousValue + currentValue.toObject().points), 0);
  }

  static addSubmission(submission: SubmissionModel): Promise<SubmissionModel> {
    return Submission.create(submission);
  }

  static updateSubmission(id: string, submission: SubmissionModel): Promise<SubmissionModel> {
    return Submission.findOneAndUpdate({_id: id}, submission, {new: true}).populate(SubmissionDao.problemPopulationPath).populate(SubmissionDao.teamPopulationPath).exec();
  }

  static async deleteSubmission(id: string): Promise<void> {
    const submission = await SubmissionDao.getSubmission(id);
    await Submission.deleteOne({_id: id}).exec();
    SocketManager.instance.emit(submission.team._id.toString(), new UpdateTeamPacket());
  }
}
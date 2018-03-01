import mongoose = require('mongoose');
import { SubmissionModel, TestCaseSubmissionModel } from '../../common/models/submission.model';
import { ProblemModel, TestCaseOutputMode } from '../../common/models/problem.model';
import { ModelPopulateOptions } from 'mongoose';
import { SocketManager } from '../socket.manager';
import { UpdateTeamPacket } from '../../common/packets/update.team.packet';

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

function toBoolean(str: string): boolean {
  return str === 'true' || str === 'True' || str === '1';
}

function isTestCaseSubmissionCorrect(testCase: TestCaseSubmissionModel, problem: ProblemModel): boolean {
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
      return toBoolean(testCase.output) === toBoolean(testCase.correctOutput);
    }
    default: {
      throw new Error(`No support for output mode ${problem.testCaseOutputMode}`);
    }
  }
}

TestCaseSubmissionSchema.virtual('correct').get(function() {
  return isTestCaseSubmissionCorrect(this, this.parent().problem);
});

const SubmissionSchema = new mongoose.Schema({
  team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
  problem: {type: mongoose.Schema.Types.ObjectId, ref: 'Problem'},
  language: String,
  code: String,
  test: {type: Boolean, default: false},
  testCases: [TestCaseSubmissionSchema],
  error: String,
  overrideCorrect: {type: Boolean, default: false},
  datetime: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export function sanitizeSubmission(submission: SubmissionModel): SubmissionModel {
  submission.problem.testCases = submission.problem.testCases.filter(testCase => !testCase.hidden);

  if (submission.testCases) {
    submission.testCases = submission.testCases.filter(testCase => !testCase.hidden);
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

// TODO: Lock the question after a certain number of incorrect submissions or start taking away points.
SubmissionSchema.virtual('points').get(function() {
  if (this.test) {
    return 0;
  }

  else if (this.overrideCorrect) {
    return this.problem.points;
  }

  else if (this.error) {
    return 0;
  }

  else if (this.testCases.every(testCase => testCase.toObject().correct)) {
    return this.problem.points;
  }

  else {
    return 0;
  }
});

const Submission = mongoose.model<SubmissionType>('Submission', SubmissionSchema);

export class SubmissionDao {
  private static readonly problemPopulationPath: ModelPopulateOptions = {path: 'problem', model: 'Problem', populate: {path: 'divisions.division', model: 'Division'}};
  private static readonly teamPopulationPath = {path: 'team', model: 'Team', populate: {path: 'division', model: 'Division'}};

  static getSubmission(id: string): Promise<SubmissionModel> {
    return Submission.findById(id).populate(SubmissionDao.problemPopulationPath).populate(SubmissionDao.teamPopulationPath).exec();
  }

  static getSubmissionsForTeam(teamId: string): Promise<SubmissionModel[]> {
    return Submission.find({team: teamId}).populate(SubmissionDao.problemPopulationPath).populate(SubmissionDao.teamPopulationPath).exec();
  }

  static getScoreForTeam(teamId: string): Promise<number> {
    // This is needed because if the score is calculated in team.dao, there is circular population.
    return new Promise<number>((resolve, reject) => {
      Submission.find({team: teamId}).populate(SubmissionDao.problemPopulationPath).exec().then(submissions => {
        resolve(submissions.reduce(((previousValue: number, currentValue: any) => previousValue + currentValue.toObject().points), 0));
      }).catch(reject);
    });
  }

  static addSubmission(submission: SubmissionModel): Promise<SubmissionType> {
    return Submission.create(submission);
  }

  static deleteSubmission(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      SubmissionDao.getSubmission(id).then(submission => {
        Submission.deleteOne({_id: id}).exec().then(() => {
          SocketManager.instance.emit(submission.team._id.toString(), new UpdateTeamPacket());
          resolve();
        }).catch(reject);
      }).catch(reject);
    });
  }
}
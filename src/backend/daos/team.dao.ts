import mongoose = require('mongoose');
import crypto = require('crypto');
import { TeamModel } from '../../common/models/team.model';
import { SubmissionModel } from '../../common/models/submission.model';

type TeamType = TeamModel & mongoose.Document;

const TestCaseSubmissionSchema = new mongoose.Schema({
  id: Number,
  hidden: Boolean,
  input: String,
  correctOutput: String,
  output: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

TestCaseSubmissionSchema.virtual('correct').get(function() {
  if (this.parent().problem.testCasesCaseSensitive) {
    return this.correctOutput === this.output;
  }

  return this.correctOutput.toLowerCase() === this.output.toLowerCase();
});

const SubmissionSchema = new mongoose.Schema({
  id: Number,
  problem: {type: mongoose.Schema.Types.ObjectId, ref: 'Problem'},
  code: String,
  testCases: [TestCaseSubmissionSchema],
  result: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

SubmissionSchema.virtual('points').get(function() {
  if (this.testCases.every(testCase => testCase.toObject().correct)) {
    return this.problem.points;
  }

  else {
    return -1;
  }
});

const TeamSchema = new mongoose.Schema({
  id: Number,
  username: String,
  password: String,
  salt: String,
  members: String,
  division: {type: mongoose.Schema.Types.ObjectId, ref: 'Division'},
  submissions: [SubmissionSchema],
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

TeamSchema.virtual('score').get(function() {
  return this.submissions.reduce(((previousValue: number, currentValue: any) => previousValue + currentValue.toObject().points), 0);
});

const Team = mongoose.model<TeamType>('Team', TeamSchema);

export class TeamDao {
  static getTeam(id: string): Promise<TeamModel> {
    return Team.findOne({id: id}).populate('division submissions.problem submissions.testCases.testCase').exec()
  }

  static addSubmission(teamId: string, submission: SubmissionModel): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      Team.findByIdAndUpdate(teamId, {$push: {submissions: submission}}, {new: true}).exec().then((team: TeamModel) => {
        resolve(team.submissions[team.submissions.length - 1]._id);
      }).catch(reject);
    });
  }

  static login(username: string, password: string) {
    return new Promise<TeamModel>((resolve, reject) => {
      Team.findOne({username: username}).populate('division submissions.problem submissions.testCases.testCase').then(team => {
        const inputHash = crypto.pbkdf2Sync(password, new Buffer(team.salt), 1000, 64, 'sha512').toString('hex');

        if (inputHash === team.password) {
          resolve(team);
        }

        else {
          reject('Incorrect password');
        }
      }).catch(reject);
    })
  }
}
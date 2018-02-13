import mongoose = require('mongoose');
import crypto = require('crypto');
import { TeamModel } from '../../common/models/team.model';
import { SubmissionModel } from '../../common/models/submission.model';
import { LoginResponse } from '../../common/packets/login.response.packet';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { AdminDao } from './admin.dao';

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
  problem: {type: mongoose.Schema.Types.ObjectId, ref: 'Problem'},
  language: String,
  code: String,
  result: String,
  test: {type: Boolean, default: false},
  testCases: [TestCaseSubmissionSchema],
  error: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

SubmissionSchema.virtual('points').get(function() {
  if (this.test) {
    return 0;
  }

  else if (this.error) {
    return -1;
  }

  else if (this.testCases.every(testCase => testCase.toObject().correct)) {
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
    return Team.findById(id).populate('division submissions.problem').exec()
  }

  static getTeamsForDivision(divisionId: string) {
    return Team.find({division: {_id: divisionId}}).populate('division submissions.problem').exec();
  }

  static addSubmission(teamId: string, submission: SubmissionModel): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      Team.findByIdAndUpdate(teamId, {$push: {submissions: submission}}, {new: true}).exec().then((team: TeamModel) => {
        resolve(team.submissions[team.submissions.length - 1]._id);
      }).catch(reject);
    });
  }

  static getSubmission(submissionId: string): Promise<SubmissionModel> {
    // TODO: Maybe make this nicer?
    return new Promise((resolve, reject) => {
      Team.find().populate('submissions.problem').exec().then((teams: TeamModel[]) => {
        for (let team of teams) {
          let submission = team.submissions.filter(submission => submission._id == submissionId);
          if (submission.length > 0) {
            resolve(submission[0]);
            return;
          }
        }

        reject(`Could not find submission with id ${submissionId}`);
      }).catch(reject);
    });
  }

  static login(username: string, password: string): Promise<TeamModel> {
    return new Promise<TeamModel>((resolve, reject) => {
      Team.findOne({username: username}).populate('division submissions.problem submissions.testCases.testCase').then(team => {
        if (!team) {
          reject(LoginResponse.NotFound);
        }

        const inputHash = crypto.pbkdf2Sync(password, new Buffer(team.salt), 1000, 64, 'sha512').toString('hex');

        if (inputHash === team.password) {
          resolve(team);
        }

        else {
          reject(LoginResponse.IncorrectPassword);
        }
      }).catch(reject);
    })
  }

  static forceTeam(req: Request, res: Response, next: NextFunction) {
    TeamDao.getTeam(req.header('Authorization').split(' ')[1]).then(team => {
      req.params.team = team;
      next();
    }).catch(next);
  };
}
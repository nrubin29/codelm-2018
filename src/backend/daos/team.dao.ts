import mongoose = require('mongoose');
import crypto = require('crypto');
import { TeamModel } from '../../common/models/team.model';
import { LoginResponse } from '../../common/packets/login.response.packet';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { SubmissionDao } from './submission.dao';
import { NativeError } from "mongoose";

type TeamType = TeamModel & mongoose.Document;

const TeamSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  password: String,
  salt: String,
  members: String,
  division: {type: mongoose.Schema.Types.ObjectId, ref: 'Division'},
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export function sanitizeTeam(team: TeamModel): TeamModel {
  team.password = undefined;
  team.salt = undefined;
  return team;
}

// I don't really want this, but it might allow me to synchronously calculate the score. Too bad it doesn't work.
// TeamSchema.virtual('submissions', {
//   ref: 'Submission',
//   localField: '_id',
//   foreignField: 'team'
// });

// TODO: Since this doesn't work, I should a nicer way to calculate the score than what I have right now.
// TeamSchema.virtual('score').get(function() {
//   return new Promise<number>((resolve, reject) => {
//     SubmissionDao.getSubmissionsForTeam(this._id).then(submissions => {
//       resolve(submissions.reduce(((previousValue: number, currentValue: any) => previousValue + currentValue.toObject().points), 0));
//     }).catch(reject);
//   });
// });

function scoreFunction(doc: TeamType, next: (err?: NativeError) => void) {
  // For some reason, doc can either be a TeamType or a TeamType[].

  let docs = [];

  if (Array.isArray(doc)) {
    docs = doc;
  }

  else {
    docs = [doc];
  }

  docs.forEach(doc => {
    SubmissionDao.getScoreForTeam(doc._id).then(score => {
      doc.set('score', score, {strict: false});
      next();
    }).catch(next);
  });
}

TeamSchema.post('init', scoreFunction);
TeamSchema.post('find', scoreFunction);

const Team = mongoose.model<TeamType>('Team', TeamSchema);

export class TeamDao {
  static getTeam(id: string): Promise<TeamModel> {
    return Team.findById(id).populate('division').exec();
  }

  static getTeamsForDivision(divisionId: string): Promise<TeamModel[]> {
    return Team.find({division: {_id: divisionId}}).populate('division').exec();
  }

  static login(username: string, password: string): Promise<TeamModel> {
    return new Promise<TeamModel>((resolve, reject) => {
      Team.findOne({username: username}).populate('division').then(team => {
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

  static addOrUpdateTeam(team: any): Promise<TeamModel> {
    if (team.password) {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(team.password, new Buffer(salt), 1000, 64, 'sha512').toString('hex');

      team.salt = salt;
      team.password = hash;
    }

    if (!team._id) {
      return Team.create(team as TeamModel);
    }

    else {
      return Team.findByIdAndUpdate(team._id, team, {new: true}).exec();
    }
  }

  // TODO: Consolidate code between register() and addOrUpdateTeam()
  static register(team: any): Promise<TeamModel> {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(team.password, new Buffer(salt), 1000, 64, 'sha512').toString('hex');

    team.salt = salt;
    team.password = hash;

    // TODO: Check for valid division.

    return new Promise<TeamModel>((resolve, reject) => {
      Team.create(team as TeamModel).then(team => {
        // This is needed to populate the necessary fields.
        TeamDao.getTeam(team._id).then(team => {
          resolve(team);
        }).catch(reject);
      }).catch(err => {
        if (err.code !== undefined && err.code === 11000) { // It's a MongoError for not-unique username.
          reject(LoginResponse.AlreadyExists);
        }

        else {
          reject(err);
        }
      });
    });
  }

  static deleteTeam(id: string): Promise<void> {
    return Team.deleteOne({_id: id}).exec();
  }

  static forceTeam(req: Request, res: Response, next: NextFunction) {
    TeamDao.getTeam(req.header('Authorization').split(' ')[1]).then(team => {
      req.params.team = team;
      next();
    }).catch(next);
  };
}
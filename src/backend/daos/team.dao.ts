import mongoose = require('mongoose');
import { TeamModel } from '../../common/models/team.model';
import { SubmissionModel } from '../../common/models/submission.model';

type TeamType = TeamModel & mongoose.Document;

const SubmissionSchema = new mongoose.Schema({
  id: Number,
  // team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
  problem: {type: mongoose.Schema.Types.ObjectId, ref: 'Problem'},
  code: String,
  testCases: [{
    id: Number,
    hidden: Boolean,
    input: String,
    correctOutput: String,
    output: String
  }],
  result: String
});

const Team = mongoose.model<TeamType>('Team', new mongoose.Schema({
  id: Number,
  username: String,
  password: String,
  members: String,
  division: {type: mongoose.Schema.Types.ObjectId, ref: 'Division'},
  submissions: [SubmissionSchema],
}));

export class TeamDao {
  static getTeam(id: string): Promise<TeamModel> {
    return Team.findOne({id: id}).populate('division submissions.problem submissions.testCases.testCase').exec()
  }

  static addSubmission(id: string, submission: SubmissionModel): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      Team.findOneAndUpdate({id: id}, {$push: {submissions: submission}}, {new: true}).exec().then((team: TeamModel) => {
        resolve(team.submissions[team.submissions.length - 1]._id);
      }).catch(reject);
    });
  }
}
// import mongoose = require('mongoose');
// import { SubmissionModel } from '../../common/models/submission.model';
//
// type SubmissionType = SubmissionModel & mongoose.Document;
//
// const Submission = mongoose.model<SubmissionType>('Submission', new mongoose.Schema({
//   id: Number,
//   team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
//   problem: {type: mongoose.Schema.Types.ObjectId, ref: 'Problem'},
//   code: String,
//   testCases: [{
//     testCase: {type: mongoose.Schema.Types.ObjectId, ref: 'Problem.testCases'},
//     output: String
//   }],
//   result: String
// }));
//
// export class SubmissionDao {
//   static getSubmission(id: string): Promise<SubmissionModel> {
//     return Submission.findOne({id: id}).populate('team problem testCases.testCase').exec()
//   }
//
//   static getSubmissionsForTeam(team: string): Promise<SubmissionModel[]> {
//     return Submission.find({team: {id: team}}).populate('team problem testCases.testCase').exec()
//   }
// }
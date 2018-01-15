import mongoose = require('mongoose');
import { ProblemModel } from '../../common/models/problem.model';

type ProblemType = ProblemModel & mongoose.Document;

//new mongoose.Schema().loadClass(ProblemModel)

export const TestCaseSchema = new mongoose.Schema({
  id: Number,
  hidden: Boolean,
  input: String,
  output: String
});

const Problem = mongoose.model<ProblemType>('Problem', new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  divisions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Division'}],
  points: Number,
  testCases: [TestCaseSchema]
}));

export class ProblemDao {

  static getProblem(id: string): Promise<ProblemModel> {
    return Problem.findOne({id: id}).exec()
  }

  static getProblemsForDivision(division: string): Promise<ProblemModel[]> {
    return Problem.find({division: {id: division}}).exec()
  }
}
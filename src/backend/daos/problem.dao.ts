import mongoose = require('mongoose');
import { ProblemModel } from '../../common/models/problem.model';

type ProblemType = ProblemModel & mongoose.Document;

const ProblemDivisionSchema = new mongoose.Schema({
  division: {type: mongoose.Schema.Types.ObjectId, ref: 'Division'},
  problemNumber: Number
});

const TestCaseSchema = new mongoose.Schema({
  hidden: Boolean,
  input: String,
  output: String
});

const Problem = mongoose.model<ProblemType>('Problem', new mongoose.Schema({
  title: String,
  description: String,
  divisions: [ProblemDivisionSchema],
  points: Number,
  testCasesCaseSensitive: {type: Boolean, default: true},
  testCases: [TestCaseSchema]
}));

export class ProblemDao {
  static getProblem(id: string): Promise<ProblemModel> {
    return Problem.findById(id).populate('divisions.division').exec()
  }

  static getProblemsForDivision(divisionId: string): Promise<ProblemModel[]> {
    // TODO: Sort based on problemNumber for given divisionId.
    return Problem.find({'divisions.division': divisionId}).populate('divisions.division').exec()
  }

  static addOrUpdateProblem(problem: ProblemModel): Promise<ProblemModel> {
    if (!problem._id) {
      return Problem.create(problem);
    }

    else {
      return Problem.findByIdAndUpdate(problem._id, problem, {new: true}).exec();
    }
  }

  static deleteProblem(id: string): Promise<void> {
    return Problem.deleteOne({_id: id}).exec();
  }
}
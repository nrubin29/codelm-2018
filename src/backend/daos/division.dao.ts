import mongoose = require('mongoose');
import { DivisionModel } from '../../common/models/division.model';

type DivisionType = DivisionModel & mongoose.Document;

const Division = mongoose.model<DivisionType>('Division', new mongoose.Schema({
  id: Number,
  name: String
}));

export class DivisionDao {

  static getDivision(id: string): Promise<DivisionModel> {
    return Division.findOne({id: id}).exec()
  }

  static getDivisions(): Promise<DivisionModel[]> {
    return Division.find({}).exec()
  }
}
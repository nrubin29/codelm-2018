import mongoose = require('mongoose');
import { DivisionModel } from '../../common/models/division.model';

type DivisionType = DivisionModel & mongoose.Document;

const DivisionSchema = new mongoose.Schema({
  id: Number,
  name: String
});

const Division = mongoose.model<DivisionType>('Division', DivisionSchema);

export class DivisionDao {
  static getDivision(id: string): Promise<DivisionModel> {
    return Division.findOne({id: id}).populate('problems').exec()
  }

  static getDivisions(): Promise<DivisionModel[]> {
    return Division.find().populate('problems').exec()
  }
}
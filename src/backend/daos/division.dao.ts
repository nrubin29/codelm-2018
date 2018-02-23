import mongoose = require('mongoose');
import { DivisionModel, DivisionType } from '../../common/models/division.model';

type DivisionDocumentType = DivisionModel & mongoose.Document;

const DivisionSchema = new mongoose.Schema({
  id: Number,
  name: String,
  type: {type: Number, default: DivisionType.Competition}
});

const Division = mongoose.model<DivisionDocumentType>('Division', DivisionSchema);

export class DivisionDao {
  static getDivisions(): Promise<DivisionModel[]> {
    return Division.find().exec();
  }

  static getDivisionsOfType(divisionType: DivisionType): Promise<DivisionModel[]> {
    return Division.find({type: divisionType}).exec();
  }

  static addOrUpdateDivision(division: DivisionModel): Promise<DivisionModel> {
    if (!division._id) {
      return Division.create(division);
    }

    else {
      return Division.findByIdAndUpdate(division._id, division, {new: true}).exec();
    }
  }

  static deleteDivision(id: string): Promise<void> {
    return Division.deleteOne({_id: id}).exec();
  }
}
import { DivisionModel } from './division.model';

export interface TeamModel {
  id: number;
  name: string;
  members: string;
  division: DivisionModel;
}
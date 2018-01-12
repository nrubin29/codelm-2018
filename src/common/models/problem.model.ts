import { DivisionModel } from './division.model';

export interface ProblemModel {
  id: number;
  title: string;
  divisions: DivisionModel[];
  points: number;
  io: {input: string, output: string}[];
}
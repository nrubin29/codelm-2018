export enum DivisionType {
  Competition,
  Preliminaries,
  Special
}

export interface DivisionModel {
  _id: string;
  name: string;
  type: DivisionType
}
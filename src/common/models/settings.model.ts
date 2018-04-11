export enum SettingsState {
  Preliminaries = 'Preliminaries',
  Graded = 'Graded',
  Upload = 'Upload',
  Closed = 'Closed',
  End = 'End',
  Debug = 'Debug'
}

export interface ScheduleModel {
  newState: SettingsState;
  when: Date;
}

export interface SettingsModel {
  state: SettingsState;
  schedule: ScheduleModel[];
  openRegistration: boolean;
}

export const defaultSettingsModel: SettingsModel = Object.freeze({state: SettingsState.Closed, schedule: [], openRegistration: false});
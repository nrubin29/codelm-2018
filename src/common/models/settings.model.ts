export enum SettingsState {
  Preliminaries = 'Preliminaries',
  Competition = 'Competition',
  Closed = 'Closed',
  End = 'End',
  Debug = 'Debug'
}

export interface SettingsModel {
  state: SettingsState;
  end: Date;
  openRegistration: boolean;
}

export const defaultSettingsModel: SettingsModel = Object.freeze({state: SettingsState.Closed, end: new Date(), openRegistration: false});
import { Packet } from './packet';
import { TeamModel } from '../models/team.model';
import { AdminModel } from '../models/admin.model';

export const enum LoginResponse {
  SuccessTeam = 'Success Team',
  SuccessAdmin = 'Success Admin',
  IncorrectPassword = 'Incorrect Password',
  NotFound = 'Account not found',
  Closed = 'You cannot log in at this time',
  AlreadyExists = 'An account with that username already exists',
  OutdatedClient = 'Please refresh the page. If this error persists, clear your browser cache',
  Error = 'An internal error occurred.',
}

export class LoginResponsePacket extends Packet {
  constructor(public response: LoginResponse, public team?: TeamModel, public admin?: AdminModel) {
    super('loginResponse');
  }
}

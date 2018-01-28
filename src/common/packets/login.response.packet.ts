import Packet from './packet';
import { TeamModel } from '../models/team.model';

export class LoginResponsePacket extends Packet {
  constructor(public success: boolean, public team?: TeamModel) {
    super('loginResponse');
  }
}
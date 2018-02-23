import Packet from './packet';

export class RegisterPacket extends Packet {

  constructor(public teamData: RegisterTeamData) {
    super('register');
  }
}

export interface RegisterTeamData {
  username: string;
  password: string;
  members: string;
  division: string
}
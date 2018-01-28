import Packet from './packet';

export class LoginPacket extends Packet {

  constructor(public username: string, public password: string) {
    super('login');
  }
}
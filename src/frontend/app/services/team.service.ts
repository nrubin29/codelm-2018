import { Injectable } from '@angular/core';
import { TeamModel } from '../../../common/models/team.model';
import { SocketService } from './socket.service';
import Packet from '../../../common/packets/packet';
import { RestService } from './rest.service';
import { LoginPacket } from '../../../common/packets/login.packet';
import { LoginResponsePacket } from '../../../common/packets/login.response.packet';

@Injectable()
export class TeamService {

  team?: TeamModel;

  constructor(private restService: RestService, private socketService: SocketService) { }

  login(username: string, password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.socketService.connect().then(() => {
        let sub = this.socketService.stream.subscribe(packet => {
          if (packet.name == 'loginResponse') {
            const loginResponsePacket = packet as LoginResponsePacket;

            sub.unsubscribe();

            if (loginResponsePacket.success) {
              this.team = loginResponsePacket.team;
              this.restService.teamId = loginResponsePacket.team._id;
              resolve();
            }

            else {
              reject();
            }
          }
        });

        this.socketService.emit(new LoginPacket(username, password));
      });
    });
  }
}

import { Injectable } from '@angular/core';
import { TeamModel } from '../../../common/models/team.model';
import { SocketService } from './socket.service';
import Packet from '../../../common/packets/packet';
import { RestService } from './rest.service';

@Injectable()
export class TeamService {

  team: TeamModel;

  constructor(private socketService: SocketService, private restService: RestService) { }

  login(username: string, password: string) {
    this.socketService.connect().then(() => {
      // TODO: Emit team packet.
      let sub = this.socketService.stream.subscribe(packet => {
        if (packet.name == 'loginResponse') {
          // TODO: Save team and key
          sub.unsubscribe()
        }
      })
    })
  }
}

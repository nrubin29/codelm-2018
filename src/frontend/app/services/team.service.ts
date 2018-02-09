import { Injectable } from '@angular/core';
import { TeamModel } from '../../../common/models/team.model';
import { SocketService } from './socket.service';
import { RestService } from './rest.service';
import { LoginPacket } from '../../../common/packets/login.packet';
import { LoginResponsePacket } from '../../../common/packets/login.response.packet';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class TeamService {
  private endpoint = 'teams';
  team: BehaviorSubject<TeamModel>;

  constructor(private restService: RestService, private socketService: SocketService) {
    this.team = new BehaviorSubject<TeamModel>(null);
  }

  login(username: string, password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.socketService.connect().then(() => {
        let sub = this.socketService.stream.subscribe(packet => {
          if (packet.name == 'loginResponse') {
            const loginResponsePacket = packet as LoginResponsePacket;

            sub.unsubscribe();

            if (loginResponsePacket.success) {
              this.team.next(loginResponsePacket.team);
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

  refreshTeam(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.restService.get<TeamModel>(this.endpoint).then(team => {
        this.team.next(team);
        resolve();
      }).catch(reject);
    });
  }

  getTeam(id: string) {
    return this.restService.get<TeamModel>(`${this.endpoint}/${id}`)
  }

  getTeamsForDivision(divisionId: string) {
    return this.restService.get<TeamModel[]>(`${this.endpoint}/division/${divisionId}`);
  }
}

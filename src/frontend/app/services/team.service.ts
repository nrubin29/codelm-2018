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

  constructor(private restService: RestService) {
    this.team = new BehaviorSubject<TeamModel>(null);
  }

  refreshTeam(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.restService.get<TeamModel>(this.endpoint).then(team => {
        this.team.next(team);
        resolve();
      }).catch(reject);
    });
  }

  getTeam(id: string): Promise<TeamModel> {
    return this.restService.get<TeamModel>(`${this.endpoint}/${id}`)
  }

  getTeamsForDivision(divisionId: string): Promise<TeamModel[]> {
    return this.restService.get<TeamModel[]>(`${this.endpoint}/division/${divisionId}`);
  }
}

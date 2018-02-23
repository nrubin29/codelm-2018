import { Injectable } from '@angular/core';
import { LoginPacket } from '../../../common/packets/login.packet';
import { LoginResponse, LoginResponsePacket } from '../../../common/packets/login.response.packet';
import { SocketService } from './socket.service';
import { TeamService } from './team.service';
import { RestService } from './rest.service';
import { AdminService } from './admin.service';
import { RegisterPacket, RegisterTeamData } from '../../../common/packets/register.packet';

@Injectable()
export class AuthService {
  constructor(private socketService: SocketService, private restService: RestService, private teamService: TeamService, private adminService: AdminService) {}

  login(username: string, password: string): Promise<LoginResponse> {
    return new Promise<LoginResponse>((resolve, reject) => {
      this.socketService.connect().then(() => {
        let sub = this.socketService.stream.subscribe(packet => {
          if (packet.name == 'loginResponse') {
            const loginResponsePacket = packet as LoginResponsePacket;

            sub.unsubscribe();

            if (loginResponsePacket.response === LoginResponse.SuccessTeam) {
              this.teamService.team.next(loginResponsePacket.team);
              this.restService.authId = loginResponsePacket.team._id;
              this.socketService.listenOnDisconnect();
              resolve(LoginResponse.SuccessTeam);
            }

            else if (loginResponsePacket.response === LoginResponse.SuccessAdmin) {
              this.adminService.admin.next(loginResponsePacket.admin);
              this.restService.authId = loginResponsePacket.admin._id;
              this.socketService.listenOnDisconnect();
              resolve(LoginResponse.SuccessAdmin);
            }

            else {
              reject(loginResponsePacket.response);
            }
          }
        });

        this.socketService.emit(new LoginPacket(username, password));
      }).catch(reject);
    });
  }

  // TODO: Consolidate this code with login().
  register(teamData: RegisterTeamData): Promise<LoginResponse> {
    return new Promise<LoginResponse>((resolve, reject) => {
      this.socketService.connect().then(() => {
        let sub = this.socketService.stream.subscribe(packet => {
          if (packet.name == 'loginResponse') {
            const loginResponsePacket = packet as LoginResponsePacket;

            sub.unsubscribe();

            if (loginResponsePacket.response === LoginResponse.SuccessTeam) {
              this.teamService.team.next(loginResponsePacket.team);
              this.restService.authId = loginResponsePacket.team._id;
              this.socketService.listenOnDisconnect();
              resolve(LoginResponse.SuccessTeam);
            }

            else {
              reject(loginResponsePacket.response);
            }
          }
        });

        this.socketService.emit(new RegisterPacket(teamData));
      }).catch(reject);
    });
  }
}

import { RegisterPacket } from '../common/packets/register.packet';
import { LoginPacket } from '../common/packets/login.packet';
import { sanitizeTeam, TeamDao } from './daos/team.dao';
import { AdminDao } from './daos/admin.dao';
import Packet from '../common/packets/packet';
import { PermissionsUtil } from './permissions.util';
import { LoginResponse, LoginResponsePacket } from '../common/packets/login.response.packet';
import { UserModel } from '../common/models/user.model';

export class SocketManager {
  private static _instance: SocketManager;

  static get instance(): SocketManager {
    if (!SocketManager._instance) {
      throw new Error('SocketManager has not been initialized.');
    }

    return SocketManager._instance;
  }

  public static init(server: SocketIO.Server) {
    if (SocketManager._instance) {
      throw new Error('SocketManager has already been initialized.');
    }

    SocketManager._instance = new SocketManager(server);
  }

  private sockets: Map<string, SocketIO.Socket>;

  public emit(userId: string, packet: Packet) {
    if (this.sockets.has(userId)) {
      this.sockets.get(userId).emit('packet', packet);
    }
  }

  public emitToAll(packet: Packet) {
    this.sockets.forEach((socket => socket.emit('packet', packet)));
  }

  protected constructor(private server: SocketIO.Server) {
    this.sockets = new Map<string, SocketIO.Socket>();

    server.on('connection', socket => {
      let _id;

      socket.on('packet', (packet: Packet) => {
        if (packet.name === 'login') {
          let loginPacket = packet as LoginPacket;
          TeamDao.login(loginPacket.username, loginPacket.password).then(team => {
            const response = PermissionsUtil.hasAccess(team) ? LoginResponse.SuccessTeam : LoginResponse.Closed;
            socket.emit('packet', new LoginResponsePacket(response, response === LoginResponse.SuccessTeam ? sanitizeTeam(team) : undefined));

            if (response === LoginResponse.SuccessTeam) {
              _id = team._id.toString();
              this.sockets.set(_id, socket);
            }

            else {
              socket.disconnect(true);
            }
          }).catch((response: LoginResponse | Error) => {
            if (response === LoginResponse.NotFound) {
              AdminDao.login(loginPacket.username, loginPacket.password).then(admin => {
                _id = admin._id.toString();
                this.sockets.set(_id, socket);
                socket.emit('packet', new LoginResponsePacket(LoginResponse.SuccessAdmin, undefined, admin));
              }).catch((response: LoginResponse | Error) => {
                if ((response as any).stack !== undefined) {
                  console.error(response);
                  socket.emit('packet', new LoginResponsePacket(LoginResponse.Error));
                }

                else {
                  socket.emit('packet', new LoginResponsePacket(response as LoginResponse));
                }

                socket.disconnect(true);
              });
            }

            else if ((response as any).stack !== undefined) {
              console.error(response);
              socket.emit('packet', new LoginResponsePacket(LoginResponse.Error));
              socket.disconnect(true);
            }

            else {
              socket.emit('packet', new LoginResponsePacket(response as LoginResponse));
              socket.disconnect(true);
            }
          });
        }

        else if (packet.name === 'register') {
          let registerPacket = packet as RegisterPacket;
          // TODO: Merge this with the login code.
          TeamDao.register(registerPacket.teamData).then(team => {
            const response = PermissionsUtil.hasAccess(team) ? LoginResponse.SuccessTeam : LoginResponse.Closed;
            socket.emit('packet', new LoginResponsePacket(response, response === LoginResponse.SuccessTeam ? sanitizeTeam(team) : undefined));
          }).catch((response: LoginResponse | Error) => {
            if ((response as any).stack !== undefined) {
              console.error(response);
              socket.emit('packet', new LoginResponsePacket(LoginResponse.Error));
            }

            else {
              socket.emit('packet', new LoginResponsePacket(response as LoginResponse));
            }

            socket.disconnect(true);
          });
        }
      });

      socket.once('disconnect', () => {
        this.sockets.delete(_id);
      });
    });
  }
}
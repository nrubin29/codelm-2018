import { RegisterPacket } from '../common/packets/register.packet';
import { LoginPacket } from '../common/packets/login.packet';
import { sanitizeTeam, TeamDao } from './daos/team.dao';
import { AdminDao } from './daos/admin.dao';
import { Packet } from '../common/packets/packet';
import { PermissionsUtil } from './permissions.util';
import { LoginResponse, LoginResponsePacket } from '../common/packets/login.response.packet';
import { VERSION } from '../common/version';
import { isClientPacket } from '../common/packets/client.packet';

export class SocketManager {
  private static _instance: SocketManager;

  private sockets: Map<string, SocketIO.Socket>;

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

  public emit(userId: string, packet: Packet) {
    if (this.sockets.has(userId)) {
      this.sockets.get(userId).emit('packet', packet);
    }
  }

  public emitToAll(packet: Packet) {
    this.sockets.forEach((socket => socket.emit('packet', packet)));
  }

  // TODO: Convert this to async/await (if socket.io supports it)
  protected constructor(private server: SocketIO.Server) {
    this.sockets = new Map<string, SocketIO.Socket>();

    server.on('connection', socket => {
      let _id;

      socket.on('packet', (packet: Packet) => {
        if (isClientPacket(packet) && packet.version !== VERSION) {
          socket.emit('packet', new LoginResponsePacket(LoginResponse.OutdatedClient));
          socket.disconnect(true);
          return;
        }

        if (packet.name === 'login') {
          const loginPacket = packet as LoginPacket;

          TeamDao.login(loginPacket.username, loginPacket.password).then(team => {
            PermissionsUtil.hasAccess(team).then(access => {
              const response = access ? LoginResponse.SuccessTeam : LoginResponse.Closed;
              socket.emit('packet', new LoginResponsePacket(response, response === LoginResponse.SuccessTeam ? sanitizeTeam(team) : undefined));

              if (response === LoginResponse.SuccessTeam) {
                _id = team._id.toString();
                this.sockets.set(_id, socket);
              }

              else {
                socket.disconnect(true);
              }
            });
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
          const registerPacket = packet as RegisterPacket;
          // TODO: Merge this with the login code.
          TeamDao.register(registerPacket.teamData).then(team => {
            PermissionsUtil.hasAccess(team).then(access => {
              const response = access ? LoginResponse.SuccessTeam : LoginResponse.Closed;
              socket.emit('packet', new LoginResponsePacket(response, response === LoginResponse.SuccessTeam ? sanitizeTeam(team) : undefined));

              if (response === LoginResponse.SuccessTeam) {
                _id = team._id.toString();
                this.sockets.set(_id, socket);
              }

              else {
                socket.disconnect(true);
              }
            });
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

import express = require('express');
import morgan = require('morgan');
import bodyParser = require('body-parser');
import mongoose = require('mongoose');
import http = require('http');
import io = require('socket.io');

import Packet from '../common/packets/packet';
import { LoginPacket } from '../common/packets/login.packet';
import { RegisterPacket } from '../common/packets/register.packet';
import { LoginResponse, LoginResponsePacket } from '../common/packets/login.response.packet';

import './daos/dao';
import { TeamDao } from './daos/team.dao';
import { AdminDao } from './daos/admin.dao';
import { SettingsDao } from './daos/settings.dao';
import { DivisionType } from '../common/models/division.model';
import { SettingsState } from '../common/models/settings.model';

import apiRoutes from './routes/route';

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // Parse application/vnd.api+json as json
app.use(express.static('./dist/frontend'));
app.use('/api', apiRoutes);

const httpSocketServer = http.createServer(app);
const socketServer = io(httpSocketServer);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/codelm', {useMongoClient: true}).then(() => {
  console.log('Connected to MongoDB');

  httpSocketServer.listen(4000, () => {
    console.log('Started socket server');

    socketServer.on('connection', socket => {
      // TODO: Move this logic to its own file.
      // TODO: Emit an error message on internal error.
      socket.on('packet', (packet: Packet) => {
        if (packet.name === 'login') {
          let loginPacket = packet as LoginPacket;
          // TODO: Clean this up.
          TeamDao.login(loginPacket.username, loginPacket.password).then(team => {
            SettingsDao.getSettings().then(settings => {
              const response = team.division.type === DivisionType.Special || settings.state === SettingsState.Debug || (settings.state === SettingsState.Competition && team.division.type === DivisionType.Competition) || (settings.state === SettingsState.Preliminaries && team.division.type === DivisionType.Preliminaries) ? LoginResponse.SuccessTeam : LoginResponse.Closed;
              socket.emit('packet', new LoginResponsePacket(response, response === LoginResponse.SuccessTeam ? team : undefined));

              if (response === LoginResponse.Closed) {
                socket.disconnect(true);
              }
            }).catch(console.error);
          }).catch((response: LoginResponse | Error) => {
            if (response === LoginResponse.NotFound) {
              AdminDao.login(loginPacket.username, loginPacket.password).then(admin => {
                socket.emit('packet', new LoginResponsePacket(LoginResponse.SuccessAdmin, undefined, admin));
              }).catch((response: LoginResponse | Error) => {
                if ((response as any).stack !== undefined) {
                  console.error(response);
                }

                else {
                  socket.emit('packet', new LoginResponsePacket(response as LoginResponse));
                  socket.disconnect(true);
                }
              });
            }

            else if ((response as any).stack !== undefined) {
              console.error(response);
            }

            else {
              socket.emit('packet', new LoginResponsePacket(response as LoginResponse));
              socket.disconnect(true);
            }
          });
        }

        else if (packet.name === 'register') {
          let registerPacket = packet as RegisterPacket;
          // TODO: Clean this up.
          TeamDao.register(registerPacket.teamData).then(team => {
            console.log(team);
            SettingsDao.getSettings().then(settings => {
              socket.emit('packet', new LoginResponsePacket(settings.state === SettingsState.Debug || (settings.state === SettingsState.Preliminaries && team.division.type === DivisionType.Preliminaries) ? LoginResponse.SuccessTeam : LoginResponse.Closed, team));
            }).catch(console.error);
          }).catch((response: LoginResponse | Error) => {
            if ((response as any).stack !== undefined) {
              console.error(response);
            }

            else {
              socket.emit('packet', new LoginResponsePacket(response as LoginResponse));
              socket.disconnect(true);
            }
          });
        }
      });
    });

    app.listen(8080, () => {
      console.log('Listening on http://localhost:8080');
    });
  })
}).catch(console.error);
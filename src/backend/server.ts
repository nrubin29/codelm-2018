import express = require('express');
import morgan = require('morgan');
import bodyParser = require('body-parser');
import mongoose = require('mongoose');
import http = require('http');
import io = require('socket.io');
import { LoginPacket } from '../common/packets/login.packet';
import { LoginResponsePacket } from '../common/packets/login.response.packet';
import { TeamDao } from './daos/team.dao';

import Packet from '../common/packets/packet';
import './daos/dao';
import divisionRoute from './routes/division.route';
import problemRoute from './routes/problem.route';
import teamRoute from './routes/team.route';

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // Parse application/vnd.api+json as json
app.use(express.static('./dist/frontend'));
app.use('/api/divisions', divisionRoute);
app.use('/api/problems', problemRoute);
app.use('/api/teams', teamRoute);

const httpSocketServer = http.createServer(app);
const socketServer = io(httpSocketServer);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/codelm', {useMongoClient: true}).then(() => {
  console.log('Connected to MongoDB');

  httpSocketServer.listen(4000, () => {
    console.log('Started socket server');

    socketServer.on('connection', socket => {
      socket.on('packet', (packet: Packet) => {
        if (packet.name === 'login') {
          let loginPacket = packet as LoginPacket;
          TeamDao.login(loginPacket.username, loginPacket.password).then(team => {
            socket.emit('packet', new LoginResponsePacket(true, team));
          }).catch(err => {
            console.error(err);
            socket.emit('packet', new LoginResponsePacket(false));
            // socket.disconnect(true);
          });
        }
      });
    });

    app.listen(8080, () => {
      console.log('Listening on http://localhost:8080');
    });
  })
}).catch(console.error);
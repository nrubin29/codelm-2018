import express = require('express');
import morgan = require('morgan');
import bodyParser = require('body-parser');
import path = require('path');
import fileUpload = require('express-fileupload');
import mongoose = require('mongoose');
import http = require('http');
import io = require('socket.io');
import { SettingsDao } from './daos/settings.dao';
import { SocketManager } from './socket.manager';
import { VERSION } from '../common/version';
import './daos/dao';
import apiRoutes from './routes/route';

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // Parse application/vnd.api+json as json
app.use(fileUpload());
app.use(express.static(path.join('.', 'files')));
app.use(express.static(path.join('.', 'dist', 'frontend')));
app.use('/api', apiRoutes);

const httpSocketServer = http.createServer(app);
const socketServer = io(httpSocketServer);

console.log(`Starting CodeLM server build ${VERSION}`);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/codelm', {useMongoClient: true}).then(() => {
  console.log('Connected to MongoDB');

  SettingsDao.getSettings().then(settings => {
    console.log('Scheduled ' + SettingsDao.scheduleJobs(settings) + ' events.');

    httpSocketServer.listen(4000, () => {
      SocketManager.init(socketServer);
      console.log('Started socket server');

      app.listen(8080, () => {
        console.log('Listening on http://localhost:8080');
      });
    });
  });
}).catch(console.error);

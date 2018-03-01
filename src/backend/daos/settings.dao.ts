import mongoose = require('mongoose');
import { DefaultSettingsModel, SettingsModel, SettingsState } from '../../common/models/settings.model';
import { Job, scheduleJob } from 'node-schedule';
import { SocketManager } from '../socket.manager';
import { UpdateSettingsPacket } from '../../common/packets/update.settings.packet';

type SettingsType = SettingsModel & mongoose.Document;

const SettingsSchema = new mongoose.Schema({
  state: {type: String, default: SettingsState.Closed},
  end: {type: Date, default: Date.now}
});

const Settings = mongoose.model<SettingsType>('Settings', SettingsSchema);

export class SettingsDao {
  private static job: Job;

  static getSettings(): Promise<SettingsModel> {
    return new Promise<SettingsModel>((resolve, reject) => {
      return Settings.findOne().exec().then(settings => {
        if (settings) {
          resolve(settings);
        }

        else {
          Settings.create(DefaultSettingsModel).then(settings => {
            resolve(settings);
          }).catch(reject);
        }
      }).catch(reject);
    });
  }

  static updateSettings(settings: any): Promise<SettingsModel> {
    // TODO: If needed, send packet to kick connected teams.
    return new Promise<SettingsModel>((resolve, reject) => {
      SettingsDao.getSettings().then((oldSettings: SettingsModel) => {
        Settings.updateOne({}, settings, {upsert: true, new: true}).exec().then((newSettings: SettingsModel) => {
          if (oldSettings.end !== newSettings.end) {
            if (SettingsDao.job) {
              SettingsDao.job.cancel();
            }

            SettingsDao.job = scheduleJob(settings.end, () => {
              settings.state = SettingsState.End;
              this.updateSettings(settings);
            });
          }

          SocketManager.instance.emitToAll(new UpdateSettingsPacket());
          resolve(newSettings);
        }).catch(reject);
      });
    });
  }

  static resetSettings(): Promise<SettingsModel> {
    return new Promise<SettingsModel>((resolve, reject) => {
      Settings.deleteOne({}).exec().then(() => {
        Settings.create(DefaultSettingsModel).then(settings => {
          SocketManager.instance.emitToAll(new UpdateSettingsPacket());
          resolve(settings);
        }).catch(reject);
      }).catch(reject);
    });
  }

  // static forceAdmin(req: Request, res: Response, next: NextFunction) {
  //   AdminDao.getAdmin(req.header('Authorization').split(' ')[1]).then(admin => {
  //     req.params.admin = admin;
  //     next();
  //   }).catch(next);
  // };
}
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

  static async getSettings(): Promise<SettingsModel> {
    const settings = await Settings.findOne().exec();

    if (settings) {
      return settings;
    }

    else {
      return await Settings.create(DefaultSettingsModel);
    }
  }

  static async updateSettings(settings: any): Promise<SettingsModel> {
    // TODO: If needed, send packet to kick connected teams.
    const oldSettings = await SettingsDao.getSettings();
    const newSettings: SettingsModel = await Settings.updateOne({}, settings, {upsert: true, new: true}).exec();

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
    return newSettings;
  }

  static async resetSettings(): Promise<SettingsModel> {
    await Settings.deleteOne({}).exec();
    const settings = await Settings.create(DefaultSettingsModel);
    SocketManager.instance.emitToAll(new UpdateSettingsPacket());
    return settings;
  }
}
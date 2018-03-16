import mongoose = require('mongoose');
import { defaultSettingsModel, SettingsModel, SettingsState } from '../../common/models/settings.model';
import { Job, scheduleJob as nodeScheduleJob } from 'node-schedule';
import { SocketManager } from '../socket.manager';
import { UpdateSettingsPacket } from '../../common/packets/update.settings.packet';

type SettingsType = SettingsModel & mongoose.Document;

const SettingsSchema = new mongoose.Schema({
  state: {type: String, default: SettingsState.Closed},
  end: Date,
  openRegistration: {type: Boolean, default: false}
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
      return await Settings.create(defaultSettingsModel);
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

      SettingsDao.scheduleJob(newSettings);
    }

    SocketManager.instance.emitToAll(new UpdateSettingsPacket());
    return newSettings;
  }

  static scheduleJob(settings: SettingsModel) {
    SettingsDao.job = nodeScheduleJob(settings.end, () => {
      settings.state = SettingsState.End;
      SettingsDao.updateSettings(settings);
    });
  }

  static async resetSettings(): Promise<SettingsModel> {
    await Settings.deleteOne({}).exec();
    const settings = await Settings.create(defaultSettingsModel);
    SocketManager.instance.emitToAll(new UpdateSettingsPacket());
    return settings;
  }
}
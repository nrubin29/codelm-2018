import { Router } from 'express';
import { AdminDao } from '../daos/admin.dao';
import { SettingsDao } from '../daos/settings.dao';

const router = Router();

// TODO: Don't require admin, sanitize SettingsModel object as needed, or send specific settings info when team logs in.
router.get('/', AdminDao.forceAdmin, (req, res) => {
  SettingsDao.getSettings().then(settings => res.json(settings));
});

router.put('/', AdminDao.forceAdmin, (req, res) => {
  SettingsDao.updateSettings(req.body).then(settings => res.json(settings)).catch(console.error);
});

router.delete('/', AdminDao.forceAdmin, (req, res) => {
  SettingsDao.resetSettings().then(() => res.json(true)).catch(console.error);
});

export default router
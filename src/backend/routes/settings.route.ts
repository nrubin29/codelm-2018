import { Router } from 'express';
import { SettingsDao } from '../daos/settings.dao';
import { PermissionsUtil } from '../permissions.util';

const router = Router();

// TODO: Sanitize SettingsModel object as needed.
router.get('/', (req, res) => {
  SettingsDao.getSettings().then(settings => res.json(settings));
});

router.put('/', PermissionsUtil.requireAdmin, PermissionsUtil.requireSuperUser, (req, res) => {
  SettingsDao.updateSettings(req.body).then(settings => res.json(settings)).catch(console.error);
});

router.delete('/', PermissionsUtil.requireAdmin, PermissionsUtil.requireSuperUser, (req, res) => {
  SettingsDao.resetSettings().then(() => res.json(true)).catch(console.error);
});

export default router
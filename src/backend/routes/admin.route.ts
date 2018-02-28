import { Router } from 'express';
import { AdminDao } from '../daos/admin.dao';
import { PermissionsUtil } from '../permissions.util';

const router = Router();

router.get('/', PermissionsUtil.requireAdmin, PermissionsUtil.requireSuperUser, (req, res) => {
  AdminDao.getAdmins().then(admins => res.json(admins));
});

router.put('/', PermissionsUtil.requireAdmin, PermissionsUtil.requireSuperUser, (req, res) => {
  AdminDao.addOrUpdateAdmin(req.body).then(admin => res.json(admin)).catch(console.error);
});

router.delete('/:id', PermissionsUtil.requireAdmin, PermissionsUtil.requireSuperUser, (req, res) => {
  AdminDao.deleteAdmin(req.params.id).then(() => res.json(true)).catch(console.error);
});

export default router
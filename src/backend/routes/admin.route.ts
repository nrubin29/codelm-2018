import { Router } from 'express';
import { AdminDao } from '../daos/admin.dao';

const router = Router();

router.get('/', AdminDao.forceAdmin, (req, res) => {
  AdminDao.getAdmins().then(admins => res.json(admins));
});

router.put('/', AdminDao.forceAdmin, (req, res) => {
  AdminDao.addOrUpdateAdmin(req.body).then(admin => res.json(admin)).catch(console.error);
});

router.delete('/:id', AdminDao.forceAdmin, (req, res) => {
  AdminDao.deleteAdmin(req.params.id).then(() => res.json(true)).catch(console.error);
});

export default router
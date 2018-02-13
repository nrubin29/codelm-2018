import { Router } from 'express';
import { DivisionDao } from '../daos/division.dao';
import { DivisionModel } from '../../common/models/division.model';
import { AdminDao } from '../daos/admin.dao';

const router = Router();

// TODO: Don't send hidden data unless user is admin.

router.get('/', AdminDao.forceAdmin, (req, res) => {
  DivisionDao.getDivisions().then(divisions => res.json(divisions));
});

router.put('/', AdminDao.forceAdmin, (req, res) => {
  DivisionDao.addOrUpdateDivision(req.body as DivisionModel).then(problem => res.json(problem)).catch(console.error);
});

router.delete('/:id', AdminDao.forceAdmin, (req, res) => {
  DivisionDao.deleteDivision(req.params.id).then(() => res.json(true)).catch(console.error)
});

export default router
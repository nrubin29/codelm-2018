import { Router } from 'express';
import { DivisionDao } from '../daos/division.dao';

const router = Router();

// TODO: Don't send hidden data unless user is admin.

router.get('/', (req, res) => {
  DivisionDao.getDivisions().then(divisions => res.json(divisions));
});

export default router
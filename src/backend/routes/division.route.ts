import { Router } from 'express';
import { DivisionDao } from '../daos/division.dao';
import { DivisionModel, DivisionType } from '../../common/models/division.model';
import { AdminDao } from '../daos/admin.dao';

const router = Router();

// TODO: If there is any sensitive Division data, don't send it.
router.get('/', (req, res) => {
  AdminDao.forceAdmin(req, res, () => {
    if (req.params.admin) {
      DivisionDao.getDivisions().then(divisions => res.json(divisions));
    }

    else {
      DivisionDao.getDivisionsOfType(DivisionType.Preliminaries).then(divisions => res.json(divisions));
    }
  });
});

router.put('/', AdminDao.forceAdmin, (req, res) => {
  DivisionDao.addOrUpdateDivision(req.body as DivisionModel).then(problem => res.json(problem)).catch(console.error);
});

router.delete('/:id', AdminDao.forceAdmin, (req, res) => {
  DivisionDao.deleteDivision(req.params.id).then(() => res.json(true)).catch(console.error)
});

export default router
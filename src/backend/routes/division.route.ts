import { Request, Response, Router } from 'express';
import { DivisionDao } from '../daos/division.dao';
import { DivisionModel, DivisionType } from '../../common/models/division.model';
import { PermissionsUtil } from '../permissions.util';
import { FileArray, UploadedFile } from 'express-fileupload';

const router = Router();

router.get('/', PermissionsUtil.requestAdmin, async (req: Request, res: Response) => {
  if (req.params.admin) {
    res.json(await DivisionDao.getDivisions());
  }

  else {
    res.json(await DivisionDao.getDivisionsOfType(DivisionType.Preliminaries));
  }
});

router.put('/', PermissionsUtil.requireAdmin, PermissionsUtil.requireSuperUser, async (req: Request & {files?: FileArray}, res: Response) => {
  const division = await DivisionDao.addOrUpdateDivision(req.body as DivisionModel);

  if (req.files) {
    const file = req.files['starterCode'] as UploadedFile;
    file.mv(`./files/files/${division._id}.zip`, err => {
      if (err) {
        res.json(err);
      }

      else {
        res.json(division);
      }
    });
  }

  else {
    res.json(division);
  }
});

router.delete('/:id', PermissionsUtil.requireAdmin, PermissionsUtil.requireSuperUser, async (req: Request, res: Response) => {
  await DivisionDao.deleteDivision(req.params.id);
  res.json(true);
});

export default router
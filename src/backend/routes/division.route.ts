import { Router, Request, Response } from 'express';
import { DivisionDao } from '../daos/division.dao';
import { DivisionModel, DivisionType } from '../../common/models/division.model';
import { PermissionsUtil } from '../permissions.util';
import { FileArray, UploadedFile } from 'express-fileupload';

const router = Router();

router.get('/', PermissionsUtil.requestAuth, (req: Request, res: Response) => {
  if (req.params.admin) {
    DivisionDao.getDivisions().then(divisions => res.json(divisions));
  }

  else {
    DivisionDao.getDivisionsOfType(DivisionType.Preliminaries).then(divisions => res.json(divisions));
  }
});

router.put('/', PermissionsUtil.requireAdmin, (req: Request & {files?: FileArray}, res: Response) => {
  DivisionDao.addOrUpdateDivision(req.body as DivisionModel).then(division => {
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
  }).catch(console.error);
});

router.delete('/:id', PermissionsUtil.requireAdmin, (req: Request, res: Response) => {
  DivisionDao.deleteDivision(req.params.id).then(() => res.json(true)).catch(console.error)
});

export default router
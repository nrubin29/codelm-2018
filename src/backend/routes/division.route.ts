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
    const handle = (file: UploadedFile, type: string) => {
      return new Promise<void>((resolve, reject) => {
        file.mv(`./files/files/${type}/${division._id}.zip`, err => {
          if (err) {
            reject(err);
          }

          else {
            resolve();
          }
        });
      });
    };

    if (req.files['gradedStarterCode']) {
      try {
        await handle(<UploadedFile>req.files['gradedStarterCode'], 'graded');
      }

      catch (err) {
        res.json(err);
        return;
      }
    }

    if (req.files['uploadStarterCode']) {
      try {
        await handle(<UploadedFile>req.files['uploadStarterCode'], 'upload');
      }

      catch (err) {
        res.json(err);
        return;
      }
    }

    res.json(division);
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
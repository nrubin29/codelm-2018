import { Router } from 'express';
import { sanitizeSubmission, SubmissionDao } from '../daos/submission.dao';
import { PermissionsUtil } from '../permissions.util';
import { SubmissionModel } from '../../common/models/submission.model';

const router = Router();

router.get('/', PermissionsUtil.requireTeam, (req, res) => {
  SubmissionDao.getSubmissionsForTeam(req.params.team._id).then(submissions => {
    res.json(submissions.map(submission => sanitizeSubmission(submission)));
  });
});

router.get('/team/:id', PermissionsUtil.requireAdmin, (req, res) => {
  SubmissionDao.getSubmissionsForTeam(req.params.id).then(submissions => {
    res.json(submissions);
  });
});

router.get('/:id', PermissionsUtil.requireAuth, (req, res) => {
  SubmissionDao.getSubmission(req.params.id).then(submission => {
    if (req.params.team) {
      // The toString() calls are needed because both _ids are objects.
      if (submission.team._id.toString() == req.params.team._id.toString()) {
        res.json(sanitizeSubmission(submission));
      }

      else {
        res.sendStatus(403);
      }
    }

    else if (req.params.admin) {
      res.json(submission);
    }

    else {
      res.sendStatus(403);
    }
  });
});

router.put('/:id', PermissionsUtil.requireAdmin, (req, res) => {
  SubmissionDao.updateSubmission(req.params.id, req.body as SubmissionModel).then(submission => {
    res.json(submission);
  });
});

router.delete('/:id', PermissionsUtil.requireAdmin, (req, res) => {
  SubmissionDao.deleteSubmission(req.params.id).then(() => res.json());
});

export default router
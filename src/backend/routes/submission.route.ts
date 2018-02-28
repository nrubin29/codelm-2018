import { Router } from 'express';
import { sanitizeSubmission, SubmissionDao } from '../daos/submission.dao';
import { PermissionsUtil } from '../permissions.util';

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
        console.log('match');

        res.json(sanitizeSubmission(submission));
      }

      else {
        res.json(false);
      }
    }

    else if (req.params.admin) {
      res.json(submission);
    }

    else {
      res.json(false);
    }
  });
});

export default router
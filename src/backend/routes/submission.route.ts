import { Router } from 'express';
import { AdminDao } from '../daos/admin.dao';
import { TeamDao } from '../daos/team.dao';
import { sanitizeSubmission, SubmissionDao } from '../daos/submission.dao';

const router = Router();

router.get('/', TeamDao.forceTeam, (req, res) => {
  SubmissionDao.getSubmissionsForTeam(req.params.team._id).then(submissions => {
    res.json(submissions.map(submission => sanitizeSubmission(submission)));
  });
});

router.get('/team/:id', AdminDao.forceAdmin, (req, res) => {
  SubmissionDao.getSubmissionsForTeam(req.params.id).then(submissions => {
    res.json(submissions);
  });
});

router.get('/:id', (req, res) => {
  SubmissionDao.getSubmission(req.params.id).then(submission => {
    TeamDao.forceTeam(req, res, () => {
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

      else {
        AdminDao.forceAdmin(req, res, () => {
          if (req.params.admin) {
            res.json(submission);
          }

          else {
            res.json(false);
          }
        });
      }
    });
  });
});

export default router
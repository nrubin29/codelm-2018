import { Router, Request, Response } from 'express';
import { sanitizeSubmission, SubmissionDao } from '../daos/submission.dao';
import { PermissionsUtil } from '../permissions.util';
import { SubmissionModel } from '../../common/models/submission.model';

const router = Router();

router.get('/', PermissionsUtil.requireTeam, (req: Request, res: Response) => {
  SubmissionDao.getSubmissionsForTeam(req.params.team._id).then(submissions => {
    res.json(submissions.map(submission => sanitizeSubmission(submission)));
  });
});

router.get('/team/:id', PermissionsUtil.requireAdmin, (req: Request, res: Response) => {
  SubmissionDao.getSubmissionsForTeam(req.params.id).then(submissions => {
    res.json(submissions);
  });
});

router.get('/disputes', PermissionsUtil.requireAdmin, (req: Request, res: Response) => {
  SubmissionDao.getDisputedSubmissions().then(submissions => {
    res.json(submissions);
  });
});

router.get('/:id', PermissionsUtil.requireAuth, (req: Request, res: Response) => {
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

router.put('/:id', PermissionsUtil.requireAuth, (req: Request, res: Response) => {
  if (req.params.team) {
    SubmissionDao.getSubmission(req.params.id).then(submission => {
      // Only allow teams to set the dispute message.
      submission.set('dispute.message', req.body.dispute.message);
      submission.set('dispute.open', true);

      SubmissionDao.updateSubmission(req.params.id, submission as SubmissionModel).then(submission => {
        res.json(submission);
      });
    })
  }

  else if (req.params.admin) {
    SubmissionDao.updateSubmission(req.params.id, req.body as SubmissionModel).then(submission => {
      res.json(submission);
    });
  }

  else {
    res.sendStatus(403);
  }
});

router.delete('/:id', PermissionsUtil.requireAdmin, (req: Request, res: Response) => {
  SubmissionDao.deleteSubmission(req.params.id).then(() => res.json());
});

export default router
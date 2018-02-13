import { Router } from 'express';
import { TeamDao } from '../daos/team.dao';
import { AdminDao } from '../daos/admin.dao';

const router = Router();

router.get('/', TeamDao.forceTeam, (req, res) => {
  res.json(req.params.team);
});

router.get('/:id', AdminDao.forceAdmin, (req, res) => {
  TeamDao.getTeam(req.params.id).then(team => res.json(team));
});

// TODO: Don't send hidden test cases and other sensitive data unless user is admin.

router.get('/submissions', TeamDao.forceTeam, (req, res) => {
  res.json(req.params.team.submissions);
});

router.get('/submissions/:id', (req, res) => {
  TeamDao.forceTeam(req, res, err => {
    if (!err) {
      res.json(req.params.team.submissions.find(t => t._id.toString() === req.params.id));
    }

    else {
      AdminDao.forceAdmin(req, res, err => {
        if (!err) {
          TeamDao.getSubmission(req.params.id).then(submission => res.json(submission));
        }

        else {
          res.json(false);
        }
      })
    }
  });
});

router.get('/division/:id', AdminDao.forceAdmin, ((req, res) => {
  TeamDao.getTeamsForDivision(req.params.id).then(teams => res.json(teams));
}));

export default router
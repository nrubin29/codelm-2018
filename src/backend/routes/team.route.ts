import { Router } from 'express';
import { TeamDao } from '../daos/team.dao';

const router = Router();

router.get('/', (req, res) => {
  TeamDao.getTeam(req.header('Authorization').split(' ')[1]).then(team => res.json(team))
});

router.get('/:id', (req, res) => {
  TeamDao.getTeam(req.params.id).then(team => res.json(team))
});

// TODO: Don't send hidden test cases and other sensitive data unless user is admin.

router.get('/submissions', (req, res) => {
  TeamDao.getTeam(req.header('Authorization').split(' ')[1]).then(team => res.json(team.submissions))
});

router.get('/submissions/:id', (req, res) => {
  // TODO: Fix this once admin auth is added.
  if (req.header('Authorization').split(' ')[1] === 'undefined') {
    TeamDao.getSubmission(req.params.id).then(submission => res.json(submission));
  }

  else {
    TeamDao.getTeam(req.header('Authorization').split(' ')[1]).then(team => res.json(team.submissions.find(t => t._id.toString() === req.params.id)))
  }
});

router.get('/division/:id', ((req, res) => {
  TeamDao.getTeamsForDivision(req.params.id).then(teams => res.json(teams));
}));

export default router
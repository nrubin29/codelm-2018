import { Router } from 'express';
import { TeamDao } from '../daos/team.dao';

const router = Router();

// TODO: Don't send hidden test cases unless user is admin.

router.get('/:id', (req, res) => {
  // TeamDao.getTeam('1').then(team => console.log(team.submissions));
  TeamDao.getTeam('1').then(team => res.json(team.submissions.find(t => t._id.toString() === req.params.id)))
  // SubmissionDao.getSubmission(req.params.id).then(p => res.json(p)).catch(console.error)
});

router.get('/?team=:tId', (req, res) => {
  TeamDao.getTeam('1').then(team => res.json(team.submissions))
  // SubmissionDao.getSubmissionsForTeam(req.params.tId).then(p => res.json(p)).catch(console.error)
});

export default router
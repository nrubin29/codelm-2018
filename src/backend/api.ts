import { Router } from 'express';
import { ProblemDao } from './daos/problem.dao';
import { TeamDao } from './daos/team.dao';
// import { SubmissionDao } from './daos/submission.dao';

const router = Router();

router.get('/problems/:id', (req, res) => {
  ProblemDao.getProblem(req.params.id).then(p => res.json(p)).catch(console.error)
});

router.get('/problems/?division=:dId', (req, res) => {
  ProblemDao.getProblemsForDivision(req.params.dId).then(p => res.json(p)).catch(console.error)
});

router.get('/submissions/:id', (req, res) => {
  // TeamDao.getTeam('1').then(team => console.log(team.submissions));
  TeamDao.getTeam('1').then(team => res.json(team.submissions.find(t => t.id.toString() === req.params.id)))
  // SubmissionDao.getSubmission(req.params.id).then(p => res.json(p)).catch(console.error)
});

router.get('/submissions/?team=:tId', (req, res) => {
  TeamDao.getTeam('1').then(team => res.json(team.submissions))
  // SubmissionDao.getSubmissionsForTeam(req.params.tId).then(p => res.json(p)).catch(console.error)
});

export default router
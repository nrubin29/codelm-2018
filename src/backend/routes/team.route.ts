import { Router } from 'express';
import { TeamDao } from '../daos/team.dao';

const router = Router();

router.get('/', (req, res) => {
  TeamDao.getTeam(req.header('Authorization').split(' ')[1]).then(team => res.json(team))
});

router.get('/:id', (req, res) => {
  TeamDao.getTeam(req.params.id).then(team => res.json(team))
});

// TODO: Don't send hidden test cases unless user is admin.

router.get('/submissions', (req, res) => {
  TeamDao.getTeam(req.header('Authorization').split(' ')[1]).then(team => res.json(team.submissions))
});

router.get('/submissions/:id', (req, res) => {
  TeamDao.getTeam(req.header('Authorization').split(' ')[1]).then(team => res.json(team.submissions.find(t => t._id.toString() === req.params.id)))
});

export default router
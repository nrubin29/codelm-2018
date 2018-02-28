import { Router } from 'express';
import { sanitizeTeam, TeamDao } from '../daos/team.dao';
import { AdminDao } from '../daos/admin.dao';

const router = Router();

router.get('/', TeamDao.forceTeam, (req, res) => {
  res.json(sanitizeTeam(req.params.team));
});

router.get('/:id', AdminDao.forceAdmin, (req, res) => {
  TeamDao.getTeam(req.params.id).then(team => res.json(team));
});

router.put('/', AdminDao.forceAdmin, (req, res) => {
  TeamDao.addOrUpdateTeam(req.body).then(team => res.json(team)).catch(console.error);
});

router.delete('/:id', AdminDao.forceAdmin, (req, res) => {
  TeamDao.deleteTeam(req.params.id).then(() => res.json(true)).catch(console.error);
});

router.get('/division/:id', AdminDao.forceAdmin, ((req, res) => {
  TeamDao.getTeamsForDivision(req.params.id).then(teams => res.json(teams));
}));

export default router
import { Router } from 'express';
import { sanitizeTeam, TeamDao } from '../daos/team.dao';
import { PermissionsUtil } from '../permissions.util';

const router = Router();

router.get('/', PermissionsUtil.requireTeam, (req, res) => {
  res.json(sanitizeTeam(req.params.team));
});

router.get('/:id', PermissionsUtil.requireAdmin, (req, res) => {
  TeamDao.getTeam(req.params.id).then(team => res.json(team));
});

router.put('/', PermissionsUtil.requireAdmin, (req, res) => {
  TeamDao.addOrUpdateTeam(req.body).then(team => res.json(team)).catch(console.error);
});

router.delete('/:id', PermissionsUtil.requireAdmin, (req, res) => {
  TeamDao.deleteTeam(req.params.id).then(() => res.json(true)).catch(console.error);
});

router.get('/division/:id', PermissionsUtil.requireAdmin, ((req, res) => {
  TeamDao.getTeamsForDivision(req.params.id).then(teams => res.json(teams));
}));

export default router
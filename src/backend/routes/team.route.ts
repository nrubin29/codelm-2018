import { Router } from 'express';
import { sanitizeSubmission, sanitizeTeam, TeamDao } from '../daos/team.dao';
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

router.get('/submissions', TeamDao.forceTeam, (req, res) => {
  res.json(req.params.team.submissions.map(submission => sanitizeSubmission(submission)));
});

router.get('/submissions/:id', (req, res) => {
  TeamDao.forceTeam(req, res, () => {
    if (req.params.team) {
      res.json(sanitizeSubmission(req.params.team.submissions.find(t => t._id.toString() === req.params.id)));
    }

    else {
      AdminDao.forceAdmin(req, res, () => {
        if (req.params.admin) {
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
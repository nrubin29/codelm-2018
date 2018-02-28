import { Router } from 'express';
import settingsRoute from './settings.route';
import divisionRoute from './division.route';
import problemRoute from './problem.route';
import teamRoute from './team.route';
import adminRoute from './admin.route';
import submissionRoute from './submission.route';

const router = Router();

router.use('/settings', settingsRoute);
router.use('/divisions', divisionRoute);
router.use('/problems', problemRoute);
router.use('/teams', teamRoute);
router.use('/admins', adminRoute);
router.use('/submissions', submissionRoute);

export default router;
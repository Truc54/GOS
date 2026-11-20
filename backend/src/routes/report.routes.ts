import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';

const router = Router();
const reportController = new ReportController();

router.get('/score-distribution', reportController.getScoreDistribution);
router.get('/top-group-a', reportController.getTopGroupA);

export default router;

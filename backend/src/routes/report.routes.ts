import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';

const router = Router();
const reportController = new ReportController();

router.get('/score-distribution', reportController.getScoreDistribution);

export default router;

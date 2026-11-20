import { Router } from 'express';
import { ScoreController } from '../controllers/ScoreController';

const router = Router();
const scoreController = new ScoreController();

router.get('/:sbd', scoreController.getBySbd);

export default router;

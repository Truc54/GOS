import { Router } from 'express';
import scoreRoutes from './score.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});

router.use('/scores', scoreRoutes);

export default router;

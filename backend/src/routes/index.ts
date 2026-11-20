import { Router } from 'express';
import { HttpStatus } from '../constants/httpStatus';
import scoreRoutes from './score.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(HttpStatus.OK).json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});

router.use('/scores', scoreRoutes);

export default router;

import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config/env';
import { HttpStatus } from './constants/httpStatus';
import { errorHandler } from './middlewares/errorHandler';
import apiRoutes from './routes';

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = env.CORS_ORIGIN.split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'OPTIONS'],
  }),
);
app.use(express.json());

app.use(
  '/api',
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests, please try again later.',
      },
    },
  }),
);

app.use('/api', apiRoutes);

app.use((_req, res) => {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  });
});

app.use(errorHandler);

export default app;

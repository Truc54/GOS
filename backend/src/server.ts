import app from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  console.log(`G-Scores API listening on port ${env.PORT} (${env.NODE_ENV})`);
});

const shutdown = (signal: string) => {
  console.log(`Received ${signal}, shutting down HTTP server...`);
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

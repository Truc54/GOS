import { Prisma, PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

dotenv.config();

// 5,000 rows * 11 columns = 55,000 bind parameters, safely below PostgreSQL's 65,535 limit
const BATCH_SIZE = 5000;
const LOG_EVERY_ROWS = 100_000;

const prisma = new PrismaClient();

function parseScore(value: string | undefined): number | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseOptionalCode(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

function parseCsvLine(line: string): Prisma.StudentScoreCreateManyInput | null {
  const columns = line.split(',');
  if (columns.length < 11) return null;

  const sbd = columns[0]?.trim();
  if (!sbd) return null;

  return {
    sbd,
    toan: parseScore(columns[1]),
    nguVan: parseScore(columns[2]),
    ngoaiNgu: parseScore(columns[3]),
    vatLi: parseScore(columns[4]),
    hoaHoc: parseScore(columns[5]),
    sinhHoc: parseScore(columns[6]),
    lichSu: parseScore(columns[7]),
    diaLi: parseScore(columns[8]),
    gdcd: parseScore(columns[9]),
    maNgoaiNgu: parseOptionalCode(columns[10]),
  };
}

async function seed(): Promise<void> {
  const csvPath = path.resolve(
    process.cwd(),
    process.env.CSV_FILE_PATH ?? '../dataset/diem_thi_thpt_2024.csv',
  );

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV dataset not found at: ${csvPath}`);
  }

  const existingCount = await prisma.studentScore.count();
  if (existingCount > 0) {
    console.log(`Database already contains ${existingCount.toLocaleString()} records. Skipping seed.`);
    return;
  }

  console.log(`Starting streaming seed from ${csvPath} (batch size: ${BATCH_SIZE})...`);
  const startedAt = performance.now();

  const fileStream = fs.createReadStream(csvPath, { encoding: 'utf8' });
  const lineReader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let isHeader = true;
  let totalInserted = 0;
  let nextLogThreshold = LOG_EVERY_ROWS;
  let batch: Prisma.StudentScoreCreateManyInput[] = [];

  for await (const rawLine of lineReader) {
    if (isHeader) {
      isHeader = false;
      continue;
    }

    if (!rawLine.trim()) continue;

    const record = parseCsvLine(rawLine);
    if (!record) continue;

    batch.push(record);

    if (batch.length >= BATCH_SIZE) {
      await prisma.studentScore.createMany({
        data: batch,
        skipDuplicates: true,
      });
      totalInserted += batch.length;
      batch = [];

      if (totalInserted >= nextLogThreshold) {
        const elapsedSec = ((performance.now() - startedAt) / 1000).toFixed(1);
        const memMb = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
        console.log(
          `Seeded ${totalInserted.toLocaleString()} records (${elapsedSec}s, RSS: ${memMb} MB)`,
        );
        nextLogThreshold += LOG_EVERY_ROWS;
      }
    }
  }

  if (batch.length > 0) {
    await prisma.studentScore.createMany({
      data: batch,
      skipDuplicates: true,
    });
    totalInserted += batch.length;
  }

  // Refresh planner statistics so PostgreSQL immediately leverages the partial expression index
  await prisma.$executeRawUnsafe('ANALYZE "student_scores";');

  const totalSeconds = ((performance.now() - startedAt) / 1000).toFixed(2);
  const peakMemMb = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
  console.log(
    `Completed seeding ${totalInserted.toLocaleString()} records in ${totalSeconds}s (RSS: ${peakMemMb} MB).`,
  );
}

seed()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import type { PrismaClient } from '@prisma/client';
import { prisma } from '../config/prisma';
import type { RawStudentScoreRecord } from '../domain/types';

export class ScoreRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  public async findBySbd(sbd: string): Promise<RawStudentScoreRecord | null> {
    return this.db.studentScore.findUnique({
      where: { sbd },
    });
  }
}

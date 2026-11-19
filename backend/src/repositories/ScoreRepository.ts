import { PrismaClient } from '@prisma/client';
import { prisma as defaultPrisma } from '../config/prisma';
import { RawStudentScoreRecord } from '../domain';

export class ScoreRepository {
  constructor(private readonly db: PrismaClient = defaultPrisma) {}

  public async findBySbd(sbd: string): Promise<RawStudentScoreRecord | null> {
    return this.db.studentScore.findUnique({
      where: { sbd },
    });
  }
}

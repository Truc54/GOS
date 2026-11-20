import type { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../constants/httpStatus';
import { ScoreService } from '../services/ScoreService';
import { sbdParamSchema } from '../validators/score.validator';

export class ScoreController {
  constructor(private readonly scoreService: ScoreService = new ScoreService()) {}

  public getBySbd = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { sbd } = sbdParamSchema.parse(req.params);
      const data = await this.scoreService.getScoreBySbd(sbd);

      res.status(HttpStatus.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

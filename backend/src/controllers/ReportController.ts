import type { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../constants/httpStatus';
import { ReportService } from '../services/ReportService';
import { topGroupAQuerySchema } from '../validators/report.validator';

export class ReportController {
  constructor(private readonly reportService: ReportService = new ReportService()) {}

  public getScoreDistribution = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await this.reportService.getScoreDistribution();

      res.status(HttpStatus.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public getTopGroupA = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { limit } = topGroupAQuerySchema.parse(req.query);
      const data = await this.reportService.getTopGroupA(limit);

      res.status(HttpStatus.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

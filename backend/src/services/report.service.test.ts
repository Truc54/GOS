import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { RawTopGroupARow, ReportRepository } from '../repositories/ReportRepository';
import { topGroupAQuerySchema } from '../validators/report.validator';
import { ReportService } from './ReportService';

describe('ReportService.getTopGroupA', () => {
  it('computes competition ranks with ties, total scores, and caches results', async () => {
    let queryCalls = 0;
    const mockRows: RawTopGroupARow[] = [
      { sbd: '26020938', toan: 9.6, vat_li: 10, hoa_hoc: 10 },
      { sbd: '01000010', toan: 9.6, vat_li: 10, hoa_hoc: 10 },
      { sbd: '02000020', toan: 9.8, vat_li: 9.75, hoa_hoc: 9.75 },
    ];

    const fakeRepository = {
      getTopGroupA: async () => {
        queryCalls += 1;
        return mockRows;
      },
    } as unknown as ReportRepository;

    const service = new ReportService(fakeRepository);
    const first = await service.getTopGroupA(10);
    const second = await service.getTopGroupA(10);

    assert.equal(queryCalls, 1);
    assert.equal(first.groupCode, 'A00');
    assert.equal(first.students.length, 3);
    assert.deepEqual(
      first.students.map((s) => ({ sbd: s.sbd, rank: s.rank, totalScore: s.totalScore })),
      [
        { sbd: '26020938', rank: 1, totalScore: 29.6 },
        { sbd: '01000010', rank: 1, totalScore: 29.6 },
        { sbd: '02000020', rank: 3, totalScore: 29.3 },
      ],
    );
    assert.deepEqual(second, first);
  });
});

describe('topGroupAQuerySchema validation', () => {
  it('defaults omitted or empty limit to 10 and rejects invalid values', () => {
    assert.equal(topGroupAQuerySchema.parse({}).limit, 10);
    assert.equal(topGroupAQuerySchema.parse({ limit: '' }).limit, 10);
    assert.equal(topGroupAQuerySchema.parse({ limit: '5' }).limit, 5);
    assert.throws(() => topGroupAQuerySchema.parse({ limit: '0' }));
    assert.throws(() => topGroupAQuerySchema.parse({ limit: '51' }));
    assert.throws(() => topGroupAQuerySchema.parse({ limit: '3.5' }));
    assert.throws(() => topGroupAQuerySchema.parse({ limit: 'abc' }));
  });
});

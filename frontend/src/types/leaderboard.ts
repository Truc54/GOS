export interface TopGroupAStudent {
  rank: number;
  sbd: string;
  scores: {
    toan: number;
    vat_li: number;
    hoa_hoc: number;
  };
  totalScore: number;
}

export interface TopGroupAReport {
  groupCode: string;
  groupName: string;
  limit: number;
  students: TopGroupAStudent[];
}

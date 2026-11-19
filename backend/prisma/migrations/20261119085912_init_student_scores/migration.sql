-- CreateTable
CREATE TABLE "student_scores" (
    "sbd" VARCHAR(10) NOT NULL,
    "toan" DOUBLE PRECISION,
    "ngu_van" DOUBLE PRECISION,
    "ngoai_ngu" DOUBLE PRECISION,
    "vat_li" DOUBLE PRECISION,
    "hoa_hoc" DOUBLE PRECISION,
    "sinh_hoc" DOUBLE PRECISION,
    "lich_su" DOUBLE PRECISION,
    "dia_li" DOUBLE PRECISION,
    "gdcd" DOUBLE PRECISION,
    "ma_ngoai_ngu" VARCHAR(5),

    CONSTRAINT "student_scores_pkey" PRIMARY KEY ("sbd")
);

-- Partial expression index for instant Top-N Group A00 (Math + Physics + Chemistry) ranking
-- without adding a redundant derived column to the table
CREATE INDEX "idx_student_scores_group_a_total"
ON "student_scores" (("toan" + "vat_li" + "hoa_hoc") DESC, "toan" DESC, "sbd" ASC)
WHERE "toan" IS NOT NULL AND "vat_li" IS NOT NULL AND "hoa_hoc" IS NOT NULL;

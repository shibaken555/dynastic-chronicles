-- CreateTable
CREATE TABLE "monarchs_records" (
    "id" SERIAL NOT NULL,
    "monarch_id" INTEGER NOT NULL,
    "record_type_id" INTEGER NOT NULL,
    "record_date" DATE NOT NULL,
    "provinces" INTEGER NOT NULL,
    "total_development" INTEGER NOT NULL,
    "tax_income" DECIMAL(10,2) NOT NULL,
    "production_income" DECIMAL(10,2) NOT NULL,
    "trade_income" DECIMAL(10,2) NOT NULL,
    "customs_income" DECIMAL(10,2) NOT NULL,
    "vassal_income" DECIMAL(10,2) NOT NULL,
    "army_troops" INTEGER NOT NULL,
    "navy_ships" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "monarchs_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "record_types" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(20) NOT NULL,

    CONSTRAINT "record_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relation_kinds" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(20) NOT NULL,

    CONSTRAINT "relation_kinds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dependent_territories" (
    "id" SERIAL NOT NULL,
    "record_id" INTEGER NOT NULL,
    "relation_kind_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "dependent_territories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "record_types_name_key" ON "record_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "relation_kinds_name_key" ON "relation_kinds"("name");

-- AddForeignKey
ALTER TABLE "monarchs_records" ADD CONSTRAINT "monarchs_records_monarch_id_fkey" FOREIGN KEY ("monarch_id") REFERENCES "monarchs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monarchs_records" ADD CONSTRAINT "monarchs_records_record_type_id_fkey" FOREIGN KEY ("record_type_id") REFERENCES "record_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dependent_territories" ADD CONSTRAINT "dependent_territories_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "monarchs_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dependent_territories" ADD CONSTRAINT "dependent_territories_relation_kind_id_fkey" FOREIGN KEY ("relation_kind_id") REFERENCES "relation_kinds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

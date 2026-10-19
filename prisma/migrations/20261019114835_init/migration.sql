-- CreateTable
CREATE TABLE "PlaySession" (
    "id" SERIAL NOT NULL,
    "public_id" VARCHAR(14) NOT NULL,
    "title" TEXT NOT NULL,
    "country_name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "PlaySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Monarch" (
    "id" SERIAL NOT NULL,
    "public_id" VARCHAR(14) NOT NULL,
    "play_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "history" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Monarch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaySession_public_id_key" ON "PlaySession"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "Monarch_public_id_key" ON "Monarch"("public_id");

-- AddForeignKey
ALTER TABLE "Monarch" ADD CONSTRAINT "Monarch_play_id_fkey" FOREIGN KEY ("play_id") REFERENCES "PlaySession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

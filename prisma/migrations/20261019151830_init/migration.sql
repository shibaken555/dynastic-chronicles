-- CreateTable
CREATE TABLE "play_sessions" (
    "id" SERIAL NOT NULL,
    "public_id" VARCHAR(14) NOT NULL,
    "title" TEXT NOT NULL,
    "country_name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "play_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monarchs" (
    "id" SERIAL NOT NULL,
    "public_id" VARCHAR(14) NOT NULL,
    "play_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "history" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "monarchs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "play_sessions_public_id_key" ON "play_sessions"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "monarchs_public_id_key" ON "monarchs"("public_id");

-- AddForeignKey
ALTER TABLE "monarchs" ADD CONSTRAINT "monarchs_play_id_fkey" FOREIGN KEY ("play_id") REFERENCES "play_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

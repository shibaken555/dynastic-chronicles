import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';
import { playSessionsSchema, monarchsSchema } from "./schema.js";
import { generatePublicId } from "./randomStringGenerator.js";
import { createPlaySession, fetchPlaySession, createMonarch, createMonarchRecord, createDependentTerritories } from "./repository.js"
import { HTTPException } from 'hono/http-exception';
import { prisma } from "./lib/prisma.js";

const app = new Hono();

app.post('/v1/playSessions', zValidator('json', playSessionsSchema), async (c) => {
  const reqBody = c.req.valid('json');
  const publicId: string = generatePublicId("pls_");
  const playSession = await createPlaySession(publicId, reqBody);
  return c.json(
    {
      id: playSession.publicId,
      title: playSession.title,
      country: playSession.countryName,
    }, 201
  )
});

app.get('/v1/monarchs/:id', async (c) => {
  const id: string = c.req.param('id');
  // TODO:prismaを使用してレコードを取得する処理を追加
  // 現時点では動作確認のために仮の値を使用
  // 今後prismaを使い指定されたIDに基づいたレコードを取得する想定
  const fetchMonarchLog =
  {
    id: "mon_f6g7h8i9j0",
    playSessionId: "pls_a1b2c3d4e5",
    name: "Carlos I",
    records: [
      {
        type: "ACCESSION",
        recordedOn: "1516-01-23",
        metrics: {
          provinces: 42,
          totalDevelopment: 462,
          taxIncome: 24.50,
          productionIncome: 15.80,
          tradeIncome: 18.20,
          customsIncome: 4.10,
          vassalIncome: 3.40,
          armyTroops: 42000,
          navyShips: 38
        },
        vassals: ["アラゴン"],
        colonies: []
      }
    ],
    history: "APIとして制限を設ける理由はないので、書いても書かなくても良い"
  }
  return c.json(
    {
      id: fetchMonarchLog.id,
      playSessionId: fetchMonarchLog.playSessionId,
      name: fetchMonarchLog.name,
      records: fetchMonarchLog.records,
      history: fetchMonarchLog.history
    }
  )
});


app.post('/v1/monarchs', zValidator('json', monarchsSchema), async (c) => {
  const reqBody = c.req.valid('json');

  // プレイ記録内の君主の記録を永続化する
  // monarchsにレコードを作成するために、リクエストされたplaySessionIdが存在することの確認をする
  const playSession = await fetchPlaySession(reqBody.playSessionId);
  if (playSession === null) {
    throw new HTTPException(404, { message: "指定されたプレイ記録は存在しません。" });
  };
  const playId = playSession.id;
  const publicId: string = generatePublicId("mon_");
  // monarchsにレコードを作成
  const monarch = await createMonarch(publicId, playId, reqBody);

  // TODO:recordsを配列にする必要はなかったので後ほど修正しておく
  // monarchs_recordsに君主毎の詳細な記録を永続化する
  const monarchId = monarch.id;
  const monarchRecord = await createMonarchRecord(monarchId, reqBody);

  // dependent_territories.record_idは外部キー制約が存在するので、monarchs_records.idを参照するようにする
  // dependent_territoriesに自国の傘下に収めた国のデータを永続化する
  const monarchRecordId = monarchRecord.id;

  // dependent_territoriesは傘下に収めた国のデータを複数種類永続化する。(monarchs_recordsと1対Nの関係)
  // 1人の君主が複数の国を傘下に収めることが想定されるため、傘下に収めた国の分だけレコードを作成する
  // 属国・植民地をそれぞれ永続化する
  const vassals = reqBody.records[0].vassals;
  const colonies = reqBody.records[0].colonies;

  // 君主の治世時に存在した属国を永続化する処理
  const createdVassals: string[] = [];
  for (let i = 0; i < vassals.length; i++) {
    const dependentTerritories = await createDependentTerritories(monarchRecordId, "vassals", vassals[i]);
    createdVassals.push(dependentTerritories.name);
  }

  // 君主の治世時に存在した植民地を永続化する処理
  const createdColonies: string[] = [];
  for (let i = 0; i < colonies.length; i++) {
    const dependentTerritories = await createDependentTerritories(monarchRecordId, "colonies", colonies[i]);
    createdColonies.push(dependentTerritories.name);
  }

  const records = [
    {
      type: "ACCESSION",
      // monarchRecord.recordDateは、そのままだと年月日+時間まで含まれてしまい、不要なので必要な値のみを返却する
      recordedOn: monarchRecord.recordDate.toISOString().slice(0, 10),
      metrics: {
        provinces: monarchRecord.provinces,
        totalDevelopment: monarchRecord.totalDevelopment,
        taxIncome: monarchRecord.taxIncome,
        productionIncome: monarchRecord.productionIncome,
        tradeIncome: monarchRecord.tradeIncome,
        customsIncome: monarchRecord.customsIncome,
        vassalIncome: monarchRecord.vassalIncome,
        armyTroops: monarchRecord.armyTroops,
        navyShips: monarchRecord.navyShips
      },
      vassals: createdVassals,
      colonies: createdColonies
    }
  ]

  return c.json(
    {
      id: monarch.publicId,
      playSessionId: playSession.publicId,
      name: monarch.name,
      records: records,
      history: monarch.history
    }, 201
  )
});


app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: { message: err.message } }, err.status);
  }
  console.error(err);
  return c.json({ error: { message: "サーバーでエラーが起きました" } }, 500);
});

serve({
  fetch: app.fetch,
  port: 8787,
},
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
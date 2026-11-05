import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';
import { playSessionsSchema, monarchsSchema } from "./schema.js";
import { generatePublicId } from "./randomStringGenerator.js";
import { createPlaySession, fetchPlaySession, createMonarch } from "./repository.js"
import { HTTPException } from 'hono/http-exception'

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
  // レコード作成するテーブル
  // monarchs(playSessionIdを引数にする)
  const playSession = await fetchPlaySession(reqBody.playSessionId);
  if (playSession === null) {
    throw new HTTPException(404, { message: "指定されたプレイ記録は存在しません。" });
  }
  const playId = playSession.id;
  const publicId: string = generatePublicId("mon_");
  const monarch = await createMonarch(publicId, playId, reqBody);
  // record_types
  // monarchs_records(monarchs.idを引数にする)
  // dependent_territories(monarchs_records.idを引数にする)

  return c.json(
    {
      id: playSession?.id,
      publicId: playSession?.publicId,
      title: playSession?.title,
      countryName: playSession?.countryName,
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
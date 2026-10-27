import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';
import { playSessionsSchema, monarchsSchema } from "./schema.js";
import { generatePublicId } from "./randomStringGenerator.js";

const app = new Hono();

app.post('/v1/playSessions', zValidator('json', playSessionsSchema), (c) => {
  const reqBody = c.req.valid('json');
  const publicId: string = generatePublicId("pls_");
  return c.json(
    {
      id: publicId,
      title: reqBody.title,
      country: reqBody.country,
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


app.post('/v1/monarchs', zValidator('json', monarchsSchema), (c) => {
  const reqBody = c.req.valid('json');
  const publicId: string = generatePublicId("mon_");

  return c.json(
    {
      id: publicId,
      playSessionId: reqBody.playSessionId,
      name: reqBody.name,
      records: reqBody.records,
      history: reqBody.history
    }, 201
  )
});


serve({
  fetch: app.fetch,
  port: 8787,
},
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';
import { playSessionsSchema, monarchsSchema, } from "./schema.js";

const app = new Hono();

app.post('/v1/playSessions', zValidator('json', playSessionsSchema), (c) => {
  const reqBody = c.req.valid('json');
  return c.json(
    {
      // TODO:idを生成するロジックは別途作成予定
      id: "pls_a1b2c3d4e5",
      title: reqBody.title,
      country: reqBody.country,
    }
  )
});

app.get('/v1/monarchs/:id', async (c) => {
  const id: string = c.req.param('id');
  return c.json(id);
});


app.post('/v1/monarchs', zValidator('json', monarchsSchema), (c) => {
  const reqBody = c.req.valid('json');
  return c.json(
    {
      // TODO:idを生成するロジックは別途作成予定
      id: "mon_f6g7h8i9j0",
      playSessionId: reqBody.playSessionId,
      name: reqBody.name,
      records: reqBody.records,
      history: reqBody.history
    }
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
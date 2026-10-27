import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';
import { playSessionsSchema, monarchsSchema, } from "./schema.js";
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
  return c.json(id);
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
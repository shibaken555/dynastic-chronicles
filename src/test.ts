import { zValidator } from '@hono/zod-validator'
import * as z from 'zod'
import { Hono } from 'hono'

const app = new Hono();

const schema = z.object({
    name: z.string(),
    age: z.number(),
})

app.post('/author', zValidator('json', schema), (c) => {
    const data = c.req.valid('json')
    return c.json({
        success: true,
        message: `${data.name} is ${data.age}`,
    })
})


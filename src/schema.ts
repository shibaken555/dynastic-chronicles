import { z } from "zod";

export const playSessionsSchema = z.object(
  {
    title: z.string(),
    country: z.string()
  });

export const monarchsSchema = z.object(
  {
    playSessionId: z.string(),
    name: z.string(),
    records: z.array(z.object(
      {
        type: z.string(),
        recordedOn: z.string(),
        metrics: z.object(
          {
            provinces: z.number(),
            totalDevelopment: z.number(),
            taxIncome: z.number(),
            productionIncome: z.number(),
            tradeIncome: z.number(),
            customsIncome: z.number(),
            vassalIncome: z.number(),
            armyTroops: z.number(),
            navyShips: z.number()
          }
        ),
        vassals: z.array(z.string()),
        colonies: z.array(z.string())
      }
    )),
    history: z.string()
  });


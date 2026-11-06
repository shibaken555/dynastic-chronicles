import { prisma } from "./lib/prisma.js";

export async function createPlaySession(publicId: string, reqBody: { title: string; country: string; }) {
  const playSession = await prisma.playSession.create({
    data: {
      publicId: publicId,
      title: reqBody.title,
      countryName: reqBody.country
    }
  })
  return playSession;
};

export async function fetchPlaySession(publicId: string) {
  const playSession = await prisma.playSession.findUnique({
    where: { publicId: publicId }
  })
  return playSession;
};

export async function createMonarch(publicId: string, playId: number, reqBody: { name: string, history: string }) {
  const monarch = await prisma.monarch.create({
    data: {
      publicId: publicId,
      playId: playId,
      name: reqBody.name,
      history: reqBody.history
    }
  })
  return monarch;
};

export async function createMonarchRecord(monarchId: number, reqBody: {
  records: {
    recordedOn: string;
    metrics: {
      provinces: number, totalDevelopment: number, taxIncome: number,
      productionIncome: number, tradeIncome: number, customsIncome: number, vassalIncome: number,
      armyTroops: number, navyShips: number;
    };
  }[];
}) {
  const monarchRecord = await prisma.monarchRecord.create({
    data: {
      monarchId: monarchId,
      recordTypeId: 1,
      recordDate: new Date(reqBody.records[0].recordedOn),
      provinces: reqBody.records[0].metrics.provinces,
      totalDevelopment: reqBody.records[0].metrics.totalDevelopment,
      taxIncome: reqBody.records[0].metrics.taxIncome,
      productionIncome: reqBody.records[0].metrics.productionIncome,
      tradeIncome: reqBody.records[0].metrics.tradeIncome,
      customsIncome: reqBody.records[0].metrics.customsIncome,
      vassalIncome: reqBody.records[0].metrics.vassalIncome,
      armyTroops: reqBody.records[0].metrics.armyTroops,
      navyShips: reqBody.records[0].metrics.navyShips,
    }
  })
  return monarchRecord;
};
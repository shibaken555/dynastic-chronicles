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
}
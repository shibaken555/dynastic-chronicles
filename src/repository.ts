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
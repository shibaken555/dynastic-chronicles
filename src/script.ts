import { prisma } from "./lib/prisma.js";

async function main() {
  // Create a new user with a post
  const playSession = await prisma.playSession.create({
    data: {
      publicId: "pls_a1b2c3d4e5",
      title: "織田 1周目",
      countryName:"織田",
      monarches: {
        create: {
          publicId: "mon_a1b2c3d4e5",
          name: "織田信長",
          history: "室町幕府を滅亡させる",
        },
      },
    },
    include: {
      monarches: true,
    },
  });
  console.log("Created user:", playSession);

  // Fetch all users with their posts
  const allSessions = await prisma.playSession.findMany({
    include: {
      monarches: true,
    },
  });
  console.log("All playSessions:", JSON.stringify(allSessions, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
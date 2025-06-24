// prisma\collection\seed.ts

import prisma from "~/prisma/lib/client";
import { faker } from "@faker-js/faker";
import cleanUp from "~/prisma/helpers/cleanUp";

export const NUM_COLLECTIONS = 10;

async function seedCollections(skipCleanup = false) {
  if (!skipCleanup) {
    console.log("🧹 Cleaning up…");
    await cleanUp();
    console.log("🧹 Cleaning up complete.");
  } else {
    console.log("⚠️ Skipping cleanup (SKIP_CLEANUP=true)");
  }

  const fakeCollections = Array.from({ length: NUM_COLLECTIONS }).map(() => ({
    collection_date: faker.date.between({
      from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      to: new Date(),
    }),
    collection_place: faker.location.city(),
  }));

  await prisma.collection.createMany({
    data: fakeCollections,
    skipDuplicates: true,
  });

  console.log(`🌟 Created ${NUM_COLLECTIONS} collections.`);
}

export default seedCollections;

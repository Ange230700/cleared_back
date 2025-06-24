// prisma\garbage\seed.ts

import prisma from "~/prisma/lib/client";
import { faker } from "@faker-js/faker";
import cleanUp from "~/prisma/helpers/cleanUp";
import { NUM_COLLECTIONS } from "~/prisma/collection/seed";

export const NUM_GARBAGE = 10;

async function seedGarbage() {
  const skipCleanup = process.env.SKIP_CLEANUP === "true";

  if (!skipCleanup) {
    console.log("🧹 Cleaning up…");
    await cleanUp();
    console.log("🧹 Cleaning up complete.");
  } else {
    console.log("⚠️ Skipping cleanup (SKIP_CLEANUP=true)");
  }

  const fakeGarbageList = Array.from({ length: NUM_GARBAGE }).map(() => ({
    collection_id: faker.number.int({ min: 1, max: NUM_COLLECTIONS }),
    garbage_type: faker.helpers.arrayElement([
      "Plastic",
      "Metal",
      "Glass",
      "Paper",
      "Organic",
      "Electronics",
    ]),
    quantity_kg: parseFloat(
      faker.number.float({ min: 0.5, max: 50, fractionDigits: 1 }).toFixed(1),
    ),
  }));

  await prisma.garbage.createMany({
    data: fakeGarbageList,
    skipDuplicates: true,
  });

  console.log(`🌟 Created ${NUM_GARBAGE} garbage items.`);
}

export default seedGarbage;

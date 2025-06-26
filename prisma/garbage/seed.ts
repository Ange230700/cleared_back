// prisma\garbage\seed.ts

import prisma from "~/prisma/lib/client";
import { faker } from "@faker-js/faker";
import deleteSafely from "~/prisma/helpers/deleteSafely";

export const NUM_GARBAGE = 10;

async function seedGarbage(skipCleanup = false) {
  if (!skipCleanup) {
    await deleteSafely(() => prisma.garbage.deleteMany(), "garbage");
  } else {
    console.log("⚠️ Skipping cleanup (SKIP_CLEANUP=true)");
  }

  const collectionIds = (
    await prisma.collection.findMany({ select: { collection_id: true } })
  ).map((c) => c.collection_id);

  const fakeGarbageList = Array.from({ length: NUM_GARBAGE }).map(() => ({
    collection_id: faker.helpers.arrayElement(collectionIds),
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

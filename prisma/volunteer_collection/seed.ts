// prisma/volunteer_collection/seed.ts

import prisma from "~/prisma/lib/client";
import { faker } from "@faker-js/faker";
import cleanUp from "~/prisma/helpers/cleanUp";
import { NUM_COLLECTIONS } from "~/prisma/collection/seed";
import { NUM_VOLUNTEERS } from "~/prisma/volunteer/seed";

export const NUM_VOLUNTEER_COLLECTION = 20;

async function seedVolunteerCollection(skipCleanup = false) {
  if (!skipCleanup) {
    console.log("🧹 Cleaning up…");
    await cleanUp();
    console.log("🧹 Cleaning up complete.");
  } else {
    console.log("⚠️ Skipping cleanup (SKIP_CLEANUP=true)");
  }

  const fakeVolunteerCollections = Array.from({
    length: NUM_VOLUNTEER_COLLECTION,
  }).map(() => ({
    volunteer_id: faker.number.int({ min: 1, max: NUM_VOLUNTEERS }),
    collection_id: faker.number.int({ min: 1, max: NUM_COLLECTIONS }),
  }));

  await prisma.volunteer_collection.createMany({
    data: fakeVolunteerCollections,
    skipDuplicates: true, // avoids duplicate join rows
  });

  console.log(
    `🌟 Created ${NUM_VOLUNTEER_COLLECTION} volunteer_collection links.`,
  );
}

export default seedVolunteerCollection;

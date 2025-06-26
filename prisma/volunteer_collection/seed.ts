// prisma/volunteer_collection/seed.ts

import prisma from "~/prisma/lib/client";
import { faker } from "@faker-js/faker";
import deleteSafely from "~/prisma/helpers/deleteSafely";

export const NUM_VOLUNTEER_COLLECTION = 20;

async function seedVolunteerCollection(skipCleanup = false) {
  if (!skipCleanup) {
    await deleteSafely(
      () => prisma.volunteer_collection.deleteMany(),
      "volunteer_collection",
    );
  } else {
    console.log("⚠️ Skipping cleanup (SKIP_CLEANUP=true)");
  }

  const volunteerIds = (
    await prisma.volunteer.findMany({ select: { volunteer_id: true } })
  ).map((v) => v.volunteer_id);

  const collectionIds = (
    await prisma.collection.findMany({ select: { collection_id: true } })
  ).map((c) => c.collection_id);

  const fakeVolunteerCollections = Array.from({
    length: NUM_VOLUNTEER_COLLECTION,
  }).map(() => ({
    volunteer_id: faker.helpers.arrayElement(volunteerIds),
    collection_id: faker.helpers.arrayElement(collectionIds),
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

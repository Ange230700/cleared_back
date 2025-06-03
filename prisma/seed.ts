// prisma/seed.ts

import { Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";

import prisma from "~/src/lib/prisma";

async function deleteSafely(fn: () => Promise<unknown>, name: string) {
  const MAX_TRIES = 10;
  let tries = 0;
  while (true) {
    try {
      await fn();
      console.log(`✅ Deleted ${name}`);
      return;
    } catch (e: unknown) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2034" &&
        tries < MAX_TRIES
      ) {
        tries++;
        console.log(`⚠️ Retrying to delete ${name} (attempt ${tries})`);
        continue;
      }
      throw e;
    }
  }
}

async function cleanUp() {
  // Because `volunteer_collection` is an ignored join table, we must delete its rows via raw SQL first.
  await deleteSafely(
    () => prisma.$executeRaw`DELETE FROM volunteer_collection;`,
    "volunteer_collection rows",
  );

  // Next, delete dependent rows in `garbage` (which FK → collection).
  await deleteSafely(() => prisma.garbage.deleteMany(), "garbage");

  // Then delete from `collection` itself.
  await deleteSafely(() => prisma.collection.deleteMany(), "collection");

  // Finally, delete all volunteers.
  await deleteSafely(() => prisma.volunteer.deleteMany(), "volunteer");
}

async function main() {
  console.log("👋 Cleaning up...");
  await cleanUp();

  console.log("🌱 Start seeding...");

  // 1. Seed volunteers
  const NUM_VOLUNTEERS = 10;
  const volunteerRecords = [];
  for (let i = 0; i < NUM_VOLUNTEERS; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password({ length: 12 });
    const role = faker.datatype.boolean() ? "attendee" : "admin";

    const vol = await prisma.volunteer.create({
      data: {
        volunteer_name: name,
        volunteer_email: email,
        password,
        role,
      },
    });
    volunteerRecords.push(vol);
  }
  console.log(`🌟 Created ${NUM_VOLUNTEERS} volunteers.`);

  // 2. Seed collections
  const NUM_COLLECTIONS = 5;
  const collectionRecords = [];
  for (let i = 0; i < NUM_COLLECTIONS; i++) {
    // Pick a random date within the past year
    const randomDate = faker.date.between({
      from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      to: new Date(),
    });
    const place = faker.location.city();

    const coll = await prisma.collection.create({
      data: {
        collection_date: randomDate,
        collection_place: place,
      },
    });
    collectionRecords.push(coll);
  }
  console.log(`🌟 Created ${NUM_COLLECTIONS} collections.`);

  for (const coll of collectionRecords) {
    // pick a random number of volunteers to link to this collection
    const numVolunteers = faker.number.int({ min: 1, max: NUM_VOLUNTEERS });

    const shuffledVolunteers = faker.helpers.shuffle(volunteerRecords);

    const chosenVolunteers = shuffledVolunteers.slice(0, numVolunteers);

    for (const vol of chosenVolunteers) {
      // Insert into volunteer_collection via raw SQL
      await prisma.$executeRaw`
        INSERT INTO volunteer_collection (collection_id, volunteer_id) VALUES (${coll.collection_id}, ${vol.volunteer_id});
      `;
    }
  }

  // 3. Seed garbage entries for each collection
  let totalGarbageCount = 0;
  for (const coll of collectionRecords) {
    // Randomly assign between 1 and 5 garbage items per collection
    const itemsCount = faker.number.int({ min: 1, max: 5 });
    totalGarbageCount += itemsCount;

    for (let j = 0; j < itemsCount; j++) {
      const garbageType = faker.helpers.arrayElement([
        "Plastic",
        "Metal",
        "Glass",
        "Paper",
        "Organic",
        "Electronics",
      ]);
      const quantityKg = parseFloat(
        faker.number.float({ min: 0.5, max: 50, fractionDigits: 1 }).toFixed(1),
      );

      await prisma.garbage.create({
        data: {
          collection_id: coll.collection_id,
          garbage_type: garbageType,
          quantity_kg: quantityKg,
        },
      });
    }
  }
  console.log(`🌟 Created ${totalGarbageCount} garbage items.`);

  // Note: Because `volunteer_collection` is ignored by Prisma, we cannot create entries in that table via Prisma client.
  // If you need to link volunteers to collections, you can run raw SQL or enable the model in Prisma schema.

  console.log("✅ Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });

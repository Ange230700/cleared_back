// prisma/main.ts

import prisma from "~/prisma/lib/client";
import seedVolunteers from "~/prisma/volunteer/seed";
import seedCollections from "~/prisma/collection/seed";
import seedGarbage from "~/prisma/garbage/seed";

async function main() {
  console.log("🌱 Seeding...");

  // Seed volunteers
  await seedVolunteers();

  // Seed collections
  await seedCollections();

  // Seed garbage entries for each collection
  await seedGarbage();

  console.log("🌱 Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });

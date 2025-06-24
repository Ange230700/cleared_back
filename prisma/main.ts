// prisma/main.ts

import prisma from "~/prisma/lib/client";
import seedVolunteers from "~/prisma/volunteer/seed";
import seedCollections from "~/prisma/collection/seed";
import seedGarbage from "~/prisma/garbage/seed";
import seedVolunteerCollection from "~/prisma/volunteer_collection/seed";

async function main() {
  console.log("🌱 Seeding...");

  const skipCleanup = process.env.SKIP_CLEANUP === "true";

  await seedVolunteers(skipCleanup);
  await seedCollections(skipCleanup);
  await seedGarbage(skipCleanup);
  await seedVolunteerCollection(skipCleanup);

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

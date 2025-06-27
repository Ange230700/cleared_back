// prisma/main.ts

import prisma from "~/prisma/lib/client";
import seedVolunteers from "~/prisma/volunteer/seed";
import seedCollections from "~/prisma/collection/seed";
import seedGarbage from "~/prisma/garbage/seed";
import seedSessions from "~/prisma/session/seed";
import seedVolunteerCollection from "~/prisma/volunteer_collection/seed";

async function main() {
  if (process.env.NODE_ENV === "prod") {
    throw new Error("Do not run seeding or cleanup scripts in prod!");
  }

  console.log("🌱 Seeding...");

  const skipCleanup = process.env.SKIP_CLEANUP === "true";

  await seedVolunteers(skipCleanup);
  await seedCollections(skipCleanup);
  await seedGarbage(skipCleanup);
  await seedSessions(skipCleanup);
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

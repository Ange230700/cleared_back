// prisma\session\seed.ts

import prisma from "~/prisma/lib/client";
import deleteSafely from "~/prisma/helpers/deleteSafely";
import { faker } from "@faker-js/faker";

export const NUM_SESSIONS = 3;

async function seedSessions(skipCleanup = false) {
  if (!skipCleanup) {
    await deleteSafely(() => prisma.session.deleteMany(), "session");
  } else {
    console.log("⚠️ Skipping cleanup (SKIP_CLEANUP=true)");
  }

  // Use the first 2 volunteer_ids for demo sessions
  const volunteers = await prisma.volunteer.findMany({
    take: 2,
    orderBy: { volunteer_id: "asc" },
  });
  if (volunteers.length < 2) {
    throw new Error("Seed at least 2 volunteers first.");
  }

  const now = new Date();
  const sessions = [
    {
      token_id: faker.string.uuid(),
      volunteer_id: volunteers[0].volunteer_id,
      issued_at: now,
      expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7), // +7 days
    },
    {
      token_id: faker.string.uuid(),
      volunteer_id: volunteers[1].volunteer_id,
      issued_at: now,
      expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2), // +2 days
    },
    {
      token_id: faker.string.uuid(),
      volunteer_id: volunteers[0].volunteer_id,
      issued_at: now,
      expires_at: new Date(now.getTime() - 1000 * 60 * 60 * 24), // expired
    },
  ];

  await prisma.session.createMany({ data: sessions, skipDuplicates: true });
  console.log(`🌟 Created ${sessions.length} sessions.`);
}

export default seedSessions;

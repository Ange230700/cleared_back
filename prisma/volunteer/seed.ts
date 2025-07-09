// prisma\volunteer\seed.ts

import argon2 from "argon2";
import prisma from "~/prisma/lib/client";
import { faker } from "@faker-js/faker";
import deleteSafely from "~/prisma/helpers/deleteSafely";
import { volunteer_role } from "@prisma/client";

export const NUM_VOLUNTEERS = 10;

async function seedVolunteers(skipCleanup = false) {
  if (!skipCleanup) {
    await deleteSafely(() => prisma.volunteer.deleteMany(), "volunteer");
  } else {
    console.log("⚠️ Skipping cleanup (SKIP_CLEANUP=true)");
  }

  // Always create this test admin user for integration tests
  await prisma.volunteer.upsert({
    where: { volunteer_email: "admin@example.com" },
    update: {},
    create: {
      volunteer_name: "Admin User",
      volunteer_email: "admin@example.com",
      password: await argon2.hash("password123"), // Use the same hash logic
      role: "admin",
    },
  });

  const fakeVolunteers = await Promise.all(
    Array.from({ length: NUM_VOLUNTEERS }).map(async () => ({
      volunteer_name: faker.person.fullName(),
      volunteer_email: faker.internet.email(),
      password: await argon2.hash(faker.internet.password({ length: 12 })), // Hash here!
      role: faker.datatype.boolean({ probability: 0.7 })
        ? volunteer_role.attendee
        : volunteer_role.admin,
    })),
  );

  await prisma.volunteer.createMany({
    data: fakeVolunteers,
    skipDuplicates: true,
  });

  console.log(`🌟 Created ${NUM_VOLUNTEERS} volunteers.`);
}

export default seedVolunteers;

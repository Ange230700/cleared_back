// prisma\volunteer\seed.ts

import prisma from "~/prisma/lib/client";
import { faker } from "@faker-js/faker";
import cleanUp from "~/prisma/helpers/cleanUp";
import { volunteer_role } from "@prisma/client";

export const NUM_VOLUNTEERS = 10;

async function seedVolunteers(skipCleanup = false) {
  if (!skipCleanup) {
    console.log("🧹 Cleaning up…");
    await cleanUp();
    console.log("🧹 Cleaning up complete.");
  } else {
    console.log("⚠️ Skipping cleanup (SKIP_CLEANUP=true)");
  }

  const fakeVolunteers = Array.from({ length: NUM_VOLUNTEERS }).map(() => ({
    volunteer_name: faker.person.fullName(),
    volunteer_email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    role: faker.datatype.boolean({ probability: 0.7 })
      ? volunteer_role.attendee
      : volunteer_role.admin,
  }));

  await prisma.volunteer.createMany({
    data: fakeVolunteers,
    skipDuplicates: true,
  });

  console.log(`🌟 Created ${NUM_VOLUNTEERS} volunteers.`);
}

export default seedVolunteers;

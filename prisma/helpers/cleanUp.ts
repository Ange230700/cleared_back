// prisma\helpers\cleanUp.ts

import prisma from "~/prisma/lib/client";
import deleteSafely from "~/prisma/helpers/deleteSafely";

async function cleanUp() {
  // Because `volunteer_collection` is an ignored join table, we must delete its rows via raw SQL first.
  await deleteSafely(
    () => prisma.volunteer_collection.deleteMany(),
    "volunteer_collection",
  );

  // Next, delete dependent rows in `garbage` (which FK → collection).
  await deleteSafely(() => prisma.garbage.deleteMany(), "garbage");

  // Then delete from `collection` itself.
  await deleteSafely(() => prisma.collection.deleteMany(), "collection");

  // Finally, delete all volunteers.
  await deleteSafely(() => prisma.volunteer.deleteMany(), "volunteer");
}

export default cleanUp;

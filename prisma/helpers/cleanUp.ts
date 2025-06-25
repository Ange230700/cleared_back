// prisma\helpers\cleanUp.ts

import prisma from "~/prisma/lib/client";
import deleteSafely from "~/prisma/helpers/deleteSafely";

async function cleanUp() {
  await deleteSafely(
    () => prisma.volunteer_collection.deleteMany(),
    "volunteer_collection",
  );
  await deleteSafely(() => prisma.garbage.deleteMany(), "garbage");
  await deleteSafely(() => prisma.collection.deleteMany(), "collection");
  await deleteSafely(() => prisma.volunteer.deleteMany(), "volunteer");
}

export default cleanUp;

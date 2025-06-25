// src\api\index.ts

import express from "express";
import cors from "cors";

import { CollectionController } from "~/src/api/controllers/CollectionController";
import { GarbageController } from "~/src/api/controllers/GarbageController";
import { VolunteerController } from "~/src/api/controllers/VolunteerController";
import { VolunteerCollectionController } from "~/src/api/controllers/VolunteerCollectionController";

const app = express();
app.use(cors());
app.use(express.json());

const collectionController = new CollectionController();
const garbageController = new GarbageController();
const volunteerController = new VolunteerController();
const volunteerCollectionController = new VolunteerCollectionController();

// Collection routes
app.get("/collections", (req, res, next) =>
  collectionController.getAllCollections(req, res, next),
);
app.get("/collections/:collection_id", (req, res, next) =>
  collectionController.getCollectionById(req, res, next),
);
app.post("/collections", (req, res, next) =>
  collectionController.createCollection(req, res, next),
);
app.put("/collections/:collection_id", (req, res, next) =>
  collectionController.updateCollection(req, res, next),
);
app.delete("/collections/:collection_id", (req, res, next) =>
  collectionController.deleteCollection(req, res, next),
);

// Garbage routes
app.get("/garbage", (req, res, next) =>
  garbageController.getAllGarbage(req, res, next),
);
app.get("/garbage/:garbage_id", (req, res, next) =>
  garbageController.getGarbageById(req, res, next),
);
app.post("/garbage", (req, res, next) =>
  garbageController.createGarbage(req, res, next),
);
app.put("/garbage/:garbage_id", (req, res, next) =>
  garbageController.updateGarbage(req, res, next),
);
app.delete("/garbage/:garbage_id", (req, res, next) =>
  garbageController.deleteGarbage(req, res, next),
);

// Volunteer routes
app.get("/volunteers", (req, res, next) =>
  volunteerController.getAllVolunteers(req, res, next),
);
app.get("/volunteers/:volunteer_id", (req, res, next) =>
  volunteerController.getVolunteerById(req, res, next),
);
app.post("/volunteers", (req, res, next) =>
  volunteerController.createVolunteer(req, res, next),
);
app.put("/volunteers/:volunteer_id", (req, res, next) =>
  volunteerController.updateVolunteer(req, res, next),
);
app.delete("/volunteers/:volunteer_id", (req, res, next) =>
  volunteerController.deleteVolunteer(req, res, next),
);

// VolunteerCollection routes
app.get("/volunteer_collections", (req, res, next) =>
  volunteerCollectionController.getAllVolunteerCollections(req, res, next),
);
app.get("/volunteer_collections/:volunteer_collection_id", (req, res, next) =>
  volunteerCollectionController.getVolunteerCollectionById(req, res, next),
);
app.post("/volunteer_collections", (req, res, next) =>
  volunteerCollectionController.createVolunteerCollection(req, res, next),
);
app.put("/volunteer_collections/:volunteer_collection_id", (req, res, next) =>
  volunteerCollectionController.updateVolunteerCollection(req, res, next),
);
app.delete(
  "/volunteer_collections/:volunteer_collection_id",
  (req, res, next) =>
    volunteerCollectionController.deleteVolunteerCollection(req, res, next),
);

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

export default app;

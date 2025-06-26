// src\api\index.ts

import express from "express";

import { CollectionController } from "~/src/api/controllers/CollectionController";
import { GarbageController } from "~/src/api/controllers/GarbageController";
import { VolunteerController } from "~/src/api/controllers/VolunteerController";
import { VolunteerCollectionController } from "~/src/api/controllers/VolunteerCollectionController";

const router = express.Router();

const collectionController = new CollectionController();
const garbageController = new GarbageController();
const volunteerController = new VolunteerController();
const volunteerCollectionController = new VolunteerCollectionController();

// Collection routes
router.get("/collections", collectionController.getAllCollections);
router.get(
  "/collections/:collection_id",
  collectionController.getCollectionById,
);
router.post("/collections", collectionController.createCollection);
router.put(
  "/collections/:collection_id",
  collectionController.updateCollection,
);
router.delete(
  "/collections/:collection_id",
  collectionController.deleteCollection,
);

// Garbage routes
router.get("/garbage", garbageController.getAllGarbage);
router.get("/garbage/:garbage_id", garbageController.getGarbageById);
router.post("/garbage", garbageController.createGarbage);
router.put("/garbage/:garbage_id", garbageController.updateGarbage);
router.delete("/garbage/:garbage_id", garbageController.deleteGarbage);

// Volunteer routes
router.get("/volunteers", volunteerController.getAllVolunteers);
router.get("/volunteers/:volunteer_id", volunteerController.getVolunteerById);
router.post("/volunteers", volunteerController.createVolunteer);
router.put("/volunteers/:volunteer_id", volunteerController.updateVolunteer);
router.delete("/volunteers/:volunteer_id", volunteerController.deleteVolunteer);

// VolunteerCollection routes
router.get(
  "/volunteer_collection",
  volunteerCollectionController.getAllVolunteerCollections,
);
router.get(
  "/volunteer_collection/:volunteer_collection_id",
  volunteerCollectionController.getVolunteerCollectionById,
);
router.post(
  "/volunteer_collection",
  volunteerCollectionController.createVolunteerCollection,
);
router.put(
  "/volunteer_collection/:volunteer_collection_id",
  volunteerCollectionController.updateVolunteerCollection,
);
router.delete(
  "/volunteer_collection/:volunteer_collection_id",
  volunteerCollectionController.deleteVolunteerCollection,
);

export default router;

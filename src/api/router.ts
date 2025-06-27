// src\api\index.ts

import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { asyncHandler } from "~/src/api/middlewares/asyncHandler";
import { AuthenticationController } from "~/src/api/controllers/AuthenticationController";
import { CollectionController } from "~/src/api/controllers/CollectionController";
import { GarbageController } from "~/src/api/controllers/GarbageController";
import { VolunteerController } from "~/src/api/controllers/VolunteerController";
import { VolunteerCollectionController } from "~/src/api/controllers/VolunteerCollectionController";

const router = express.Router();
const swaggerDocument = YAML.load(__dirname + "/swagger.yaml");

const authController = new AuthenticationController();
const collectionController = new CollectionController();
const garbageController = new GarbageController();
const volunteerController = new VolunteerController();
const volunteerCollectionController = new VolunteerCollectionController();

// Docs
router.get("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Authentication routes
router.post("/auth/register", asyncHandler(authController.register));
router.post("/auth/login", asyncHandler(authController.login));
router.post("/auth/refresh", asyncHandler(authController.refresh));
router.post("/auth/logout", asyncHandler(authController.logout));

// Collection routes
router.get(
  "/collections",
  asyncHandler(collectionController.getAllCollections),
);
router.get(
  "/collections/:collection_id",
  asyncHandler(collectionController.getCollectionById),
);
router.post(
  "/collections",
  asyncHandler(collectionController.createCollection),
);
router.put(
  "/collections/:collection_id",
  asyncHandler(collectionController.updateCollection),
);
router.delete(
  "/collections/:collection_id",
  asyncHandler(collectionController.deleteCollection),
);

// Garbage routes
router.get("/garbage", asyncHandler(garbageController.getAllGarbage));
router.get(
  "/garbage/:garbage_id",
  asyncHandler(garbageController.getGarbageById),
);
router.post("/garbage", asyncHandler(garbageController.createGarbage));
router.put(
  "/garbage/:garbage_id",
  asyncHandler(garbageController.updateGarbage),
);
router.delete(
  "/garbage/:garbage_id",
  asyncHandler(garbageController.deleteGarbage),
);

// Volunteer routes
router.get("/volunteers", asyncHandler(volunteerController.getAllVolunteers));
router.get(
  "/volunteers/:volunteer_id",
  asyncHandler(volunteerController.getVolunteerById),
);
router.post("/volunteers", asyncHandler(volunteerController.createVolunteer));
router.put(
  "/volunteers/:volunteer_id",
  asyncHandler(volunteerController.updateVolunteer),
);
router.delete(
  "/volunteers/:volunteer_id",
  asyncHandler(volunteerController.deleteVolunteer),
);

// VolunteerCollection routes
router.get(
  "/volunteer_collection",
  asyncHandler(volunteerCollectionController.getAllVolunteerCollections),
);
router.get(
  "/volunteer_collection/:volunteer_collection_id",
  asyncHandler(volunteerCollectionController.getVolunteerCollectionById),
);
router.post(
  "/volunteer_collection",
  asyncHandler(volunteerCollectionController.createVolunteerCollection),
);
router.put(
  "/volunteer_collection/:volunteer_collection_id",
  asyncHandler(volunteerCollectionController.updateVolunteerCollection),
);
router.delete(
  "/volunteer_collection/:volunteer_collection_id",
  asyncHandler(volunteerCollectionController.deleteVolunteerCollection),
);

export default router;

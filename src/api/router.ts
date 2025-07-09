// src\api\router.ts

import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

import { asyncHandler } from "~/src/api/middlewares/asyncHandler";
import { AuthenticationController } from "~/src/api/controllers/AuthenticationController";
import { CollectionController } from "~/src/api/controllers/CollectionController";
import { GarbageController } from "~/src/api/controllers/GarbageController";
import { VolunteerController } from "~/src/api/controllers/VolunteerController";
import { VolunteerCollectionController } from "~/src/api/controllers/VolunteerCollectionController";
import { SessionController } from "~/src/api/controllers/SessionController";
import { requireAuth } from "~/src/api/middlewares/auth";
import { requireRole } from "~/src/api/middlewares/role";

const router = express.Router();
const swaggerDocument = YAML.load(
  path.resolve(process.cwd(), "src/api/swagger.yaml"),
);

const authController = new AuthenticationController();
const collectionController = new CollectionController();
const garbageController = new GarbageController();
const volunteerController = new VolunteerController();
const volunteerCollectionController = new VolunteerCollectionController();
const controller = new SessionController();

// Docs
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
  requireAuth,
  asyncHandler(collectionController.getCollectionById),
);
router.post(
  "/collections",
  requireAuth,
  requireRole("admin"),
  asyncHandler(collectionController.createCollection),
);
router.put(
  "/collections/:collection_id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(collectionController.updateCollection),
);
router.delete(
  "/collections/:collection_id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(collectionController.deleteCollection),
);

// Garbage routes
router.get("/garbage", asyncHandler(garbageController.getAllGarbage));
router.get(
  "/garbage/:garbage_id",
  requireAuth,
  asyncHandler(garbageController.getGarbageById),
);
router.post(
  "/garbage",
  requireAuth,
  requireRole("admin"),
  asyncHandler(garbageController.createGarbage),
);
router.put(
  "/garbage/:garbage_id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(garbageController.updateGarbage),
);
router.delete(
  "/garbage/:garbage_id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(garbageController.deleteGarbage),
);

// Volunteer routes
router.get("/volunteers", asyncHandler(volunteerController.getAllVolunteers));
router.get(
  "/volunteers/:volunteer_id",
  requireAuth,
  asyncHandler(volunteerController.getVolunteerById),
);
router.post(
  "/volunteers",
  requireAuth,
  requireRole("admin"),
  asyncHandler(volunteerController.createVolunteer),
);
router.put(
  "/volunteers/:volunteer_id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(volunteerController.updateVolunteer),
);
router.delete(
  "/volunteers/:volunteer_id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(volunteerController.deleteVolunteer),
);

// VolunteerCollection routes
router.get(
  "/volunteer_collection",
  asyncHandler(volunteerCollectionController.getAllVolunteerCollections),
);
router.get(
  "/volunteer_collection/:volunteer_collection_id",
  requireAuth,
  asyncHandler(volunteerCollectionController.getVolunteerCollectionById),
);
router.post(
  "/volunteer_collection",
  requireAuth,
  requireRole("admin"),
  asyncHandler(volunteerCollectionController.createVolunteerCollection),
);
router.put(
  "/volunteer_collection/:volunteer_collection_id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(volunteerCollectionController.updateVolunteerCollection),
);
router.delete(
  "/volunteer_collection/:volunteer_collection_id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(volunteerCollectionController.deleteVolunteerCollection),
);

// Session routes

router.get("/sessions", requireAuth, asyncHandler(controller.getAllSessions));
router.get(
  "/sessions/:token_id",
  requireAuth,
  asyncHandler(controller.getSessionById),
);
router.post("/sessions", requireAuth, asyncHandler(controller.createSession));
router.delete(
  "/sessions/:token_id",
  requireAuth,
  asyncHandler(controller.deleteSession),
);

export default router;

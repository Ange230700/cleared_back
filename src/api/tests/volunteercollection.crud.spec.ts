// src/api/tests/volunteercollection.crud.spec.ts

import request from "supertest";
import app from "~/src/api/index";
import { faker } from "@faker-js/faker";
import prisma from "~/prisma/lib/client";

type VolunteerCollectionResponse = {
  volunteer_collection_id: number;
  volunteer_id: number | null;
  collection_id: number | null;
};

let adminToken: string;
let volunteerIds: number[] = [];
let collectionIds: number[] = [];

async function loginAsAdmin() {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ volunteer_email: "admin@example.com", password: "password123" });
  if (!res.body?.data?.accessToken) {
    throw new Error("Login failed: " + (res.body?.error?.message || "unknown"));
  }
  return res.body.data.accessToken;
}

async function createVolunteerCollection(override = {}) {
  const base = {
    volunteer_id: faker.helpers.arrayElement(volunteerIds),
    collection_id: faker.helpers.arrayElement(collectionIds),
  };
  const response = await request(app)
    .post("/api/volunteer_collection")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ ...base, ...override });
  return response;
}

describe("VolunteerCollection API CRUD", () => {
  beforeAll(async () => {
    adminToken = await loginAsAdmin();
    volunteerIds = (
      await prisma.volunteer.findMany({ select: { volunteer_id: true } })
    ).map((v) => Number(v.volunteer_id));
    collectionIds = (
      await prisma.collection.findMany({ select: { collection_id: true } })
    ).map((c) => Number(c.collection_id));
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  let createdVolunteerCollection: VolunteerCollectionResponse;

  describe("POST /api/volunteer_collection", () => {
    it("should create a volunteer_collection", async () => {
      const randomVolunteer = faker.helpers.arrayElement(volunteerIds);
      const randomCollection = faker.helpers.arrayElement(collectionIds);
      const res = await createVolunteerCollection({
        volunteer_id: randomVolunteer,
        collection_id: randomCollection,
      });
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("volunteer_collection_id");
      expect(res.body.data.volunteer_id).toBe(randomVolunteer);
      expect(res.body.data.collection_id).toBe(randomCollection);
      createdVolunteerCollection = res.body.data;
    });

    it("should fail with missing required fields", async () => {
      const res = await request(app)
        .post("/api/volunteer_collection")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({})
        .expect(400);
      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/missing/i);
    });
  });

  describe("GET /api/volunteer_collection", () => {
    it("should fetch all volunteer_collections", async () => {
      const res = await request(app)
        .get("/api/volunteer_collection")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(
        res.body.data.find(
          (vc: VolunteerCollectionResponse) =>
            vc.volunteer_collection_id ===
            createdVolunteerCollection.volunteer_collection_id,
        ),
      ).toBeTruthy();
    });
  });

  describe("GET /api/volunteer_collection/:id", () => {
    it("should fetch a volunteer_collection by id", async () => {
      const res = await request(app)
        .get(
          `/api/volunteer_collection/${createdVolunteerCollection.volunteer_collection_id}`,
        )
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.volunteer_collection_id).toBe(
        createdVolunteerCollection.volunteer_collection_id,
      );
    });

    it("should return 404 for non-existent volunteer_collection", async () => {
      const res = await request(app)
        .get("/api/volunteer_collection/999999")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/not found/i);
    });
  });

  describe("PUT /api/volunteer_collection/:id", () => {
    it("should update a volunteer_collection", async () => {
      const newVolunteer = faker.helpers.arrayElement(volunteerIds);
      const newCollection = faker.helpers.arrayElement(collectionIds);
      const res = await request(app)
        .put(
          `/api/volunteer_collection/${createdVolunteerCollection.volunteer_collection_id}`,
        )
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          volunteer_id: newVolunteer,
          collection_id: newCollection,
        });
      expect(res.status).toBe(200);
      expect(res.body.data.volunteer_id).toBe(newVolunteer);
      expect(res.body.data.collection_id).toBe(newCollection);
    });

    it("should 404 on update for non-existent volunteer_collection", async () => {
      const res = await request(app)
        .put("/api/volunteer_collection/999999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          volunteer_id: faker.helpers.arrayElement(volunteerIds),
          collection_id: faker.helpers.arrayElement(collectionIds),
        });
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/not found/i);
    });
  });

  describe("DELETE /api/volunteer_collection/:id", () => {
    it("should delete a volunteer_collection", async () => {
      const res = await request(app)
        .delete(
          `/api/volunteer_collection/${createdVolunteerCollection.volunteer_collection_id}`,
        )
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(204);
    });

    it("should 404 on delete for non-existent volunteer_collection", async () => {
      const res = await request(app)
        .delete("/api/volunteer_collection/999999")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/not found/i);
    });

    it("should return 404 when fetching deleted volunteer_collection", async () => {
      const res = await request(app)
        .get(
          `/api/volunteer_collection/${createdVolunteerCollection.volunteer_collection_id}`,
        )
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });
});

// src/api/tests/collection.crud.spec.ts

import request from "supertest";
import app from "~/src/api/index";
import { faker } from "@faker-js/faker";
import prisma from "~/prisma/lib/client";

type CollectionResponse = {
  collection_id: number;
  collection_date: string;
  collection_place: string;
};

// Helper: create a collection
async function createCollection(override = {}) {
  const base = {
    collection_date: faker.date
      .between({
        from: faker.date.past({ years: 1 }),
        to: new Date(),
      })
      .toISOString()
      .slice(0, 10),
    collection_place: faker.location.city(),
  };
  const response = await request(app)
    .post("/api/collections")
    .send({ ...base, ...override });
  return response;
}

describe("Collection API CRUD", () => {
  let createdCollection: CollectionResponse;

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/collections", () => {
    it("should create a collection", async () => {
      const randomPlace = faker.location.city();
      const res = await createCollection({ collection_place: randomPlace });
      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toHaveProperty("collection_id");
      expect(res.body.data.collection_place).toBe(randomPlace);
      createdCollection = res.body.data;
    });

    it("should fail with missing required fields", async () => {
      const res = await request(app)
        .post("/api/collections")
        .send({}) // Missing all fields
        .expect(400);
      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/missing/i);
    });
  });

  describe("GET /api/collections", () => {
    it("should fetch all collections", async () => {
      const res = await request(app).get("/api/collections");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(
        res.body.data.find(
          (c: CollectionResponse) =>
            c.collection_id === createdCollection.collection_id,
        ),
      ).toBeTruthy();
    });
  });

  describe("GET /api/collections/:collection_id", () => {
    it("should fetch a collection by id", async () => {
      const res = await request(app).get(
        `/api/collections/${createdCollection.collection_id}`,
      );
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.collection_id).toBe(createdCollection.collection_id);
    });

    it("should return 404 for non-existent collection", async () => {
      const res = await request(app).get("/api/collections/999999");
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/not found/i);
    });
  });

  describe("PUT /api/collections/:collection_id", () => {
    it("should update a collection", async () => {
      const newPlace = faker.location.city();
      const res = await request(app)
        .put(`/api/collections/${createdCollection.collection_id}`)
        .send({ collection_place: newPlace });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.collection_place).toBe(newPlace);
    });

    it("should 404 on update for non-existent collection", async () => {
      const res = await request(app)
        .put("/api/collections/999999")
        .send({ collection_place: faker.location.city() });
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/not found/i);
    });
  });

  describe("DELETE /api/collections/:collection_id", () => {
    it("should delete a collection", async () => {
      const res = await request(app).delete(
        `/api/collections/${createdCollection.collection_id}`,
      );
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toBeNull();
      expect(res.body.error).toBeNull();
    });

    it("should 404 on delete for non-existent collection", async () => {
      const res = await request(app).delete("/api/collections/999999");
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/not found/i);
    });

    it("should return 404 when fetching deleted collection", async () => {
      const res = await request(app).get(
        `/api/collections/${createdCollection.collection_id}`,
      );
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });
});

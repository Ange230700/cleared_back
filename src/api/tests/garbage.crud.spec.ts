// src/api/tests/garbage.crud.spec.ts

import request from "supertest";
import app from "~/src/api/index";
import { faker } from "@faker-js/faker";
import prisma from "~/prisma/lib/client";

type GarbageResponse = {
  garbage_id: number;
  collection_id: number | null;
  garbage_type: string;
  quantity_kg: number;
};

// Helper: create a garbage
async function createGarbage(override = {}) {
  const collectionIds = (
    await prisma.collection.findMany({ select: { collection_id: true } })
  ).map((c) => Number(c.collection_id));

  const base = {
    collection_id: faker.helpers.arrayElement(collectionIds),
    garbage_type: faker.helpers.arrayElement([
      "Plastic",
      "Metal",
      "Glass",
      "Paper",
      "Organic",
      "Electronics",
    ]),
    quantity_kg: parseFloat(
      faker.number.float({ min: 0.5, max: 50, fractionDigits: 1 }).toFixed(1),
    ),
  };
  const response = await request(app)
    .post("/api/garbage")
    .send({ ...base, ...override });
  return response;
}

describe("Garbage API CRUD", () => {
  let createdGarbage: GarbageResponse;

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/garbage", () => {
    it("should create a garbage item", async () => {
      const collectionIds = (
        await prisma.collection.findMany({ select: { collection_id: true } })
      ).map((c) => Number(c.collection_id));
      const randomCollectionId = faker.helpers.arrayElement(collectionIds);

      const res = await createGarbage({ collection_id: randomCollectionId });
      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toHaveProperty("garbage_id");
      expect(res.body.data.collection_id).toBe(randomCollectionId);
      createdGarbage = res.body.data;
    });

    it("should fail with missing required fields", async () => {
      const res = await request(app).post("/api/garbage").send({}).expect(400);
      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/missing/i);
    });
  });

  describe("GET /api/garbage", () => {
    it("should fetch all garbage items", async () => {
      const res = await request(app).get("/api/garbage");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(
        res.body.data.find(
          (g: GarbageResponse) => g.garbage_id === createdGarbage.garbage_id,
        ),
      ).toBeTruthy();
    });
  });

  describe("GET /api/garbage/:garbage_id", () => {
    it("should fetch a garbage item by id", async () => {
      const res = await request(app).get(
        `/api/garbage/${createdGarbage.garbage_id}`,
      );
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.garbage_id).toBe(createdGarbage.garbage_id);
    });

    it("should return 404 for non-existent garbage", async () => {
      const res = await request(app).get("/api/garbage/999999");
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/not found/i);
    });
  });

  describe("PUT /api/garbage/:garbage_id", () => {
    it("should update a garbage item", async () => {
      const newType = faker.helpers.arrayElement([
        "Plastic",
        "Metal",
        "Glass",
        "Paper",
        "Organic",
        "Electronics",
      ]);
      const newQuantity = parseFloat(
        faker.number.float({ min: 0.5, max: 50, fractionDigits: 1 }).toFixed(1),
      );
      const res = await request(app)
        .put(`/api/garbage/${createdGarbage.garbage_id}`)
        .send({ garbage_type: newType, quantity_kg: newQuantity });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.garbage_type).toBe(newType);
      expect(res.body.data.quantity_kg).toBe(newQuantity);
    });

    it("should 404 on update for non-existent garbage", async () => {
      const res = await request(app)
        .put("/api/garbage/999999")
        .send({
          garbage_type: faker.helpers.arrayElement([
            "Plastic",
            "Metal",
            "Glass",
            "Paper",
            "Organic",
            "Electronics",
          ]),
          quantity_kg: parseFloat(
            faker.number
              .float({ min: 0.5, max: 50, fractionDigits: 1 })
              .toFixed(1),
          ),
        });
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/not found/i);
    });
  });

  describe("DELETE /api/garbage/:garbage_id", () => {
    it("should delete a garbage item", async () => {
      const res = await request(app).delete(
        `/api/garbage/${createdGarbage.garbage_id}`,
      );
      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
    });

    it("should 404 on delete for non-existent garbage", async () => {
      const res = await request(app).delete("/api/garbage/999999");
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/not found/i);
    });

    it("should return 404 when fetching deleted garbage", async () => {
      const res = await request(app).get(
        `/api/garbage/${createdGarbage.garbage_id}`,
      );
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });
});

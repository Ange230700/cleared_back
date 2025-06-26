// src\api\tests\garbage.crud.spec.ts

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

describe("Garbage CRUD API", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  let createdGarbage: GarbageResponse;

  // Create
  it("should create a garbage", async () => {
    const randomCollection = faker.helpers.arrayElement(
      await prisma.collection.findMany({ select: { collection_id: true } }),
    );
    const res = await createGarbage({
      collection_id: Number(randomCollection.collection_id),
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("garbage_id");
    expect(res.body.collection_id).toBe(Number(randomCollection.collection_id));
    createdGarbage = res.body;
  });

  // Read (GET ALL)
  it("should fetch all garbage", async () => {
    const res = await request(app).get("/api/garbage");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(
      res.body.find(
        (g: GarbageResponse) => g.garbage_id === createdGarbage.garbage_id,
      ),
    ).toBeTruthy();
  });

  // Read (GET ONE)
  it("should fetch a garbage by id", async () => {
    const res = await request(app).get(
      `/api/garbage/${createdGarbage.garbage_id}`,
    );
    expect(res.status).toBe(200);
    expect(res.body.garbage_id).toBe(createdGarbage.garbage_id);
  });

  // Update
  it("should update a garbage", async () => {
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
    expect(res.body.garbage_type).toBe(newType);
    expect(res.body.quantity_kg).toBe(newQuantity);
  });

  // Delete
  it("should delete a garbage", async () => {
    const res = await request(app).delete(
      `/api/garbage/${createdGarbage.garbage_id}`,
    );
    expect(res.status).toBe(204);
  });

  // Confirm deletion
  it("should return 404 for deleted garbage", async () => {
    const res = await request(app).get(
      `/api/garbage/${createdGarbage.garbage_id}`,
    );
    expect(res.status).toBe(404);
  });

  // Edge: update non-existent
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
  });

  // Edge: delete non-existent
  it("should 404 on delete for non-existent garbage", async () => {
    const res = await request(app).delete("/api/garbage/999999");
    expect(res.status).toBe(404);
  });
});

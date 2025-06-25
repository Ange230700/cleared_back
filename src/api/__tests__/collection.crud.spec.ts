// src\api\__tests__\collection.crud.spec.ts

import request from "supertest";
import app from "~/src/api/index";
import { faker } from "@faker-js/faker";

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
    .post("/collections")
    .send({ ...base, ...override });
  return response;
}

describe("Collection CRUD API", () => {
  let createdCollection: CollectionResponse;

  // Create
  it("should create a collection", async () => {
    const randomPlace = faker.location.city();
    const res = await createCollection({ collection_place: randomPlace });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("collection_id");
    expect(res.body.collection_place).toBe(randomPlace);
    createdCollection = res.body;
  });

  // Read (GET ALL)
  it("should fetch all collections", async () => {
    const res = await request(app).get("/collections");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(
      res.body.find(
        (c: CollectionResponse) =>
          c.collection_id === createdCollection.collection_id,
      ),
    ).toBeTruthy();
  });

  // Read (GET ONE)
  it("should fetch a collection by id", async () => {
    const res = await request(app).get(
      `/collections/${createdCollection.collection_id}`,
    );
    expect(res.status).toBe(200);
    expect(res.body.collection_id).toBe(createdCollection.collection_id);
  });

  // Update
  it("should update a collection", async () => {
    const newPlace = faker.location.city();
    const res = await request(app)
      .put(`/collections/${createdCollection.collection_id}`)
      .send({ collection_place: newPlace });
    expect(res.status).toBe(200);
    expect(res.body.collection_place).toBe(newPlace);
  });

  // Delete
  it("should delete a collection", async () => {
    const res = await request(app).delete(
      `/collections/${createdCollection.collection_id}`,
    );
    expect(res.status).toBe(204);
  });

  // Confirm deletion
  it("should return 404 for deleted collection", async () => {
    const res = await request(app).get(
      `/collections/${createdCollection.collection_id}`,
    );
    expect(res.status).toBe(404);
  });

  // Edge: update non-existent
  it("should 404 on update for non-existent collection", async () => {
    const res = await request(app)
      .put("/collections/999999")
      .send({ collection_place: faker.location.city() });
    expect(res.status).toBe(404);
  });

  // Edge: delete non-existent
  it("should 404 on delete for non-existent collection", async () => {
    const res = await request(app).delete("/collections/999999");
    expect(res.status).toBe(404);
  });
});

// src\api\__tests__\volunteercollection.crud.spec.ts

import request from "supertest";
import app from "~/src/api/index";
import { faker } from "@faker-js/faker";
import prisma from "~/prisma/lib/client";

type VolunteerCollectionResponse = {
  volunteer_collection_id: number;
  volunteer_id: number | null;
  collection_id: number | null;
};

async function createVolunteerCollection(override = {}) {
  const volunteerIds = (
    await prisma.volunteer.findMany({ select: { volunteer_id: true } })
  ).map((v) => v.volunteer_id);

  const collectionIds = (
    await prisma.collection.findMany({ select: { collection_id: true } })
  ).map((c) => c.collection_id);

  const base = {
    volunteer_id: faker.helpers.arrayElement(volunteerIds),
    collection_id: faker.helpers.arrayElement(collectionIds),
  };
  const response = await request(app)
    .post("/volunteer-collections")
    .send({ ...base, ...override });
  return response;
}

describe("VolunteerCollection CRUD API", () => {
  let createdVolunteerCollection: VolunteerCollectionResponse;

  // Create
  it("should create a volunteer_collection", async () => {
    const randomVolunteer = faker.helpers.arrayElement(
      await prisma.volunteer.findMany({ select: { volunteer_id: true } }),
    );
    const randomCollection = faker.helpers.arrayElement(
      await prisma.collection.findMany({ select: { collection_id: true } }),
    );
    const res = await createVolunteerCollection({
      volunteer_id: randomVolunteer.volunteer_id,
      collection_id: randomCollection.collection_id,
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("volunteer_collection_id");
    expect(res.body.volunteer_id).toBe(randomVolunteer.volunteer_id);
    expect(res.body.collection_id).toBe(randomCollection.collection_id);
    createdVolunteerCollection = res.body;
  });

  // Read (GET ALL)
  it("should fetch all volunteer_collections", async () => {
    const res = await request(app).get("/volunteer-collections");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(
      res.body.find(
        (vc: VolunteerCollectionResponse) =>
          vc.volunteer_collection_id ===
          createdVolunteerCollection.volunteer_collection_id,
      ),
    ).toBeTruthy();
  });

  // Read (GET ONE)
  it("should fetch a volunteer_collection by id", async () => {
    const res = await request(app).get(
      `/volunteer-collections/${createdVolunteerCollection.volunteer_collection_id}`,
    );
    expect(res.status).toBe(200);
    expect(res.body.volunteer_collection_id).toBe(
      createdVolunteerCollection.volunteer_collection_id,
    );
  });

  // Update
  it("should update a volunteer_collection", async () => {
    const newVolunteer = faker.helpers.arrayElement(
      await prisma.volunteer.findMany({ select: { volunteer_id: true } }),
    );
    const newCollection = faker.helpers.arrayElement(
      await prisma.collection.findMany({ select: { collection_id: true } }),
    );
    const res = await request(app)
      .put(
        `/volunteer-collections/${createdVolunteerCollection.volunteer_collection_id}`,
      )
      .send({
        volunteer_id: newVolunteer.volunteer_id,
        collection_id: newCollection.collection_id,
      });
    expect(res.status).toBe(200);
    expect(res.body.volunteer_id).toBe(newVolunteer.volunteer_id);
    expect(res.body.collection_id).toBe(newCollection.collection_id);
  });

  // Delete
  it("should delete a volunteer_collection", async () => {
    const res = await request(app).delete(
      `/volunteer-collections/${createdVolunteerCollection.volunteer_collection_id}`,
    );
    expect(res.status).toBe(204);
  });

  // Confirm deletion
  it("should return 404 for deleted volunteer_collection", async () => {
    const res = await request(app).get(
      `/volunteer-collections/${createdVolunteerCollection.volunteer_collection_id}`,
    );
    expect(res.status).toBe(404);
  });

  // Edge: update non-existent
  it("should 404 on update for non-existent volunteer_collection", async () => {
    const res = await request(app)
      .put("/volunteer-collections/999999")
      .send({
        volunteer_id: faker.helpers.arrayElement(
          (
            await prisma.volunteer.findMany({ select: { volunteer_id: true } })
          ).map((v) => v.volunteer_id),
        ),
        collection_id: faker.helpers.arrayElement(
          (
            await prisma.collection.findMany({
              select: { collection_id: true },
            })
          ).map((c) => c.collection_id),
        ),
      });
    expect(res.status).toBe(404);
  });

  // Edge: delete non-existent
  it("should 404 on delete for non-existent volunteer_collection", async () => {
    const res = await request(app).delete("/volunteer-collections/999999");
    expect(res.status).toBe(404);
  });
});

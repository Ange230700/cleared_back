// src\api\tests\volunteercollection.crud.spec.ts

import request from "supertest";
import app from "~/src/api/index";
import { faker } from "@faker-js/faker";
import prisma from "~/prisma/lib/client";
import http from "http";

type VolunteerCollectionResponse = {
  volunteer_collection_id: number;
  volunteer_id: number | null;
  collection_id: number | null;
};

let server: http.Server;
let volunteerIds: number[] = [];
let collectionIds: number[] = [];

async function createVolunteerCollection(override = {}) {
  const base = {
    volunteer_id: faker.helpers.arrayElement(volunteerIds),
    collection_id: faker.helpers.arrayElement(collectionIds),
  };
  const response = await request(server)
    .post("/api/volunteer_collection")
    .send({ ...base, ...override });
  return response;
}

describe("VolunteerCollection CRUD API", () => {
  jest.setTimeout(15000);

  beforeAll(async () => {
    server = app.listen(0);
    await new Promise<void>((resolve) => server.once("listening", resolve));

    volunteerIds = (
      await prisma.volunteer.findMany({ select: { volunteer_id: true } })
    ).map((v) => Number(v.volunteer_id));
    collectionIds = (
      await prisma.collection.findMany({ select: { collection_id: true } })
    ).map((c) => Number(c.collection_id));
  });

  afterAll(async () => {
    await prisma.$disconnect();
    server.close();
  });

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
      volunteer_id: Number(randomVolunteer.volunteer_id),
      collection_id: Number(randomCollection.collection_id),
    });
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("volunteer_collection_id");
    expect(res.body.data.volunteer_id).toBe(
      Number(randomVolunteer.volunteer_id),
    );
    expect(res.body.data.collection_id).toBe(
      Number(randomCollection.collection_id),
    );
    createdVolunteerCollection = res.body.data;
  });

  // Read (GET ALL)
  it("should fetch all volunteer_collections", async () => {
    const res = await request(server).get("/api/volunteer_collection");
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

  // Read (GET ONE)
  it("should fetch a volunteer_collection by id", async () => {
    const res = await request(server).get(
      `/api/volunteer_collection/${createdVolunteerCollection.volunteer_collection_id}`,
    );
    expect(res.status).toBe(200);
    expect(res.body.data.volunteer_collection_id).toBe(
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
    const res = await request(server)
      .put(
        `/api/volunteer_collection/${createdVolunteerCollection.volunteer_collection_id}`,
      )
      .send({
        volunteer_id: Number(newVolunteer.volunteer_id),
        collection_id: Number(newCollection.collection_id),
      });
    expect(res.status).toBe(200);
    expect(res.body.data.volunteer_id).toBe(Number(newVolunteer.volunteer_id));
    expect(res.body.data.collection_id).toBe(
      Number(newCollection.collection_id),
    );
  });

  // Delete
  it("should delete a volunteer_collection", async () => {
    const res = await request(server).delete(
      `/api/volunteer_collection/${createdVolunteerCollection.volunteer_collection_id}`,
    );
    expect(res.status).toBe(204);
  });

  // Confirm deletion
  it("should return 404 for deleted volunteer_collection", async () => {
    const res = await request(server).get(
      `/api/volunteer_collection/${createdVolunteerCollection.volunteer_collection_id}`,
    );
    expect(res.status).toBe(404);
  });

  // Edge: update non-existent
  it("should 404 on update for non-existent volunteer_collection", async () => {
    const res = await request(server)
      .put("/api/volunteer_collection/999999")
      .send({
        volunteer_id: Number(
          faker.helpers.arrayElement(
            (
              await prisma.volunteer.findMany({
                select: { volunteer_id: true },
              })
            ).map((v) => v.volunteer_id),
          ),
        ),
        collection_id: Number(
          faker.helpers.arrayElement(
            (
              await prisma.collection.findMany({
                select: { collection_id: true },
              })
            ).map((c) => c.collection_id),
          ),
        ),
      });
    expect(res.status).toBe(404);
  });

  // Edge: delete non-existent
  it("should 404 on delete for non-existent volunteer_collection", async () => {
    const res = await request(server).delete(
      "/api/volunteer_collection/999999",
    );
    expect(res.status).toBe(404);
  });
});

// src\api\tests\volunteer.crud.spec.ts

import request from "supertest";
import app from "~/src/api/index";
import { faker } from "@faker-js/faker";
import { volunteer_role } from "@prisma/client";
import prisma from "~/prisma/lib/client";

type VolunteerResponse = {
  volunteer_id: number;
  volunteer_name: string;
  volunteer_email: string;
  password: string;
  role: volunteer_role;
};

async function createVolunteer(override = {}) {
  const base = {
    volunteer_name: faker.person.fullName(),
    volunteer_email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    role: faker.helpers.arrayElement<volunteer_role>(["admin", "attendee"]),
  };
  const response = await request(app)
    .post("/api/volunteers")
    .send({ ...base, ...override });
  return response;
}

describe("Volunteer CRUD API", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  let createdVolunteer: VolunteerResponse;

  // Create
  it("should create a volunteer", async () => {
    const randomName = faker.person.fullName();
    const randomEmail = faker.internet.email();
    const res = await createVolunteer({
      volunteer_name: randomName,
      volunteer_email: randomEmail,
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("volunteer_id");
    expect(res.body.volunteer_name).toBe(randomName);
    expect(res.body.volunteer_email).toBe(randomEmail);
    createdVolunteer = res.body;
  });

  // Read (GET ALL)
  it("should fetch all volunteers", async () => {
    const res = await request(app).get("/api/volunteers");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(
      res.body.find(
        (v: VolunteerResponse) =>
          v.volunteer_id === createdVolunteer.volunteer_id,
      ),
    ).toBeTruthy();
  });

  // Read (GET ONE)
  it("should fetch a volunteer by id", async () => {
    const res = await request(app).get(
      `/api/volunteers/${createdVolunteer.volunteer_id}`,
    );
    expect(res.status).toBe(200);
    expect(res.body.volunteer_id).toBe(createdVolunteer.volunteer_id);
  });

  // Update
  it("should update a volunteer", async () => {
    const newName = faker.person.fullName();
    const res = await request(app)
      .put(`/api/volunteers/${createdVolunteer.volunteer_id}`)
      .send({ volunteer_name: newName });
    expect(res.status).toBe(200);
    expect(res.body.volunteer_name).toBe(newName);
  });

  // Delete
  it("should delete a volunteer", async () => {
    const res = await request(app).delete(
      `/api/volunteers/${createdVolunteer.volunteer_id}`,
    );
    expect(res.status).toBe(204);
  });

  // Confirm deletion
  it("should return 404 for deleted volunteer", async () => {
    const res = await request(app).get(
      `/api/volunteers/${createdVolunteer.volunteer_id}`,
    );
    expect(res.status).toBe(404);
  });

  // Edge: update non-existent
  it("should 404 on update for non-existent volunteer", async () => {
    const res = await request(app)
      .put("/api/volunteers/999999")
      .send({ volunteer_name: faker.person.fullName() });
    expect(res.status).toBe(404);
  });

  // Edge: delete non-existent
  it("should 404 on delete for non-existent volunteer", async () => {
    const res = await request(app).delete("/api/volunteers/999999");
    expect(res.status).toBe(404);
  });
});

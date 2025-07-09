// src/api/tests/volunteer.crud.spec.ts

import request from "supertest";
import app from "~/src/api/index";
import { faker } from "@faker-js/faker";
import { volunteer_role } from "@prisma/client";
import prisma from "~/prisma/lib/client";

type VolunteerResponse = {
  volunteer_id: number;
  volunteer_name: string;
  volunteer_email: string;
  role: volunteer_role;
};

let adminToken: string;

async function loginAsAdmin() {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ volunteer_email: "admin@example.com", password: "password123" });
  if (!res.body?.data?.accessToken) {
    throw new Error("Login failed: " + (res.body?.error?.message || "unknown"));
  }
  return res.body.data.accessToken;
}

async function createVolunteer(override = {}) {
  const base = {
    volunteer_name: faker.person.fullName(),
    volunteer_email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    role: faker.helpers.arrayElement<volunteer_role>(["admin", "attendee"]),
  };
  const response = await request(app)
    .post("/api/volunteers")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ ...base, ...override });
  return response;
}

describe("Volunteer API CRUD", () => {
  let createdVolunteer: VolunteerResponse;

  beforeAll(async () => {
    adminToken = await loginAsAdmin();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/volunteers", () => {
    it("should create a volunteer", async () => {
      const randomName = faker.person.fullName();
      const randomEmail = faker.internet.email();
      const res = await createVolunteer({
        volunteer_name: randomName,
        volunteer_email: randomEmail,
      });
      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toHaveProperty("volunteer_id");
      expect(res.body.data.volunteer_name).toBe(randomName);
      expect(res.body.data.volunteer_email).toBe(randomEmail);
      createdVolunteer = res.body.data;
    });

    it("should fail with missing required fields", async () => {
      const res = await request(app)
        .post("/api/volunteers")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({})
        .expect(400);
      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/missing/i);
    });
  });

  describe("GET /api/volunteers", () => {
    it("should fetch all volunteers", async () => {
      const res = await request(app).get("/api/volunteers");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(
        res.body.data.find(
          (v: VolunteerResponse) =>
            v.volunteer_id === createdVolunteer.volunteer_id,
        ),
      ).toBeTruthy();
    });
  });

  describe("GET /api/volunteers/:volunteer_id", () => {
    it("should fetch a volunteer by id", async () => {
      const res = await request(app)
        .get(`/api/volunteers/${createdVolunteer.volunteer_id}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.volunteer_id).toBe(createdVolunteer.volunteer_id);
    });

    it("should return 404 for non-existent volunteer", async () => {
      const res = await request(app)
        .get("/api/volunteers/999999")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/not found/i);
    });
  });

  describe("PUT /api/volunteers/:volunteer_id", () => {
    it("should update a volunteer", async () => {
      const newName = faker.person.fullName();
      const res = await request(app)
        .put(`/api/volunteers/${createdVolunteer.volunteer_id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ volunteer_name: newName });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.volunteer_name).toBe(newName);
    });

    it("should 404 on update for non-existent volunteer", async () => {
      const res = await request(app)
        .put("/api/volunteers/999999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ volunteer_name: faker.person.fullName() });
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/not found/i);
    });
  });

  describe("DELETE /api/volunteers/:volunteer_id", () => {
    it("should delete a volunteer", async () => {
      const res = await request(app)
        .delete(`/api/volunteers/${createdVolunteer.volunteer_id}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
    });

    it("should 404 on delete for non-existent volunteer", async () => {
      const res = await request(app)
        .delete("/api/volunteers/999999")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/not found/i);
    });

    it("should return 404 when fetching deleted volunteer", async () => {
      const res = await request(app)
        .get(`/api/volunteers/${createdVolunteer.volunteer_id}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });
});

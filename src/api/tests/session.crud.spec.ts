// src/api/tests/session.crud.spec.ts

import request from "supertest";
import app from "~/src/api/index";
import prisma from "~/prisma/lib/client";
import { faker } from "@faker-js/faker";

type SessionResponse = {
  token_id: string;
  volunteer_id: number;
  issued_at: string;
  expires_at: string;
};

describe("Session API CRUD", () => {
  // Keep track of created entities for cleanup and reference
  let volunteer: { volunteer_id: number };
  let createdSession: SessionResponse;

  // Prepare a test volunteer, required by Session schema
  beforeAll(async () => {
    // Create a volunteer
    const v = await prisma.volunteer.create({
      data: {
        volunteer_name: faker.person.fullName(),
        volunteer_email: faker.internet.email().toLowerCase(),
        password: faker.internet.password({ length: 15 }),
        role: "attendee",
      },
      select: { volunteer_id: true },
    });
    volunteer = { volunteer_id: Number(v.volunteer_id) };
  });

  // Clean up after all tests
  afterAll(async () => {
    // Delete sessions and volunteer
    if (createdSession?.token_id) {
      await prisma.session.deleteMany({
        where: { token_id: createdSession.token_id },
      });
    }
    if (volunteer?.volunteer_id) {
      await prisma.volunteer.delete({
        where: { volunteer_id: volunteer.volunteer_id },
      });
    }
    await prisma.$disconnect();
  });

  describe("POST /api/sessions", () => {
    it("should create a session", async () => {
      const now = new Date();
      const expires = new Date(Date.now() + 60 * 60 * 1000); // +1h
      const sessionData = {
        token_id: faker.string.uuid(),
        volunteer_id: volunteer.volunteer_id,
        issued_at: now.toISOString(),
        expires_at: expires.toISOString(),
      };

      const res = await request(app)
        .post("/api/sessions")
        .send(sessionData)
        .expect(201);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toMatchObject({
        token_id: sessionData.token_id,
        volunteer_id: sessionData.volunteer_id,
      });

      createdSession = res.body.data;
    });

    it("should fail with missing required fields", async () => {
      const res = await request(app)
        .post("/api/sessions")
        .send({}) // missing all fields
        .expect(400);

      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/missing/i);
    });
  });

  describe("GET /api/sessions", () => {
    it("should list sessions", async () => {
      const res = await request(app).get("/api/sessions").expect(200);

      expect(res.body.status).toBe("success");
      expect(Array.isArray(res.body.data)).toBe(true);
      // Should include the created session
      expect(
        res.body.data.some(
          (s: SessionResponse) => s.token_id === createdSession.token_id,
        ),
      ).toBe(true);
    });
  });

  describe("GET /api/sessions/:token_id", () => {
    it("should get a session by token_id", async () => {
      const res = await request(app)
        .get(`/api/sessions/${createdSession.token_id}`)
        .expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data.token_id).toBe(createdSession.token_id);
      expect(res.body.data.volunteer_id).toBe(volunteer.volunteer_id);
    });

    it("should 404 for non-existing token_id", async () => {
      const res = await request(app)
        .get(`/api/sessions/does-not-exist-token`)
        .expect(404);

      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/not found/i);
    });
  });

  describe("DELETE /api/sessions/:token_id", () => {
    it("should delete a session", async () => {
      const res = await request(app)
        .delete(`/api/sessions/${createdSession.token_id}`)
        .expect(204);

      // No data expected in response, status 204
      expect(res.body).toEqual({});
    });

    it("should 404 if deleting already deleted/non-existing session", async () => {
      const res = await request(app)
        .delete(`/api/sessions/${createdSession.token_id}`)
        .expect(404);

      expect(res.body.status).toBe("error");
      expect(res.body.error?.message).toMatch(/not found/i);
    });
  });
});

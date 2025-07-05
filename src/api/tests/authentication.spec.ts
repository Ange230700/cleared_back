// src\api\tests\authentication.spec.ts

import request from "supertest";
import app from "~/src/api/index";
import prisma from "~/prisma/lib/client";
import { faker } from "@faker-js/faker";

const ENDPOINT = "/api/auth";
const genUser = () => ({
  volunteer_name: faker.person.fullName(),
  volunteer_email: faker.internet.email(),
  password: faker.internet.password({ length: 12 }),
  role: "attendee",
});

describe("Authentication API", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  const user = genUser();
  let refreshTokenCookie = "";

  it("should register a new volunteer", async () => {
    const res = await request(app).post(`${ENDPOINT}/register`).send(user);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.error).toBeNull();
  });

  it("should not register with same email", async () => {
    const res = await request(app).post(`${ENDPOINT}/register`).send(user);

    expect(res.status).toBeGreaterThanOrEqual(400); // likely 409 or 400 depending on implementation
  });

  it("should login with valid credentials", async () => {
    const res = await request(app)
      .post(`${ENDPOINT}/login`)
      .send({ volunteer_email: user.volunteer_email, password: user.password });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.headers["set-cookie"]).toBeDefined();

    // Extract refresh cookie for next tests
    const cookies = res.headers["set-cookie"];
    const cookieArr = Array.isArray(cookies) ? cookies : [cookies];
    refreshTokenCookie = cookieArr.find((c: string) =>
      c.startsWith("refresh_token="),
    );
    expect(refreshTokenCookie).toBeDefined();
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app)
      .post(`${ENDPOINT}/login`)
      .send({ volunteer_email: user.volunteer_email, password: "wrongpass" });
    expect(res.status).toBe(401);
  });

  it("should refresh access token using refresh cookie", async () => {
    const res = await request(app)
      .post(`${ENDPOINT}/refresh`)
      .set("Cookie", refreshTokenCookie);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.volunteer_email).toBe(user.volunteer_email);
    expect(res.body.error).toBeNull();
  });

  it("should logout and clear refresh token cookie", async () => {
    const res = await request(app)
      .post(`${ENDPOINT}/logout`)
      .set("Cookie", refreshTokenCookie);

    expect(res.status).toBe(204);
    // Check Set-Cookie: refresh_token=; ... (cleared)
    const cookies = res.headers["set-cookie"];
    let cookieArr: string[] = [];

    if (Array.isArray(cookies)) {
      cookieArr = cookies;
    } else if (cookies) {
      cookieArr = [cookies];
    } // else leave as []

    const setCookie = cookieArr.find((c: string) =>
      c.startsWith("refresh_token="),
    );
    expect(setCookie).toBeDefined();
    expect(setCookie).toMatch(/refresh_token=;/);
  });

  it("should not refresh with invalid/expired refresh token", async () => {
    const res = await request(app)
      .post(`${ENDPOINT}/refresh`)
      .set("Cookie", refreshTokenCookie); // Already logged out
    expect(res.status).toBe(401);
  });

  it("should not logout if no cookie present (graceful)", async () => {
    const res = await request(app).post(`${ENDPOINT}/logout`);
    expect(res.status).toBe(204);
  });
});

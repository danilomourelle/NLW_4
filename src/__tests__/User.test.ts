import request from "supertest";
import app from "../app";

import createConnection from "../database";

describe("Users", () => {
  beforeAll(async () => {
    const connection = await createConnection();

    // await connection.query("DELETE FROM users");
    await connection.query("DROP TABLE IF EXISTS migrations");
    await connection.query("DROP TABLE IF EXISTS users");
    await connection.query("DROP TABLE IF EXISTS surveys");

    await connection.runMigrations();
  });

  test("Should be able to create a new User", async () => {
    const response = await request(app).post("/users").send({
      email: "user@example.com",
      name: "User Example",
    });

    expect(response.status).toBe(201);
  });

  test("Should NOT be able to create a new User", async () => {
    const response = await request(app).post("/users").send({
      email: "user@example.com",
      name: "User Example",
    });

    expect(response.status).toBe(400);
  });
});

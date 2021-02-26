import request from "supertest";
import app from "../app";

import createConnection from "../database";

describe("Surveys", () => {
  beforeAll(async () => {
    const connection = await createConnection();

    // await connection.query("DELETE FROM surveys");
    await connection.query("DROP TABLE IF EXISTS migrations");
    await connection.query("DROP TABLE IF EXISTS users");
    await connection.query("DROP TABLE IF EXISTS surveys");

    await connection.runMigrations();
  });

  test("Should be able to create a new Survey", async () => {
    const response = await request(app).post("/surveys").send({
      title: "Title Example",
      description: "Description Example",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  test("Should be able to get all surveys", async () => {
    await request(app).post("/surveys").send({
      title: "Title Example",
      description: "Description Example",
    });

    const response = await request(app).get("/surveys");

    expect(response.body.length).toBe(2);
  });
});

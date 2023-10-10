const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const User = require("../api/users/users.model");
const usersService = require("../api/users/users.service");

describe("Tester l'API des utilisateurs", () => {
  let token;
  const USER_ID = "fake";
  const MOCK_DATA = [
    {
      _id: USER_ID,
      name: "ana",
      email: "nfegeg@gmail.com",
      password: "azertyuiop",
    },
  ];
  const MOCK_DATA_CREATED = {
    name: "test",
    email: "test@test.net",
    password: "azertyuiop",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_DATA, "find");
    mockingoose(User).toReturn(MOCK_DATA_CREATED, "save");
  });

  test("[Users] Get All", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("[Users] Create User", async () => {
    const res = await request(app)
      .post("/api/users")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(MOCK_DATA_CREATED.name);
  });

  test("[Users] Update User", async () => {
    const updatedName = "Updated Name";
    const res = await request(app)
      .put(`/api/users/${USER_ID}`)
      .send({ name: updatedName })
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(updatedName);
  });

  test("[Users] Delete User", async () => {
    const res = await request(app)
      .delete(`/api/users/${USER_ID}`)
      .set("x-access-token", token);
    expect(res.status).toBe(204);

    // Vérifiez si l'utilisateur est supprimé de la base de données
    const deletedUser = await User.findById(USER_ID);
    expect(deletedUser).toBeNull();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});

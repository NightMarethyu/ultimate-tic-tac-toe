const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Users = require("../models/users");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Users.deleteMany({});
});

describe("User API", () => {
  it("should allow a new user to sign up", async () => {
    const newUser = {
      lastName: "Test",
      firstName: "User",
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    const res = await request(app)
      .post("/users/signup")
      .send(newUser)
      .expect(201);

    expect(res.body.username).toBe(newUser.username);
    expect(res.body.email).toBe(newUser.email);
    expect(res.body.password).toBeUndefined();

    const userInDb = await Users.findOne({ username: `${newUser.username}` });
    expect(userInDb).not.toBeNull();
    expect(userInDb.email).toBe(newUser.email);
  });

  it("should fail to sign up with a duplicate username", async () => {
    await Users.create({
      username: "duplicateuser",
      email: "first@example.com",
      password: "password123",
    });

    const duplicateUserData = {
      username: "duplicateuser",
      email: "first@example.com",
      password: "password456",
    };

    const res = await request(app)
      .post("/users/signup")
      .send(duplicateUserData)
      .expect(400);

    expect(res.body.error).toBe("Username or email already exists");
  });

  it("should allow a registered user to log in", async () => {
    const userData = {
      username: "loginuser",
      email: "login@example.com",
      password: "password123",
    };

    const hashPassword = require("../helpers/hash");
    const hashedPassword = await hashPassword(userData.password);

    await Users.create({ ...userData, password: hashedPassword });

    const loginCredentials = {
      username: userData.username,
      password: userData.password,
    };

    const res = await request(app)
      .post("/users/login")
      .send(loginCredentials)
      .expect(200);

    expect(res.body.token).toBeDefined();
    expect(res.body.username).toBe(userData.username);
  });

  it("should deny access to GET /users for non-admin users", async () => {
    const regularUser = {
      username: "regular",
      email: "reg@test.com",
      password: "password123",
    };

    const hashedPassword = await require("../helpers/hash")(
      regularUser.password
    );
    await Users.create({ ...regularUser, password: hashedPassword });

    const loginRes = await request(app)
      .post("/users/login")
      .send({ username: regularUser.username, password: regularUser.password })
      .expect(200);

    const token = loginRes.body.token;

    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);

    expect(res.body.message).toBe("Access denied. Admins only.");
  });

  it("should grant access to GET /users for admin users", async () => {
    const adminUser = {
      username: "adminuser",
      email: "admin@test.com",
      password: "adminpassword",
      role: "admin",
    };

    const hashedPassword = await require("../helpers/hash")(adminUser.password);
    await Users.create({ ...adminUser, password: hashedPassword });

    const loginRes = await request(app)
      .post("/users/login")
      .send({ username: adminUser.username, password: adminUser.password })
      .expect(200);

    const token = loginRes.body.token;

    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].username).toBe(adminUser.username);
  });
});

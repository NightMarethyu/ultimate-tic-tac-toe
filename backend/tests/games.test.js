const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Games = require("../models/game");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Games.deleteMany({});
});

describe("Games API", () => {
  it("should create a new game", async () => {
    const gameRequest = {
      gameType: "single_player",
    };

    const res = await request(app).post("/games").send(gameRequest).expect(201);

    expect(res.body).toHaveProperty("_id");
    const gameInDb = await Games.findById(res.body._id);
    expect(gameInDb).not.toBeNull();
  });

  it("should get a list of all games", async () => {
    const game1 = new Games({ gameType: "single_player" });
    const game2 = new Games({ gameType: "multiplayer" });
    await game1.save();
    await game2.save();

    const res = await request(app).get("/games").expect(200);

    expect(res.body.length).toBe(2);
    expect(res.body[0].gameType).toBe("single_player");
    expect(res.body[1].gameType).toBe("multiplayer");
  });

  it("should get a game by ID", async () => {
    const game = new Games({ gameType: "single_player" });
    await game.save();

    const res = await request(app).get(`/games/${game._id}`).expect(200);

    expect(res.body._id).toBe(game._id.toString());
    expect(res.body.gameType).toBe("single_player");
  });

  it("should return 404 for a non-existent game ID", async () => {
    const res = await request(app)
      .get("/games/6863603d14dabe9ad8e2aa61")
      .expect(404);
    expect(res.body.error).toBe("Game not found");
  });

  it("should update a game by ID", async () => {
    const game = new Games({ gameType: "single_player" });
    await game.save();

    const updatedGame = { gameType: "multiplayer" };
    const res = await request(app)
      .put(`/games/${game._id}`)
      .send(updatedGame)
      .expect(200);

    expect(res.body._id).toBe(game._id.toString());
    expect(res.body.gameType).toBe("multiplayer");

    const updatedGameInDb = await Games.findById(game._id);
    expect(updatedGameInDb.gameType).toBe("multiplayer");
  });

  it("should delete a game by ID", async () => {
    const game = new Games({ gameType: "single_player" });
    await game.save();

    const res = await request(app).delete(`/games/${game._id}`).expect(200);

    expect(res.body.message).toBe("Game deleted successfully");
    expect(res.body.game._id).toBe(game._id.toString());

    const deletedGame = await Games.findById(game._id);
    expect(deletedGame).toBeNull();
  });

  it("should make a move in the game", async () => {
    const game = new Games({
      gameType: "single_player",
      currentPlayer: "60c72b2f9b1d8c001c8e4f1a", // Mock user ID
    });
    await game.save();

    const move = { move: "Xa5" }; // Player X moves to square 5 in board a
    const res = await request(app)
      .post(`/games/${game._id}/move`)
      .send(move)
      .expect(200);

    expect(res.body.moves).toContain("Xa5");
    expect(res.body.currentPlayer).toBe("60c72b2f9b1d8c001c8e4f1a");
  });

  it("should return 400 for invalid move", async () => {
    const game = new Games({
      gameType: "multiplayer",
      currentPlayer: "60c72b2f9b1d8c001c8e4f1a", // Mock user ID
    });
    await game.save();

    const move = { move: "Xa5" }; // Player X moves to square 5 in board a
    await request(app).post(`/games/${game._id}/move`).send(move).expect(200);

    // Try to make an invalid move (not player's turn)
    const invalidMove = { move: "Oa6" }; // Player O tries to move
    const res = await request(app)
      .post(`/games/${game._id}/move`)
      .send(invalidMove)
      .expect(400);

    expect(res.body.message).toBe("Move is not in the correct active board");
  });

  it("should return 400 for invalid move (not player's turn)", async () => {
    const game = new Games({
      gameType: "multiplayer",
      currentPlayer: "60c72b2f9b1d8c001c8e4f1a", // Mock user ID
    });
    await game.save();

    const move = { move: "Xa5" }; // Player X moves to square 5 in board a
    await request(app).post(`/games/${game._id}/move`).send(move).expect(200);

    // Try to make an invalid move (not player's turn)
    const invalidMove = { move: "Xa6" }; // Player O tries to move
    const res = await request(app)
      .post(`/games/${game._id}/move`)
      .send(invalidMove)
      .expect(400);

    expect(res.body.message).toBe("Not your turn.");
  });
});

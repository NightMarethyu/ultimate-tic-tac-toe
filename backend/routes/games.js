const express = require("express");
const router = express.Router();

const gamesController = require("../controllers/gamesController");
const jwtOptional = require("../auth/auth").jwtOptional;

router.get("/", gamesController.games_list); // Get all games
router.post("/", jwtOptional, gamesController.games_create_post); // Create a new game

router.post("/:id/move", jwtOptional, gamesController.games_make_move_post); // Make a move in a game

router.get("/:id", gamesController.games_detail); // Get game by ID
router.put("/:id", jwtOptional, gamesController.games_update_put); // Update a game by ID
router.delete("/:id", gamesController.games_delete); // Delete a game by ID

module.exports = router;

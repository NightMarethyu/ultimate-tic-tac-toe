const express = require("express");
const router = express.Router();

const gamesController = require("../controllers/gamesController");

router.get("/", gamesController.games_list); // Get all games
router.get("/:id", gamesController.games_detail); // Get game by ID
router.post("/", gamesController.games_create_post); // Create a new game
router.put("/:id", gamesController.games_update_put); // Update a game by ID
router.delete("/:id", gamesController.games_delete); // Delete a game by ID

module.exports = router;

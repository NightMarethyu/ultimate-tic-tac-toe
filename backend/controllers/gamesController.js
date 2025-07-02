const Games = require("../models/game");
const asyncHandler = require("express-async-handler");
const gameLogic = require("../game-logic/ultimate-tic-tac-toe");

exports.games_list = asyncHandler(async (req, res, next) => {
  const games = await Games.find();
  res.json(games);
});

exports.games_detail = asyncHandler(async (req, res, next) => {
  const game = await Games.findById(req.params.id);
  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }
  res.json(game);
});

exports.games_create_post = asyncHandler(async (req, res, next) => {
  const game = new Games(req.body);
  await game.save();
  res.status(201).json(game);
});

exports.games_update_put = asyncHandler(async (req, res, next) => {
  const game = await Games.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }
  res.json(game);
});

exports.games_delete = asyncHandler(async (req, res, next) => {
  const game = await Games.findByIdAndDelete(req.params.id);
  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }
  res.json({ message: "Game deleted successfully", game: game });
});

exports.games_make_move_post = asyncHandler(async (req, res, next) => {
  const { move } = req.body;
  const gameId = req.params.id;

  // This will be the user's document if they're logged in, otherwise undefined
  const user = req.user;

  const game = await Games.findById(gameId); // Populate players to access their data
  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  // --- New Logic to determine the current player ---
  const { currentPlayerSymbol } = gameLogic.rebuildGameState(game.moves);
  const playerSymbolInMove = move.charAt(0);

  if (currentPlayerSymbol !== playerSymbolInMove) {
    return res.status(400).json({ message: "Not your turn." });
  }

  // --- New Validation Logic ---
  // Instead of passing userId, we pass the user object (or null) and the expected symbol
  const validation = gameLogic.validateMove(game.moves, move, req.user, game);
  if (!validation.isValid) {
    return res.status(400).json({
      message: validation.message,
    });
  }

  game.moves.push(move);

  // You can still check for a winner and save the logged-in user's ID if they won
  const newState = gameLogic.rebuildGameState(game.moves);
  if (gameLogic.checkMainBoardWin(newState.mainBoard, playerSymbolInMove)) {
    game.status = "completed";
    if (user) {
      // Only assign a winner if a logged-in user made the winning move
      game.winner = user._id;
    }
  } else if (newState.mainBoard.every((s) => s !== null)) {
    game.status = "draw";
  } else {
    // This logic can be simplified or moved into your gameLogic module
    // For now, it correctly determines the next player based on who is NOT the current player
    if (game.gameType === "single_player") {
      // In single player mode, we can just toggle between two symbols
      game.currentPlayerSymbol = game.currentPlayerSymbol === "X" ? "O" : "X";
    } else {
      // In multiplayer mode, we need to find the next player
      const currentPlayerDoc = game.players.find(
        (p) => p && p._id.equals(game.currentPlayer)
      );
      if (currentPlayerDoc) {
        const nextPlayer = game.players.find(
          (p) => p && !p._id.equals(currentPlayerDoc._id)
        );
        game.currentPlayer = nextPlayer ? nextPlayer._id : null;
      }
    }
  }

  await game.save();
  res.status(200).json(game);
});

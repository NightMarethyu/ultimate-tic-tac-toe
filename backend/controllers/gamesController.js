const Games = require("../models/game");
const asyncHandler = require("express-async-handler");

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

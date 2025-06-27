const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  player: [{ type: Schema.Types.ObjectId, ref: "User" }],
  gameType: {
    type: String,
    enum: ["single_player", "multiplayer"],
    required: true,
  },
  board: {
    type: [[String]],
    default: () => Array(9).fill(Array(9).fill(null)),
  },
  mainBoard: { type: [String], default: () => Array(9).fill(null) },
  currentPlayer: { type: Schema.Types.ObjectId, ref: "User" },
  activeBoard: { type: Number, default: -1 },
  status: {
    type: String,
    enum: ["in_progress", "completed", "draw"],
    default: "in_progress",
  },
  winner: { type: Schema.Types.ObjectId, ref: "User", default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Game", gameSchema);

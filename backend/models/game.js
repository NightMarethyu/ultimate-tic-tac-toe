const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    players: [{ type: Schema.Types.ObjectId, ref: "User" }],
    gameType: {
      type: String,
      enum: ["single_player", "multiplayer"],
      required: true,
    },
    moves: { type: [String], default: [] }, // eg ["Xa5", "Oe3", "Xc4"]
    currentPlayer: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["in_progress", "completed", "draw"],
      default: "in_progress",
    },
    winner: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);

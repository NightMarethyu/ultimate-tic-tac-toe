function checkSmallBoardWin(board, player) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  for (const pattern of winPatterns) {
    if (pattern.every((index) => board[index] === player)) {
      return true;
    }
  }
  return false;
}

function determineNextActiveBoard(squareIndex) {
  return squareIndex;
}

function rebuildGameState(moves) {
  const board = Array(81).fill(null);
  const mainBoard = Array(9).fill(null);
  let currentPlayerSymbol = "X";

  for (const move of moves) {
    const player = move.charAt(0);
    const boardIndex = move.charCodeAt(1) - "a".charCodeAt(0);
    const squareIndex = parseInt(move.charAt(2), 10);

    const boardStartIndex = boardIndex * 9;
    board[boardStartIndex + squareIndex] = player;

    currentPlayerSymbol = player === "X" ? "O" : "X";
  }

  for (let i = 0; i < 9; i++) {
    if (mainBoard[i]) continue;

    const smallBoard = board.slice(i * 9, i * 9 + 9);
    if (checkSmallBoardWin(smallBoard, "X")) mainBoard[i] = "X";
    else if (checkSmallBoardWin(smallBoard, "O")) mainBoard[i] = "O";
    else if (!smallBoard.includes(null)) mainBoard[i] = "D"; // Draw in small board
  }

  let activeBoard = -1;
  if (moves.length > 0) {
    const lastMove = moves[moves.length - 1];
    const lastSquareIndex = parseInt(lastMove.charAt(2), 10);

    if (mainBoard[lastSquareIndex] === null) {
      activeBoard = lastSquareIndex;
    }
  }

  return {
    board,
    mainBoard,
    currentPlayerSymbol,
    activeBoard,
  };
}

function validateMove(currentMoves, newMove, playerMovingId, gameDoc) {
  if (gameDoc.status !== "in_progress") {
    return { isValid: false, message: "Game is already over" };
  }
  if (gameDoc.currentPlayer.toString() !== playerMovingId) {
    return { isValid: false, message: "Not your turn" };
  }

  const currentState = rebuildGameState(currentMoves);
  const playerSymbol = newMove.charAt(0);
  const boardIndex = newMove.charCodeAt(1) - "a".charCodeAt(0);
  const squareIndex = parseInt(newMove.charAt(2), 10);

  if (playerSymbol !== currentState.currentPlayerSymbol) {
    return {
      isValid: false,
      message: "Invalid player symbol for the current turn",
    };
  }
  if (
    currentState.activeBoard !== -1 &&
    currentState.activeBoard !== boardIndex
  ) {
    return {
      isValid: false,
      message: "Move is not in the correct active board",
    };
  }
  if (currentState.board[boardIndex * 9 + squareIndex] !== null) {
    return { isValid: false, message: "Square is already taken" };
  }
  if (currentState.mainBoard[boardIndex] !== null) {
    return { isValid: false, message: "This board has already been won/drawn" };
  }

  return { isValid: true, message: "Valid move" };
}

module.exports = {
  rebuildGameState,
  validateMove,
  checkMainBoardWin: (mainBoard, player) =>
    checkSmallBoardWin(mainBoard, player),
};

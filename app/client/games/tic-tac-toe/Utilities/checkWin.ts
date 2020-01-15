import { BoardType } from "../Types/Board";
import { Player } from "../Classes/Player";
import { Coordinate } from "../Types/Coordinate";

export const checkWin = (
  board: BoardType,
  player: Player,
  coordinate: Coordinate
): boolean => {
  // If we have three in on a row, we have a winner
  // Check horizontal left
  if (checkHorizontalLeft(board, player, coordinate)) {
    return true;
  }

  // Check horizontal right
  if (checkHorizontalRight(board, player, coordinate)) {
    return true;
  }

  // Check vertical up
  if (checkVerticalUp(board, player, coordinate)) {
    return true;
  }

  // Check vertical down
  if (checkVerticalDown(board, player, coordinate)) {
    return true;
  }

  // Check diagonal top left
  if (checkDiagonalTopLeft(board, player, coordinate)) {
    return true;
  }

  // Check diagonal top right
  if (checkDiagonalTopRight(board, player, coordinate)) {
    return true;
  }

  // Check diagonal bottom right
  if (checkDiagonalBottomRight(board, player, coordinate)) {
    return true;
  }

  // Check diagonal bottom left
  if (checkDiagonalBottomLeft(board, player, coordinate)) {
    return true;
  }

  return false;
};

const checkHorizontalLeft = (
  board: BoardType,
  player: Player,
  coordinate: Coordinate
): boolean => {
  const [x, y] = coordinate;
  if (belongsToSamePlayer(board, player, [x - 1, y])) {
    return (
      belongsToSamePlayer(board, player, [x - 2, y]) ||
      belongsToSamePlayer(board, player, [x + 1, y])
    );
  }
  return false;
};

const checkHorizontalRight = (
  board: BoardType,
  player: Player,
  coordinate: Coordinate
): boolean => {
  const [x, y] = coordinate;
  if (belongsToSamePlayer(board, player, [x + 1, y])) {
    return (
      belongsToSamePlayer(board, player, [x + 2, y]) ||
      belongsToSamePlayer(board, player, [x - 1, y])
    );
  }
  return false;
};

const checkVerticalUp = (
  board: BoardType,
  player: Player,
  coordinate: Coordinate
): boolean => {
  const [x, y] = coordinate;
  if (belongsToSamePlayer(board, player, [x, y - 1])) {
    return (
      belongsToSamePlayer(board, player, [x, y - 2]) ||
      belongsToSamePlayer(board, player, [x, y + 1])
    );
  }
  return false;
};

const checkVerticalDown = (
  board: BoardType,
  player: Player,
  coordinate: Coordinate
): boolean => {
  const [x, y] = coordinate;
  if (belongsToSamePlayer(board, player, [x, y + 1])) {
    return (
      belongsToSamePlayer(board, player, [x, y + 2]) ||
      belongsToSamePlayer(board, player, [x, y - 1])
    );
  }
  return false;
};

const checkDiagonalTopLeft = (
  board: BoardType,
  player: Player,
  coordinate: Coordinate
): boolean => {
  const [x, y] = coordinate;
  if (belongsToSamePlayer(board, player, [x - 1, y - 1])) {
    return (
      belongsToSamePlayer(board, player, [x - 2, y - 2]) ||
      belongsToSamePlayer(board, player, [x + 1, y + 1])
    );
  }
  return false;
};

const checkDiagonalTopRight = (
  board: BoardType,
  player: Player,
  coordinate: Coordinate
): boolean => {
  const [x, y] = coordinate;
  if (belongsToSamePlayer(board, player, [x + 1, y - 1])) {
    return (
      belongsToSamePlayer(board, player, [x + 2, y - 2]) ||
      belongsToSamePlayer(board, player, [x - 1, y + 1])
    );
  }
  return false;
};

const checkDiagonalBottomRight = (
  board: BoardType,
  player: Player,
  coordinate: Coordinate
): boolean => {
  const [x, y] = coordinate;
  if (belongsToSamePlayer(board, player, [x + 1, y + 1])) {
    return (
      belongsToSamePlayer(board, player, [x + 2, y + 2]) ||
      belongsToSamePlayer(board, player, [x - 1, y - 1])
    );
  }
  return false;
};

const checkDiagonalBottomLeft = (
  board: BoardType,
  player: Player,
  coordinate: Coordinate
): boolean => {
  const [x, y] = coordinate;
  if (belongsToSamePlayer(board, player, [x - 1, y + 1])) {
    return (
      belongsToSamePlayer(board, player, [x - 2, y + 2]) ||
      belongsToSamePlayer(board, player, [x + 1, y - 1])
    );
  }
  return false;
};

const isOutOfBoundaries = (index: number): boolean => {
  return index < 0 || index > 2;
};

const belongsToSamePlayer = (
  board: BoardType,
  player: Player,
  coordinate: Coordinate
): boolean => {
  const [x, y] = coordinate;
  return (
    !isOutOfBoundaries(x) &&
    !isOutOfBoundaries(y) &&
    board[x][y] === player.name
  );
};

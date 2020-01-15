import { BoardType } from "../Types/Board";

export const isADraw = (board: BoardType): boolean => {
  const newArr = [...board[0], ...board[1], ...board[2]];
  return newArr.every(cell => !!cell);
};

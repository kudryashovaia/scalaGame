import * as React from "react";
import { Row } from "./Row";
import "../CSS/Board.css";
import { Player } from "../Classes/Player";
import { Coordinate } from "../Types/Coordinate";
import { BoardType } from "../Types/Board";

interface IBoardProps {
  board: BoardType;
  updateGame: (player: Player, coord: Coordinate) => void;
  activePlayer: Player;
}

export const Board = (props: IBoardProps) => {
  return (
    <div className="board">
      <Row
        row={{ values: props.board[0], index: 0 }}
        updateGame={props.updateGame}
        activePlayer={props.activePlayer}
      />
      <Row
        row={{ values: props.board[1], index: 1 }}
        updateGame={props.updateGame}
        activePlayer={props.activePlayer}
      />
      <Row
        row={{ values: props.board[2], index: 2 }}
        updateGame={props.updateGame}
        activePlayer={props.activePlayer}
      />
    </div>
  );
};

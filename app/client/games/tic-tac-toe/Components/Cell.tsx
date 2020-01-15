import * as React from "react";
import "../CSS/Cell.css";
import { Player } from "../Classes/Player";
import { Coordinate } from "../Types/Coordinate";
interface ICellProps {
  cell: string;
  updateGame: (player: Player, coord: Coordinate) => void;
  activePlayer: Player;
  coordinate: Coordinate;
}

export const Cell = (props: ICellProps): JSX.Element => {
  return (
    <div
      className="cell"
      onClick={() => props.updateGame(props.activePlayer, props.coordinate)}
    >
      {props.cell}
    </div>
  );
};

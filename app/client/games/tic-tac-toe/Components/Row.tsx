import * as React from "react";
import { Cell } from "./Cell";
import "../CSS/Row.css";
import { Player } from "../Classes/Player";
import { Coordinate } from "../Types/Coordinate";

interface IRowProps {
  row: { values: string[]; index: number };
  updateGame: (player: Player, coord: Coordinate) => void;
  activePlayer: Player;
}

export const Row = (props: IRowProps): JSX.Element => {
  return (
    <div className="row">
      <Cell
        cell={props.row.values[0]}
        updateGame={props.updateGame}
        activePlayer={props.activePlayer}
        coordinate={[props.row.index, 0]}
      />
      <Cell
        cell={props.row.values[1]}
        updateGame={props.updateGame}
        activePlayer={props.activePlayer}
        coordinate={[props.row.index, 1]}
      />
      <Cell
        cell={props.row.values[2]}
        updateGame={props.updateGame}
        activePlayer={props.activePlayer}
        coordinate={[props.row.index, 2]}
      />
    </div>
  );
};

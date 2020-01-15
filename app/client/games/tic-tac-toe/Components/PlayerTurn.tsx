import React from "react";
import { Player } from "../Classes/Player";
interface IPlayerTurn {
  activePlayer: Player;
}

export const PlayerTurn = (props: IPlayerTurn) => {
  return (
    <div>
      <p>{props.activePlayer.name} turn</p>
    </div>
  );
};

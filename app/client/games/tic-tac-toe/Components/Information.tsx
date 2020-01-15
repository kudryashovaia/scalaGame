import React from "react";
import { Score } from "./Score";
import { PlayerTurn } from "./PlayerTurn";
import { Winner } from "./Winner";
import "../CSS/Information.css";
import { IAppState } from "../TicTacToe";

interface IInformation {
  gameState: IAppState;
}
export const Information = (props: IInformation): JSX.Element => {
  return (
    <div className="information">
      <PlayerTurn activePlayer={props.gameState.activePlayer} />
      <Score players={props.gameState.players} />
      <Winner winner={props.gameState.winner} />
    </div>
  );
};

import React from "react";
import { IWinner } from "../TicTacToe";

interface IWinnerProps {
  winner: IWinner;
}

export const Winner = (props: IWinnerProps): JSX.Element => {
  let winner;
  if (props.winner.player) {
    winner = `${props.winner.player.name} wins!`;
  } else if (props.winner.draw) {
    winner = `It's a draw`;
  }
  return (
    <div>
      <p>{winner}</p>
    </div>
  );
};

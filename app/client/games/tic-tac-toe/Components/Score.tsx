import React from "react";
import "../CSS/Score.css";
import { Player } from "../Classes/Player";

interface IScore {
  players: Player[];
}

interface IPlayerScore {
  player: Player;
}

export const Score = (props: IScore): JSX.Element => {
  return (
    <div className="score">
      <PlayerScore player={props.players[0]} />
      <PlayerScore player={props.players[1]} />
    </div>
  );
};

const PlayerScore = (props: IPlayerScore): JSX.Element => {
  return (
    <p>
      {props.player.name}: {props.player.score}
    </p>
  );
};

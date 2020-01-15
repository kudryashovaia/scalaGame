import * as React from "react";
import { render } from "react-dom";
import { Board } from "./Components/Board";
import { Information } from "./Components/Information";
import { Player } from "./Classes/Player";
import { Coordinate } from "./Types/Coordinate";
import { BoardType } from "./Types/Board";
import { checkWin } from "./Utilities/checkWin";
import { isADraw } from "./Utilities/isADraw";
import "./styles.css";

export interface IWinner {
  player: Player | undefined;
  draw: boolean;
}

interface IAppProps {}
export interface IAppState {
  board: BoardType;
  activePlayer: Player;
  players: Player[];
  winner: IWinner;
}

export interface IUpdateGame {
  player: Player;
  coord: Coordinate;
}

export class TicTacToe extends React.Component<IAppProps, IAppState> {
  pX = new Player("X");
  pO = new Player("O");

  state = {
    board: [["", "", ""], ["", "", ""], ["", "", ""]],
    players: [this.pX, this.pO],
    activePlayer: this.pX,
    winner: { player: undefined, draw: false } as IWinner
  };

  updateGameHandler = (player: Player, coord: Coordinate): void => {
    const name = player.name;
    const newBoard = { ...this.state.board };
    // if cell is occupied, return
    if (newBoard[coord[0]][coord[1]]) {
      return;
    }
    newBoard[coord[0]][coord[1]] = name;
    /**This should be implemented in the Winner Component */
    // Check for winner or draw
    let winner: IWinner = { player: undefined, draw: false };
    if (checkWin(newBoard, player, coord)) {
      player.score++;
      winner = { player: player, draw: false };
    } else if (isADraw(newBoard)) {
      winner = { player: undefined, draw: true };
    }

    this.setState(
      {
        board: newBoard,
        activePlayer: name === "X" ? this.pO : this.pX,
        winner
      },
      () => {
        /* Do something */
      }
    );
  };

  restartGame = () => {
    const newState = {
      board: [["", "", ""], ["", "", ""], ["", "", ""]],
      players: [this.pX, this.pO],
      activePlayer: this.pX,
      winner: { player: undefined, draw: false } as IWinner
    };

    this.setState(newState);
  };

  render() {
    return (
      <div className="app centered">
        {this.state.winner.player || this.state.winner.draw ? (
            <button onClick={() => this.restartGame()}>Restart</button>
        ) : (
          <Board
            board={this.state.board}
            updateGame={this.updateGameHandler}
            activePlayer={this.state.activePlayer}
          />
        )}
        <Information gameState={this.state} />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
render(<TicTacToe />, rootElement);

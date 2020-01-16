import React from "react";
import "./NewsPage.scss";
import {history} from "./react-helpers/history";
import {Button} from "react-bootstrap";


export class NewsPage extends React.Component<{}> {
  render() {
    return (
      <div className="container-fluid news-page">
        <h1>You are at the ScalaGame</h1>
        <h3>This is final project for PPPoSD course</h3>
        <h4>This is the main page: Here some information about project</h4>
        <Button onClick={() => history.push("/tic-tac-toe")}>Click here to start the game Tic-Tac-Toe</Button><br/>
        <a href={"https://github.com/kudryashovaia/scalaGame"}>Click here to see code on the GitHub</a>
      </div>
    );
  }
}



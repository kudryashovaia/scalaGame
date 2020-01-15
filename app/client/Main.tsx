import React from 'react';
import {Link} from 'react-router-dom';
import {Navbar} from 'react-bootstrap';
import "./Main.css";
import {MenuGroup} from "./util/MenuGroup";
import {Routes} from "./Routes";

export class Main extends React.Component<{}> {
    render() {
        return (
            <div>
                <Navbar inverse staticTop fluid>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/">ScalaGames project</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle/>
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <ul className="nav navbar-nav">
                            <MenuGroup
                                groupTitle="Games"
                                menus={[
                                    {title: "Tic Tac Toe", link:"/tic-tac-toe"}
                                ]}
                            />
                        </ul>
                    </Navbar.Collapse>
                </Navbar>
                <Routes/>
            </div>
        );
    }
}


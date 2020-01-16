# Scala Server Game

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/kudryashovaia/scalaGame/blob/master/LICENSE)<br/>
[![Build Status](https://travis-ci.com/kudryashovaia/scalaGame.svg?branch=master)](https://travis-ci.com/kudryashovaia/scalaGame)<br/>
[![Coverage](https://codecov.io/gh/kudryashovaia/scalaGame/branch/master/graph/badge.svg)](https://codecov.io/gh/kudryashovaia/scalaGame)

## It is necessary to have:
 - Postgresql 10 [You can install it here](https://www.postgresql.org/download/linux/ubuntu/) 
    * You have to have table `users`. Script of creation you can see [here](https://github.com/kudryashovaia/scalaGame/blob/master/conf/database.psql)
 - sbt [here](https://www.scala-sbt.org/download.html)
 - nvm [here](https://github.com/creationix/nvm)
 
## How to start:
 - clone this repository by
    `git clone https://github.com/kudryashovaia/scalaGame.git`
 - in main directory command: `.\util\start-webpack.sh`. This script run server.
 - in browser go to `localhost:9011`. You will be redirected to page `/login`. <br/>
    ![Image alt](https://github.com/kudryashovaia/scalaGame/blob/master/readmePictures/login1.png?raw=true)
 
## How to play:
 - login: root, password: 1 to login.<br/>
    ![Image alt](https://github.com/kudryashovaia/scalaGame/blob/master/readmePictures/login2.png?raw=true)
 - you will be redirected to the main page. you can choose the game to play in slide menu at top <br/>
    ![Image alt](https://github.com/kudryashovaia/scalaGame/blob/master/readmePictures/main_page.png?raw=true)
 - here TicTacToe game <br/>
    ![Image alt](https://github.com/kudryashovaia/scalaGame/blob/master/readmePictures/tic-tac-toe1.png?raw=true)
 - example of playing <br/>
    ![Image alt](https://github.com/kudryashovaia/scalaGame/blob/master/readmePictures/tic-tac-toe2.png?raw=true) 
 - at the end you can restart the game <br/>
    ![Image alt](https://github.com/kudryashovaia/scalaGame/blob/master/readmePictures/tic-tac-toe3.png?raw=true)
    
## Hope you will enjoy
 
    

 
 
 
## Copyright

Copyright © 2020 kudryashovaia. See LICENSE.txt for details.

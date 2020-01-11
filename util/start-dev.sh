#!/bin/bash
gnome-terminal -- node ./util/start-webpack.js | grep -Pv '# (un)?watch'
sbt -mem 4096

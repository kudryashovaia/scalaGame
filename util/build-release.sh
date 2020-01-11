#!/bin/bash
npm run build &&
    rm -f public/lk.html &&
    rm -fr public/static/ &&
    cp -r target/build/* public/ &&
    sbt clean assembly

#!/bin/bash

if ! ./util/check_migration_collision.sh; then
    echo migration collision
    exit 1
fi

./util/build-release.sh &&
    rsync -avz --chown=root:root --progress target/scala-2.12/scalagame.jar root@scalagame:scalagame/scalagame.jar &&
ssh root@scalagame "systemctl restart scalaGame"

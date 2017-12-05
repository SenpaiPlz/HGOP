#!/usr/bin/env bash

export GIT_COMMIT=$1
docker-compose down
docker-compose up -d --build

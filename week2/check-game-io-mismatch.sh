#!/bin/bash
set -e

GAME_ID=$1

mkdir $GAME_ID

cat server-issued-events.log | grep ${GAME_ID} | sort > $GAME_ID/serverissued.log
cat user-api-incoming-events.log | grep ${GAME_ID} | sort > $GAME_ID/clientreceived.log

cat server-received-commands.log | grep ${GAME_ID} | sort > $GAME_ID/serverreceived.log
cat user-api-outgoing-commands.log | grep ${GAME_ID} | sort > $GAME_ID/clientissued.log


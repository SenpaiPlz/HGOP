#!/bin/bash


if [ -z "$GIT_COMMIT" ];
then
    export GIT_COMMIT='da2f19126787dd312a33f3178f397f5e2b6f55e1'
fi


source ./create-aws-docker-host-instance.sh
source ./update-env.sh ${INSTANCE_PUBLIC_NAME}

echo New environment provisioned
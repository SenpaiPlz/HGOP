#!/usr/bin/env bash

. ./ec2-instance-settings.sh

echo "Waiting until available ${INSTANCE_PUBLIC_NAME}"
echo "-o StrictHostKeyChecking=no -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME}"

ssh -o StrictHostKeyChecking=no -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME} "cat ~/docker-compose-and-run.sh"

echo "Connecting ec2-user@${INSTANCE_PUBLIC_NAME}"

ssh -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME}
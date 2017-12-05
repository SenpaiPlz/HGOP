#!/usr/bin/env bash

INSTANCE_ID=$(cat ./ec2_instance/instance-id.txt)
SECURITY_GROUP_ID=$(cat ./ec2_instance/security-group-id.txt)
SECURITY_GROUP_NAME=$(cat ./ec2_instance/security-group-name.txt)

aws ec2 terminate-instances --instance-ids ${INSTANCE_ID}

echo Waiting for instance to terminate....
aws ec2 wait --region eu-west-1 instance-terminated --instance-ids ${INSTANCE_ID}
echo Instance ${INSTANCE_ID} terminated

rm ./ec2_instance/instance-id.txt
rm ./ec2_instance/instance-public-name.txt

#aws ec2 delete-security-group --group-id ${SECURITY_GROUP_ID}
#
#aws ec2 delete-key-pair --key-name ${SECURITY_GROUP_NAME}
#
#rm  -rf ec2_instance

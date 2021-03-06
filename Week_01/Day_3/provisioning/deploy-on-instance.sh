#!/bin/bash
SECURITY_GROUP_NAME="test"
printf "Querying for public name\n"

# Query the aws service to validate the instance id and retrieve the public dns name
INSTANCE_PUBLIC_NAME=$(aws ec2 describe-instances --instance-id $2 --query Reservations[*].Instances[*].[PublicDnsName] --output text)

# if the return value is not 0, then the instance was not found.
if [ $? -ne 0 ]; then
	printf "Instance not found! STOPPING!!!\n"
	exit 1
fi

printf "Public name found: ${INSTANCE_PUBLIC_NAME}\n"
printf "Trying to establish connection...\n"

# Try and establish a connection with the instance
status='unknown'
while [ ! "${status}" == "ok" ]
do
    status=$(ssh -i "${SECURITY_GROUP_NAME}.pem"  -o StrictHostKeyChecking=no -o BatchMode=yes -o ConnectTimeout=5 ec2-user@${INSTANCE_PUBLIC_NAME} echo ok 2>&1)
    sleep 2
done

printf "Connection Established!\n"
printf "Copying files to ec2 instance!\n"

# Create a .env file with the github-id as TAG
echo TAG=$1 > .env

# Copy all the required files to the server
scp -o StrictHostKeyChecking=no -i "${SECURITY_GROUP_NAME}.pem" ./.env ec2-user@${INSTANCE_PUBLIC_NAME}:~/.env
scp -o StrictHostKeyChecking=no -i "${SECURITY_GROUP_NAME}.pem" ../ec2-instance-check.sh ec2-user@${INSTANCE_PUBLIC_NAME}:~/ec2-instance-check.sh
scp -o StrictHostKeyChecking=no -i "${SECURITY_GROUP_NAME}.pem" ../docker-compose.yml ec2-user@${INSTANCE_PUBLIC_NAME}:~/docker-compose.yaml
scp -o StrictHostKeyChecking=no -i "${SECURITY_GROUP_NAME}.pem" ../docker-compose-and-run.sh ec2-user@${INSTANCE_PUBLIC_NAME}:~/docker-compose-and-run.sh
rm .env

printf "Running docker-compose-and-run.sh\n"


ssh -o StrictHostKeyChecking=no -i "${SECURITY_GROUP_NAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME} "~/ec2-instance-check.sh"
ssh -o StrictHostKeyChecking=no -i "${SECURITY_GROUP_NAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME} "~/docker-compose-and-run.sh"

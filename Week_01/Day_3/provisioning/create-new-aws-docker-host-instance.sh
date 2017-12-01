#!/bin/bash
SECURITY_GROUP_NAME="test"

# The code flow is as follows.
# 1. Check if there is already a .pem file associated with this security group.
#   - If true contirue
#   - If false, setup a new security group and create a new key-pair ( initial setup )
# 2. Create an ec2 t2.micro instance

# Check for the .pem file
printf "Checking for ${SECURITY_GROUP_NAME}.pem ...\n"
if [ ! -f ./${SECURITY_GROUP_NAME}.pem ]; then
	printf "${SECURITY_GROUP_NAME}.pem not found...\n"
 	printf "Checking if a key-pair is associated with ${SECURITY_GROUP_NAME}...\n"

    # Ask for all key-pairs that have the same name as our security group
	aws ec2 describe-key-pairs --key-names ${SECURITY_GROUP_NAME} &> /dev/null

    # If the call returned 0, then a key was found. Delete it!
	if [ $? -eq 0 ]; then
		printf "Key-pair found...\n"
		printf "Deleting key-pair...\n"

    	# Deletes the key-pair with the name ${SECURTY_GROUP_NAME}
        aws ec2 delete-key-pair --key-name ${SECURITY_GROUP_NAME}
		if [ $? -ne 0 ]; then
			printf "Failed to delete key-pair. Close all running instances associated with ${SECURITY_GROUP_NAME}. STOPPING!!!!\n\n"
			exit 1
		fi
	else
		printf "Key-pair not found...\n"
	fi

	printf "Checking if a security-group is associated with ${SECURITY_GROUP_NAME}...\n"

    # Ask for all security-groups that have the same name as our security group
	aws ec2 describe-security-groups --group-names ${SECURITY_GROUP_NAME} &> /dev/null

    # If the call returned 0. then a security group was found. Delete it!
	if [ $? -eq 0 ]; then
		printf "Security-group-found...\n"
		printf "Deleting security-group...\n"

        # Deletes the security group with the name ${SECURITY_GROUP_NAME}
		aws ec2 delete-security-group --group-name ${SECURITY_GROUP_NAME}
		if [ $? -ne 0 ]; then
			printf "Failed to delete security group. Close all running instances associated with ${SECURITY_GROUP_NAME}. STOPPING!\n\n"
			exit 1
		fi
	fi

	printf "Creating key-pair as ${SECURITY_GROUP_NAME}.pem\n"

    # Create a key-pair with the name of our security group, and pipe the resulting key to a .pem file.
	aws ec2 create-key-pair --key-name ${SECURITY_GROUP_NAME} --query 'KeyMaterial' --output text > ${SECURITY_GROUP_NAME}.pem
	chmod 400 ${SECURITY_GROUP_NAME}.pem
	printf "Creating security group with name ${SECURITY_GROUP_NAME}\n"

    # Create a security group with name of our security group.
	aws ec2 create-security-group --group-name ${SECURITY_GROUP_NAME} --description "security group for dev env in EC2 allowing ssh and tcp" &> /dev/null
	MY_PUBLIC_IP=$(curl http://checkip.amazonaws.com) &> /dev/null
	MY_CIDR=${MY_PUBLIC_IP}/32
	printf "Authorizing port 22 and 80!\n"

    # Create security policies that allow SSH and HTTP communication with instances associated with this security group
	aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 22 --cidr ${MY_CIDR}
	aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 80 --cidr 0.0.0.0/0
else
	printf "${SECURITY_GROUP_NAME}.pem found!\n"
fi

printf "Creating Instance!\n"

# Create a ec2 instance, injecting the ec2-instance-init.sh
INSTANCE_ID=$(aws ec2 run-instances --user-data file://${PWD}/ec2-instance-init.sh --image-id ami-9398d3e0 --security-groups ${SECURITY_GROUP_NAME} --count 1 --instance-type t2.micro --key-name ${SECURITY_GROUP_NAME} --query 'Instances[0].InstanceId'  --output=text)

# Wait for the instance to report that it's running
aws ec2 wait --region eu-west-1 instance-running --instance-ids ${INSTANCE_ID}
printf "Intsance created with id: ${INSTANCE_ID}\n"

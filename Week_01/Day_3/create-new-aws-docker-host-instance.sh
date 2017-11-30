#!/bin/bash
SECURITY_GROUP_NAME="test"

printf "Checking for ${SECURITY_GROUP_NAME}.pem ...\n"
if [ ! -f ${PWD}/${SECURITY_GROUP_NAME}.pem ]; then
	printf "${SECURITY_GROUP_NAME}.pem not found...\n"
 	printf "Checking if a key-pair is associated with ${SECURITY_GROUP_NAME}...\n"
	aws ec2 describe-key-pairs --key-names ${SECURITY_GROUP_NAME} &> /dev/null
	if [ $? -eq 0 ]; then
		printf "Key-pair found...\n"
		printf "Deleting key-pair...\n"
		aws ec2 delete-key-pair --key-name ${SECURITY_GROUP_NAME}
		if [ $? -ne 0 ]; then
			printf "Failed to delete key-pair. Close all running instances associated with ${SECURITY_GROUP_NAME}. STOPPING!!!!\n\n"
			exit 1
		fi
	else
		printf "Key-pair not found...\n"
	fi
	
	printf "Checking if a security-group is associated with ${SECURITY_GROUP_NAME}...\n"
	aws ec2 describe-security-groups --group-names ${SECURITY_GROUP_NAME} &> /dev/null
	if [ $? -eq 0 ]; then
		printf "Security-group-found...\n"
		printf "Deleting security-group...\n"
		aws ec2 delete-security-group --group-name ${SECURITY_GROUP_NAME}
		if [ $? -ne 0 ]; then
			printf "Failed to delete security group. Close all running instances associated with ${SECURITY_GROUP_NAME}. STOPPING!\n\n"
			exit 1
		fi
	fi

	printf "Creating key-pair as ${SECURITY_GROUP_NAME}.pem\n"
	aws ec2 create-key-pair --key-name ${SECURITY_GROUP_NAME} --query 'KeyMaterial' --output text > ${SECURITY_GROUP_NAME}.pem
	chmod 400 ${SECURITY_GROUP_NAME}.pem
	printf "Creating security group with name ${SECURITY_GROUP_NAME}\n"
	aws ec2 create-security-group --group-name ${SECURITY_GROUP_NAME} --description "security group for dev env in EC2 allowing ssh and tcp"
	MY_PUBLIC_IP=$(curl http://checkip.amazonaws.com)
	MY_CIDR=${MY_PUBLIC_IP}/32
	printf "Authorizing port 22 and 80!\n"
	aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 22 --cidr ${MY_CIDR}
	aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 80 --cidr ${MY_CIDR}
else
	printf "${SECURITY_GROUP_NAME}.pem found!\n"
fi

printf "Creating Instance!\n"
INSTANCE_ID=$(aws ec2 run-instances --user-data file://${PWD}/provisioning/ec2-instance-init.sh --image-id ami-9398d3e0 --security-groups ${SECURITY_GROUP_NAME} --count 1 --instance-type t2.micro --key-name ${SECURITY_GROUP_NAME} --query 'Instances[0].InstanceId'  --output=text)
aws ec2 wait --region eu-west-1 instance-running --instance-ids ${INSTANCE_ID}
printf "Intsance created with id: ${INSTANCE_ID}\n"

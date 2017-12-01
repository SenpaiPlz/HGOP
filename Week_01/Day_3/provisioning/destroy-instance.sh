#!/bin/bash

printf "Terminating instance with id: $1\n"
# terminate the instance with the intance id of the first argument
aws ec2 terminate-instances --instance-ids $1 &> /dev/null

if [ $? -ne 0 ]; then
    printf "Instance not found!\n"
    exit 1
fi

# Wait for the instance to signal that it has terminated
aws ec2 wait --region eu-west-1 instance-terminated --instance-ids $1
printf "Intance terminated!\n"

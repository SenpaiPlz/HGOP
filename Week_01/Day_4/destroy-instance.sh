#!/bin/bash
aws ec2 terminate-instances --instance-ids $1
aws ec2 wait --region eu-west-1 instance-terminated --instance-ids $1

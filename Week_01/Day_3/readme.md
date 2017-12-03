# Day 3 - Setting up aws!
## Steps taken to get a docker image up and running on aws.
1. Created an AWS account and logged on to the aws console.
2. Created a new IAM user, and gave it administrator priveleges.
3. Downloaded the AWS cli.
4. Logged into the AWS cli as the IAM user, using the aws configure command.
5. Went through the launch tutorial at: https://www.ybrikman.com/writing/2015/11/11/running-docker-aws-ground-up/#launching-an-ec2-instance
6. SSH'd into the instance.
7. Updated yum and Installed and started Docker.
8. Used SCP to transfer the docker-compose.yml to the instance.
9. Ran docker-compose up to run my docker image!
## How far did you get?
I finished the assignment, creating the three scripts and running them to verify if they work.

There are a few gotcha's that I think should be mentioned.
1. As of this moment the scripts require the following folder structure:
    1. ec2-instance-check.sh, docker-compose-and-run.sh and docker-compose.yml should be a folder above the provisioning folder.
    2. ec2-instance-init.sh should be in the provisioning folder.
2. The scripts should be run from the provisioning folder.
3. The create-new-aws-docker-host-instance.sh script will delete and re-create, the key-pair and security group with the name test, if test.pem is not present in the provisioning folder.

~~Here is the public dns for a running instance: ec2-34-253-226-120.eu-west-1.compute.amazonaws.com~~

~~It has open port 80, and is running a docker image that contains the newest version of the app ( includes the postgres database and get/post routes ).~~

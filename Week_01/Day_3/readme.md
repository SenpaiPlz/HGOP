# Day 3 - Setting up aws!
## Steps taken to get a docker image up and running on aws.
1. Created an AWS account and logged on to the aws console.
2. Created a new IAM user, and gave it administrator priveleges.
3. Downloaded the AWS cli.
4. Logged into the AWS cli as the IAM user, using the aws configure command.
5. Went through the launch tutorial at: https://www.ybrikman.com/writing/2015/11/11/running-docker-aws-ground-up/#launching-an-ec2-instance
6. SSH'd into the instance.
7. Updated and Installed Docker.
8. Used SCP to transfer the docker-compose.yml to the instance.
9. Ran docker-compose up to run my docker image!

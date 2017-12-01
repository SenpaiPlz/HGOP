# Day 4 - Adding postgres to the application!
## What changes were made to the application in order to add postgres?
There are a few steps needed to be taken before before postgres has been added to the application, they are as follows:
1. Install pg, by using the npm install pg --save, as that also adds it as a dependancy to our package.json file.
2. Edit the docker-compose.yml, in order to use pg with docker.
3. Create a .js file, which handles communication between app.js and the database.
4. Import the .js file in app.js using the require() function.
5. Hooray! We got postgres.

While these are the steps that are needed to be taken for pg to run in our application with docker, there are still a few steps needed to be taken to actually communicate with database.
1. The .js file which handles the connection, should export functions that allow communication with the database.
2. The app.js should have routes, that implement these functions.

## How far did you get?
I finished the assignment, and verified that it works using the curl commands in the assignment description.

Here is the public dns for a running instance: ec2-34-253-226-120.eu-west-1.compute.amazonaws.com
 
It has open port 80, and is running a docker image that contains the newest version of the app ( includes the postgres database and get/post routes ).

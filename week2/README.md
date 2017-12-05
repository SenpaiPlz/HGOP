## Application for HGOP 2017 Student project

Global installation requirements:


nodejs version 6.9.1
https://nodejs.org/en/

It is recommended to install nvm (node version manager) to install node and choose which version you use. 

optional: yarn for package management (server only). 
https://yarnpkg.com/

Add ./node_modules/.bin to your path. This enables to you to run locally installed npm commands.

nodemon for watching server and restarting on modifications.
```
npm install -g nodemon
```


For developing React single-page-app (optional):

```
npm install -g create-react-app
```


## Getting started:

Install and run postgres docker image for development.
The postgres docker image takes a few seconds to setup the database when creating a new container.
So we sleep for 10 seconds before running database migration scripts.
```
npm run startpostgres && sleep 10 && npm run migratedb
```
Note: You might also run into problems if you have any residual postgres containers from week 1 since the startpostgres command will try to use them instead of creating a new container. Remove the containers from week 1 to resolve this issue.

** There is also a problem with the migratedb command, when you run it against an already migrated database it fails. We are working on a fix mean while just avoid migrating the database more than once. You can safly ignore this for day 6 and 7. (We temporarily removed the migratedb command from the startserver command) **

In project root directory, install NPM dependencies:

```
yarn install (or npm install)

```

Start API server.
```
npm run startserver
```

To run server side tests in watch mode (in another terminal window):
```
npm run test
```
This runs server-side jasmine tests, which are then automatically rerun when a file is saved.


In another terminal window, run the React web client. Do **NOT** use yarn install here, it is not
compatible with this project.
```
cd client
npm install
npm run start
```

At this point you should see the HGOP intro page open in your browser.
If not, you should be able to point your browser to http://localhost:3000 and open it.

To run client tests in watch mode:
```
cd client
npm run test
```
On linux, this may fail due to too many watches being created. To fix, issue this command:

```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```



To run API tests, simulating client calls to server socket-io api. API server must be running.

```
npm run apitest
```


To run API load tests, simulating client load on server socket-io api. API server must be running.

```
npm run loadtest
```


To build and deploy new version in a new ec2 instance on amazon:

```
./dockerbuild.sh

export GIT_COMMIT= <git hash used to tag your container>

cd provision
./provision-new-environment.sh
```


## Development

When developing this project, I like haveing a few open terminals
- One in root, running the autorestarting API server:
```
cd .
npm run startserver
```

- One in client, running the auto-restarting web client:
```
cd ./client
npm run start
```
- One to run tests and other commands you need at any given moment, such as npm/yarn install, running
one of the other commands above.



## Build targets

```
npm run build
```
This builds both server and client, and combines in a single server to
run in a production-like setting, such as within a docker image.

```
npm run clean
```
Clean generated artifacts in build directories.

```
npm run startpostgres
```
Launch or restart a local postgres instance. Required for running the application, api tests and load tests.



## Notes

The main emphasis in this sample application is on object decomposition and testability, achieved with fine-grained
objects wired together with aggressive use of dependency injection. The architecture style used is fully message based
using Command Query Responsibility Segregation (CQRS) with event sourcing. This is an appropriate architecture for
many classes of applications, such as where synchronizing views of multiple users is an important concern, and where
achieving near-linear scaling of servers in clustered environments is a concern.

Notice especially that use of import/require statements are limited to application context
objects and to test files. Application context objects are there to wire the application
together, and should generally not contain any conditional logic.

Due to this architecture, it is relatively simple to reuse logic between server and
client, which is generally a hard problem to solve cleanly. Code that is shared
between client and server is found on the [client](client/src) side. routing-context is a good example,
since it is used both in the web client, and in the API and load tests.

Note that transaction support, error handling and logging are incomplete, and many other details that would be 
required in production-ready clustered applications are not present.






## Links

http://docs.aws.amazon.com/cli/latest/userguide/cli-ec2-launch.html

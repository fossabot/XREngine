<div align="center">

<a href="https://xr3ngine.io">
</a>

# xr3ngine
An end-to-end solution for hosting humans and AI in a virtual space, built on top of react, three.js and express/feathers.

This repo includes a fully-feature client, API server, realtime gamerserver, game engine and devops for scalable deployment. Pick and choose what you need or deploy the whole stack and start building your application on top.

</div>

[![Build Status](https://travis-ci.org/xr3ngine/xr3ngine.svg?branch=dev)](https://travis-ci.org/xr3ngine/xr3ngine)	


## Popular features
Player rigs to support 2D, 3D and XR interaction

High-performance ECS engine

Full-featured world editor

Fully networked player controller, physics, vehicles and particles

Fully data-oriented design

Chat, groups, parties and friends

Voice and video over WebRTC

Instant login with phone number or email

OAuth login with Facebook, Google, Steam and Github

User management, avatars and inventory

Authorative realtime gameserver

Reliable messaging and signaling with socket.io

Fast, unreliable messaging with SCTP data channels

Built end-to-end in Typescript

Free, open source, MIT-licensed

## Getting Started

Getting up and running is as easy as 1, 2, 3.

First, make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed (and if you are using it, [docker](https://docs.docker.com/)).

1. Install your dependencies
    ```
    cd path/to/xr3ngine
    yarn install
    ```
2. Make sure you have a mysql database installed and running -- our recommendation is Mariadb. We've provided a docker container for easy setup:
    ```
    cd scripts && ./start-db.sh
    ```
    This creates a docker image of mariadb named xr3ngine_db.
    
3. Open a new tab and start the Agones sidecar in local mode

    ```
   cd scripts
   sh start-agones.sh
   ```
   
   You can also go to vendor/agones/ and run
   
   ```./sdk-server.linux.amd64 --local```
   
   If you are using a Windows machine, run
   
   ```sdk-server.windows.amd64.exe --local```
   
   and for mac, run
   
   ```./sdk-server.darwin.amd64 --local``` 

4. Start your app

    ```
    yarn start
    ```
    for development mode
    ```
    yarn dev
    ```
   
5. (Optional) Run client and server separately

    The primary runnable components of xr3ngine are the server and the client.
    Running ```yarn dev``` from the root directory will start both of them via Lerna.
    
    You may find it easier to run each of them separately in different tabs.
    Make sure you do not have them running from the root directory, then
    go to ```packages/<client or server>``` and run ```yarn dev```.
    
    Running them this way allows you to start one of the components with specific
    scripts, such as ```yarn dev-reinit-db``` in server, which will reset the
    database and re-populate all of the table schemas and seed values.
    This script is not specified in the root package.json. 

### Notes

If you are on Windows, you can use docker-compose to start the scripts/docker-compose.yml file, or install mariadb and copy the login/pass and database name from docker-compose or .env.local -- you will need to create the database with the matching name, but you do not need to populate it

./start-db.sh only needs to be run once. If the docker image has stopped, start it again with:

```
    docker container start xr3ngine_db
```

#### OSX DB Init

brew install mysql

mysql_secure_installation
server
password
 
mysql -uroot -ppassword
mysql -userver -ppassword

create database xr3ngine;
create user 'server'@'localhost' identified by 'password';
grant all on xr3ngine.* to 'server'@'localhost';

show databases;

mysql.server start
mysql.server stop


### Troubleshooting

#### Invalid Certificate errors in local environment

As of this writing, the cert provided in the xr3ngine package for local use
is not adequately signed. Browsers will throw up warnings about going to insecure pages.
You should be able to tell the browser to ignore it, usually by clicking on some sort
of 'advanced options' button or link and then something along the lines of 'go there anyway'.

Chrome sometimes does not show a clickable option on the warning. If so, just
type ```badidea``` or ```thisisunsafe``` when on that page. You don't enter that into the
address bar or into a text box, Chrome is just passively listening for those commands.

##### Allow gameserver address connection with invalid certificate

The gameserver functionality is hosted on an address other than localhost in the local
environment. Accepting an invalid certificate for localhost will not apply to this address.
Open the dev console for Chrome/Firefox by pressing ```Ctrl+Shift+i``` simultaneously, and
go to the Console or Network tabs. 

If you see errors about not being able to connect to
something like ```https://192.168.0.81/socket.io/?location=<foobar>```, right click on
that URL and open it in a new tab. You should again get a warning page about an invalid
certificate, and you again need to allow it.  

#### AccessDenied connecting to mariadb

Make sure you don't have another instance of mariadb running on port 3306
```
    lsof -i :3306
```
#### Error: listen EADDRINUSE :::3030

check which process is using port 3030 and kill
```
    killall -9 node
```
    OR
```
    lsof -i :3030
	kill -3 <proccessIDfromPreviousCommand>
```

#### Weird issues with your database?
Try
```
yarn run dev-reinit-db // in server package
```

## Testing

Simply run `yarn test` and all your tests in the `test/` directory will be run.

## Linting

`yarn run lint`

## Docker

You can run it using docker, if you don't have node installed or need to test.
``` bash
# Build the image
docker build --tag xr3ngine .

# Run the image (deletes itself when you close it)
docker run -d --rm --name server -e "MYSQL_URL=mysql://server:password@db:3306/xr3ngine" -p "3030:3030"  xr3ngine

# Stop the server
docker stop server
```

### Docker image configurations

Enviroment variables:
- `NODE_ENV` controls the config/*.js file for feathers.js to load [default: production]
- `PORT` controls the listening port [default: 3030]
- `MYSQL_URL` e.g. `mysql://<user>:<pass>@<host>:<port>/<db>` points to MariaDB server with a username and password

### Run in Kubernetes locally

First, you'll need minikube installed and running, as well as kubectl. Next, you'll want to point your shell to minikube's docker-env
so that you don't need to push the Docker image to an external repository. Run the following:

```eval $(minikube docker-env)```

For now, this process will use a separate Dockerfile called 'Dockerfile-dev'. You'll have to build the image using
it by running the following command:

```docker build -t xr3ngine/xr3ngine:v0.0.0 -f Dockerfile-dev .```

Once that image is built, make sure that kubectl is pointed to minikube.
Run ```kubectl config get-contexts``` and there should be a '*' next to minikube; alternatively, run 
```kubectl config current-context```, and it should show minikube.
If it's not, run ```kubectl config set-context minikube``` to change to it.

You'll need to deploy two Kustomize scripts to Minikube.
The first one is the nginx-ingress setup.
Run ```kubectl apply -k kubernetes/nginx/base```.

You'll need to have a file called 'xr3ngine-dev-secrets.env' in kubernetes/xr3ngine/base.
This is in the gitignore to demonstrate that these sorts of files should never be committed.
The production one is expected to be called 'xr3ngine-secrets.env' and is also in the gitignore.
As these are very sensitive files, they should be transmitted to you securely.

Finally run ```kubectl apply -k kubernetes/xr3ngine/base``` to deploy the MariaDB server and xr3ngine.
The server is set up in dev mode to be behind the domain 'api.dev.xr3ngine.dev' and is secured by a self-signed certificate.
If you wanted to call one of the endpoints with curl, you could run the following and get a 401 error: 
```curl https://192.168.99.109/user -H HOST:api.dev.xr3ngine.dev --insecure```

NOTE: As of this writing, the MariaDB server sometimes finishes initializing after xr3ngine has already tried to
connect to it. To reboot xr3ngine, run the following:

```kubectl rollout restart -n xr3ngine deployments/xr3ngine```


### SMTP Testing

https://mailtrap.io/inboxes

add credentials in ```packages/server/.env```
```dotenv
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=<mailtrap-user>
SMTP_PASS=<mailtrap-password>
```


## Scaffolding (Server Only)

Feathers.js has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```


## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).


## Migrations

### Generate Migration file

```node_modules/.bin/sequelize migration:generate --name "migration_name"```

### Migrate the database

Before run the server, you should migrate the db.
To do this, please run as following.
```yarn run compile```
```node_modules/.bin/sequelize db:migrate```

### For more information

For more information, please visit here
https://github.com/douglas-treadwell/sequelize-cli-typescript

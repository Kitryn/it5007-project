# IT5007 Project

## Layout

This project uses yarn workspaces to segregate client and server. It assumes you have prettier installed for code formatting.

## Local development

This project requires Node version `>=16`. We use `16.13` in local development, and docker base image `node:16-alpine` in production.

### Set up `yarn`

```
$ npm install yarn --global
```

## Getting started right away (for Lecturer + TA)

The webapp is already deployed to the public internet: https://mazesoba-345315.web.app

GitHub URL: [Link to repo](https://github.com/Kitryn/it5007-project)

## TUTORIAL 6 INSTRUCTIONS

This project has been deployed into production with an authenticated `firebase` CLI tool, and authenticated `gcloud` cli tool. A token-based authentication exists for lecturer and TA to use.

Tutorial questions:

1. Setup: Authentication file in two forms:
   - `firebase-admin.json` for authenticating with Cloud SQL and Cloud Run -- NOT IN SOURCE CONTROL, but should be in the gzipped file.
   - `FIREBASE_TOKEN` in `.env` file -- NOT IN SOURCE CONTROL, but should be in the gzipped file.
   - Follow the deployment instructions below for testing cloud connectivity.
2. Installation:
   - Follow the deployment instructions below. STRONGLY ADVISED TO TEST THE WEBSITE VIA ABOVE PUBLIC LINK BEFORE PLAYING AROUND WITH DEPLOYMENT.
3. Public accessibility:
   - Already covered previously: https://mazesoba-345315.web.app
4. Performance measurement definitions:
   - FP: First Paint
     - How long before when users first try to access the website before the page appears
   - FCP: First Contentful Paint
     - Similar to the above, but without loading screens - must display pieces of content
   - FMP: First meaningful paint
     - Similar to FCP except that it has to be usable to users
   - DCL: DOM Content Loaded
     - When the client side browser has fully loaded the DOM and is ready to run Javascript
5. Performance measurement on Cloud:
   - FP: 131.2ms
   - FCP: 174.1ms
   - DCL: 159.9ms
   - LCP (Largest Contentful Paint): 240.5ms
6. Performance measurement on Docker:
   - FP: 137.4ms
   - FCP: 172.1ms
   - DCL: 1006.2ms (maybe querying the cloud SQL?)
   - LCP: 172.2ms
7. Comments on performance measurement on Docker vs Cloud
   - Largely similar, possibly implies that our bundle sizes are small enough that network latency is not a great contributor, but instead the load time of the React runtime.
   - One notable difference is the DCL which seems to be a lot longer on the local Docker instance. It is possible that the measurement is including the time it took for one of the API queries to return, and since the local Docker instance proxies over its database requests to the Cloud SQL database, this could incur a large network latency compared to when the instance deployed in the cloud queries the SQL database in the cloud. If they live in the same or similar datacenter, the latency would be far less.

### Firebase (Front-end deployment)

Ideally we login with firebase. However for testing, we'll use authentication tokens pre-generated. Contact Yixun or Ding if the tokens don't work.

1. Install the Firebase CLI
   - `$ npm install --global firebase-tools`
2. Build the front end -- IMPORTANT! This will output the build artifacts used in production!
   - Install dependencies first, then build
   - `$ yarn && yarn client:build`
3. Copy the `FIREBASE_TOKEN` environment variable from `.env`
4. Deploy with the Firebase command line
   - `$ firebase deploy --token="<token>"`

### Google Cloud Run (Back-end deployment)

We login with the `gcloud` cli. For testing, we'll use the service account json `firebase-admin.json` file included in the gzip file.

1. [Set up gcloud CLI](https://cloud.google.com/sdk/docs/install-sdk)
2. Login with `gcloud` and the `firebase-admin.json` secret file
   - `$ gcloud auth login --cred-file=./firebase-admin.json`
3. Deploy with the `gcloud` command line
   - `$ gcloud run deploy sobaapi --source .`
   - Specifying the project service name is important as the service definition has been preconfigured with the necessary environment variables

### Google Cloud SQL (MySQL RDBMS)

Instance already set up on the Google Cloud Console GUI. To test connectivity, you need to install the `cloud_sql_proxy` provided by Google. There are some instructions below for how to do so on Windows. If you are on a Unix system (only tested with Ubuntu), it is a lot more straightforward:

- `$ sudo mkdir -p /cloudsql && sudo chmod 777 /cloudsql`
- `$ cloud_sql_proxy -dir=/cloudsql -instances=mazesoba-345315:asia-southeast1:mazesoba-mysql -credential_file=./firebase-admin.json`

This runs `cloud_sql_proxy` in a docker container and mounts the Unix socket at `/cloudsql`. You can then connect to the DB using your MySQL client of choice, with details:

- Socket/Pipe path: `/cloudsql/mazesoba-345315:asia-southeast1:mazesoba-mysql`
- Username: `root`
- Password: `<found inside .env file>`

## TO RUN LOCALLY

To run locally: source control does NOT include the `.env` file or `firebase-admin.json` credentials file. However, it should be included in the zip file provided to yourselves.

The following steps assume you are running on a Unix based system (only tested on Ubuntu, not tested on MacOS). If you are using Windows, please skip this section.

1. Install the project
   - `$ yarn`
2. Ensure you have the `.env` and `firebase-admin.json` files in the project root
3. Ensure you have `cloud_sql_proxy` permissions
   - `$ mkdir -p /cloudsql && sudo chmod 777 /cloudsql`
4. Run the development `docker-compose container`. This creates a unix socket in `/cloudsql` for directly talking to production database, authenticating with `firebase-admin.json`
   - `$ sudo docker-compose up --abort-on-container-exit --exit-code-from webapp --build`
   - Note: `--build` can be omitted for subsquent runs
5. Start the client frontend, with proxies request to the local back end
   - `$ yarn client:start`
   - Choose `y` when asked to run on port 3001 instead of 3000

**IF YOU ARE ON WINDOWS, THE FOLLOWING IS UNTESTED BUT SHOULD WORK**

1. Download `cloud_sql_proxy.exe` from google: https://dl.google.com/cloudsql/cloud_sql_proxy_x64.exe into the project root
2. If you are on powershell:
   - `> $env:GOOGLE_APPLICATION_CREDENTIALS=".\firebase-admin.json"`
   - `> .\cloud_sql_proxy.exe -instances=mazesoba-345315:asia-southeast1:mazesoba-mysql=tcp:3306 -credential_file=.\firebase-admin.json`
   - `> yarn server:dev`
   - Then in a new window:
   - `> yarn client:start`
3. If you are on `cmd` instead of powershell, set the environment variable with this instead:
   - `> set GOOGLE_APPLICATION_CREDENTIALS=".\firebase-admin.json"`

## Development instructions

### Setting up gcloud and firebase

1. [Set up gcloud CLI](https://cloud.google.com/sdk/docs/install-sdk)

2. Set gcloud project `$ gcloud config set project mazesoba-345315`

3. Set cloud run region `$ gcloud config set run/region asia-southeast1`

4. Install firebase CLI `$ npm install --global firebase-tools`

5. Set up firebase

```
$ firebase login
```

6. Deploy when ready

```
$ yarn client:build
$ firebase deploy
```

7. View in prod: https://mazesoba-345315.web.app/

### Adding firebase components

`$ firebase init`

## Project structure

### packages/client

Frontend client project, initialised with `yarn create react-app client --template typescript`.

### packages/server

express.js based backend. Talks with MySQL hosted on Google Cloud SQL

### Local development

To proxy over to production:

```bash
$ mkdir -p /cloudsql && sudo chmod 777 /cloudsql
$ cloud_sql_proxy -dir=/cloudsql -instances=mazesoba-345315:asia-southeast1:mazesoba-mysql -credential_file=./firebase-admin.json
```

### Running client locally with docker

For local server development with live code reload on server:

```
$ docker-compose up --abort-on-container-exit --exit-code-from webapp --build
```

Note that `docker-compose` also starts up the cloud sql proxy.

### Deploying the backend to production

```
$ gcloud run deploy sobaapi --source .
```

# Database schema

1. **currencies**

- Stores record of different currencies supported
- Keeps track if a given currency is a LP token or not by including a reference to pairs.id; null if not LP token

2. **pairs**

- Defines an exchange tradeable pair
- Foreign key constraint on `ccy1`, `ccy2` to `currencies.id`.

3. **reserves**

- Stores reserves for a given pair+ccy
- One row for each ccy to make joins easier
- Foreign key constraint on `pair_id` to `pairs.id`
- Foreign key constraint on `ccy_id` to `currencies.id`

4. **transactions**

- Stores list of swap transactions made by a user
- Foreign key constraint on `pair_id` to `pairs.id`

5. **balances**

- Stores balances for a given user id `uid`
- Foreign key constraint `ccy_id` to `currencies.id`

6. **requests**

- Stores withdrawal requests
- Foreign key constraint `ccy_id` to `currencies.id`

7. **airdrops**

- Stores whether or not a user has claimed a specific airdrop (e.g. first time user)

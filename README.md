# IT5007 Project

## Layout

This project uses yarn workspaces to segregate client and server. It assumes you have prettier installed for code formatting.

## Local development

### Set up `yarn`

```
$ npm install yarn --global
```

## Getting started right away (for Lecturer + TA)

The webapp is already deployed to production: https://mazesoba-345315.web.app

GitHub URL: [Link to repo](https://github.com/Kitryn/it5007-project)

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

# IT5007 Project

## Layout

This project uses yarn workspaces to segregate client and server. It assumes you have prettier installed for code formatting.

## Local development

### Set up `yarn`

```
$ npm install yarn --global
```

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
$ firebase deploy
```

7. View in prod: https://mazesoba-345315.web.app/

### Adding firebase components

`$ firebase init`

## Project structure

### packages/client

Frontend client project, initialised with `yarn create react-app client --template typescript`.

Feel free to rip this entire thing out to scaffold from scratch; the only requirement is that it builds into a `/build` folder (which will be served by the backend).

### packages/server

express.js based backend. Pending addition of MongoDB

### Running client locally with docker

```
$ docker build --tag mazesoba .
$ docker run --init -it --publish 3000:3000 mazesoba

```

Or for local server development with live code reload on server:

```
$ docker-compose up --abort-on-container-exit --exit-code-from webapp --build
```

```
$ gcloud run deploy sobaapi --source .
>> https://sobaapi-bovnkkpola-as.a.run.app
```

Local dev with cloud_sql_proxy

```bash
$ sudo mkdir /cloudsql; sudo chmod 777 /cloudsql

# For socket usage for local dev server
$ cloud_sql_proxy -dir=/cloudsql -instances=mazesoba-345315:asia-southeast1:mazesoba-mysql -credential_file=./firebase-admin.json
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

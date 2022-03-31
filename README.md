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

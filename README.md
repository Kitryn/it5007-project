# IT5007 Project

## Layout

This project uses yarn workspaces to segregate client and server. It assumes you have prettier installed for code formatting.

### packages/client

Frontend client project, initialised with `yarn create react-app client --template typescript".

Feel free to rip this entire thing out to scaffold from scratch; the only requirement is that it builds into a `/build` folder (which will be served by the backend).

### packages/server

express.js based backend. Pending addition of MongoDB

```
$ docker build --tag it5007 .
$ docker run --publish 5000:5000 it5007

# Stopping
$ docker ps
$ docker stop <containerid>
```

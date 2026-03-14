# Tamerlane Chess

## Installation

### env setup

Create a file .env based on .env.example
Set PORT to an unused port (e.g., 3000)
Set VITE_WEBSERVER_HOST to "http://localhost:{port number}"
	where port number is replaced with PORT
For example:

```
PORT=3000
VITE_WEBSERVER_HOST="http://localhost:3000"
```

### running

```
npm install --legacy-peer-deps

```

**In backend server command line**

```
npm run devser
```

**In webserver command line**

```
npm run devweb
```


## Architecture

### Network

We use a client-server architecture. To join a game, a client either requests to make a game or to join a free lobby, where they receive a token to identify them. They can then use this token over https to make moves for their game instance. Instances that aren't used will be periodically removed.

### Game

//TODO

# Proposal Limitations

As of now, players can make servers and view the rules. When in a game, they can view legal moves, take pieces, and win or lose. 

However, due to time constraints, some features were not yet implemented. citadel drawing, server customization, private servers, and rematching were not implemented.

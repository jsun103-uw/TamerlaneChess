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

The vulnerability has been identified to be from the flatted development-build sub-dependency, and is unlikely to be of issue for runtime builds

**In backend server command line**

```
npm run devser
```

**In webserver command line**

```
npm run devweb
```

Then go to the provided webserver link.

## Architecture Notes

### Network

We use a client-server architecture. To join a game, a client either requests to make a game or to join a free lobby, where they receive a token to identify them. They can then use this token over https to make moves for their game instance. Instances that aren't used will be periodically removed.

### Game

Pieces can calcualte their own pseudolegal moves, which does not consider board states like checks. For example, a rook's pseudo legal moves are all moves in a line up to the edge of the board, a friendly piece, or up to an including an enemy piece. Legal moves are then filtered from the pseudo legal ones by checking if the state is valid.

# Proposal Limitations

As of now, players can make servers and view the rules. When in a game, they can view legal moves, take pieces, and win or lose. 

However, due to time constraints, some features were not yet implemented. citadel drawing, server customization, private servers, and rematching were not implemented.

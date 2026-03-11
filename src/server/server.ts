import { convertMoveJson } from "../common/Convert.js";
import { MoveUnion } from "../common/Move.js";
import { Player, PlayerENUM } from "../common/Player.js";
import { BadResponse, JoinResponse, MoveResponse, NoResponse, ServerInfo, ServerlistResponse, TamerlaneRequest, TamerlaneRequestENUM, TamerlaneResponseENUM, UpdateRequest } from "../common/Request.js";
import { GameInstance } from "./GameInstance.js";
import express from "express"
import cors from "cors"

const maxInstances: number = 10;

let instances = new Map<number, GameInstance>();
let instanceNum: number = 0;


import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(cors());
app.post('/server', async (req, res) => {
    console.log(req.url)

    if (req.method === 'POST') {
        let body = '';

        for await (const chunk of req) {
            body += chunk;
        }
        res.status(200);
        const data = JSON.parse(body);
        if (!data.request) {
            res.json((handleBadRequest("Does not have request")));
            return;
        }

        switch(data.request as TamerlaneRequest) {
            case TamerlaneRequestENUM.move:
                res.json(handleMoveRequest(data));
                break;
            case TamerlaneRequestENUM.update:
                res.json(handleUpdateRequest(data));
                return;
            case TamerlaneRequestENUM.serverlist:
                res.json(handleServerlistRequest());
                break;
            case TamerlaneRequestENUM.join:
                res.json(handleJoinRequest(data));
                break;
            case TamerlaneRequestENUM.make:
                res.json(handleMakeRequest());
                break;
            case TamerlaneRequestENUM.rematch:

                break;
            default:
                res.json(handleBadRequest("Request not understood"));
                break;

        }
        console.log(data);

        // res.end(JSON.stringify({ received: data }));
        return;
    }

    res.status(404).json({"error":"not found"});
});
// Server listening to port
app.listen((port), () => {
    console.log(`Server is running on ${port}`);
})



function newInstance(): [number, GameInstance] {
    const instance = new GameInstance();
    const num = instanceNum ++;
    instances.set(num, instance);
    return [num, instance];
}


function handleBadRequest(message: string): BadResponse {
    return {
        response: TamerlaneResponseENUM.bad,
        message: message,
    }
}


function handleServerlistRequest(): ServerlistResponse {
    const servers: ServerInfo[] = [];
    for (const [k, v] of instances) {
        // only show available servers
        if (v.full) continue;

        servers.push({
            instanceNumber: k,
            playerSide: v.joinedWhite ? PlayerENUM.Black : PlayerENUM.White,
        })
    }
    return {
        response: "serverlist",
        servers: servers,
    }
}

function handleMakeRequest(): JoinResponse | BadResponse  {
    if (instances.size > maxInstances) {
        return handleBadRequest("Servers full");
    }
    const [key, instance] = newInstance();
    if (!instance.join(PlayerENUM.White)) {
        console.log("Failed to join own game");
        return handleBadRequest("transaction failed");
    }

    const joinResp: JoinResponse = {
        response: TamerlaneResponseENUM.join,
        player: PlayerENUM.White,
        token: instance.whiteToken,
        instance: key
    }
    return joinResp;
}
/**
 * returns the move that was executed to the server if the client successfully moved a piece, or a bad response if not.
 */
function handleMoveRequest(request: any): MoveResponse | BadResponse {
    //* Ensure that required parameters exist and are the right types
    if (request.move === undefined || 
        request.instance === undefined || 
        request.token === undefined || 
        request.turnNum === undefined) return {
        response: TamerlaneResponseENUM.bad,
        message: `request missing properties: ${JSON.stringify(request)}`,
    };

    const instanceNum = parseInt(request.instance);
    const token = parseInt(request.token);
    const turnNum = parseInt(request.turnNum);
    if (instanceNum === undefined  ||
        token === undefined ||
        turnNum === undefined) return {
        response: TamerlaneResponseENUM.bad,
        message: `Failed to parse number: ${request}`,
    };

    //* check that instance exists
    const instance = instances.get(request.instance);
    if (instance === undefined) return {
        response: TamerlaneResponseENUM.bad,
        message: `instance ${instanceNum} not found`,
    }

    //* parse move
    const move: MoveUnion | null = convertMoveJson(request.move);
    if (move === null) return {
        response: TamerlaneResponseENUM.bad,
        message: `move not understood: ${request.move}`,
    }; 

    //* attempt to execute move
    const result = instance.do(token, move);
    if (result !== null) {
        return {
            response: TamerlaneResponseENUM.move,
            move: result,
        }
    }
    else {
        return {
            response: TamerlaneResponseENUM.bad,
            message: `Attempted to execute illegal move: ${JSON.stringify(move)}`,
        }
    }
}

function handleJoinRequest(request: any): JoinResponse | BadResponse {
    if (request.request !== TamerlaneRequestENUM.join) {
        return handleBadRequest(`invalid valid join request`);
    }
    const instanceNum = parseInt(request.instance);
    if (instanceNum === undefined) {
        return handleBadRequest(`failed to parse instance ${request.instance}`);
    }


    //* check that instance exists
    const instance = instances.get(instanceNum);
    if (instance === undefined) return handleBadRequest(`instance ${instanceNum} not found`);


    //* get side that's free
    let side: Player | null = instance.getFreeSide();
    if (side === null ) {
        return handleBadRequest(`No free sides`);
    }

    //* try to join
    const joined = instance.join(side);
    if (joined === null) return handleBadRequest(`Failed to join game`);
    return {
        response: TamerlaneResponseENUM.join,
        instance: instanceNum,
        player: side,
        token: instance.tokenOf(side),
    }
}

function handleUpdateRequest(request: any): MoveResponse | BadResponse | NoResponse {
    const token = parseInt(request.token);
    const turnNum = parseInt(request.turnNum);
    const instanceNum = parseInt(request.instance);
    if (token === undefined || turnNum === undefined || instanceNum === undefined) {
        return handleBadRequest(`failed to parse values in  ${request}`);
    }

    //* check that instance exists
    const instance = instances.get(instanceNum);
    if (instance === undefined) return handleBadRequest(`instance ${instanceNum} not found`);

    const move = instance.getUpdateFor(token, turnNum);
    if (move === null) return {
        response: TamerlaneResponseENUM.none,
    };
    else return {
        response: TamerlaneRequestENUM.move,
        move: move,
    }
}
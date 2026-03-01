import { PlayerENUM } from "../common/Player";
import { BadResponse, JoinResponse, ServerInfo, ServerlistResponse, TamerlaneRequest, TamerlaneRequestENUM, TamerlaneResponseENUM } from "../common/Request";
import { GameInstance } from "./GameInstance";
import { createServer, ServerResponse } from "node:http";

const maxInstances: number = 10;

let instances = new Map<number, GameInstance>();
let instanceNum: number = 0;

function newInstance(): [number, GameInstance] {
    const instance = new GameInstance();
    const num = instanceNum ++;
    instances.set(num, instance);
    return [num, instance];
}


const server = createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/server') {
        let body = '';

        for await (const chunk of req) {
            body += chunk;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        const data = JSON.parse(body);
        console.log(data);
        if (!data.request) {
            res.end(JSON.stringify(handleBadRequest("Does not have request")));
            return;
        }

        switch(data.request as TamerlaneRequest) {
            case TamerlaneRequestENUM.move:

                break;
            case TamerlaneRequestENUM.serverlist:
                res.end(JSON.stringify(handleServerlistRequest()))
                break;
            case TamerlaneRequestENUM.join:

                break;
            case TamerlaneRequestENUM.make:
                res.end(JSON.stringify(handleMakeRequest()))
                break;
            case TamerlaneRequestENUM.rematch:

                break;
            default:
                res.end(JSON.stringify(handleBadRequest("Request not understood")));
                break;

        }

        // res.end(JSON.stringify({ received: data }));
        return;
    }

    res.writeHead(404);
    res.end();
});
function handleBadRequest(message: string): BadResponse {
    return {
        response: TamerlaneResponseENUM.bad,
        message: message,
    }
}

// Server listening to port 3000
server.listen((3000), () => {
    console.log("Server is Running");
})

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
    instance.join(instance.whiteToken);

    const joinResp: JoinResponse = {
        response: TamerlaneResponseENUM.join,
        player: PlayerENUM.White,
        token: instance.whiteToken,
        instance: key
    }
    return joinResp;
}
import { BadResponse, ConnectRequest, GameExitRequest, JoinResponse, MakeRequest, RematchRequest, GetServersRequest as ServerlistRequest, ServerlistResponse, TamerlaneRequestENUM, TamerlaneResponseENUM } from "../common/Request";

const host = import.meta.env.VITE_WEBSERVER_HOST;
console.log(`Looking for webserver at ${host}`);

/**
 * Sends a post request with a json object to the webserver identified in the environment.
 * @param json object to send
 * @param handle handler, if successful
 */
export function sendRequest(json: Object, handle: (resp: any) => any): Promise<void> {
    return fetch(`${host}/server`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(json),
        }
    ).then(resp => resp.json())
    .then(json => {
        handle(json);
    }).catch(err => {
            console.log(`Failed to send request: ${err}`);
    })
}

export function requestServers(handle: (resp: ServerlistResponse) => void): Promise<void> {
    const GetServer: ServerlistRequest = {
        request: TamerlaneRequestENUM.serverlist
    };
    return sendRequest(GetServer, json => {
        if (json.response 
            && json.response === TamerlaneResponseENUM.serverlist
            && json.servers
        ) {
            handle(json);
        }
        handle(json);
    });
}


export function requestMake(name: string, handle: (response: JoinResponse | BadResponse) => void) {
    const request: MakeRequest = {
        request: TamerlaneRequestENUM.make,
        name: name,
    }
    sendRequest(request, handle);
}

export function requestJoin(instance: number, handle: (response: JoinResponse | BadResponse) => void) {
    const request: ConnectRequest = {
        request: TamerlaneRequestENUM.join,
        instance: instance,
    }
    sendRequest(request, handle);
}

export function requestRematch(instance: number, token: number, handle: (Response: JoinResponse | BadResponse) => void): Promise<void> {
    const request: RematchRequest = {
        request: TamerlaneRequestENUM.rematch,
        instance: instance,
        token: token,
    }
    return sendRequest(request, handle);
}

export function sendGameExit(instance: number, token: number) {
    const request: GameExitRequest = {
        request: "gameexit",
        token: instance,
    }
}
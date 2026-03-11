import { BadResponse, ConnectRequest, JoinResponse, MakeRequest, GetServersRequest as ServerlistRequest, ServerlistResponse, TamerlaneRequestENUM, TamerlaneResponseENUM } from "../common/Request";

const host = import.meta.env.VITE_WEBSERVER_HOST;
console.log(`Looking for webserver at ${host}`);

export function sendRequest(json: Object, handle: (resp: any) => any) {
    fetch(`${host}/server`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(json),
        }
    ).then(resp => resp.json())
    .then(json => {
        handle(json);
    })
}

export function requestServers(handle: (resp: ServerlistResponse) => void): void {
    const GetServer: ServerlistRequest = {
        request: TamerlaneRequestENUM.serverlist
    };
    sendRequest(GetServer, json => {
        if (json.response 
            && json.response === TamerlaneResponseENUM.serverlist
            && json.servers
        ) {
            handle(json);
        }
        handle(json);
    });
}


export function requestMake(handle: (response: JoinResponse | BadResponse) => void) {
    const request: MakeRequest = {
        request: TamerlaneRequestENUM.make,
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
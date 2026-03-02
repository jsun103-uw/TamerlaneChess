import { BadResponse, ConnectRequest, JoinResponse, MakeRequest, GetServersRequest as ServerlistRequest, TamerlaneRequestENUM } from "../common/Request";

export function sendRequest(json: Object, handle: (resp: any) => any) {
    fetch('http://localhost:3000/server', {
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

export function requestServers() {
    const GetServer: ServerlistRequest = {
        request: TamerlaneRequestENUM.serverlist
    }
    sendRequest(GetServer, json => console.log(json));
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
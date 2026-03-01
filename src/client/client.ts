import { MakeRequest, GetServersRequest as ServerlistRequest, TamerlaneRequestENUM } from "../common/Request";

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


export function requestMake() {
    const request: MakeRequest = {
        request: TamerlaneRequestENUM.make,
    }
    sendRequest(request, json => console.log(json));
}
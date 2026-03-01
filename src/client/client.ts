import { MakeRequest, GetServersRequest as ServerlistRequest, TamerlaneRequestENUM } from "../common/Request";

function sendRequests(json: Object) {
    fetch('http://localhost:3000/server', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(json),
        }
    ).then(resp => resp.json())
    .then(json => {
        console.log(json);
    })
}

function requestServers() {
    const GetServer: ServerlistRequest = {
        request: TamerlaneRequestENUM.serverlist
    }
    sendRequests(GetServer);
}


function requestMake() {
    const request: MakeRequest = {
        request: TamerlaneRequestENUM.make,
    }
    sendRequests(request);
}

requestMake();
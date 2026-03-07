import React, { RefObject, useEffect, useRef, useState } from "react";
import { requestServers } from "./client";
import { ServerInfo, ServerlistResponse } from "../common/Request";


export default function ServerPage() {
    const [servers, setServers] = useState<ServerInfo[]>([])
    const serverTimeout: RefObject<NodeJS.Timeout | null> = useRef(null);
    console.log(servers);

    function handleServerlist(resp: ServerlistResponse) { setServers(resp.servers) }
    useEffect(
        () => {
            requestServers(handleServerlist);

            if (serverTimeout.current !== null) clearInterval(serverTimeout.current);
            serverTimeout.current = setInterval(() => {
                requestServers(handleServerlist);
            }, 500);
        }, []
    )
    return (
        <>
            <div className=".server-list">
                {
                    servers.map(
                        server => (
                            <button key={server.instanceNumber}>
                                <p>{`Instace: ${server.instanceNumber}, Player: ${server.playerSide}`}</p>
                            </button>
                        )
                    )
                }
            </div>
        </>
    )
}
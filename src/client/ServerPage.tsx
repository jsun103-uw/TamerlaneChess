import React, { RefObject, useEffect, useRef, useState } from "react";
import { requestJoin, requestMake, requestServers } from "./Client";
import { BadResponse, JoinResponse, ServerInfo, ServerlistResponse } from "../common/Request";
import { Server } from "http";
import { Player } from "../common/Player";
import { PATH_SERVERS } from "./Consts";

interface ServerPage {
    readonly onJoin?: (side: Player, token: number, instance: number) => (void);
}


export default function ServerPage(props: ServerPage) {
    const [servers, setServers] = useState<ServerInfo[]>([])
    const serverPolling: RefObject<NodeJS.Timeout | null> = useRef(null);
 
    function handleResponse(resp: JoinResponse | BadResponse) {
        if (resp.response === "join") {
            if (props.onJoin) props.onJoin(resp.player, resp.token, resp.instance);
        }
        else {
            console.log(`Failed to join: ${resp.message}`);
        }
    }
    // console.log(servers);

    function pingUpdate() {
        if (serverPolling.current) clearTimeout(serverPolling.current);
        serverPolling.current = setTimeout(async () => {
            await requestServers(handleServerlist)
            //set timer again
            pingUpdate();
        }, 1000)
    }

    function handleServerlist(resp: ServerlistResponse) { setServers(resp.servers) }
    useEffect(
        () => {
            pingUpdate();
            return () => {
                if (serverPolling.current) clearTimeout(serverPolling.current);
            }
        }, []
    )
    return (
        <>
            <button onClick={() => requestMake(handleResponse)}>
                New Server
            </button>
            <div className=".server-list">
                {
                    servers.map(
                        server => (
                            <button 
                                key={server.instanceNumber}
                                onClick={
                                    () => requestJoin(server.instanceNumber, handleResponse)
                                }>
                                <p>{`Instace: ${server.instanceNumber}, Player: ${server.playerSide}`}</p>
                            </button>
                        )
                    )
                }
            </div>
        </>
    )
}
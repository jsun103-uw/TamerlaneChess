import React, { RefObject, useEffect, useRef, useState } from "react";
import { requestJoin, requestMake, requestServers } from "../Client";
import { BadResponse, JoinResponse, ServerInfo, ServerlistResponse } from "../../common/Request";
import { Player } from "../../common/Player";
import './ServerPage.css'

interface ServerPage {
    readonly onJoin?: (side: Player, token: number, instance: number) => (void);
}


export default function ServerPage(props: ServerPage) {
    const [servers, setServers] = useState<ServerInfo[]>([])
    const [joinError, setJoinError] = useState<string>("");
    const serverPolling: RefObject<NodeJS.Timeout | null> = useRef(null);
    const serverName: RefObject<string> = useRef("");
 
    /**
     * 
     * @param resp Handles join/fail response from attempting to make/join a game
     */
    function handleResponse(resp: JoinResponse | BadResponse) {
        if (resp.response === "join") {
            setJoinError("");
            if (props.onJoin) props.onJoin(resp.player, resp.token, resp.instance);
        }
        else {
            setJoinError(resp.message);
            console.log(`Failed to join: ${resp.message}`);
        }
    }

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
        <main className="server-page">
            <section className="server-section server-create-panel">
                <div className="server-create-controls">
                    <label className="server-field" htmlFor="server-name">
                        <span>server name</span>
                        <input
                            id="server-name"
                            type="text"
                            name="name"
                            placeholder="hello"
                            onChange={(e) => {
                                serverName.current = e.target.value
                            }}
                        />
                    </label>
                    <button className="server-action-button" onClick={() => requestMake(serverName.current, handleResponse)}>
                        New Server
                    </button>
                </div>
                {
                    joinError.length > 0 ?
                    <p className="server-error" role="status">{joinError}</p> :
                    <></>
                }
            </section>

            <section className="server-section">
                <div className="server-list" role="list">
                    {
                        servers.map(
                            server => (
                                <button
                                    className="server-card"
                                    key={server.instanceNumber}
                                    onClick={
                                        () => requestJoin(server.instanceNumber, handleResponse)
                                    }
                                >
                                    <p>{`${server.name}: Instance ${server.instanceNumber}, Playing as ${server.playerSide}`}</p>
                                </button>
                            )
                        )
                    }
                </div>
            </section>
        </main>
    )
}
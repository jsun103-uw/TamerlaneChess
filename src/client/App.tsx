import { useEffect, useReducer, useRef, useState } from 'react'
import './App.css'
import React from 'react'
import TamerlanePieces from './TamerlanePieces'
import GamePage from './GamePage'
import { ClientInstance } from './ClientInstance'
import { PlayerENUM } from '../common/Player'
import { Route, Routes, useNavigate } from 'react-router-dom'
import ServerPage from './ServerPage'
import { ServerInfo } from '../common/Request'
import { requestJoin } from './client'

function App() {
  	const navigate = useNavigate();
	const [client, setClient] = useState<ClientInstance | null>(new ClientInstance(PlayerENUM.Black, 0, 0))
	const [, rerender] = useReducer(x => x + 1, 0);


	return (
		<Routes>
			<Route 
				path="/"
				element={
					<ServerPage onSelect={
						(server: ServerInfo) => {
							requestJoin(
								server.instanceNumber, resp => {
									if (resp.response === "join") {
										setClient(new ClientInstance(resp.player, resp.instance, resp.instance));
										navigate("/instance/");
									}
									else {
										console.log(`failed to join: ${resp.message}`);
									}
								}
							)
						}
					}/>
				}
			/>
			<Route 
				path="/instance"
				element={
					<GamePage instance={client} />
				}
			/>
		</Routes>
	)
}

export default App

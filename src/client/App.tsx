import { RefObject, useEffect, useReducer, useRef, useState } from 'react'
import './App.css'
import React from 'react'
import TamerlanePieces from './TamerlanePieces'
import GamePage from './GamePage'
import { ClientInstance } from './ClientInstance'
import { Player, PlayerENUM } from '../common/Player'
import { Route, Routes, useNavigate } from 'react-router-dom'
import ServerPage from './ServerPage'
import { ServerInfo } from '../common/Request'
import { requestJoin } from './client'
import { PATH_INSTANCE, PATH_SERVERS } from './Consts'
import FooterBar from './FooterBar'

function App() {
  	const navigate = useNavigate();
	const [client, setClient] = useState<ClientInstance | null>(new ClientInstance(PlayerENUM.Black, 0, 0))
	const nameRef: RefObject<string> = useRef<string>("");
	const [, rerender] = useReducer(x => x + 1, 0);


	return (
		<>
			<Routes>
				<Route 
					path={PATH_SERVERS}
					element={
						<ServerPage onJoin={
							(side: Player, token: number, instance: number) => {
								setClient(new ClientInstance(side, token, instance));
								navigate(PATH_INSTANCE);
							}
						} />
					}
				/>
				<Route 
					path={PATH_INSTANCE}
					element={
						<GamePage instance={client} />
					}
				/>
			</Routes>
			<FooterBar onChanged={(text: string) => {
				nameRef.current = text;
			}} />
		</>
	)
}

export default App

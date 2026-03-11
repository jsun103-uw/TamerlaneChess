import { RefObject, useEffect, useReducer, useRef, useState } from 'react'
import './App.css'
import React from 'react'
import TamerlanePieces from './gamepage/TamerlanePieces'
import GamePage from './gamepage/GamePage'
import { ClientInstance } from './ClientInstance'
import { Player, PlayerENUM } from '../common/Player'
import { Route, Routes, useNavigate } from 'react-router-dom'
import ServerPage from './serverpage/ServerPage'
import { ServerInfo } from '../common/Request'
import { requestJoin } from './Client'
import { PATH_INSTANCE, PATH_ROOT, PATH_RULES, PATH_SERVERS } from './Consts'
import FooterBar from './FooterBar'
import { RulePage } from './rulepage/RulePage'
import HomePage from './homepage/HomePage'

function App() {
  	const navigate = useNavigate();
	const [client, setClient] = useState<ClientInstance | null>(null)
	const nameRef: RefObject<string> = useRef<string>("");
	const [, rerender] = useReducer(x => x + 1, 0);


	return (
		<>
			<Routes>
				<Route
					path={PATH_ROOT}
					element={
						<HomePage 

						/>
					}
				/>
				<Route 
					path={PATH_SERVERS}
					element={
						<ServerPage onJoin={
							(side: Player, token: number, instance: number) => {
								setClient(new ClientInstance(side, token, instance, nameRef.current, "temp"));
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
				<Route
					path={PATH_RULES}
					element={
						<RulePage
							//TODO if need properties, add them here. They shouldn't be needed, though
						/>
					}

				/>
			</Routes>
		</>
	)
}

export default App

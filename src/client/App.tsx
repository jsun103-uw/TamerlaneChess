import { useEffect, useReducer, useRef, useState } from 'react'
import './App.css'
import React from 'react'
import TamerlanePieces from './TamerlanePieces'
import GamePage from './GamePage'
import { ClientInstance } from './ClientInstance'
import { PlayerENUM } from '../common/Player'

function App() {
	const client = useRef<ClientInstance | null>(new ClientInstance(PlayerENUM.Black, 0, 0))
	const [, rerender] = useReducer(x => x + 1, 0);


	return (
		<>
			<GamePage instance={client.current}></GamePage>
		</>
	)
}

export default App

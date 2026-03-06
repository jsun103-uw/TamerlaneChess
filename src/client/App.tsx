import { useState } from 'react'
import './App.css'
import React from 'react'
import BoardElement from './BoardElement'
import GamePage from './GamePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GamePage></GamePage>
    </>
  )
}

export default App

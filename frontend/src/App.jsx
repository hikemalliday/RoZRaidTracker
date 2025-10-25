import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DevHome from './views/DevHome.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <DevHome/>
    </>
  )
}

export default App

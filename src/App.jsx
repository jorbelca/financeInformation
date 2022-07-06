import Home from "./Views/Home"
import "./App.css"
import Notification from "./Views/Notification"
import { Routes, Route, Link } from "react-router-dom"

import Graphs from "./Views/Graphs"

function App() {
  return (
    <div className="App">
      <Notification />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/graphs/:symbol" element={<Graphs />} />
      </Routes>
    </div>
  )
}

export default App

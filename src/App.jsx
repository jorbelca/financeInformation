import Home from "./Views/Home"
import "./App.css"
import Notification from "./Views/Notification"
import { Routes, Route } from "react-router-dom"
import Graphs from "./Views/Graphs"
import Compare from "./Views/Compare"
import Footer from "./Components/Footer"

function App() {
  return (
    <div className="App">
      <Notification />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/graphs/:symbol" element={<Graphs />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App

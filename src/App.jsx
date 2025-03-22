import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getPokemon, getAllPokemon } from '../src/Services/pokeService'
import "./App.css";

import { Home } from './Pages/home'
import { SinglePokemon } from './Pages/singlePokemon'

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:id" element={<SinglePokemon />} />
        </Routes>
    </Router>
  )
}

export default App

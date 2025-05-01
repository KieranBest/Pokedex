import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { getPokemon, getAllPokemon, colourTypes, generations } from '../Services/pokeService';

export const Home = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [filteredPokemonData, setFilteredPokemonData] = useState([]);
  const [loading, isLoading] = useState(true);


  const apiURL = 'https://pokeapi.co/api/v2/pokemon?limit=200';

  const navigate = useNavigate();

  // Initial loading of pokemon
  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(apiURL);
      await loadPokemon(response.results);
      isLoading(false);
    }
    fetchData();
  }, [])

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(data.map(async pokemon => {
      let pokemonGet = await getPokemon(pokemon);
      return pokemonGet;
    }))
    setPokemonData(_pokemonData);
    setFilteredPokemonData(_pokemonData);
  }

  // Opens generation page
  function openGeneration(id) {
    console.log(id.key);
    navigate("/generation", { state: id.key})
  }

  // Opens singular pokemon page
  const openSinglePokemon = (id) => {
    navigate(`/pokemon/${id}`);
  }

  // Search functionality
  function handleSearchInput(input) {
    let filteredPokemon = pokemonData.filter(pokemon => pokemon.name.toLowerCase().includes(input.toLowerCase()));
    setFilteredPokemonData(filteredPokemon);
  }


  return (
    <div>
      <p className=' text-6xl'>Pokemon</p>
      <div className="grid grid-cols-10 sm:grid-cols-6 gap-8">
        {Object.keys(generations).map((key) => (
          <button key={key} onClick={() => openGeneration({key})} className='bg-red-500 p-10 rounded-full' >{generations[key]}</button>
        ))}
      </div>
      <input 
        type='text'
        onChange={(e) => handleSearchInput(e.target.value)}
        className=' rounded-full border-2 m-2 p-2 bg-white'
        >
      </input>
    </div>
  );
}


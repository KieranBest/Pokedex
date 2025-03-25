import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { getPokemon, getAllPokemon } from '../Services/pokeService';

export const Home = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, isLoading] = useState(true);
  const apiURL = 'https://pokeapi.co/api/v2/pokemon?limit=151';
  const navigate = useNavigate();

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

  const openSinglePokemon = (id) => {
    navigate(`/pokemon/${id}`);
  }

  const [filteredPokemonData, setFilteredPokemonData] = useState([]);

  function handleSearchInput(input) {
    let filteredPokemon = pokemonData.filter(pokemon => pokemon.name.toLowerCase().includes(input.toLowerCase()));
    setFilteredPokemonData(filteredPokemon);
    console.log(pokemonData)
  }




  return (
    <div>
      <p className=' text-6xl'>Pokemon</p>
      <input 
        type='text'
        onChange={(e) => handleSearchInput(e.target.value)}
        className=' rounded-full border-2 m-2 p-2 bg-white shadow-red-300'
        >
        </input>

      {loading ? <p>Loading...</p> : (
      <div className='grid grid-cols-10 pb-10 gap-4'>
        {filteredPokemonData.map((p) => (
            <div className='bg-blue-100 hover:cursor-pointer' key={p.id} onClick={() => openSinglePokemon(p.id)}>
                <img className='justcenter' src={p.sprites.front_default} alt={p.name} />
                <p>{p.name}</p>
                <p># {p.id}</p>
            </div>
        ))}
    </div>
  )}
  </div>
  );
}


import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom"
import { getPokemon, getAllPokemon } from '../Services/pokeService'

export const Home = () => {
  const [pokemonData, setPokemonData] = useState([])
  const [loading, isLoading] = useState(true)
  const apiURL = 'https://pokeapi.co/api/v2/pokemon?limit=100'
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(apiURL)
      await loadPokemon(response.results)
      isLoading(false)
    }
    fetchData()
  }, [])

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(data.map(async pokemon => {
      let pokemonGet = await getPokemon(pokemon)
      return pokemonGet
    }))
    setPokemonData(_pokemonData)
  }

  const openSinglePokemon = (id) => {
    navigate(`/pokemon/${id}`)
  }

  return (
    <div className='grid grid-cols-5 pb-10 gap-4'>
        {pokemonData.map((p) => (
            <div className='p-4' key={p.id} onClick={() => openSinglePokemon(p.id)}>
                <img className='pokeImage' src={p.sprites.front_default} alt='pokemon' />
                <p>{p.name}</p>
                <p># {p.id}</p>
            </div>
        ))}
    </div>
  );
}


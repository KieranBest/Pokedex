import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { getPokemon, getAllPokemon, colourTypes, generations } from '../Services/pokeService';
import { useLocation } from "react-router-dom";

export const Generation = () => {
    const [pokemonData, setPokemonData] = useState([]);
    const [filteredPokemonData, setFilteredPokemonData] = useState([]);
    const [loading, isLoading] = useState(true);

    const location = useLocation();
    const generation = location.state;
    const generationURL = `https://pokeapi.co/api/v2/generation/${generation}/`;
    let generationPokemon = [];
    let idArray = [];
    let sortedGenerationPokemon = [];


    const navigate = useNavigate();

    // Initial loading of pokemon
    useEffect(() => {
        async function fetchPData(url) {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        }

        async function fetchPokemonID(pokemon) {
            let pData = await fetchPData(pokemon.url);
            if(idArray.includes(pData.id) == false) {
                idArray.push(pData.id);
                generationPokemon.push(await fetchPData(`https://pokeapi.co/api/v2/pokemon/${pData.id}`));
            }
        }

        async function fetchPokemonData(generationData, loading) {
            await generationData.forEach((pokemon) => fetchPokemonID(pokemon));
            sortedGenerationPokemon = generationPokemon.sort((a, b) => {
                if (a.id < b.id) {
                    return -1;
                }
            });
            console.log(generationPokemon.length)

            if (loading) {
                isLoading(false);
            }

            return sortedGenerationPokemon
        }

        async function fetchData() {
            const gData = await fetchPData(generationURL);
            const generationData = gData.pokemon_species;

            // Gather pokemon ID's in the given generation           
            setPokemonData(await fetchPokemonData(generationData), false)
            setFilteredPokemonData(await fetchPokemonData(generationData), true)
        }
        fetchData();
    }, [])

    // Opens singular pokemon page
    const openSinglePokemon = (id) => {
        navigate(`/pokemon/${id}`);
    }

    // Search functionality
    function handleSearchInput(input) {
        let filteredPokemon = pokemonData.filter(pokemon => pokemon.name.toLowerCase().includes(input.toLowerCase()));
        setFilteredPokemonData(filteredPokemon);
    }

      // Opens generation page
    function openGeneration(id) {
        console.log(id.key);
        navigate("/generation", { state: id.key})
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


        {loading ? <p>Loading...</p> : (
            <div className='grid grid-cols-8 pb-10 gap-4'>
                {filteredPokemonData.map((p) => (
                    <div className='hover:cursor-pointer'
                    style={{backgroundColor: `${colourTypes[p.types[0].type.name]}`}}
                    key={p.id} onClick={() => openSinglePokemon(p.id)}
                    >
                    <img className='bg-white m-2 rounded-full' src={p.sprites.front_default} alt={p.name} />
                    <p>{p.name}</p>
                    <p># {p.id} {p.types[0].type.name}</p>
                    </div>
                ))}
            </div>
        )}
        </div>
    );
}


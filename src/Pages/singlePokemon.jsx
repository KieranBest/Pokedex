import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { getSinglePokemon} from '../Services/pokeService'

export const SinglePokemon = () => {
    const { id } = useParams();
    const joinURL = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const [pokemon, setPokemon] = useState(null);
    const [loading, isLoading] = useState(true);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(joinURL);
                const data = await response.json();
                isLoading(false);
                setPokemon(data);
                console.log(data);
            } catch (e) {
                setError(e.message);
                console.log(error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className='grid grid-cols-5 pb-10 gap-4'>
            {loading ? <h1>Loading...</h1> : (
                <div className='p-4' key={pokemon.id}>
                    <img className='pokeImage' src={pokemon.sprites.front_default} alt='pokemon' />
                    <p>{pokemon.name}</p>
                    <p># {pokemon.id}</p>
                </div>
            )}
        </div>
    )
}
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
        <div>
            {loading ? <p>Loading...</p> : (
                <div className='p-4'>
                    <img className='' src={pokemon.sprites.front_default} alt='pokemon' />
                    <p>{pokemon.name}</p>
                    <p># {pokemon.id}</p>
                </div>
            )}
        </div>
    )
}
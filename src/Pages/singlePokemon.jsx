import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { getSinglePokemon} from '../Services/pokeService'

export const SinglePokemon = () => {
    const { id } = useParams();
    const joinURL = `https://pokeapi.co/api/v2/pokemon/${id}`;

    const [pokemon, setPokemon] = useState([]);
    const [evolves, setEvolves] = useState(true);
    let evolutionList = [];
    let evolutionListChild = [];


    const [loading, isLoading] = useState(true);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        async function fetchData() {
            try {
                // id Pokemon data
                const response = await fetch(joinURL);
                const data = await response.json();
                setPokemon(data);

                // species data
                const sResponse = await fetch(data.species.url);
                const sData = await sResponse.json();

                // evolution chain data
                const eResponse = await fetch(sData.evolution_chain.url);
                const eData = await eResponse.json();
                evolutionList.push(eData.chain.species.url);
                collectEvolution(eData.chain);
            } catch (e) {
                setError(e.message);
                console.log(error);
            }
        }

        const collectEvolution = async (evolutionChain) => {
            let evolutionData = evolutionChain;

            for (let i = 0; i < evolutionData.evolves_to.length; i++) {
                let evolutionDataChild = evolutionData.evolves_to[0];
                evolutionList.push(evolutionData.species.url);
                for (let i = 0; i < evolutionDataChild.evolves_to.length; i++) {
                    let evolutionDataChildChild = evolutionDataChild.evolves_to[0];
                    evolutionListChild.push(evolutionDataChild.species.url);
                }
            }
            if (evolutionData.evolves_to.length > 0) {
                
            } else {
                setEvolves(false);
            }
            let uniqueEvolutionList = new Set (evolutionList);
            evolutionList = [...uniqueEvolutionList];

            let uniqueEvolutionListChild = new Set (evolutionListChild);
            evolutionListChild = [...uniqueEvolutionListChild];

            evolutionList.push(evolutionListChild);
            console.log(evolutionList)

            isLoading(false);

            if(!evolves) {
            }
        }
        fetchData();

    }, []);

    return (
        <div>
            {loading ? <p>Loading...</p> : (
                <div>
                    <div className='p-4'>
                        <img className='' src={pokemon.sprites.front_default} alt='pokemon' />
                        <p>{pokemon.name}</p>
                        <p># {pokemon.id}</p>
                    </div>


                    {/* <div className='grid grid-cols-10 pb-10 gap-4'>
                        {evolutionPath.map((p) => (
                            <div className='bg-blue-100 hover:cursor-pointer'
                                style={{backgroundColor: `${colourTypes[p.types[0].type.name]}`}}
                                key={p.id} onClick={() => openSinglePokemon(p.id)}
                            >
                            <img className='bg-white m-2 rounded-full' src={p.sprites.front_default} alt={p.name} />
                            <p>{p.name}</p>
                            <p># {p.id} {p.types[0].type.name}</p>
                            </div>
                        ))}
                    </div> */}
                </div>
            )}
        </div>
    )
}
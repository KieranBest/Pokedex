import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { getSinglePokemon} from '../Services/pokeService'

export const SinglePokemon = () => {
    const { id } = useParams();
    const joinURL = `https://pokeapi.co/api/v2/pokemon/${id}`;

    const [pokemon, setPokemon] = useState([]);
    const [evolution, setEvolution] = useState([]);
    const [addedChild, setAddedChild] = useState([]);
    const [addedChildChild, setAddedChildChild] = useState([]);
    const [combined, setCombined] = useState(false);

    let evolutionList = [];
    let evolutionListChild = [];
    let evolutionListChildChild = [];

    const [loading, isLoading] = useState(true);
    const [error, setError] = useState(undefined);

    function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }

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
                collectEvolution(eData.chain);
            } catch (e) {
                setError(e.message);
                console.log(error);
            }
        }

        const collectEvolution = (evolutionChain) => {
            let centrePokemon = evolutionChain.species.url;

            if (evolutionChain.evolves_to.length > 0) {
                for (let i = 0; i < evolutionChain.evolves_to.length; i++) {
                    let evolutionChainChild = evolutionChain.evolves_to[i];
                    evolutionListChild.push(evolutionChainChild.species.url);
                    if (evolutionChainChild.evolves_to.length > 0) {
                        for (let i = 0; i < evolutionChainChild.evolves_to.length; i++) {
                            let evolutionChainChildChild = evolutionChainChild.evolves_to[i];
                            evolutionListChildChild.push(evolutionChainChildChild.species.url);
                        }
                    } else {
                        console.log("No Evolutions 2");
                    }
                }
            } else {
                console.log("No Evolutions");
            }


            const uniqueEvolutionListChild = evolutionListChild.filter(onlyUnique);
            const uniqueEvolutionListChildChild = evolutionListChildChild.filter(onlyUnique);

            if(!combined) {
                setCombined(true); 
                setEvolution(centrePokemon);
                if(uniqueEvolutionListChild.length > 0) {
                    setAddedChild(uniqueEvolutionListChild);
                }
                if(uniqueEvolutionListChildChild.length > 0) {
                    setAddedChildChild(uniqueEvolutionListChildChild);
                }
            }

            isLoading(false);

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
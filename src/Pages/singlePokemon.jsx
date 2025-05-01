import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { colourTypes, getPokemon } from '../Services/pokeService'

export const SinglePokemon = () => {
    const { id } = useParams();
    const idURL = `https://pokeapi.co/api/v2/pokemon/${id}`;

    const [pokemon, setPokemon] = useState([]);
    const [evolution, setEvolution] = useState([]);
    const [addedChild, setEvolutionChild] = useState([]);
    const [addedChildChild, setEvolutionChildChild] = useState([]);
    const [added, setAdded] = useState(false);

    let evolutionListChild = [];
    let evolutionListChildChild = [];

    const [loading, isLoading] = useState(true);
    const [error, setError] = useState(undefined);

    function onlyUnique(repeatedArray) {
        const names = [];
        const uniqueArray = [];
        repeatedArray.forEach((item) => {
            if (!names.includes(item.name)) {
                names.push(item.name);
                uniqueArray.push(item);
            }
        });
        return uniqueArray;
    }

    useEffect(() => {
        async function fetchPData(url) {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        }

        async function fetchData() {
            try {
                // id Pokemon data
                const data = await fetchPData(idURL);
                console.log(data)
                setPokemon(data);

                // species data
                const sResponse = await  async function fetchPData(url) {
                    const response = await fetch(url);
                    const data = await response.json();
                    return data;
                }(data.species.url);
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

        async function collectEvolution(evolutionChain) {
            const centrePokemonData = await fetchPData(evolutionChain.species.url);
            const centrePokemon = await fetchPData(`https://pokeapi.co/api/v2/pokemon/${centrePokemonData.id}/`)
            console.log(centrePokemon)
            setEvolution(centrePokemon);

            if (evolutionChain.evolves_to.length > 0) {
                for (let i = 0; i < evolutionChain.evolves_to.length; i++) {
                    let evoChainData = await fetchPData(evolutionChain.evolves_to[i].species.url)
                    let evoChain = await fetchPData(`https://pokeapi.co/api/v2/pokemon/${evoChainData.id}/`)
                    if(evolutionListChild.includes(evoChain) == false) evolutionListChild.push(evoChain);

                    if (evolutionChain.evolves_to[i].evolves_to.length > 0) {
                        for (let j = 0; j < evolutionChain.evolves_to[i].evolves_to.length; j++) {
                            let evoChainChildData = await fetchPData(evolutionChain.evolves_to[i].evolves_to[j].species.url);
                            let evoChainChild = await fetchPData(`https://pokeapi.co/api/v2/pokemon/${evoChainChildData.id}/`)
                            evolutionListChildChild.push(evoChainChild);
                        }
                    }
                }
            }

            let uniqueEvolutionListChild = onlyUnique(evolutionListChild);
            setEvolutionChild(uniqueEvolutionListChild);

            let uniqueEvolutionListChildChild = onlyUnique(evolutionListChildChild);
            setEvolutionChildChild(uniqueEvolutionListChildChild);
            
            isLoading(false);
        }

        fetchData();

    }, []);

    return (
        <div>
            {loading ? <p>Loading...</p> : (
                <div>
                    <div className='p-4'
                        style={{backgroundColor: `${colourTypes[pokemon.types[0].type.name]}`}}
                    >
                        <img className='bg-white m-2 rounded-full' src={pokemon.sprites.front_default} alt='pokemon' />
                        <p>{pokemon.name}</p>
                        <p># {pokemon.id}</p>
                    </div>

                    <div className='grid grid-cols-3 p-10 gap-4'>
                        <div className='grid grid-cols-1 p-10 gap-4'>
                            <div className='hover:cursor-pointer'
                                style={{backgroundColor: `${colourTypes[evolution.types[0].type.name]}`}}
                                onClick={() => openSinglePokemon(evolution.id)}
                            >
                                <img className='bg-white m-2 rounded-full' src={evolution.sprites.front_default} alt={evolution.name} />
                                <p>{evolution.name}</p>
                                <p># {evolution.id} {evolution.types[0].type.name}</p>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 p-10 gap-4'>
                            {addedChild.map((p) => (
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

                        <div className='grid grid-cols-1 p-10 gap-4'>
                            {addedChildChild.map((p) => (
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
                    </div>
                </div>
            )}
        </div>
    )
}
import React from 'react'

function PokemonList({ pokemon }) {
    const classes = useStyles();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {pokemon.map(p => (
                <div key={p.id}>
                    <img src={pokemon.sprites.front_default} alt='pokemon' />
                    <div>{pokemon.name}</div>
                    <div># <span>{pokemon.order}</span></div>
                </div>
            ))}

            <div className='pokeTypes'>
                {pokemon.types.map((type, i) => {
                    return (
                        <div className='pokeSkill' key={i}>
                            {type.type.name}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PokemonList
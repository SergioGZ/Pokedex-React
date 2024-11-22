import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
}

function App() {
  const [search, setSearch] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPokemon = async (identifier: string | number) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${identifier.toString().toLowerCase()}`
      );
      if (!response.ok) throw new Error('Pokémon no encontrado');
      const data = await response.json();
      setPokemon(data);
    } catch (err) {
      setError('Pokémon no encontrado. Comprueba el nombre.');
    } finally {
      setLoading(false);
    }
  };

  const searchPokemon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    setPokemon(null);
    await fetchPokemon(search);
  };

  const navigatePokemon = async (direction: 'prev' | 'next') => {
    if (!pokemon) return;
    const newId = direction === 'prev' ? pokemon.id - 1 : pokemon.id + 1;
    if (newId < 1) return;
    await fetchPokemon(newId);
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-300',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-400',
    };
    return colors[type] || 'bg-gray-400';
  };

  const getStatColor = (statValue: number) => {
    if (statValue >= 150) return 'bg-purple-500';
    if (statValue >= 100) return 'bg-blue-500';
    if (statValue >= 70) return 'bg-green-500';
    if (statValue >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTypeTranslated = (type: string) => {
    const tipos: { [key: string]: string } = {
      normal: 'normal',
      fire: 'fuego',
      water: 'agua',
      electric: 'eléctrico',
      grass: 'planta',
      ice: 'hielo',
      fighting: 'lucha',
      poison: 'veneno',
      ground: 'tierra',
      flying: 'volador',
      psychic: 'psíquico',
      bug: 'bicho',
      rock: 'roca',
      ghost: 'fantasma',
      dragon: 'dragón',
      dark: 'siniestro',
      steel: 'acero',
      fairy: 'hada'
    };
    return tipos[type] || type;
  };

  const formatStatName = (stat: string) => {
    const translations: { [key: string]: string } = {
      'hp': 'PS',
      'attack': 'Ataque',
      'defense': 'Defensa',
      'special-attack': 'At. Esp.',
      'special-defense': 'Def. Esp.',
      'speed': 'Velocidad'
    };
    return translations[stat] || stat;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-yellow-600 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm w-full max-w-md rounded-2xl shadow-xl p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Pokédex</h1>
          <p className="text-gray-600">Introduce el nombre o número del Pokémon</p>
        </div>

        <form onSubmit={searchPokemon} className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre o número del Pokémon..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-10"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <Search size={20} />
          </button>
        </form>

        {loading && (
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-500 justify-center">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {pokemon && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigatePokemon('prev')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={pokemon.id === 1}
              >
                <ChevronLeft size={24} className={pokemon.id === 1 ? 'text-gray-300' : 'text-gray-600'} />
              </button>
              <div className="text-center">
                <span className="text-sm text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</span>
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                  {pokemon.name}
                </h2>
              </div>
              <button
                onClick={() => navigatePokemon('next')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 rounded-xl" />
              <img
                src={pokemon.sprites.other['official-artwork'].front_default}
                alt={pokemon.name}
                className="w-full h-64 object-contain rounded-xl transform transition-transform group-hover:scale-105"
              />
            </div>
            
            <div className="flex gap-2 justify-center">
              {pokemon.types.map((type) => (
                <span
                  key={type.type.name}
                  className={`${getTypeColor(
                    type.type.name
                  )} text-white px-3 py-1 rounded-full text-sm font-medium capitalize`}
                >
                  {getTypeTranslated(type.type.name)}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-sm text-gray-500">Altura</p>
                <p className="font-semibold">{pokemon.height / 10} m</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-sm text-gray-500">Peso</p>
                <p className="font-semibold">{pokemon.weight / 10} kg</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Estadísticas</h3>
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{formatStatName(stat.stat.name)}</span>
                    <span className="font-medium">{stat.base_stat}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStatColor(stat.base_stat)} transition-all duration-500`}
                      style={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
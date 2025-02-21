import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { backgroundColors } from '../assets/colors';
import Tag from './Tag';
import PokeCard from '../assets/Images/pokecard.png';
import Pattern from '../assets/Images/Pattern.png';

const Card = ({ item }) => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Pokémon data from API
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${item}`);
        const data = await response.json();
        setPokemon(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [item]);

  if (loading) {
    return <ActivityIndicator size="large" color="#fff" />;
  }

  return (
    <View style={{ ...styles.card, backgroundColor: backgroundColors[pokemon.types[0].type.name] || 'gray' }}>
      <View>
        <Text style={styles.pokeNumber}>#{String(pokemon.id).padStart(4, '0')}</Text>
        <Text style={styles.pokeName}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>

        <View style={styles.row}>
          {pokemon.types.map((type, index) => (
            <Tag style={styles.pokeTag} key={index} type={type.type.name} />
          ))}
        </View>
      </View>

      {/* Pokémon Image */}
      <Image 
        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }} 
        style={styles.pokeImage} 
      />

      <Image source={Pattern} style={styles.cardPattern} />
      <Image source={PokeCard} style={styles.pokecard} />
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'visible',
  },
  pokeName: {
    fontSize: 26,
    color: 'white',
    textTransform: 'capitalize',
  },
  pokeNumber: {
    fontSize: 12,
    color: 'white',
  },
  pokeImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
    top: -20,
    zIndex: 1000,
  },
  pokecard: {
    position: 'absolute',
    right: 0,
  },
  cardPattern: {
    position: 'absolute',
    left: 130,
    top: 0,
    width: 100,
  },
  row: {
    flexDirection: 'row',
    marginTop: 5,
<<<<<<< HEAD
    marginRight: 55,
=======
    gap: 5,
>>>>>>> 0cb21b871e91f30509e7a8f01fde2dbe065cd103
  },

  
});

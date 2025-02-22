import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { backgroundColors } from '../assets/colors';
import Tag from './Tag';
import PokeCard from '../assets/Images/pokecard.png';
import Pattern from '../assets/Images/patternDetails.png';
import { useNavigation } from '@react-navigation/native';

const Card = ({ item, onPress }) => {
    const navigation = useNavigation();
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${item}`);
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPokemon(data);
            } catch (error) {
                console.error('Error fetching Pokémon:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemon();
    }, [item]);

    if (loading) {
        return <ActivityIndicator size="large" color="#fff" />;
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity 
          onPress={() => navigation.navigate('Details', { pokemon })}
          activeOpacity={0.7}
          >
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
                      source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png` }} 
                      style={styles.pokeImage} 
                  />

                  <Image source={Pattern} style={styles.cardPattern} />
                  <Image source={PokeCard} style={styles.pokecard} />
              </View>
        </TouchableOpacity>
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
    fontWeight: 'bold',
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
    top: -30,
    zIndex: 1000,
  },
  pokecard: {
    position: 'absolute',
    right: 0,
  },
  cardPattern: {
    position: 'absolute',
    left: 130,
    top: -5,
    width: 70,
  },
  row: {
    flexDirection: 'row',
    marginTop: 5,
    marginRight: 55,
    gap: 5,
  },
  errorContainer: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
  },
});

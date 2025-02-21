import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const DetailsScreen = ({ route }) => {
  const { pokemon } = route.params; // Receive the Pokémon data

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
      
      <Image 
        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }} 
        style={styles.pokeImage} 
      />

      <Text style={styles.pokeNumber}>#{String(pokemon.id).padStart(4, '0')}</Text>

      <View style={styles.typesContainer}>
        {pokemon.types.map((type, index) => (
          <Text key={index} style={styles.typeBadge}>{type.type.name}</Text>
        ))}
      </View>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  pokeNumber: {
    fontSize: 18,
    marginVertical: 10,
    color: 'gray',
  },
  pokeImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  typesContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  typeBadge: {
    backgroundColor: '#ddd',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    textTransform: 'capitalize',
    fontSize: 16,
  },
});

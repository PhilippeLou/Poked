import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { backgroundColors } from '../assets/colors';
import Tag from './Tag';
import PokeCard from '../assets/Images/pokecard.png'
import Pattern from '../assets/Images/Pattern.png';

const Card = ({ item }) => {

  console.warn({ item });

  return (
    <View style={{ ...styles.card, backgroundColor: backgroundColors['grass'] }}>
      <View>
        <Text style={styles.pokeNumber}>#{String(item).padStart(4, '0')}</Text> {/* Formats number as #0001 */}
        <Text style={styles.pokeName}>Bulbasaur</Text>

        <View style={styles.row}>
          <Tag type="grass" />
          <Tag type="poison" />
        </View>
      </View>

      {/* Image Overlapping the Card */}
      <Image 
        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item}.png` }} 
        style={styles.pokeImage} 
      />

      <Image source={Pattern} style={styles.cardPattern}/>
      <Image source={PokeCard} style={styles.pokecard}/>
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
    top: 0,
    width: 100,
    
  },

  row: {
    flexDirection: 'row',
    marginTop: 5,
  },
});

import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { backgroundColors } from '../assets/colors';
import Bulbasaur from '../assets/Images/bulb.png';
import Tag from './Tag';

const Card = () => {
  return (
    <View style={{ ...styles.card, backgroundColor: backgroundColors['grass'] }}>
      <View>
        <Text style={styles.pokeNumber}>#0001</Text>
        <Text style={styles.pokeName}>Bulbasaur</Text>
        
        <View style={styles.row}>
          <Tag type="grass"/>
          <Tag type="poison"/>
        </View>
      </View>

      

      {/* Image Overlapping the Card */}
      <Image source={Bulbasaur} style={styles.pokeImage} />
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
    overflow: 'visible', // ✅ Ensures child elements can overflow
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
    width: 150, // ✅ Make it bigger
    height: 150,
    resizeMode: 'contain',
    position: 'absolute', // ✅ Make it float
    right: 0, // ✅ Move it outside the card
    top: -30, // ✅ Move it slightly up
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
  },
});

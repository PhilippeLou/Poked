import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { textColor, backgroundColors } from '../assets/colors';
import Tag from './Tag';

const AboutSection = ({ pokemon, species }) => {
  if (!pokemon || !species) {
    return <Text>Loading...</Text>;
  }

  // Helper function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    if (!str) return ''; // Handle empty or undefined strings
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Helper function to get the English flavor text
  const getEnglishFlavorText = (entries) => {
    const englishEntry = entries.find((entry) => entry.language.name === 'en');
    return englishEntry ? englishEntry.flavor_text : 'No description available.';
  };

  return (
    <ScrollView style={styles.sectionContainer}>
      {/* Description */}
      <Text style={styles.description}>
        {getEnglishFlavorText(species.flavor_text_entries)}
      </Text>

      {/* Pokédex Data */}
      <View>
        <Text style={[styles.pokedexData, { color: backgroundColors[pokemon.types[0].type.name] }]}>
          Pokédex Data
        </Text>
        <View style={styles.pokeDataContent}>
          <View style={styles.dataQuestion}>
            <Text style={styles.quest}>Name</Text>
            <Text style={styles.quest}>Height</Text>
            <Text style={styles.quest}>Weight</Text>
            <Text style={styles.quest}>Types</Text>
          
          </View>
          <View style={styles.dataAnswer}>
            <Text style={styles.answTwo}>{capitalizeFirstLetter(pokemon.name)}</Text>
            <Text style={styles.answTwo}>{pokemon.height / 10}m</Text>
            <Text style={styles.answTwo}>{pokemon.weight / 10}kg</Text>
            <View style={styles.row}>
              {pokemon.types.map((type, index) => (
                <Tag key={index} type={type.type.name} />
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default AboutSection;

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    padding: 30,
  },
  description: {
    color: textColor.grey,
    fontSize: 22,
    lineHeight: 39,
    marginBottom: 10,
  },
  pokedexData: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pokeDataContent: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dataQuestion: {
    flex: 1,
  },
  dataAnswer: {
    flex: 1,
    marginBottom: 20,
  },
  quest: {
    fontSize: 16,
    color: textColor.black,
    marginVertical: 8,
  },
  answTwo: {
    fontSize: 16,
    color: textColor.grey,
    marginVertical: 8,

  },
  row: {
    flexDirection: 'row',
    gap: 5,
  },
});
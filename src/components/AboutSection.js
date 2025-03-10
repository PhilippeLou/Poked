import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { textColor, backgroundColors } from '../assets/colors';
import Tag from './Tag';

const AboutSection = ({ pokemon, species }) => {
  if (!pokemon || !species) return <Text style={styles.loading}>Loading...</Text>;

  const capitalizeFirstLetter = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');
  const getEnglishFlavorText = (entries) => {
    const englishEntry = entries?.find((entry) => entry.language.name === 'en');
    return englishEntry?.flavor_text.replace(/\n/g, ' ') || 'No description available.'; // Replace newlines with spaces
  };

  return (
    <ScrollView style={styles.sectionContainer} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.description}>{getEnglishFlavorText(species.flavor_text_entries)}</Text>
      <View style={styles.dataWrapper}>
        <Text style={[styles.pokedexData, { color: backgroundColors[pokemon.types[0].type.name] }]}>
          Pokédex Data
        </Text>
        <View style={styles.pokeDataContent}>
          <View style={styles.dataQuestion}>
            {['Name', 'Height', 'Weight', 'Types'].map((label) => (
              <Text key={label} style={styles.quest}>{label}</Text>
            ))}
          </View>
          <View style={styles.dataAnswer}>
            <Text style={styles.answTwo}>{capitalizeFirstLetter(pokemon.name)}</Text>
            <Text style={styles.answTwo}>{(pokemon.height / 10).toFixed(1)}m</Text>
            <Text style={styles.answTwo}>{(pokemon.weight / 10).toFixed(1)}kg</Text>
            <View style={styles.row}>
              {pokemon.types.map((type, index) => (
                <Tag key={type.type.name} type={type.type.name} /> // Use type.name as key for uniqueness
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
  sectionContainer: { flex: 1, paddingHorizontal: 30 },
  contentContainer: { paddingVertical: 20 }, // Better scroll padding
  description: { color: textColor.grey, fontSize: 18, lineHeight: 28, marginBottom: 20 }, // Smaller font, tighter line height
  dataWrapper: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 15 }, // Subtle background
  pokedexData: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  pokeDataContent: { flexDirection: 'row' },
  dataQuestion: { flex: 1 },
  dataAnswer: { flex: 1 },
  quest: { fontSize: 16, color: textColor.black, marginVertical: 10 },
  answTwo: { fontSize: 16, color: textColor.grey, marginVertical: 10 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' }, // Wrap types if too many
  loading: { fontSize: 18, color: textColor.grey, textAlign: 'center', marginTop: 20 },
});
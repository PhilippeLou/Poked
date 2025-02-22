import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { textColor, backgroundColors } from '../assets/colors';

const StatsSection = ({ pokemon }) => {
  if (!pokemon) {
    return <Text>Loading...</Text>;
  }

  // Helper function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    if (!str) return ''; // Handle empty or undefined strings
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Map stat names to display names
  const statDisplayNames = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Attack',
    'special-defense': 'Sp. Defense',
    speed: 'Speed',
  };

  return (
    <ScrollView style={styles.sectionContainer}>
      <Text style={[styles.heading, { color: backgroundColors[pokemon.types[0].type.name] }]}>
        Base Stats
      </Text>

      {/* Stats List */}
      {pokemon.stats.map((stat, index) => (
        <View key={index} style={styles.statRow}>
          <Text style={styles.statName}>
            {statDisplayNames[stat.stat.name] || capitalizeFirstLetter(stat.stat.name)}
          </Text>
          <Text style={styles.statValue}>{stat.base_stat}</Text>
          <View style={styles.statBarContainer}>
            <View
              style={[
                styles.statBar,
                {
                  width: `${(stat.base_stat / 255) * 100}%`, // Normalize stat value to a percentage
                  backgroundColor: backgroundColors[pokemon.types[0].type.name],
                },
              ]}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default StatsSection;

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statName: {
    width: 100,
    fontSize: 16,
    color: textColor.black,
  },
  statValue: {
    width: 40,
    fontSize: 16,
    color: textColor.black,
    textAlign: 'right',
    marginRight: 10,
  },
  statBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: 'transparent',
    borderRadius: 5,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    borderRadius: 5,
  },
});
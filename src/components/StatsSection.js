import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { textColor, backgroundColors } from '../assets/colors';

const StatsSection = ({ pokemon }) => {
  if (!pokemon) return <Text style={styles.loading}>Loading...</Text>;

  const statDisplayNames = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed',
  };

  const getStatColor = (value) => {
    if (value > 100) return '#4CAF50'; // Green for high stats
    if (value > 50) return '#FFC107'; // Yellow for average
    return '#F44336'; // Red for low
  };

  return (
    <ScrollView style={styles.sectionContainer} contentContainerStyle={styles.contentContainer}>
      <Text style={[styles.heading, { color: backgroundColors[pokemon.types[0].type.name] }]}>
        Base Stats
      </Text>
      {pokemon.stats.map((stat) => {
        const statValue = stat.base_stat;
        const statPercentage = Math.min((statValue / 255) * 100, 100);
        return (
          <View key={stat.stat.name} style={styles.statRow}>
            <Text style={styles.statName}>
              {statDisplayNames[stat.stat.name] || stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}
            </Text>
            <Text style={styles.statValue}>{statValue}</Text>
            <View style={styles.statBarContainer}>
              <View
                style={[
                  styles.statBar,
                  { width: `${statPercentage}%`, backgroundColor: getStatColor(statValue) },
                ]}
              />
            </View>
          </View>
        );
      })}
      <Text style={styles.total}>
        Total: {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
      </Text>
    </ScrollView>
  );
};

export default StatsSection;

const styles = StyleSheet.create({
  sectionContainer: { flex: 1, paddingHorizontal: 20 },
  contentContainer: { paddingVertical: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statName: { width: 80, fontSize: 16, color: textColor.black },
  statValue: { width: 40, fontSize: 16, color: textColor.black, textAlign: 'right', marginRight: 10 },
  statBarContainer: { flex: 1, height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, overflow: 'hidden' },
  statBar: { height: '100%', borderRadius: 5 },
  total: { fontSize: 16, fontWeight: 'bold', color: textColor.grey, marginTop: 10, textAlign: 'right' },
  loading: { fontSize: 18, color: textColor.grey, textAlign: 'center', marginTop: 20 },
});
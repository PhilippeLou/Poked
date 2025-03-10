import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { textColor, backgroundColors } from '../assets/colors';
import EvolutionBackground from '../assets/Images/evoBG.png';

const EvolutionSection = ({ pokemon, species }) => {
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvolutionChain = async () => {
      if (!species?.evolution_chain?.url) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(species.evolution_chain.url);
        if (!response.ok) throw new Error('Failed to fetch evolution chain.');
        const data = await response.json();
        setEvolutionChain(data.chain);
      } catch (error) {
        console.error('Error fetching evolution chain:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvolutionChain();
  }, [species?.evolution_chain?.url]);

  const capitalizeFirstLetter = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');

  const getEvolutionTrigger = (details) => {
    if (!details?.length) return 'Unknown';
    const trigger = details[0].trigger.name;
    if (trigger === 'level-up') return `Lv. ${details[0].min_level || '?'}`;
    return capitalizeFirstLetter(trigger);
  };

  const buildEvolutionChain = (chain) => {
    if (!chain) return <Text style={styles.noData}>No evolution data available.</Text>;

    const evolutionSteps = [];
    let currentChain = chain;
    while (currentChain) {
      evolutionSteps.push({
        name: currentChain.species.name,
        id: parseInt(currentChain.species.url.split('/')[6], 10),
        evolutionDetails: currentChain.evolves_to[0]?.evolution_details || [],
      });
      currentChain = currentChain.evolves_to[0];
    }

    return (
      <View style={styles.evolutionContainer}>
        {evolutionSteps.map((step, index) => {
          if (index < evolutionSteps.length - 1) {
            const nextStep = evolutionSteps[index + 1];
            const trigger = getEvolutionTrigger(step.evolutionDetails);
            return (
              <View key={step.id} style={styles.evolutionStep}>
                <View style={styles.imageRow}>
                  <View style={styles.pokemonContainer}>
                    <Image source={EvolutionBackground} style={styles.backgroundImage} />
                    <Image
                      source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${step.id}.png` }}
                      style={styles.pokemonImage}
                    />
                  </View>
                  <Text style={styles.triggerText}>{trigger}</Text>
                  <View style={styles.pokemonContainer}>
                    <Image source={EvolutionBackground} style={styles.backgroundImage} />
                    <Image
                      source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${nextStep.id}.png` }}
                      style={styles.pokemonImage}
                    />
                  </View>
                </View>
                <View style={styles.nameRow}>
                  <Text style={styles.pokemonName}>{capitalizeFirstLetter(step.name)}</Text>
                  <Text style={styles.pokemonName}>{capitalizeFirstLetter(nextStep.name)}</Text>
                </View>
              </View>
            );
          }
          return null;
        })}
      </View>
    );
  };

  if (loading) return <Text style={styles.loading}>Loading evolution data...</Text>;
  return (
    <ScrollView style={styles.sectionContainer} contentContainerStyle={styles.contentContainer}>
      <Text style={[styles.heading, { color: backgroundColors[pokemon.types[0].type.name] }]}>
        Evolution Chain
      </Text>
      {buildEvolutionChain(evolutionChain)}
    </ScrollView>
  );
};

export default EvolutionSection;

const styles = StyleSheet.create({
  sectionContainer: { flex: 1, paddingHorizontal: 20 },
  contentContainer: { paddingVertical: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  evolutionContainer: { flexDirection: 'column' },
  evolutionStep: { marginBottom: 30 },
  imageRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  pokemonContainer: { alignItems: 'center', position: 'relative' },
  backgroundImage: { width: 100, height: 100, position: 'absolute' },
  pokemonImage: { width: 80, height: 80, resizeMode: 'contain', zIndex: 1 },
  pokemonName: { fontSize: 16, color: textColor.black, marginTop: 5, textAlign: 'center' },
  triggerText: { fontSize: 14, color: textColor.grey, fontStyle: 'italic' },
  loading: { fontSize: 18, color: textColor.grey, textAlign: 'center', marginTop: 20 },
  noData: { fontSize: 16, color: textColor.grey, textAlign: 'center' },
});
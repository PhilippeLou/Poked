import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { textColor, backgroundColors } from '../assets/colors';
import EvolutionBackground from '../assets/Images/evoBG.png'; // Import the background image

const EvolutionSection = ({ pokemon, species }) => {
  const [evolutionChain, setEvolutionChain] = useState(null);

  useEffect(() => {
    const fetchEvolutionChain = async () => {
      try {
        // Get the evolution chain URL from the species data
        const response = await fetch(species.evolution_chain.url);
        const data = await response.json();
        setEvolutionChain(data.chain);
      } catch (error) {
        console.error('Error fetching evolution chain:', error);
      }
    };

    if (species) {
      fetchEvolutionChain();
    }
  }, [species]);

  // Helper function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Function to extract the evolution level
  const getEvolutionLevel = (evolutionDetails) => {
    if (!evolutionDetails || evolutionDetails.length === 0) return '?';

    // Check for level-up evolution
    const levelUp = evolutionDetails.find(
      (detail) => detail.trigger.name === 'level-up'
    );

    if (levelUp) {
      return levelUp.min_level || '?';
    }

    // Check for other evolution methods (e.g., stones, trading)
    const otherMethod = evolutionDetails.find(
      (detail) => detail.trigger.name !== 'level-up'
    );

    if (otherMethod) {
      return `(${capitalizeFirstLetter(otherMethod.trigger.name)})`;
    }

    return '?';
  };

  // Function to build the evolution chain in the desired format
  const buildEvolutionChain = (chain) => {
    if (!chain) return null;

    const evolutionSteps = [];
    let currentChain = chain;

    // Traverse the evolution chain and collect steps
    while (currentChain) {
      evolutionSteps.push({
        name: currentChain.species.name,
        id: currentChain.species.url.split('/')[6], // Extract Pokémon ID from URL
        evolutionDetails: currentChain.evolves_to[0]?.evolution_details || [], // Get evolution details
      });

      // Move to the next evolution
      currentChain = currentChain.evolves_to[0];
    }

    return (
      <View style={styles.evolutionContainer}>
        {evolutionSteps.map((step, index) => {
          if (index < evolutionSteps.length - 1) {
            const nextStep = evolutionSteps[index + 1];
            const evolutionLevel = getEvolutionLevel(step.evolutionDetails);

            return (
              <View key={step.id} style={styles.evolutionStep}>
                {/* First Row: Pokémon Images and Level */}
                <View style={styles.imageRow}>
                  {/* First Pokémon */}
                  <View style={styles.pokemonContainer}>
                    <Image source={EvolutionBackground} style={styles.backgroundImage} />
                    <Image
                      source={{
                        uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${step.id}.png`,
                      }}
                      style={styles.pokemonImage}
                    />
                  </View>

                  {/* Evolution Level */}
                  <Text style={styles.levelText}>(Level {evolutionLevel})</Text>

                  {/* Next Pokémon */}
                  <View style={styles.pokemonContainer}>
                    <Image source={EvolutionBackground} style={styles.backgroundImage} />
                    <Image
                      source={{
                        uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${nextStep.id}.png`,
                      }}
                      style={styles.pokemonImage}
                    />
                  </View>
                </View>

                {/* Second Row: Pokémon Names */}
                <View style={styles.nameRow}>
                  <Text style={styles.pokemonName}>
                    {capitalizeFirstLetter(step.name)}
                  </Text>
                  <Text style={styles.pokemonName}>
                    {capitalizeFirstLetter(nextStep.name)}
                  </Text>
                </View>
              </View>
            );
          }
          return null;
        })}
      </View>
    );
  };

  if (!evolutionChain) {
    return <Text>Loading evolution data...</Text>;
  }

  return (
    <ScrollView style={styles.sectionContainer}>
      <Text style={[styles.heading, { color: backgroundColors[pokemon.types[0].type.name] }]}>
        Evolution Chain
      </Text>

      {/* Render the evolution chain */}
      {buildEvolutionChain(evolutionChain)}
    </ScrollView>
  );
};

export default EvolutionSection;

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
  evolutionContainer: {
    flexDirection: 'column',
  },
  evolutionStep: {
    marginBottom: 20,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20, // Adjust spacing to align with images
  },
  pokemonContainer: {
    alignItems: 'center',
    position: 'relative', // Needed for absolute positioning of the background
  },
  backgroundImage: {
    width: 100, // Adjust based on your image size
    height: 100, // Adjust based on your image size
    position: 'absolute', // Position the background behind the Pokémon image
  },
  pokemonImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    zIndex: 1, // Ensure the Pokémon image is above the background
  },
  pokemonName: {
    fontSize: 18,
    color: textColor.black,
    marginTop: 5,
  },
  levelText: {
    fontSize: 16,
    color: textColor.grey,
  },
});
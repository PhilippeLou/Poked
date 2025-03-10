import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { backgroundColors, textColor } from '../assets/colors';
import Tag from '../components/Tag';
import PatternDetails from '../assets/Images/patternDetails.png';
import CircleDetails from '../assets/Images/circleDetails.png';
import AboutSection from '../components/AboutSection';
import StatsSection from '../components/StatsSection';
import EvolutionSection from '../components/EvolutionSection';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const DetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pokemon } = route.params || {};

  const [pokemonData, setPokemonData] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpecies = async () => {
      if (!pokemon) {
        setError('No Pokémon data provided.');
        setLoading(false);
        return;
      }

      try {
        setPokemonData(pokemon); // Use passed pokemon data
        if (!pokemon.species?.url) {
          setLoading(false);
          return;
        }

        const response = await fetch(pokemon.species.url);
        if (!response.ok) throw new Error('Failed to fetch species data.');
        const data = await response.json();
        setSpecies(data);
      } catch (err) {
        console.error('Error fetching species data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, [pokemon]);

  // Memoize capitalized name for performance
  const getPokemonName = useCallback(() => {
    return pokemonData?.name ? pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1) : '';
  }, [pokemonData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={backgroundColors[pokemon?.types?.[0]?.type?.name] || 'gray'} />
      </View>
    );
  }

  if (error || !pokemonData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'No Pokémon data available.'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={28} color={textColor.black} />
      </TouchableOpacity>

      <Text style={styles.titleMain}>{getPokemonName()}</Text>
      <Text style={styles.pokeNumber}>#{String(pokemonData.id).padStart(4, '0')}</Text>

      <View style={[styles.imageContainer, { backgroundColor: backgroundColors[pokemonData.types?.[0]?.type?.name] || 'gray' }]}>
        <Image source={PatternDetails} style={styles.patternDetails} />
        <Image source={PatternDetails} style={styles.patternDetailsTwo} />
        <Image source={CircleDetails} style={styles.circleDetails} />

        <Image
          source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonData.id}.png` }}
          style={styles.pokeImage}
          onError={() => console.warn(`Failed to load image for ${pokemonData.name}`)}
          defaultSource={require('../assets/Images/placeholder.png')} // Placeholder if image fails
        />

        <View style={styles.typeRow}>
          {pokemonData.types?.map((type) => (
            <Tag key={type.type.name} type={type.type.name} />
          ))}
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: styles.tabLabel,
            tabBarStyle: styles.tabBar,
            tabBarIndicatorStyle: {
              backgroundColor: backgroundColors[pokemonData.types?.[0]?.type?.name] || 'black',
              height: 3,
            },
            swipeEnabled: true, // Enable swipe for better UX
          }}
        >
          <Tab.Screen name="About">
            {() => <AboutSection pokemon={pokemonData} species={species} />}
          </Tab.Screen>
          <Tab.Screen name="Stats">
            {() => <StatsSection pokemon={pokemonData} />}
          </Tab.Screen>
          <Tab.Screen name="Evolution">
            {() => <EvolutionSection pokemon={pokemonData} species={species} navigation={navigation} />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: textColor.white,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 15,
    padding: 10,
    zIndex: 1, // Ensure it’s above other elements
  },
  titleMain: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: textColor.black,
    marginTop: 10,
  },
  pokeNumber: {
    fontSize: 18,
    color: textColor.grey,
    textAlign: 'center',
    marginBottom: 10,
  },
  imageContainer: {
    marginTop: 20,
    paddingVertical: 60,
    paddingHorizontal: 50,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5, // Add shadow for depth
  },
  pokeImage: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginVertical: 15,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap', // Handle multiple types
  },
  patternDetails: {
    width: 80,
    position: 'absolute',
    right: 5,
    top: 100,
  },
  patternDetailsTwo: {
    width: 80,
    position: 'absolute',
    left: 5,
    top: 260,
  },
  circleDetails: {
    position: 'absolute',
    top: 80,
    left: 50,
    height: 200,
    width: 200,
  },
  tabsContainer: {
    flex: 1,
    width: '100%',
  },
  tabBar: {
    backgroundColor: textColor.white,
    elevation: 2, // Subtle shadow
  },
  tabLabel: {
    color: textColor.black,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  goBackButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 12,
    backgroundColor: '#007BFF',
  },
  goBackText: {
    fontSize: 16,
    color: textColor.white,
    fontWeight: 'bold',
  },
});
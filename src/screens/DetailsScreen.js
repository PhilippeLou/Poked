import React, { useState, useEffect } from 'react';
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
  const { pokemon } = route.params || {}; // Ensure route.params is always defined

  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpecies = async () => {
      if (!pokemon?.species?.url) {
        setError('Pokémon data is incomplete.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(pokemon.species.url);
        if (!response.ok) {
          throw new Error('Failed to fetch species data.');
        }

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
  }, [pokemon?.species?.url]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={backgroundColors[pokemon?.types?.[0]?.type?.name] || 'gray'} />
      </View>
    );
  }

  if (error || !pokemon) {
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
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.titleMain}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
      <Text style={styles.pokeNumber}>{String(pokemon.id).padStart(4, '0')}</Text>

      {/* Image Container */}
      <View style={{ ...styles.imageContainer, backgroundColor: backgroundColors[pokemon.types?.[0]?.type?.name] || 'gray' }}>
        <Image source={PatternDetails} style={styles.patternDetails} />
        <Image source={PatternDetails} style={styles.patternDetailsTwo} />
        <Image source={CircleDetails} style={styles.circleDetails} />

        <Image
          source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png` }}
          style={styles.pokeImage}
          onError={() => console.warn('Failed to load Pokémon image')}
        />

        <View style={styles.row}>
          {pokemon.types?.map((type, index) => (
            <Tag key={index} type={type.type.name} />
          ))}
        </View>
      </View>

      {/* Tabs Section */}
      <View style={styles.tabsContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { color: textColor.black, fontSize: 14, fontWeight: 'bold' },
            tabBarStyle: { backgroundColor: 'white' },
            tabBarIndicatorStyle: { backgroundColor: backgroundColors[pokemon.types?.[0]?.type?.name] || 'black' },
          }}
        >
          <Tab.Screen name="About">
            {() => <AboutSection pokemon={pokemon} species={species} />}
          </Tab.Screen>
          <Tab.Screen name="Stats">
            {() => <StatsSection pokemon={pokemon} />}
          </Tab.Screen>
          <Tab.Screen name="Evolution">
            {() => <EvolutionSection pokemon={pokemon} species={species} />}
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
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    padding: 10,
  },
  titleMain: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  pokeNumber: {
    fontSize: 20,
    color: textColor.grey,
  },
  pokeImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  imageContainer: {
    marginTop: 40,
    paddingVertical: 80,
    paddingHorizontal: 65,
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  patternDetails: {
    width: 80,
    position: 'absolute',
    right: 5,
    top: 120,
  },
  patternDetailsTwo: {
    width: 80,
    position: 'absolute',
    left: 5,
    top: 290,
  },
  circleDetails: {
    position: 'absolute',
    top: 100,
    left: 60,
    height: 200,
    width: 200,
  },
  tabsContainer: {
    flex: 1,
    width: '100%',
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
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  goBackButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#007BFF',
  },
  goBackText: {
    fontSize: 16,
    color: 'white',
  },
});

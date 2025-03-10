import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AboutSection from '../components/AboutSection';
import StatsSection from '../components/StatsSection';
import EvolutionSection from '../components/EvolutionSection';
import Tag from '../components/Tag';
import { backgroundColors, textColor } from '../assets/colors';

const Tab = createMaterialTopTabNavigator();

const DetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pokemon } = route.params || {};

  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpecies = async () => {
      if (!pokemon?.species?.url) {
        setError('No species data available.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(pokemon.species.url);
        if (!response.ok) throw new Error('Failed to fetch species data.');
        const data = await response.json();
        setSpecies(data);
      } catch (err) {
        console.error('Error fetching species:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, [pokemon?.species?.url]);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.centeredContainer}>
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
        <Ionicons name="arrow-back" size={28} color={textColor.black} />
      </TouchableOpacity>

      <Text style={styles.title}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
      <Text style={styles.pokeNumber}>#{String(pokemon.id).padStart(4, '0')}</Text>

      <View style={[styles.imageContainer, { backgroundColor: backgroundColors[pokemon.types?.[0]?.type?.name] || 'gray' }]}>
        <Image
          source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png` }}
          style={styles.pokeImage}
          onError={() => console.warn('Image failed to load')}
        />
        <View style={styles.tagRow}>
          {pokemon.types?.map((type, index) => (
            <Tag key={index} type={type.type.name} />
          ))}
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: styles.tabLabel,
            tabBarStyle: styles.tabBar,
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
    backgroundColor: 'white',
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 15,
    padding: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  pokeNumber: {
    fontSize: 18,
    color: textColor.grey,
    textAlign: 'center',
  },
  imageContainer: {
    marginTop: 20,
    paddingVertical: 50,
    paddingHorizontal: 50,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
  },
  pokeImage: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 10,
  },
  tabsContainer: {
    flex: 1,
    width: '100%',
  },
  tabBar: {
    backgroundColor: 'white',
    elevation: 3,
  },
  tabLabel: {
    color: textColor.black,
    fontSize: 14,
    fontWeight: 'bold',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  goBackButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#007BFF',
  },
  goBackText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

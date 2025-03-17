import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AboutSection from '../components/AboutSection';
import StatsSection from '../components/StatsSection';
import EvolutionSection from '../components/EvolutionSection';
import Tag from '../components/Tag';
import { backgroundColors, textColor } from '../assets/colors';

const Tab = createMaterialTopTabNavigator();

// Helper function for network requests that works in both dev and production
const performFetch = (url) => {
  return new Promise((resolve, reject) => {
    console.log(`Attempting to fetch data from: ${url}`);
    
    if (Platform.OS === 'android' && !__DEV__) {
      // Use XMLHttpRequest for Android production builds
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          console.log(`XHR completed with status: ${xhr.status}`);
          if (xhr.status === 200) {
            resolve({
              ok: true,
              json: () => Promise.resolve(JSON.parse(xhr.responseText))
            });
          } else {
            reject(new Error(`XMLHttpRequest failed with status ${xhr.status}`));
          }
        }
      };
      xhr.open('GET', url);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.timeout = 15000; // 15 seconds
      xhr.ontimeout = () => reject(new Error('Request timed out'));
      xhr.onerror = (e) => {
        console.error('XHR error event:', e);
        reject(new Error('Network request failed'));
      };
      try {
        xhr.send();
      } catch (error) {
        console.error('XHR send error:', error);
        reject(error);
      }
    } else {
      // Use fetch for iOS and development
      console.log('Using standard fetch API');
      fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      })
        .then(response => {
          console.log(`Fetch completed with status: ${response.status}`);
          resolve(response);
        })
        .catch(error => {
          console.error('Fetch error:', error);
          reject(error);
        });
    }
  });
};

const DetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pokemon } = route.params || {};
  
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (!pokemon) {
        console.error('No pokemon data received');
        setError('No Pokemon data provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Pokemon received in Details:', JSON.stringify(pokemon).substring(0, 100) + '...');
        
        // Check if we already have the full Pokemon details
        if (pokemon && (pokemon.abilities || pokemon.sprites || pokemon.stats)) {
          console.log('Full Pokemon details already available, using existing data');
          setPokemonDetails(pokemon);
          
          // If we have the full details, check for species data
          if (pokemon.species?.url) {
            try {
              console.log('Fetching species from:', pokemon.species.url);
              const speciesResponse = await performFetch(pokemon.species.url);
              
              if (!speciesResponse.ok) {
                console.warn(`Species fetch failed with status: ${speciesResponse.status}`);
                throw new Error(`Failed to fetch species data. Status: ${speciesResponse.status}`);
              }
              
              const speciesData = await speciesResponse.json();
              setSpecies(speciesData);
            } catch (speciesError) {
              console.warn('Species fetch error:', speciesError);
              // Don't fail if species fetch fails
            }
          }
        } 
        // If we only have the basic Pokemon data, fetch the full details
        else if (pokemon && pokemon.url) {
          console.log('Fetching full Pokemon details from URL:', pokemon.url);
          
          // Fetch Pokemon details
          const detailsResponse = await performFetch(pokemon.url);
          if (!detailsResponse.ok) {
            throw new Error(`Failed to fetch Pokemon details. Status: ${detailsResponse.status}`);
          }
          
          const details = await detailsResponse.json();
          console.log('Successfully fetched details for:', details.name);
          setPokemonDetails(details);
          
          // Fetch species data if available
          if (details.species?.url) {
            try {
              console.log('Fetching species from:', details.species.url);
              const speciesResponse = await performFetch(details.species.url);
              
              if (!speciesResponse.ok) {
                console.warn(`Species fetch failed with status: ${speciesResponse.status}`);
                throw new Error(`Failed to fetch species data. Status: ${speciesResponse.status}`);
              }
              
              const speciesData = await speciesResponse.json();
              setSpecies(speciesData);
            } catch (speciesError) {
              console.warn('Species fetch error:', speciesError);
              // Don't fail if species fetch fails
            }
          }
        } else {
          throw new Error('Invalid Pokemon data format');
        }
      } catch (err) {
        console.error('Error in fetchPokemonDetails:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [pokemon]);

  const handleGoBack = () => {
    try {
      navigation.goBack();
    } catch (error) {
      console.error('Navigation error:', error);
      // Force navigation to home as fallback
      navigation.navigate('Home');
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text style={styles.loadingText}>Loading Pokémon details...</Text>
      </View>
    );
  }

  if (error || !pokemonDetails) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error || 'No Pokémon data available.'}</Text>
        <TouchableOpacity onPress={handleGoBack} style={styles.goBackButton}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Safely get background color, with fallback
  const getBackgroundColor = () => {
    if (pokemonDetails?.types && pokemonDetails.types.length > 0 && pokemonDetails.types[0]?.type?.name) {
      return backgroundColors[pokemonDetails.types[0].type.name] || 'gray';
    }
    return 'gray';
  };

  // Safely get pokemon name with proper capitalization
  const getPokemonName = () => {
    if (!pokemonDetails?.name) return 'Pokemon';
    return pokemonDetails.name.charAt(0).toUpperCase() + pokemonDetails.name.slice(1);
  };

  // Safely get pokemon number
  const getPokemonNumber = () => {
    if (!pokemonDetails?.id) return '#0000';
    return `#${String(pokemonDetails.id).padStart(4, '0')}`;
  };

  // Safely get pokemon image
  const getPokemonImage = () => {
    // Try to get the best image available
    if (pokemonDetails?.sprites?.other?.home?.front_default) {
      return pokemonDetails.sprites.other.home.front_default;
    } else if (pokemonDetails?.sprites?.other?.['official-artwork']?.front_default) {
      return pokemonDetails.sprites.other['official-artwork'].front_default;
    } else if (pokemonDetails?.sprites?.front_default) {
      return pokemonDetails.sprites.front_default;
    } else if (pokemonDetails?.id) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonDetails.id}.png`;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={28} color={textColor.black} />
      </TouchableOpacity>

      <Text style={styles.title}>{getPokemonName()}</Text>
      <Text style={styles.pokeNumber}>{getPokemonNumber()}</Text>

      <View style={[styles.imageContainer, { backgroundColor: getBackgroundColor() }]}>
        <Image
          source={getPokemonImage() ? { uri: getPokemonImage() } : require('../assets/Images/Pokeball.png')}
          style={styles.pokeImage}
          onError={(e) => {
            console.warn('Image failed to load:', e.nativeEvent.error);
          }}
        />
        <View style={styles.tagRow}>
          {pokemonDetails.types?.map((type, index) => (
            type?.type?.name ? <Tag key={index} type={type.type.name} /> : null
          ))}
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: styles.tabLabel,
            tabBarStyle: styles.tabBar,
            tabBarIndicatorStyle: { backgroundColor: getBackgroundColor() },
          }}
        >
          <Tab.Screen name="About">
            {() => <AboutSection pokemon={pokemonDetails} species={species} />}
          </Tab.Screen>
          <Tab.Screen name="Stats">
            {() => <StatsSection pokemon={pokemonDetails} />}
          </Tab.Screen>
          <Tab.Screen name="Evolution">
            {() => <EvolutionSection pokemon={pokemonDetails} species={species} />}
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
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: textColor.grey,
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
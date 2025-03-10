import React, { useState, useEffect, useCallback } from 'react';
import { ImageBackground, StyleSheet, Text, View, TextInput, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { height, width } from '../assets/constants';
import Pokeball_header from '../assets/Images/Pokeball-no-bg.png';
import { customColor, textColor } from '../assets/colors';
import Card from '../components/Card';
import PokedexImage from '../assets/Images/poketitle.png';

const searchIcon = require('../assets/Icons/Search.png');

const HomeScreen = ({ navigation }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        if (!response.ok) throw new Error('Failed to fetch Pokémon list.');
        const data = await response.json();
        console.log('API response (first 3):', data.results.slice(0, 3));
        setPokemonList(data.results);
      } catch (error) {
        console.error('Error fetching Pokémon list:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPokemon();
  }, []);

  // Memoize filteredPokemon to prevent unnecessary re-renders
  const filteredPokemon = useCallback(() => {
    return pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pokemonList, searchQuery])();

  // Memoize renderItem to optimize FlatList performance
  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        onPress={() => {
          console.log('Navigating with pokemon:', item);
          navigation.navigate('Details', { pokemon: item });
        }}
        activeOpacity={0.7} // Slight feedback on press
      >
        <Card item={item.name} />
      </TouchableOpacity>
    ),
    [navigation]
  );

  return (
    <View style={styles.container}>
      <ImageBackground resizeMode="contain" style={styles.bgImage} source={Pokeball_header} />

      <View style={styles.paddedContainer}>
        <View style={styles.header}>
          <Image source={PokedexImage} style={styles.pokeTitle} />
          <Text style={styles.subText}>
            Find your favorite Pokémon by name and explore their details!
          </Text>

          <View style={styles.searchContainer}>
            <Image source={searchIcon} style={styles.searchIcon} />
            <TextInput
              style={styles.searchbar}
              placeholder="Search for a Pokémon..."
              placeholderTextColor={textColor.grey}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none" // Prevent auto-capitalization
              returnKeyType="search" // Better keyboard UX
            />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={customColor.primary} style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={filteredPokemon}
            keyExtractor={(item) => item.name}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            initialNumToRender={10} // Optimize initial render
            maxToRenderPerBatch={20} // Batch rendering for performance
            windowSize={5} // Reduce off-screen rendering
          />
        )}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: textColor.white,
  },
  bgImage: {
    width: '100%',
    height: height / 4,
    marginTop: 30,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  paddedContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: height / 8 - 40,
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
  },
  pokeTitle: {
    width: 300,
    height: 80,
    marginVertical: 20,
    marginTop: -20,
  },
  subText: {
    fontSize: 16,
    color: textColor.grey,
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic', // Slight style tweak
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: customColor.input,
    borderRadius: 12,
    marginBottom: 20,
    height: 50, // Slightly smaller for compactness
    paddingHorizontal: 15,
    width: '100%',
    elevation: 2, // Subtle shadow for depth
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  searchbar: {
    flex: 1,
    fontSize: 16,
    color: textColor.black,
  },
  listContainer: {
    paddingBottom: 20,
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});
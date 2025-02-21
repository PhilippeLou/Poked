import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, TextInput, Image, FlatList, ActivityIndicator } from 'react-native';
import { height, width } from '../assets/constants';
import Pokeball_header from '../assets/Images/Pokeball-no-bg.png';
import { customColor, textColor } from '../assets/colors';
import Card from '../components/Card';

const searchIcon = require('../assets/Icons/Search.png'); // Import the search icon

const HomeScreen = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all Pokémon from the API
  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000'); // Fetch all Pokémon
        const data = await response.json();
        setPokemonList(data.results); // Store the list of Pokémon
      } catch (error) {
        console.error('Error fetching Pokémon list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPokemon();
  }, []);

  // Filter Pokémon based on search query
  const filteredPokemon = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header Section - Full-Width Background Image */}
      <ImageBackground resizeMode="contain" style={styles.bgImage} source={Pokeball_header} />

      {/* Padded Contents */}
      <View style={styles.paddedContainer}>
        <View style={styles.contents}>
          <Text style={styles.heading}>Pokédex</Text>
          <Text style={styles.subText}>
            Search for Pokémon by name or using the National Pokédex number.
          </Text>

          {/* Search Bar with Icon */}
          <View style={styles.searchContainer}>
            <Image source={searchIcon} style={styles.searchIcon} />
            <TextInput
              style={styles.searchbar}
              placeholder="What Pokémon are you looking for?"
              placeholderTextColor={textColor.grey}
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)} // Update search query
            />
          </View>
        </View>

        {/* Display loading indicator or Pokémon list */}
        {loading ? (
          <ActivityIndicator size="large" color="#000" style={styles.loader} />
        ) : (
          <FlatList
            data={filteredPokemon}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => <Card item={item.name} />} // Pass Pokémon name to Card
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
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
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  paddedContainer: {
    flex: 1,
    paddingHorizontal: 20, // Add space on the sides for all content except bgImage
    marginTop: height / 5.5 - 40, // Adjust margin to account for bgImage height
  },
  contents: {
    marginTop: 20, // Adjust spacing between bgImage and contents
  },
  heading: {
    fontSize: 35,
    fontWeight: '900',
    color: textColor.black,
    fontFamily: 'SF-Pro-Display-Bold',
  },
  subText: {
    fontSize: 16,
    color: textColor.grey,
    textAlign: 'center',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: customColor.input,
    borderRadius: 10,
    marginTop: 20,
    height: 60,
    paddingHorizontal: 15,
    width: '100%', // Ensure the search bar takes full width of its container
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
    paddingBottom: 20, // Ensures proper spacing at the bottom
  },
  loader: {
    marginTop: 20,
  },
});
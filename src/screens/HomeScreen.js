import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, TextInput, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { height, width } from '../assets/constants';
import Pokeball_header from '../assets/Images/Pokeball-no-bg.png';
import { customColor, textColor } from '../assets/colors';
import Card from '../components/Card';
import PokedexImage from '../assets/Images/poketitle.png';

const searchIcon = require('../assets/Icons/Search.png');

const HomeScreen = ({ navigation }) => { // Accept navigation prop
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const data = await response.json();
        setPokemonList(data.results);
      } catch (error) {
        console.error('Error fetching Pokémon list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPokemon();
  }, []);

  const filteredPokemon = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ImageBackground resizeMode="contain" style={styles.bgImage} source={Pokeball_header} />

      <View style={styles.paddedContainer}>
        <View style={styles.contents}>
          <Image source={PokedexImage} style={styles.pokeTItle} />
          <Text style={styles.subText}>
            Find your favorite Pokémon by name and look for their details.
          </Text>

          <View style={styles.searchContainer}>
            <Image source={searchIcon} style={styles.searchIcon} />
            <TextInput
              style={styles.searchbar}
              placeholder="Search for a Pokemon..."
              placeholderTextColor={textColor.grey}
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#000" style={styles.loader} />
        ) : (
          <FlatList
            data={filteredPokemon}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('Details', { pokemon: item })}>
                <Card item={item.name} />
              </TouchableOpacity>
            )}
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
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  pokeTItle: {
    width: 300,
    height: 80,
    marginVertical: 20,
    marginTop: -20,
    marginLeft: 30,
  },
  paddedContainer: {
    flex: 1,
    paddingHorizontal: 20, // Add space on the sides for all content except bgImage
    marginTop: height / 8 - 40, // Adjust margin to account for bgImage height
  },
  contents: {
    marginTop: 20, // Adjust spacing between bgImage and contents
  },
  heading: {
    fontSize: 45,
    fontWeight: 'bold',
    color: textColor.black,
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
    marginBottom: 15,
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
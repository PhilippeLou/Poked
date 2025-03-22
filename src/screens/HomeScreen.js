  import React, { useState, useEffect, useCallback } from 'react';
  import { ImageBackground, StyleSheet, Text, View, TextInput, Image, FlatList, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
  import { height, width } from '../assets/constants';
  import Pokeball_header from '../assets/Images/Pokeball-no-bg.png';
  import { customColor, textColor, backgroundColors } from '../assets/colors';
  import Card from '../components/Card';
  import PokedexImage from '../assets/Images/poketitle.png';
  import { Ionicons } from '@expo/vector-icons';
  import { NavigationContainer } from '@react-navigation/native'; // Add for tabs in modal
  import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
  import AboutSection from '../components/AboutSection'; // Import your tab components
import StatsSection from '../components/StatsSection';
import EvolutionSection from '../components/EvolutionSection';


  const searchIcon = require('../assets/Icons/Search.png');
  const pokeballFallback = require('../assets/Images/Pokeball.png');

  const HomeScreen = ({ navigation }) => {
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [pokemonDetails, setPokemonDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    

    useEffect(() => {
      const fetchAllPokemon = async () => {
        try {
          const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
          if (!response.ok) throw new Error('Failed to fetch Pokémon list.');
          const data = await response.json();
          setPokemonList(data.results);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchAllPokemon();
    }, []);

    useEffect(() => {
      const fetchDetails = async () => {
        if (!selectedPokemon) return;
        setDetailsLoading(true);
        setPokemonDetails(null);
        try {
          const response = await fetch(selectedPokemon.url);
          const data = await response.json();
          setPokemonDetails(data);
        } catch (error) {
          console.error('Error fetching Pokémon details:', error);
        } finally {
          setDetailsLoading(false);
        }
      };
      fetchDetails();
    }, [selectedPokemon]);

    const filteredPokemon = useCallback(() => {
      return pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [pokemonList, searchQuery])();

    // In HomeScreen renderItem
    const renderItem = useCallback(
      ({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Details', { pokemon: item })}
          activeOpacity={0.7}
        >
          <Card item={item.name} onPress={() => {
            setSelectedPokemon(item);
            setModalVisible(true);
          }} />
        </TouchableOpacity>
      ),
      [navigation]
    );

    const getBackgroundColor = () => {
      const type = pokemonDetails?.types?.[0]?.type?.name;
      return type ? backgroundColors[type] || 'gray' : 'gray';
    };

    const getPokemonImage = () => {
      return (
        pokemonDetails?.sprites?.other?.['official-artwork']?.front_default ||
        pokemonDetails?.sprites?.front_default ||
        pokeballFallback
      );
    };

    const getTypeColor = () => {
      const type = pokemonDetails?.types?.[0]?.type?.name;
      switch(type) {
        case 'fire': return '#F08030';
        default: return textColor.grey;
      }
    };

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
                autoCapitalize="none"
                returnKeyType="search"
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
              initialNumToRender={10}
              maxToRenderPerBatch={20}
              windowSize={5}
            />
          )}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={28} color={textColor.white} />
              </TouchableOpacity>

              {detailsLoading || !pokemonDetails ? (
                <View style={styles.modalLoading}>
                  <ActivityIndicator size="large" color={customColor.primary} />
                  <Text style={styles.modalLoadingText}>Loading...</Text>
                </View>
              ) : (
                <>
                  <View style={[styles.imageContainer, { backgroundColor: getBackgroundColor() }]}>
                    <Text style={styles.modalTitle}>
                      {pokemonDetails.name.charAt(0).toUpperCase() + pokemonDetails.name.slice(1)}
                    </Text>
                    <Text style={styles.modalNumber}>
                      #{String(pokemonDetails.id).padStart(4, '0')}
                    </Text>
                    <Image
                      source={{ uri: getPokemonImage() }}
                      style={styles.modalImage}
                    />
                  </View>

                  <View style={styles.modalDetails}>
                    <Text style={styles.detailLabel}>Type:</Text>
                    <Text style={styles.detailText}>
                      {pokemonDetails.types.map((t) => t.type.name).join(', ')}
                    </Text>

                    <Text style={styles.detailLabel}>Height:</Text>
                    <Text style={styles.detailText}>{pokemonDetails.height / 10} m</Text>

                    <Text style={styles.detailLabel}>Weight:</Text>
                    <Text style={styles.detailText}>{pokemonDetails.weight / 10} kg</Text>

                    <Text style={styles.detailLabel}>Stats:</Text>
                    {pokemonDetails.stats.map((stat, index) => (
                      <Text key={index} style={styles.detailText}>
                        {stat.stat.name}: {stat.base_stat}
                      </Text>
                    ))}
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
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
      fontStyle: 'italic',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: customColor.input,
      borderRadius: 12,
      marginBottom: 20,
      height: 50,
      paddingHorizontal: 15,
      width: '100%',
      elevation: 2,
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '90%',
      height: '80%',
      backgroundColor: textColor.white,
      borderRadius: 20,
      overflow: 'hidden',
    },
    closeButton: {
      position: 'absolute',
      top: 15,
      right: 15,
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 20,
      padding: 5,
    },
    imageContainer: {
      paddingVertical: 20,
      alignItems: 'center', // Center horizontally
      justifyContent: 'center', // Center vertically
    },
    modalTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: textColor.white,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      textAlign: 'center',
    },
    modalNumber: {
      fontSize: 16,
      color: textColor.white,
      marginBottom: 15,
      textAlign: 'center',
    },
    modalImage: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
    },
    modalDetails: {
      padding: 20,
      flex: 1,
    },
    detailLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: textColor.black,
      marginTop: 10,
    },
    detailText: {
      fontSize: 16,
      color: textColor.grey,
      marginLeft: 10,
    },
    modalLoading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalLoadingText: {
      fontSize: 16,
      color: textColor.grey,
      marginTop: 10,
    },
  });
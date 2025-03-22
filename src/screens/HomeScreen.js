import React, { useState, useEffect, useCallback } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { height, width } from '../assets/constants';
import Pokeball_header from '../assets/Images/Pokeball-no-bg.png';
import { customColor, textColor, backgroundColors } from '../assets/colors';
import Card from '../components/Card';
import PokedexImage from '../assets/Images/poketitle.png';
import { Ionicons } from '@expo/vector-icons';
import AboutSection from '../components/AboutSection'; // Adjust path as needed
import StatsSection from '../components/StatsSection'; // Adjust path as needed
import EvolutionSection from '../components/EvolutionSection'; // Adjust path as needed

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
  const [speciesDetails, setSpeciesDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('About');

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
      setSpeciesDetails(null);
      try {
        const pokemonResponse = await fetch(selectedPokemon.url);
        if (!pokemonResponse.ok) throw new Error('Failed to fetch Pokémon details.');
        const pokemonData = await pokemonResponse.json();
        setPokemonDetails(pokemonData);

        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`);
        if (!speciesResponse.ok) throw new Error('Failed to fetch species details.');
        const speciesData = await speciesResponse.json();
        setSpeciesDetails(speciesData);
      } catch (error) {
        console.error('Error fetching details:', error);
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

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        onPress={() => navigation.navigate('Details', { pokemon: item })}
        activeOpacity={0.7}
      >
        <Card
          item={item.name}
          onPress={() => {
            setSelectedPokemon(item);
            setModalVisible(true);
            setActiveTab('About');
          }}
        />
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

  const tabs = ['About', 'Stats', 'Evolution'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'About':
        return <AboutSection pokemon={pokemonDetails} species={speciesDetails} />;
      case 'Stats':
        return <StatsSection pokemon={pokemonDetails} />;
      case 'Evolution':
        return <EvolutionSection pokemon={pokemonDetails} species={speciesDetails} />;
      default:
        return null;
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
                <ImageBackground
                  source={Pokeball_header}
                  style={[styles.imageContainer, { backgroundColor: getBackgroundColor() }]}
                  resizeMode="contain"
                  imageStyle={styles.imageContainerBackground}
                >
                  <Text style={styles.modalTitle}>
                    {pokemonDetails.name.charAt(0).toUpperCase() + pokemonDetails.name.slice(1)}
                  </Text>
                  <Text style={styles.modalNumber}>
                    #{String(pokemonDetails.id).padStart(4, '0')}
                  </Text>
                  <Image source={{ uri: getPokemonImage() }} style={styles.modalImage} />
                </ImageBackground>

                <View style={styles.tabContainer}>
                  {tabs.map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      style={[
                        styles.tabButton,
                        activeTab === tab && styles.activeTabButton,
                      ]}
                      onPress={() => setActiveTab(tab)}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === tab && styles.activeTabText,
                        ]}
                      >
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.tabContent}>{renderTabContent()}</View>
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
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imageContainerBackground: {
    opacity: 0.2, // Subtle Pokéball background
    width: '100%',
    height: '100%',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: textColor.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
    zIndex: 1,
  },
  modalNumber: {
    fontSize: 16,
    color: textColor.white,
    marginBottom: 15,
    textAlign: 'center',
    zIndex: 1,
  },
  modalImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    zIndex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: customColor.primary,
  },
  tabText: {
    fontSize: 16,
    color: textColor.grey,
  },
  activeTabText: {
    color: customColor.primary,
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    padding: 10,
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
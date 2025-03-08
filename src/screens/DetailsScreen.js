import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { backgroundCard, backgroundColors } from '../assets/colors';
import Tag from '../components/Tag';
import { customColor, textColor } from '../assets/colors';
import PatternDetails from '../assets/Images/patternDetails.png';
import CircleDetails from '../assets/Images/circleDetails.png';
import AboutSection from '../components/AboutSection';
import StatsSection from '../components/StatsSection';
import EvolutionSection from '../components/EvolutionSection';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const DetailsScreen = ({ route }) => {
  const { pokemon } = route.params;
  const navigation = useNavigation();

  const [species, setSpecies] = useState(null);

  useEffect(() => {
    const fetchSpecies = async () => {
      const response = await fetch(pokemon.species.url);
      const data = await response.json();
      setSpecies(data);
    };
    fetchSpecies();
  }, [pokemon.species.url]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.titleMain}>
        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </Text>

      <Text style={styles.pokeNumber}>{String(pokemon.id).padStart(4, '0')}</Text>

      {/* Image Container */}
      <View style={{ ...styles.imageContainer, backgroundColor: backgroundColors[pokemon.types[0].type.name] || 'gray' }}>
        <Image source={PatternDetails} style={styles.patternDetails} />
        <Image source={PatternDetails} style={styles.patternDetailsTwo} />
        <Image source={CircleDetails} style={styles.circleDetails} />

        <Text style={[
          styles.title,
          { color: backgroundColors[pokemon.types[0].type.name] || 'gray' }
        ]}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Text>

        <Image 
          source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png` }} 
          style={styles.pokeImage} 
        />

        <View style={styles.row}>
          {pokemon.types.map((type, index) => (
            <Tag style={styles.pokeTag} key={index} type={type.type.name} />
          ))}
        </View>
      </View>

      {/* Tabs Section */}
      <View style={styles.tabsContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { color: textColor.black, fontSize: 14, fontWeight: 'bold' },
            tabBarStyle: { backgroundColor: 'white' },
            tabBarIndicatorStyle: { backgroundColor: backgroundColors[pokemon.types[0].type.name] || 'black' }, // Dynamic indicator color
          }}
        >
          <Tab.Screen name="About">
            {() => <AboutSection pokemon={pokemon} species={species} />}
          </Tab.Screen>
          <Tab.Screen name="Stats">
            {() => <StatsSection pokemon = {pokemon} />}
          </Tab.Screen>
          <Tab.Screen name="Evolution">
            {() => <EvolutionSection pokemon = {pokemon} species={species} />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 55,
        left: 20,
        padding: 10,
    },
  container: {
    paddingTop: 60,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  titleMain: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: "uppercase",
  },
  title: {
    position: 'absolute',
    top: 10,  // Adjust the top position
    alignSelf: 'center',  // Centers the text horizontally
    fontSize: 50,
    fontWeight: "bold",
    textTransform: "uppercase",
    textShadowColor: "white",  // Shadow color for stroke effect
    textShadowOffset: { width: 2, height: 2 },  // Stronger stroke effect
    textShadowRadius: 3,
  },
  
  pokeImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20,
    zIndex: 1000,
    marginTop: 10,
  },
  imageContainer: {
    marginTop: 40,
    paddingVertical: 80,
    paddingHorizontal: 65,
    backgroundColor: 'yellow',
    borderRadius: 20,
  },
  row: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
  
});

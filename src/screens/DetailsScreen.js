import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { backgroundColors } from '../assets/colors';
import Tag from '../components/Tag';
import PatternDetails from '../assets/Images/patternDetails.png';
import CircleDetails from '../assets/Images/circleDetails.png';

const AboutSection = () => (
  <View style={styles.sectionContainer}><Text>About Information Here</Text></View>
);
const StatsSection = () => (
  <View style={styles.sectionContainer}><Text>Stats Information Here</Text></View>
);
const EvolutionSection = () => (
  <View style={styles.sectionContainer}><Text>Evolution Information Here</Text></View>
);

const renderScene = SceneMap({
  about: AboutSection,
  stats: StatsSection,
  evolution: EvolutionSection,
});

const DetailsScreen = ({ route }) => {
  const { pokemon } = route.params;
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'about', title: 'About' },
    { key: 'stats', title: 'Stats' },
    { key: 'evolution', title: 'Evolution' },
  ]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.titleMain}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
      <Text style={styles.pokeNumber}>{String(pokemon.id).padStart(4, '0')}</Text>
      <View style={{...styles.imageContainer, backgroundColor: backgroundColors[pokemon.types[0].type.name] || 'gray'}}>
        <Image source={PatternDetails} style={styles.patternDetails} />
        <Image source={PatternDetails} style={styles.patternDetailsTwo} />
        <Image source={CircleDetails} style={styles.circleDetails} />
        <Text style={[styles.title, { color: backgroundColors[pokemon.types[0].type.name] || 'gray' }]}> 
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
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={props => (
          <TabBar 
            {...props} 
            style={styles.tabBar} 
            indicatorStyle={styles.indicator} 
            renderLabel={({ route, focused }) => (
              <Text style={styles.tabText}>{route.title}</Text>
            )} 
          />
        )}
      />
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 0,
    left: 20,
    padding: 10,
  },
  container: {
    marginTop: 80,
    flex: 1,
    alignItems: 'center',
  },
  titleMain: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  title: {
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
    fontSize: 50,
    fontWeight: "bold",
    textTransform: "uppercase",
    textShadowColor: "white",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  pokeImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20,
    zIndex: 1000,
    marginTop: -10,
  },
  imageContainer: {
    marginTop: 40,
    paddingVertical: 90,
    paddingHorizontal: 65,
    backgroundColor: 'yellow',
    borderRadius: 20,
  },
  row: {
    marginTop: -10,
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
  sectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tabBar: {
    backgroundColor: '',
    elevation: 0,
    shadowOpacity: 0,
  },
  indicator: {
    backgroundColor: 'black',
  },
  tabText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

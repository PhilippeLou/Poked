import { ImageBackground, StyleSheet, Text, View, TextInput, Image, ScrollView } from 'react-native';
import React from 'react';
import { height, width } from '../assets/constants';
import Pokeball_header from '../assets/Images/Pokeball-no-bg.png';
import { customColor, textColor } from '../assets/colors';
import Card from '../components/Card';

const searchIcon = require('../assets/Icons/Search.png'); // Import the search icon

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <ImageBackground
        resizeMode="contain"
        style={styles.bgImage}
        source={Pokeball_header}
      >
        
      </ImageBackground>

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
            />
          </View>
        </View>s

      {/* Scrollable Section (Cards) */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </ScrollView>
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
    position: 'absolute', // Fixes the header in place
    top: 0,
    left: 0,
    right: 0,
  },
  contents: {
    marginTop: 100,
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
    width: '90%',
    paddingHorizontal: 15,
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
  scrollContainer: {
    
  },
});

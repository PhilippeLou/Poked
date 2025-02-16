import { ImageBackground, StyleSheet, Text, View, TextInput, Image } from 'react-native';
import React from 'react';
import { height, width } from '../assets/constants';
import Pokeball_header from '../assets/Images/Pokeball-no-bg.png';
import { customColor, textColor } from '../assets/colors';

const searchIcon = require('../assets/Icons/Search.png'); // Import the search icon

const HomeScreen = () => {
  return (
    <View>
      <ImageBackground
        resizeMode="contain"
        style={styles.bgImage}
        source={Pokeball_header}
      >
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
        </View>
      </ImageBackground>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  bgImage: {
    width: '100%',
    height: height / 4,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contents: {
    marginTop: 120,
  },
  heading: {
    fontSize: 32,
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
    flexDirection: 'row', // Align icon and input in one line
    alignItems: 'center',
    backgroundColor: customColor.input,
    borderRadius: 10,
    marginTop: 20,
    height: 60,
    width: '100%',
    paddingHorizontal: 15,
  },
  searchIcon: {
    width: 24, // Adjust size as needed
    height: 24,
    marginRight: 10, // Space between icon and text input
  },
  searchbar: {
    flex: 1, // Makes the input take available space
    fontSize: 16,
    color: textColor.black,
  },
});

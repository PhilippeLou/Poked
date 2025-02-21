import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { customColor, textColor, backgroundColors } from '../assets/colors';

const AboutSection = () => (
  <ScrollView style={styles.sectionContainer}>
    <Text style={styles.description}>
      Bulbusaur can be seen napping in bright sunlight. 
      There is a seed on its back. 
      By soaking up the sun's rays, the seed grows progressively larger.
    </Text>
    <View>
      <Text style={styles.pokedexData}>Pokédex Data</Text>
      <View style={styles.pokeDataContent}>
        <View style={styles.dataQuestion}>
          <Text style={styles.quest}>Species</Text>
          <Text style={styles.quest}>Height</Text>
          <Text style={styles.quest}>Weight</Text>
          <Text style={styles.quest}>Weakness</Text>
        </View>
        <View style={styles.dataAnswer}>
          <Text style={styles.answTwo}>Seed Pokemon</Text>
          <Text style={styles.answTwo}>0.7m</Text>
          <Text style={styles.answTwo}>6.9kg</Text>
          <Text style={styles.answTwo}>Fire</Text>
        </View>
      </View>
    </View>

    <View>
      <Text style={styles.pokedexData}>Training</Text>
      <View style={styles.pokeDataContent}>
        <View style={styles.dataQuestion}>
          <Text style={styles.quest}>EV Yield</Text>
          <Text style={styles.quest}>Base Friendship</Text>
          <Text style={styles.quest}>Base EXP</Text>
          <Text style={styles.quest}>Growth Rate</Text>
          <Text style={styles.quest}>Weakness</Text>
        </View>
        <View style={styles.dataAnswer}>
          <Text style={styles.answ}>1 Special Attack</Text>
          <Text style={styles.answ}>70 (normal)</Text>
          <Text style={styles.answ}>64</Text>
          <Text style={styles.answ}>Medium Slow</Text>
        </View>
      </View>
    </View>
  </ScrollView>
);



export default AboutSection;

const styles = StyleSheet.create({
    sectionContainer: {
      flex: 1,
      padding: 30,
      color: 'white',
    },
    description: {
      color: textColor.grey,
    },
    pokedexData: {
      color: backgroundColors.grass,
      fontSize: 20,
      marginVertical: 10,
    },
    quest: {
      marginVertical: 7,
      fontSize: 18,
    },
    answ: {
      marginVertical: 3,
      marginLeft: 35,
      fontSize: 25,
      color: textColor.grey,
    },
    answTwo: {
      marginVertical: 3,
      marginLeft: 72,
      fontSize: 25,
      color: textColor.grey,
    },
    
    pokeDataContent: {
      flexDirection: 'row',
      
    }
  });
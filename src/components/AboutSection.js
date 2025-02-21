import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AboutSection = () => (
  <View style={styles.sectionContainer}>
    <Text>About Information Here</Text>
  </View>
);



export default AboutSection;

const styles = StyleSheet.create({
    sectionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      color: 'white',
    },
  });
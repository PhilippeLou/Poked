import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatsSection = () => (
  <View style={styles.sectionContainer}>
    <Text>Stats Information Here</Text>
  </View>
);



export default StatsSection;

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
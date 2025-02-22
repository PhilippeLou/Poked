import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../assets/colors';
import Icon from './Icon';

const Tag = ({ type }) => {
  return (
    <View style={{ ...styles.tag, backgroundColor: colors[type] }}>
      <Icon name={type} style={styles.icon} />
      <Text style={styles.text}>{type.toUpperCase()}</Text>
    </View>
  );
};

export default Tag;

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row', // ✅ Align icon & text
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginLeft: 5, // ✅ Adds spacing between icon and text
  },
  icon: {
    width: 20, // ✅ Adjust icon size
    height: 20,
  },
});

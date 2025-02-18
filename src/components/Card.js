import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { backgroundColors } from '../assets/colors'

const Card = () => {
  return (
    <View style={{...styles.card, backgroundColor: backgroundColors['grass']}}>
      <View>
        <Text styles={styles.pokeNumber}>#0001</Text>
        <Text style={styles.pokeName}>Bulbasaur</Text>
      </View>
    </View>
  )
}

export default Card



 const styles = StyleSheet.create({
    card: {
        marginVertical: 10,
        padding: 20,
        borderRadius: 10,

    },

    pokeName: {
        fontSize: 26,
        color: 'white',
    },

    pokeNumber: {
        fontSize: 12,
        
    }
 })
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Tag = ({type}) => {
  return (
    <View style={styles.tag}>
      <Text>{type}</Text>
    </View>
  )
}

export default Tag

const styles = StyleSheet.create({
    tag: {
        
    }
})
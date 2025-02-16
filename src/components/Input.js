import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native';

const Input = ({...props}) => {
  return (
    <View>
      <TextInput {...props} />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({})
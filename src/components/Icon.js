import { StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import Grass from '../assets/Icons/GrassIcon.png'; // ✅ Fixed import path
import Poison from '../assets/Icons/PoisonIcon.png'; // ✅ Ensure default case works

const Icon = ({ children, onPress, name, style, ...props }) => {
  let RenderIcon;
  
  switch (name) {
    case 'grass':
      RenderIcon = Grass;
      break;
    default:
      RenderIcon = Poison;
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      {name ? <Image source={RenderIcon} style={[styles.icon, style]} /> : children}
    </TouchableWithoutFeedback>
  );
};

export default Icon;

const styles = StyleSheet.create({
  icon: {
    width: 24,  // ✅ Set width & height for proper display
    height: 24,
    resizeMode: 'contain',
  },
});

import { StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import Grass from '../assets/Icons/GrassIcon.png';
import Poison from '../assets/Icons/PoisonIcon.png';
import Dark from '../assets/Icons/Darkicon.png';
import Dragon from '../assets/Icons/DragonIcon.png';
import Electric from '../assets/Icons/ElectricIcon.png'; // ✅ Fixed space issue in filename
import Fairy from '../assets/Icons/FairyIcon.png';
import Fighting from '../assets/Icons/FightingIcon.png';
import Fire from '../assets/Icons/FireIcon.png';
import Flying from '../assets/Icons/FlyingIcon.png'; // ✅ Fixed
import Ghost from '../assets/Icons/GhostIcon.png'; // ✅ Fixed
import Ground from '../assets/Icons/GroundIcon.png'; // ✅ Fixed
import Ice from '../assets/Icons/IceIcon.png'; // ✅ Fixed
import Normal from '../assets/Icons/NormalIcon.png'; // ✅ Fixed
import Psychic from '../assets/Icons/PsychicIcon.png'; // ✅ Fixed
import Rock from '../assets/Icons/RockIcon.png'; // ✅ Fixed
import Steel from '../assets/Icons/SteelIcon.png'; // ✅ Fixed
import Water from '../assets/Icons/WaterIcon.png'; // ✅ Fixed




const Icon = ({ children, onPress, name, style, ...props }) => {
  let RenderIcon;
  
  switch (name) {
    case 'grass':
      RenderIcon = Grass;
      break;
    case 'poison':
      RenderIcon = Poison;
      break;
    case 'dark':
      RenderIcon = Dark;
      break;
    case 'dragon':
      RenderIcon = Dragon;
      break;
    case 'electric':
      RenderIcon = Electric;
      break;
    case 'fairy':
      RenderIcon = Fairy;
      break;
    case 'fighting':
      RenderIcon = Fighting;
      break;
    case 'fire':
      RenderIcon = Fire;
      break;
    case 'flying':
      RenderIcon = Flying;
      break;
    case 'ghost':
      RenderIcon = Ghost;
      break;
    case 'ground':
      RenderIcon = Ground;
      break;
    case 'ice':
      RenderIcon = Ice;
      break;
    case 'normal':
      RenderIcon = Normal;
      break;
    case 'psychic':
      RenderIcon = Psychic;
      break;
    case 'rock':
      RenderIcon = Rock;
      break;
    case 'steel':
      RenderIcon = Steel;
      break;
    case 'water':
      RenderIcon = Water;
      break;
    default:
      RenderIcon = Poison; // Default to Poison if no match is found
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

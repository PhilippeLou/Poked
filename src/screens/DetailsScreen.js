import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { backgroundCard } from '../assets/colors';
import Tag from '../components/Tag';
import { customColor, textColor } from '../assets/colors';

const DetailsScreen = ({ route }) => {
  const { pokemon } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
        <Text style={styles.pokeNumber}>{String(pokemon.id).padStart(4, '0')}</Text>

        <View style={{...styles.imageContainer, backgroundColor: backgroundCard[pokemon.types[0].type.name] || 'gray'}}>
            <Image 
                source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }} 
                style={styles.pokeImage} 
            />
        </View>
            
        

      
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 0,
        left: 20,
        padding: 10,
    },
  container: {
    marginTop: 80,
    flex: 1,
    alignItems: 'center',
    
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  pokeImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  imageContainer: {
    marginTop: 40,
    paddingVertical: 100,
    paddingHorizontal: 65,
    backgroundColor: 'yellow',
    borderRadius: 20,
  },
  
});

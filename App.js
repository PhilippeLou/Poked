import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { textColor } from './src/assets/colors';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor={textColor.white} />
      <View style={styles.container}>
        <HomeScreen />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: textColor.white,
  },
});

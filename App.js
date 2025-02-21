import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { textColor } from './src/assets/colors';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Correct import


const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar barStyle={'dark-content'} backgroundColor={textColor.white} />
            <Stack.Navigator>
                <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
                <Stack.Screen name="Details" options={{ headerShown: false }} component={DetailsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

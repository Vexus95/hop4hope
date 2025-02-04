import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import WardrobeScreen from './src/screens/WardrobeScreen';
import DanceScreen from './src/screens/DanceScreen';
import MyDeviceScreen from './src/screens/MyBraceletScreen';
import QuestsScreen from './src/screens/QuestsScreen';
import LoginScreen from './src/screens/LoginScreen';
import ShopScreen from './src/screens/ShopScreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import BluetoothScreen from './src/screens/BluetoothScreen';

import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainApp = () => (
  <Tab.Navigator>
    <Tab.Screen 
      name="MyDevice" 
      component={BluetoothScreen}
      options={{ tabBarIcon: ({ color, size }) => <Icon name="bluetooth" size={size} color={color} /> }}
    />
    <Tab.Screen 
      name="Quests" 
      component={QuestsScreen}
      options={{ tabBarIcon: ({ color, size }) => <Icon name="list-alt" size={size} color={color} /> }}
    />
    <Tab.Screen 
      name="Wardrobe" 
      component={WardrobeScreen}
      options={{ tabBarIcon: ({ color, size }) => <Icon name="users" size={size} color={color} /> }}
    />
    <Tab.Screen 
      name="Dance" 
      component={DanceScreen}
      options={{ tabBarIcon: ({ color, size }) => <Icon name="music" size={size} color={color} /> }}
    />
    <Tab.Screen 
      name="Shop" 
      component={ShopScreen}
      options={{ tabBarIcon: ({ color, size }) => <Icon name="shopping-bag" size={size} color={color} /> }}
    />
  </Tab.Navigator>
);


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Load fonts inside the component
  const [fontsLoaded] = useFonts({
    'Gliker': require('./assets/fonts/Gliker-Black.ttf'),
  });

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainApp />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLoginSuccess={() => setIsLoggedIn(true)} />}
          </Stack.Screen>
          <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

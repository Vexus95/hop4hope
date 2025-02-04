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
import { useFonts } from 'expo-font';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export type RootStackParamList = {
  Login: undefined;
  CreateAccount: undefined;
};

const MainApp = () => (
  <Tab.Navigator>
    <Tab.Screen name="MyDevice" component={MyDeviceScreen} />
    <Tab.Screen name="Quests" component={QuestsScreen} />
    <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
    <Tab.Screen name="Dance" component={DanceScreen} />
    <Tab.Screen name="Shop" component={ShopScreen} />
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

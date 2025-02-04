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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="MyDevice" component={MyDeviceScreen} />
      <Tab.Screen name="Quests" component={QuestsScreen} />
      <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
      <Tab.Screen name="Dance" component={DanceScreen} />
      <Tab.Screen name="Bluetooth" component={BluetoothScreen} />
    </Tab.Navigator>
  );
}
export type RootStackParamList = {
  Login: undefined;
  CreateAccount: undefined;
  // Ajoute d'autres routes ici si besoin
};


const MainApp = () => (
  <Tab.Navigator>
    <Tab.Screen name="MyDevice" component={BluetoothScreen} />
    <Tab.Screen name="Quests" component={QuestsScreen} />
    <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
    <Tab.Screen name="Dance" component={DanceScreen} />
    <Tab.Screen name="Shop" component={ShopScreen} />
  </Tab.Navigator>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


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

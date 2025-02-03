import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WardrobeScreen from './src/screens/WardrobeScreen';
import DanceScreen from './src/screens/DanceScreen';
import MyDeviceScreen from './src/screens/MyBraceletScreen';
import QuestsScreen from './src/screens/QuestsScreen';
import LoginScreen from './src/screens/LoginScreen';
import ShopScreen from './src/screens/ShopScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // État pour vérifier si l'utilisateur est connecté

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Mettre à jour l'état lorsque l'utilisateur se connecte avec succès
  };

  return (
    <NavigationContainer>
      {isLoggedIn ? ( // Si l'utilisateur est connecté, afficher la barre de navigation
        <Tab.Navigator>
          <Tab.Screen name="MyDevice" component={MyDeviceScreen} />
          <Tab.Screen name="Quests" component={QuestsScreen} />
          <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
          <Tab.Screen name="Dance" component={DanceScreen} />
          <Tab.Screen name="Shop" component={ShopScreen} />
        </Tab.Navigator>
      ) : ( // Sinon, afficher l'écran de connexion
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </NavigationContainer>
  );
}

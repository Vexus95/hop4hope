import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WardrobeScreen from './src/screens/WardrobeScreen';
import DanceScreen from './src/screens/DanceScreen';
import MyDeviceScreen from './src/screens/MyBraceletScreen';
import QuestsScreen from './src/screens/QuestsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="MyDevice" component={MyDeviceScreen} />
        <Tab.Screen name="Quests" component={QuestsScreen} />
        <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
        <Tab.Screen name="Dance" component={DanceScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

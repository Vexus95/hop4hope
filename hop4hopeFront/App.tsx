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
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export type RootStackParamList = {
  Login: undefined;
  CreateAccount: undefined;
};


const MainApp = () => (
  <Tab.Navigator>
    <Tab.Screen 
      name="Appareil" 
      component={MyDeviceScreen}
      options={{ tabBarIcon: ({ color, size }) => <Icon name="bluetooth" size={size} color={color} />,
      headerTitleStyle: { 
        fontFamily: 'Gliker',
        fontSize: 20,
      }
    }}
  />
    <Tab.Screen 
      name="Quêtes" 
      component={QuestsScreen}
      options={{ tabBarIcon: ({ color, size }) => <Icon name="list-alt" size={size} color={color} />,
      headerTitleStyle: { 
        fontFamily: 'Gliker',
        fontSize: 20,
      }
    }}
  />
    <Tab.Screen 
      name="Inventaire" 
      component={WardrobeScreen}
      options={{ tabBarIcon: ({ color, size }) => <Icon name="users" size={size} color={color} />,
      headerTitleStyle: { 
        fontFamily: 'Gliker',
        fontSize: 20,
      }
    }}
  />
    <Tab.Screen 
      name="Danse" 
      component={DanceScreen}
      options={{ tabBarIcon: ({ color, size }) => <Icon name="music" size={size} color={color} />,
      headerTitleStyle: { 
        fontFamily: 'Gliker',
        fontSize: 20,
      }
    }}
  />
    <Tab.Screen 
      name="Boutique" 
      component={ShopScreen}
      options={{ tabBarIcon: ({ color, size }) => <Icon name="shopping-bag" size={size} color={color} />,
      headerTitleStyle: { 
        fontFamily: 'Gliker',
        fontSize: 20,
      }
    }}
  />
  </Tab.Navigator>
);


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Load fonts inside the component
  const [fontsLoaded] = useFonts({
    'Gliker': require('./assets/fonts/Gliker-Black.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Prevent rendering until fonts are loaded
  }

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

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MyDeviceScreen = () => {
  const [message, setMessage] = useState('Appareil non trouvé'); // Message par défaut

  const searchDevice = () => {
    // Simule une recherche d'appareil
    setMessage('Recherche en cours...');
    setTimeout(() => {
      // Simule un appareil trouvé après 2 secondes
      setMessage('Appareil trouvé!');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bracelet</Text>
      <TouchableOpacity style={styles.button} onPress={searchDevice}>
        <Text style={styles.buttonText}>Chercher mon bracelet</Text>
      </TouchableOpacity>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dbebff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    fontFamily: 'Gliker',
  },
  button: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontFamily: 'Gliker',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontFamily: 'Gliker',
    fontSize: 16,
    color: '#555',
  },
});

export default MyDeviceScreen;

import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import UserPoints from '../component/UserPoints';

const ShopScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
        <UserPoints></UserPoints>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to My App</Text>
        <Text style={styles.subtitle}>This is a simple white page.</Text>
        <TouchableOpacity style={styles.button} onPress={() => alert('Button Pressed!')}>
          <Text style={styles.buttonText}>Click Me</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000', // Black text
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666', // Gray text
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF', // Blue button
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShopScreen;
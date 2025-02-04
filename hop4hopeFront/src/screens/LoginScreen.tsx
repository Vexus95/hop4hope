import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../App";
import { StackNavigationProp } from "@react-navigation/stack";


const REACT_NATIVE_SERVER_IP = Constants.expoConfig?.extra?.REACT_NATIVE_SERVER_IP;

if (!REACT_NATIVE_SERVER_IP) {
  throw new Error('REACT_NATIVE_SERVER_IP is not defined in app.config.js or app.json');
}

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const API_URL = `http://${REACT_NATIVE_SERVER_IP}:5000/users`;

  const handleLogin = async () => {
    try {
      console.log("Tentative de connexion avec:", email, password);
      
      const response = await axios.post(`${API_URL}/login`, { 
        Email: email, 
        motdepasse: password 
      });

      const token = response.data.token;
      console.log("Token reçu:", token);

      if (!token) {
        throw new Error("Token non reçu");
      }

      await AsyncStorage.setItem("userToken", token);
      onLoginSuccess();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || "Mot de passe incorrect";
        Alert.alert("Erreur", errorMessage);
      } else {
        Alert.alert("Erreur", "Une erreur inattendue s'est produite.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Identifiant</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez votre identifiant"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez votre mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Connexion</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
          <Text style={styles.link}>Créer un compte</Text>
        </TouchableOpacity>
          <Text style={styles.link}>Mot de passe oublié</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F5E9", justifyContent: "center", alignItems: "center" },
  formContainer: { width: "80%", backgroundColor: "white", padding: 20, borderRadius: 20, elevation: 5 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  input: { height: 40, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 10, backgroundColor: "white", marginBottom: 15 },
  button: { backgroundColor: "#6C63FF", paddingVertical: 10, borderRadius: 10, alignItems: "center", marginTop: 10 },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  link: { color: "#6C63FF", fontSize: 14 },
});

export default LoginScreen;

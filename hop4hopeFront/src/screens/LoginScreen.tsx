import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";

// API_URL pointant vers le serveur local
const API_URL = "http://192.168.1.14:5000/users"; 

// Définition du type de la prop 'onLoginSuccess'
interface LoginScreenProps {
  onLoginSuccess: () => void; // 'onLoginSuccess' est une fonction qui ne prend aucun paramètre et ne retourne rien
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => { // Application du type à la fonction
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log(email, password);
      const response = await axios.post(`${API_URL}/login`, { Email: email, motdepasse: password });

      // Connexion réussie
      Alert.alert("Succès", "Connexion réussie !");
      console.log("Token reçu:", response.data.token);

      // Appel de la fonction pour signaler que l'utilisateur est connecté
      onLoginSuccess();
    } catch (error: any) { // TypeScript : "any" pour éviter les erreurs de typage
      const errorMessage = error.response?.data?.error || "Mot de passe incorrect";
      Alert.alert("Erreur", errorMessage);
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
          <Text style={styles.link}>Créer un compte</Text>
          <Text style={styles.link}>Mot de passe oublié</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  link: {
    color: "#6C63FF",
    fontSize: 14,
  },
});

export default LoginScreen;

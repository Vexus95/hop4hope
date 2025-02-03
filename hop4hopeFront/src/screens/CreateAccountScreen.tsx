import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import axios from 'axios';
import Constants from 'expo-constants';
import { StackNavigationProp } from '@react-navigation/stack';

const REACT_NATIVE_SERVER_IP = Constants.expoConfig.extra.REACT_NATIVE_SERVER_IP;

const CreateAccountScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const API_URL = `http://${REACT_NATIVE_SERVER_IP}:5000/users/register`;

  const handleCreateAccount = async () => {
    try {
      const response = await axios.post(API_URL, {
        Nom: nom,
        Prénom: prenom,
        Email: email,
        motdepasse: password,
      });
      
      Alert.alert("Succès", "Compte créé avec succès !");
      navigation.navigate('Login'); // Retour à l'écran de connexion
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.error || "Une erreur est survenue lors de la création du compte.";
          Alert.alert("Erreur", errorMessage);
        } else {
          Alert.alert("Erreur", "Une erreur inattendue s'est produite.");
        }
      }
    }
      

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nom</Text>
        <TextInput style={styles.input} placeholder="Nom" value={nom} onChangeText={setNom} />

        <Text style={styles.label}>Prénom</Text>
        <TextInput style={styles.input} placeholder="Prénom" value={prenom} onChangeText={setPrenom} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput style={styles.input} placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />

        <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
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
  link: { color: "#6C63FF", fontSize: 14, marginTop: 10, textAlign: "center" },
});

export default CreateAccountScreen;

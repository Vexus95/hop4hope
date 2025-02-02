import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://192.168.1.14:5000/users/info"; // Mise à jour avec la nouvelle route pour récupérer les infos de l'utilisateur

const UserPoints = () => {
  const [points, setPoints] = useState<number | null>(null); // Initialisation des points
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          throw new Error("Token non trouvé");
        }

        // Faire la requête pour obtenir les informations de l'utilisateur, y compris les points
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Assurer que les points sont présents dans la réponse
        setPoints(response.data.Points); // Points doivent être dans la réponse
      } catch (error) {
        console.error("Erreur lors de la récupération des points", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPoints();
  }, []);

  if (loading) {
    return <ActivityIndicator size="small" color="#5468ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pointsText}>Points: {points !== null ? points : 0}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',  // Réduit la largeur de la box à 60%
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default UserPoints;

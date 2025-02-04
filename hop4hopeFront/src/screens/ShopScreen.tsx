import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList, Alert, Image } from 'react-native';
import { Card, Title, Paragraph } from "react-native-paper";
import UserPoints from '../component/UserPoints';
import axios from "axios";
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";

const REACT_NATIVE_SERVER_IP = Constants.expoConfig?.extra?.REACT_NATIVE_SERVER_IP;

interface Personnage {
  image: any;
  id: number;
  nom: string;
  coût: number;
  matrice: string;
}

const ShopScreen = () => {
  const [personnages, setPersonnages] = useState<Personnage[]>([]);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [ownedCharacterIds, setOwnedCharacterIds] = useState<number[]>([]);

  useEffect(() => {
    fetchPersonnages();
    fetchUserPoints();
    fetchOwnedCharacters();
  }, [refreshKey]); // 🔹 Fetch user points when refreshKey changes

  const fetchUserPoints = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        throw new Error("Token non trouvé");
      }

      const response = await axios.get(`http://${REACT_NATIVE_SERVER_IP}:5000/users/info`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserPoints(response.data.Points);
    } catch (error) {
      console.error("Erreur lors de la récupération des points", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonnages = async () => {
    try {
      const response = await axios.get(`http://${REACT_NATIVE_SERVER_IP}:5000/personnages/getAll`, {
        timeout: 10000, // 10 seconds
      });

      const allPersonnages: Personnage[] = response.data.map((p: any) => ({
        id: p.Id_personnage,
        nom: p.Nom,
        coût: p.coût,
        matrice: p.matrice,
        image: p.image
      }));

      setPersonnages(allPersonnages);
    } catch (error) {
      console.error("Erreur lors de la récupération des personnages:", error);
    } finally {
      setLoading(false);
    }
  };

  const buyCharacter = async (characterId: number) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      await axios.post(
        `http://${REACT_NATIVE_SERVER_IP}:5000/shop/buy-character`,
        { characterId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Achat réussi", `Vous avez acheté le skin avec succès!`);

      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      Alert.alert("Erreur", error.response?.data?.error || "Achat échoué.");
    }
  };

  const fetchOwnedCharacters = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) throw new Error("Token non trouvé");

      const response = await axios.get(`http://${REACT_NATIVE_SERVER_IP}:5000/users/characters`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ownedIds = response.data.map((char: any) => char.Id_personnage);
      setOwnedCharacterIds(ownedIds);
    } catch (error) {
      console.error("Erreur lors de la récupération des personnages possédés", error);
    }
  };

  const getImageSource = (imagePath: string) => {
    const images: { [key: string]: any } = {
      "./assets/pixil-layer-2.png": require("../../assets/pixil-layer-2.png"),
      "./assets/pixil-layer-3.png": require("../../assets/pixil-layer-3.png"),
    };
  
    return images[imagePath]; // Fallback image
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <UserPoints key={refreshKey} pointsProp={userPoints} />
      </View>
      <FlatList
        data={personnages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isOwned = ownedCharacterIds.includes(item.id);
          return (
            <TouchableOpacity onPress={() => !isOwned && buyCharacter(item.id)} disabled={isOwned}>
              <Card style={[styles.card, isOwned && styles.ownedCard]}>
                <Card.Content>
                  <Title style={[styles.text, isOwned && styles.ownedText]}>{item.nom}</Title>
                  <Paragraph style={[styles.text, isOwned && styles.ownedText]}>
                    {isOwned ? "Personnage déjà possédé" : `Coût: ${item.coût} 🪙`}
                  </Paragraph>
                  <Image source={getImageSource(item.image)} style={styles.image} />
                </Card.Content>
              </Card>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  container: { 
    flex: 1, 
    backgroundColor: '#dbebff', 
    padding: 20 
  },
  card: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 1 },
  },
  ownedCard: {
    backgroundColor: "#A2A2A2", // Grey background for owned characters
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: 'Gliker',
    fontSize: 18,
    color:"#0b1788"
  },
  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: "contain", // Ensures the whole image is visible without cropping
  },
  
});

export default ShopScreen;

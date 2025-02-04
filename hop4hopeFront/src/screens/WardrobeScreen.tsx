import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const REACT_NATIVE_SERVER_IP = Constants.expoConfig?.extra?.REACT_NATIVE_SERVER_IP;

interface Personnage {
  image: string;
  id: number;
  nom: string;
  coût: number;
  matrice: string;
}

const WardrobeScreen = () => {
  const [personnages, setPersonnages] = useState<Personnage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<Personnage | null>(null);

  useEffect(() => {
    fetchOwnedCharacters();
  }, []);

  const fetchOwnedCharacters = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) throw new Error("Token non trouvé");

      const response = await axios.get(`http://${REACT_NATIVE_SERVER_IP}:5000/users/characters`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ownedIds = response.data.map((char: any) => char.Id_personnage);
      ownedIds.forEach((id: number) => fetchPersonnageById(id));
    } catch (error) {
      console.error("Erreur lors de la récupération des personnages possédés", error);
    }
  };

  const fetchPersonnageById = async (characterId: number) => {
    try {
      const response = await axios.get(`http://${REACT_NATIVE_SERVER_IP}:5000/personnages/${characterId}`, {
        timeout: 10000, // 10 seconds timeout
      });
      console.log(response.data)
      const newPersonnage: Personnage = {
        id: response.data.Id_personnage,
        nom: response.data.Nom,
        coût: response.data.coût,
        matrice: response.data.matrice,
        image: response.data.image,
      };

      setPersonnages((prev) => {
        const updatedList = prev.some((p) => p.id === newPersonnage.id) ? prev : [...prev, newPersonnage];

        // Set the first character as selected
        if (updatedList.length === 1) {
          setSelectedCharacter(updatedList[0]);
        }

        return updatedList;
      });
    } catch (error) {
      console.error(`Erreur lors de la récupération du personnage ${characterId}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const getImageSource = (imagePath: string) => {
    const images: { [key: string]: any } = {
      "./hop4hope/hop4hopeFront/assets/pixil-layer-2.png": require("../../assets/pixil-layer-2.png"),
      "/hop4hope/hop4hopeFront/assets/pixil-layer-3.png": require("../../assets/pixil-layer-3.png"),
    };
  
    return images[imagePath]; // Fallback image
  };

  return (
    <View style={styles.screen}>
      <View style={styles.selectedContainer}>
        <Image source={getImageSource(selectedCharacter.image)} style={styles.selectedImage} />
      </View>
      <ScrollView contentContainerStyle={styles.gridContainer}>
      {personnages.map((character) => {
        console.log("Character rendering: \n", character);
        return (
          <TouchableOpacity key={character.id} onPress={() => setSelectedCharacter(character)}>
            <Image
              source={getImageSource(character.image)}
              style={[
                 styles.image,
                 selectedCharacter?.id === character.id && styles.selectedBorder,
               ]}
            />
          </TouchableOpacity>
        );
      })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f9ff',
  },
  selectedContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    resizeMode: "contain",
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center images properly
    alignItems: 'center',
    paddingHorizontal: 10,
  },  
  gridItem: {
    width: '48%', // Deux éléments par ligne avec un petit espace
    marginBottom: 10,
  },
  image: {
    width: 150,  // Fixed size to avoid layout issues
    height: 100, 
    borderRadius: 10,
    resizeMode: "contain", // "cover" instead of "contain" for proper rendering
  },
  selectedBorder: {
    borderWidth: 2,
    borderColor: 'blue',
  },
});

export default WardrobeScreen;

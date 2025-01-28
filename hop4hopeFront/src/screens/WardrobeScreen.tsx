import React, { useState } from 'react';
import { ScrollView, View, Image, StyleSheet, TouchableOpacity } from 'react-native';

const WardrobeScreen = () => {
  const clothes = [
    { id: 1, src: require('../../assets/clothes1.png') },
    { id: 2, src: require('../../assets/clothes2.png') },
    { id: 3, src: require('../../assets/clothes2.png') },
    { id: 4, src: require('../../assets/clothes2.png') },
    { id: 5, src: require('../../assets/clothes2.png') },
    { id: 6, src: require('../../assets/clothes2.png') },
    // Ajoute plus d'images ici
  ];

  // État pour le vêtement sélectionné (par défaut le premier)
  const [selectedClothes, setSelectedClothes] = useState(clothes[0]);

  return (
    <View style={styles.screen}>
      {/* Vêtement sélectionné affiché en grand */}
      <View style={styles.selectedContainer}>
        <Image source={selectedClothes.src} style={styles.selectedImage} />
      </View>

      {/* Liste des vêtements affichés en grille (2 par ligne) */}
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {clothes.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setSelectedClothes(item)} // Change le vêtement sélectionné
            style={styles.gridItem}
          >
            <Image
              source={item.src}
              style={[
                styles.image,
                selectedClothes.id === item.id && styles.selectedBorder, // Bordure pour l'élément sélectionné
              ]}
            />
          </TouchableOpacity>
        ))}
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
    width: 200,
    height: 200,
    borderRadius: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permet de passer à la ligne suivante automatiquement
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  gridItem: {
    width: '48%', // Deux éléments par ligne avec un petit espace
    marginBottom: 10,
  },
  image: {
    width: '100%', // Utilise toute la largeur de l'élément parent
    height: 150,
    borderRadius: 10,
  },
  selectedBorder: {
    borderWidth: 2,
    borderColor: 'blue',
  },
});

export default WardrobeScreen;

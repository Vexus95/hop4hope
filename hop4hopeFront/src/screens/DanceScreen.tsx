import React, { useState } from 'react';
import { ScrollView, View, Image, StyleSheet, TouchableOpacity } from 'react-native';

const DanceScreen = () => {
  const gifs = [
    { id: 1, src: { uri: 'https://media.giphy.com/media/26FPCXdkvDbKBbgOI/giphy.gif' } },
    { id: 2, src: { uri: 'https://media.giphy.com/media/l0ExhAIZRLb2f4cE4/giphy.gif' } },
    { id: 3, src: { uri: 'https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif' } },
    { id: 4, src: { uri: 'https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.gif' } },
    // Ajoute plus de GIFs ici si nécessaire
  ];

  // GIF sélectionné par défaut (le premier)
  const [selectedGif, setSelectedGif] = useState(gifs[0]);

  return (
    <View style={styles.screen}>
      {/* GIF sélectionné affiché en grand */}
      <View style={styles.selectedContainer}>
        <Image source={selectedGif.src} style={styles.selectedImage} />
      </View>

      {/* Liste des GIFs affichés en grille (2 par ligne) */}
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {gifs.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setSelectedGif(item)} // Change le GIF sélectionné
            style={styles.gridItem}
          >
            <Image
              source={item.src}
              style={[
                styles.image,
                selectedGif.id === item.id && styles.selectedBorder, // Bordure pour le GIF sélectionné
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

export default DanceScreen;

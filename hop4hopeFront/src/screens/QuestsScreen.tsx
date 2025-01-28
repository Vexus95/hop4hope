import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

// Définir une interface pour les quêtes
interface Quest {
  id: number;
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

// Définir les données pour les quêtes
const quests = {
  daily: [
    { id: 1, title: 'Daily Quest 1', description: 'Marcher 500 mètres', points: 4, completed: true },
    { id: 2, title: 'Daily Quest 2', description: 'Atteindre une fois la vitesse de 10km/h', points: 4, completed: false },
  ],
  weekly: [
    { id: 3, title: 'Weekly Quest 1', description: 'Marcher 2 km', points: 15, completed: false },
    { id: 4, title: 'Weekly Quest 2', description: 'Faire au moins 50 saut dans la semaine', points: 30, completed: true },
  ],
};

const QuestsScreen = () => {
  // Fonction pour rendre chaque quête
  const renderQuest = ({ item }: { item: Quest }) => (
    <View style={styles.questItem}>
      <View style={[styles.icon, item.completed ? styles.completedIcon : styles.pendingIcon]} />
      <View style={styles.textContainer}>
        <Text style={styles.questTitle}>{item.title}</Text>
        <Text style={styles.questDescription}>{item.description}</Text>
      </View>
      <Text style={styles.points}>{item.points} points</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.totalPoints}>80 Points</Text>
      <Text style={styles.sectionTitle}>Daily</Text>
      <FlatList
        data={quests.daily}
        renderItem={renderQuest}
        keyExtractor={(item) => item.id.toString()}
      />
      <Text style={styles.sectionTitle}>Weekly</Text>
      <FlatList
        data={quests.weekly}
        renderItem={renderQuest}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f9ff',
    padding: 20,
  },
  totalPoints: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#5468ff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  questItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  completedIcon: {
    backgroundColor: '#4caf50',
  },
  pendingIcon: {
    backgroundColor: '#ccc',
  },
  textContainer: {
    flex: 1,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  questDescription: {
    fontSize: 14,
    color: '#777',
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5468ff',
  },
});

export default QuestsScreen;

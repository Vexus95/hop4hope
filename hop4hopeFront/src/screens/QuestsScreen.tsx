import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBar from '../component/ProgressBar'; // Import du composant ProgressBar

interface Quest {
  id: number;
  nom: string;
  description: string;
  points: number;
  date_debut: string;
  date_fin: string;
  defaultGoal: number;
  currentProgress: number;
}

const API_URL = "http://192.168.1.14:5000/users/quests"; // URL pour récupérer les quêtes
const PROGRESS_URL = "http://192.168.1.14:5000/quests/progress"; // URL pour récupérer la progression

const QuestsScreen = () => {
  const [quests, setQuests] = useState<{ daily: Quest[]; weekly: Quest[] }>({ daily: [], weekly: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          throw new Error("Token non trouvé");
        }
  
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // Récupérer les quêtes
        const allQuests: Quest[] = response.data.map((quests: any) => ({
          id: quests.Id_quete,
          nom: quests.Nom,
          description: quests.description,
          points: quests.points,
          date_debut: quests.date_debut,
          date_fin: quests.date_fin,
          defaultGoal: quests.defaultGoal, // goal par défaut
        }));
        console.log(allQuests);
        console.log(allQuests[0]);
        // Récupérer la progression actuelle de chaque quête via un POST
        const progressResponses = await Promise.all(
          allQuests.map((quests) =>
            axios.post(PROGRESS_URL, {
              questId: quests.id,
              progressAmount: 0, // On met progressAmount à 0 pour récupérer la progression actuelle
            }, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );
  
        // Mettre à jour les quêtes avec la progression obtenue
        const questsWithProgress = allQuests.map((quest, index) => ({
          ...quest,
          currentProgress: progressResponses[index].data.currentProgress, // Ajout de la progression réelle
        }));
  
        // Séparer les quêtes quotidiennes et hebdomadaires
        const dailyQuests = questsWithProgress.filter((q) => {
          const startDate = new Date(q.date_debut);
          const endDate = new Date(q.date_fin);
          const diffInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
          return diffInDays === 0;
        });
  
        const weeklyQuests = questsWithProgress.filter((q) => {
          const startDate = new Date(q.date_debut);
          const endDate = new Date(q.date_fin);
          const diffInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
          return diffInDays === 7;
        });
  
        setQuests({ daily: dailyQuests, weekly: weeklyQuests });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchQuests();
  }, []);
  

  const renderQuest = ({ item }: { item: Quest }) => {
    const currentProgress = item.currentProgress || 0; // Utilise currentProgress de l'état
    const goal = item.defaultGoal;
  
    return (
      <View style={styles.questItem}>
        <Text style={styles.questTitle}>{item.nom}</Text>
        <Text style={styles.questDescription}>{item.description}</Text>
        
        {/* Barre de progression */}
        <ProgressBar currentProgress={currentProgress} goal={goal} />
        
        <Text style={styles.points}>{item.points} points</Text>
      </View>
    );
  };
  
  

  if (loading) {
    return <ActivityIndicator size="large" color="#5468ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Daily</Text>
      <FlatList 
        data={quests.daily} 
        renderItem={renderQuest} 
        keyExtractor={(item) => item.id ? item.id.toString() : 'defaultKey'}
      />

      <Text style={styles.sectionTitle}>Weekly</Text>
      <FlatList 
        data={quests.weekly} 
        renderItem={renderQuest} 
        keyExtractor={(item) => item.id ? item.id.toString() : 'defaultKey'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f9ff', padding: 20 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 10, color: '#333' },
  questItem: { 
    flexDirection: 'column', // Aligner les éléments verticalement
    backgroundColor: '#fff', 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 10, 
    elevation: 3 
  },
  questTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  questDescription: { fontSize: 14, color: '#777' },
  points: { fontSize: 16, fontWeight: 'bold', color: '#5468ff' },
  progressBarContainer: { 
    height: 10, 
    backgroundColor: '#ccc', 
    borderRadius: 5, 
    overflow: 'hidden', 
    marginVertical: 10 
  },
  progressBar: { 
    height: '100%', 
    backgroundColor: '#4caf50' 
  },
});


export default QuestsScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBar from '../component/ProgressBar'; // Import du composant ProgressBar
import Icon from "react-native-vector-icons/FontAwesome";
import UserPoints from '../component/UserPoints'; // Import du composant UserPoints

interface Quest {
  id: number;
  nom: string;
  description: string;
  points: number;
  date_debut: string;
  date_fin: string;
  defaultGoal: number;
  currentProgress: number;
  rewardClaimed: boolean; // Ajout de la clé rewardClaimed
  questStatus?: string;
}

const API_URL = "http://192.168.1.14:5000/users/quests"; // URL pour récupérer les quêtes
const PROGRESS_URL = "http://192.168.1.14:5000/quests/progress"; // URL pour récupérer la progression
const CLAIM_REWARD_URL = "http://192.168.1.14:5000/quests/claim-reward";

const QuestsScreen = () => {
  const [quests, setQuests] = useState<{ daily: Quest[]; weekly: Quest[] }>({ daily: [], weekly: [] });
  const [loading, setLoading] = useState(true);

  const fetchQuests = async () => {
    setLoading(true); // Active le loading avant de récupérer les données
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
        rewardClaimed: quests.Utilisateurs[0].Avoir.rewardClaimed, // Récupérer si rewardClaimed est true ou false
      }));

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

      console.log("Progressions reçues :", progressResponses.map(res => res.data));

      // Filtrer les quêtes pour ne pas afficher celles qui ont été réclamées
      const questNotCompleted = questsWithProgress.filter(q => !q.rewardClaimed);

      // Séparer les quêtes quotidiennes et hebdomadaires
      const dailyQuests = questNotCompleted.filter((q) => {
        const startDate = new Date(q.date_debut);
        const endDate = new Date(q.date_fin);
        const diffInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffInDays === 0;
      });

      const weeklyQuests = questNotCompleted.filter((q) => {
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

  useEffect(() => {
    fetchQuests(); // Appel initial pour charger les quêtes
  }, []);

  const renderQuest = ({ item }: { item: Quest }) => {
    const isCompleted = item.currentProgress >= item.defaultGoal; // Vérifier si la quête est terminée
    const isRewardClaimed = item.rewardClaimed;

    return (
      <View style={[styles.questItem, isCompleted && styles.completedQuest]}>
        <Text style={styles.questTitle}>{item.nom}</Text>
        <Text style={styles.questDescription}>{item.description}</Text>

        <ProgressBar currentProgress={item.currentProgress} goal={item.defaultGoal} />

        <Text style={styles.points}>{item.points} points</Text>

        {isCompleted && !isRewardClaimed && (
          <TouchableOpacity
            style={styles.chestButton}
            onPress={() => handleClaimReward(item.id)}
          >
            <Icon name="gift" size={30} color="#FFD700" />
          </TouchableOpacity>
        )}

        {isRewardClaimed && <Text style={styles.claimedText}>Récompense récupérée 🎉</Text>}
      </View>
    );
  };

  const handleClaimReward = async (questId: number) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        throw new Error("Token non trouvé");
      }

      const response = await axios.post(
        CLAIM_REWARD_URL,
        { questId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Succès", response.data.message);

      setQuests((prevQuests) => ({
        daily: prevQuests.daily.map((q) =>
          q.id === questId ? { ...q, rewardClaimed: true } : q
        ),
        weekly: prevQuests.weekly.map((q) =>
          q.id === questId ? { ...q, rewardClaimed: true } : q
        ),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      Alert.alert("Erreur", errorMessage);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#5468ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      {/* Box des points de l'utilisateur en haut et bouton actualiser */}
      <View style={styles.header}>
        <UserPoints />
        <TouchableOpacity style={styles.refreshButton} onPress={fetchQuests}>
          <Icon name="refresh" size={30} color="#5468ff" />
        </TouchableOpacity>
      </View>

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
  completedQuest: {
    opacity: 0.5, // Rend la quête transparente si elle est complétée
  },
  chestButton: {
    alignSelf: "center",
    marginTop: 10,
  },
  claimedText: {
    marginTop: 10,
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
  header: {
    flexDirection: 'row', // Aligne horizontalement les éléments
    justifyContent: 'space-between', // Espacement entre la box des points et le bouton
    alignItems: 'center', // Aligne verticalement au centre
    marginBottom: 20,
  },
  refreshButton: {
    marginLeft: 10, // Espacement entre la box des points et le bouton
  },
  questTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  questDescription: { fontSize: 14, color: '#777' },
  points: { fontSize: 16, fontWeight: 'bold', color: '#5468ff' },
});

export default QuestsScreen;

// ProgressBar.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ currentProgress, goal }: { currentProgress: number, goal: number }) => {
  const progressPercentage = (currentProgress / goal) * 100;

  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
});

export default ProgressBar;

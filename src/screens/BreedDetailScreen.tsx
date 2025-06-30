import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { CatBreed } from '../data/catBreeds';
import { RootStackParamList } from '../types/navigation';

type BreedDetailRouteProp = RouteProp<RootStackParamList, 'BreedDetail'>;

interface Props {
  route: BreedDetailRouteProp;
}

export default function BreedDetailScreen({ route }: Props) {
  const { breed } = route.params;


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{breed.image}</Text>
        <Text style={styles.name}>{breed.name}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Origin</Text>
        <Text style={styles.sectionText}>{breed.origin}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Temperament</Text>
        <Text style={styles.sectionText}>{breed.temperament}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lifespan</Text>
        <Text style={styles.sectionText}>{breed.lifespan}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.sectionText}>{breed.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 24,
  },
});
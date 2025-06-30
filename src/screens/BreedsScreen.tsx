import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { catBreeds, CatBreed } from '../data/catBreeds';
import { RootStackParamList } from '../types/navigation';

type BreedsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BreedsList'>;

interface Props {
  navigation: BreedsScreenNavigationProp;
}

export default function BreedsScreen({ navigation }: Props) {
  const renderBreed = ({ item }: { item: CatBreed }) => (
    <TouchableOpacity 
      style={styles.breedCard}
      onPress={() => navigation.navigate('BreedDetail', { breed: item })}
    >
      <Text style={styles.emoji}>{item.image}</Text>
      <View style={styles.breedInfo}>
        <Text style={styles.breedName}>{item.name}</Text>
        <Text style={styles.breedOrigin}>Origin: {item.origin}</Text>
        <Text style={styles.breedTemperament}>{item.temperament}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cat Breeds</Text>
      <FlatList
        data={catBreeds}
        renderItem={renderBreed}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  breedCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 40,
    marginRight: 16,
  },
  breedInfo: {
    flex: 1,
  },
  breedName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  breedOrigin: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  breedTemperament: {
    fontSize: 14,
    color: '#3498db',
    fontStyle: 'italic',
  },
});
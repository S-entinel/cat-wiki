import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';

export type SortOption = 'name' | 'origin' | 'lifespan' | 'temperament';

interface SortOptionItem {
  label: string;
  value: SortOption;
  icon: string;
}

interface SortDropdownProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: SortOptionItem[] = [
  { label: 'Name (A-Z)', value: 'name', icon: '🔤' },
  { label: 'Origin', value: 'origin', icon: '🌍' },
  { label: 'Lifespan', value: 'lifespan', icon: '⏰' },
  { label: 'Temperament', value: 'temperament', icon: '😸' },
];

export const SortDropdown: React.FC<SortDropdownProps> = ({
  selectedSort,
  onSortChange
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = sortOptions.find(option => option.value === selectedSort);

  const handleSelect = (value: SortOption) => {
    onSortChange(value);
    setIsVisible(false);
  };

  const renderOption = ({ item }: { item: SortOptionItem }) => (
    <TouchableOpacity 
      style={[
        styles.optionItem,
        item.value === selectedSort && styles.selectedOption
      ]}
      onPress={() => handleSelect(item.value)}
    >
      <View style={styles.optionContent}>
        <Text style={styles.optionIcon}>{item.icon}</Text>
        <Text style={[
          styles.optionText,
          item.value === selectedSort && styles.selectedOptionText
        ]}>
          {item.label}
        </Text>
      </View>
      {item.value === selectedSort && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.sortButton}
        onPress={() => setIsVisible(true)}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.sortIcon}>⇅</Text>
          <Text style={styles.sortText}>Sort</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort Breeds By</Text>
            <FlatList
              data={sortOptions}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
  },
  sortButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortIcon: {
    fontSize: 16,
    color: '#7f8c8d',
    marginRight: 4,
  },
  sortText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area padding
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    padding: 16,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  selectedOptionText: {
    color: '#3498db',
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: 'bold',
  },
});
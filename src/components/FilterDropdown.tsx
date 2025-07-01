import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  title: string;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  title,
  options,
  selectedValue,
  onSelect,
  placeholder = "All"
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find(option => option.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsVisible(false);
  };

  const renderOption = ({ item }: { item: FilterOption }) => (
    <TouchableOpacity 
      style={[
        styles.optionItem,
        item.value === selectedValue && styles.selectedOption
      ]}
      onPress={() => handleSelect(item.value)}
    >
      <Text style={[
        styles.optionText,
        item.value === selectedValue && styles.selectedOptionText
      ]}>
        {item.label}
      </Text>
      {item.value === selectedValue && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.dropdown}
        onPress={() => setIsVisible(true)}
      >
        <View>
          <Text style={styles.dropdownTitle}>{title}</Text>
          <Text style={[
            styles.dropdownText,
            selectedValue && styles.dropdownTextSelected
          ]}>
            {displayText}
          </Text>
        </View>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            <FlatList
              data={[{ label: placeholder, value: '' }, ...options]}
              renderItem={renderOption}
              keyExtractor={(item) => item.value || 'all'}
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
    flex: 1,
    marginHorizontal: 4,
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownTitle: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  dropdownText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  dropdownTextSelected: {
    color: '#2c3e50',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 20,
    maxHeight: '60%',
    minWidth: '70%',
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
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
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
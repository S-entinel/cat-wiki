
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  StyleSheet,
  ViewStyle 
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

export type SortOption = 'name' | 'origin' | 'lifespan' | 'temperament';

interface SortDropdownProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  style?: ViewStyle; // Added this prop
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  selectedSort,
  onSortChange,
  style, // Added this prop
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Name', value: 'name' },
    { label: 'Origin', value: 'origin' },
    { label: 'Lifespan', value: 'lifespan' },
    { label: 'Temperament', value: 'temperament' },
  ];

  const handleSelect = (sort: SortOption) => {
    onSortChange(sort);
    setIsVisible(false);
  };

  const selectedOption = sortOptions.find(option => option.value === selectedSort);
  const displayText = selectedOption ? selectedOption.label : 'Sort';

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.sortLabel}>↕️ Sort</Text>
        <Text style={styles.dropdownText}>{displayText}</Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort by</Text>
            <FlatList
              data={sortOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === selectedSort && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={[
                    styles.optionText,
                    item.value === selectedSort && styles.selectedOptionText
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // No default margin - let parent control spacing
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 44,
    ...Shadows.xs,
  },
  sortLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  dropdownText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },
  arrow: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    margin: Spacing.xl,
    maxHeight: 250,
    minWidth: 180,
    ...Shadows.lg,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  option: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedOption: {
    backgroundColor: Colors.primarySoft,
  },
  optionText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
});
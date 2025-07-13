// src/components/SortDropdown.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

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
      activeOpacity={0.7}
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
        <View style={styles.checkmarkContainer}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.sortButton}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort Breeds By</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={sortOptions}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: Spacing.sm,
  },
  sortButton: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sortIcon: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
  },
  sortText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.bold,
  },
  optionsList: {
    paddingBottom: Spacing.xl,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
  },
  selectedOption: {
    backgroundColor: `${Colors.primary}10`,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: Typography.fontSize.lg,
    marginRight: Spacing.md,
  },
  optionText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textInverse,
    fontWeight: Typography.fontWeight.bold,
  },
});
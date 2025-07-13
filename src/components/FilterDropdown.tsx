// src/components/FilterDropdown.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

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
  const hasSelection = !!selectedValue;

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
      activeOpacity={0.7}
    >
      <Text style={[
        styles.optionText,
        item.value === selectedValue && styles.selectedOptionText
      ]}>
        {item.label}
      </Text>
      {item.value === selectedValue && (
        <View style={styles.checkmarkContainer}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.dropdown, hasSelection && styles.dropdownSelected]}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.dropdownContent}>
          <Text style={styles.dropdownTitle}>{title}</Text>
          <Text style={[
            styles.dropdownText,
            hasSelection && styles.dropdownTextSelected
          ]}>
            {displayText}
          </Text>
        </View>
        <Text style={[styles.arrow, hasSelection && styles.arrowSelected]}>▼</Text>
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={[{ label: placeholder, value: '' }, ...options]}
              renderItem={renderOption}
              keyExtractor={(item) => item.value || 'all'}
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
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  dropdown: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  dropdownSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}05`,
  },
  dropdownContent: {
    flex: 1,
  },
  dropdownTitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 2,
  },
  dropdownText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
    fontWeight: Typography.fontWeight.normal,
  },
  dropdownTextSelected: {
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  arrow: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginLeft: Spacing.sm,
  },
  arrowSelected: {
    color: Colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    maxHeight: '70%',
    width: '100%',
    ...Shadows.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
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
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
  },
  selectedOption: {
    backgroundColor: `${Colors.primary}10`,
  },
  optionText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    flex: 1,
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
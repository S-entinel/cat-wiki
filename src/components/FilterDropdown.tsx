
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet,
  ViewStyle,
  Animated,
  ScrollView,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { height: screenHeight } = Dimensions.get('window');

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterCategory {
  id: string;
  title: string;
  options: FilterOption[];
  selectedValue: string;
  multiSelect?: boolean;
  selectedValues?: string[];
}

interface FilterDropdownProps {
  categories: FilterCategory[];
  onApplyFilters: (filters: { [categoryId: string]: string | string[] }) => void;
  onResetFilters: () => void;
  style?: ViewStyle;
  activeFiltersCount?: number;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  categories,
  onApplyFilters,
  onResetFilters,
  style,
  activeFiltersCount = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempFilters, setTempFilters] = useState<{ [categoryId: string]: string | string[] }>(() => {
    // Initialize state with current filter values
    return categories.reduce((acc, category) => {
      acc[category.id] = category.multiSelect 
        ? category.selectedValues || [] 
        : category.selectedValue;
      return acc;
    }, {} as { [categoryId: string]: string | string[] });
  });
  const [slideAnim] = useState(new Animated.Value(screenHeight));
  const isAnimating = useRef(false);

  const showModal = () => {
    if (isAnimating.current) return;
    
    // Sync tempFilters with current category values when opening modal
    setTempFilters(categories.reduce((acc, category) => {
      acc[category.id] = category.multiSelect 
        ? category.selectedValues || [] 
        : category.selectedValue;
      return acc;
    }, {} as { [categoryId: string]: string | string[] }));
    
    setIsVisible(true);
    isAnimating.current = true;
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8
    }).start(() => {
      isAnimating.current = false;
    });
  };

  const hideModal = () => {
    if (isAnimating.current) return;
    
    isAnimating.current = true;
    Animated.spring(slideAnim, {
      toValue: screenHeight,
      useNativeDriver: true,
      tension: 100,
      friction: 8
    }).start(() => {
      isAnimating.current = false;
      // Use setTimeout to avoid state updates during insertion effects
      setTimeout(() => {
        setIsVisible(false);
      }, 0);
    });
  };

  const handleCategorySelect = (categoryId: string, value: string, multiSelect?: boolean) => {
    setTempFilters(prev => {
      if (multiSelect) {
        const currentValues = (prev[categoryId] as string[]) || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        return { ...prev, [categoryId]: newValues };
      } else {
        return { ...prev, [categoryId]: prev[categoryId] === value ? '' : value };
      }
    });
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
    hideModal();
  };

  const handleReset = () => {
    const resetFilters = categories.reduce((acc, category) => {
      acc[category.id] = category.multiSelect ? [] : '';
      return acc;
    }, {} as { [categoryId: string]: string | string[] });
    
    setTempFilters(resetFilters);
    onResetFilters();
    hideModal();
  };

  const getActiveFiltersText = () => {
    if (activeFiltersCount === 0) return 'Filters';
    return `Filters (${activeFiltersCount})`;
  };

  const renderCategory = (category: FilterCategory) => {
    const currentValue = tempFilters[category.id];
    const isMultiSelect = category.multiSelect;
    
    return (
      <View key={category.id} style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{category.title}</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.optionsScrollView}
          contentContainerStyle={styles.optionsContainer}
        >
          {category.options.map((option) => {
            const isSelected = isMultiSelect 
              ? (currentValue as string[] || []).includes(option.value)
              : currentValue === option.value;
            
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionChip,
                  isSelected && styles.selectedChip
                ]}
                onPress={() => handleCategorySelect(category.id, option.value, isMultiSelect)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.optionChipText,
                  isSelected && styles.selectedChipText
                ]}>
                  {option.label}
                  {option.count !== undefined && ` (${option.count})`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.filterTrigger,
          activeFiltersCount > 0 && styles.filterTriggerActive
        ]}
        onPress={showModal}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.filterTriggerText,
          activeFiltersCount > 0 && styles.filterTriggerTextActive
        ]}>
          {getActiveFiltersText()}
        </Text>
        <View style={[
          styles.filterIcon,
          activeFiltersCount > 0 && styles.filterIconActive
        ]}>
          <Text style={[
            styles.filterIconText,
            activeFiltersCount > 0 && styles.filterIconTextActive
          ]}>⚙</Text>
        </View>
        {activeFiltersCount > 0 && (
          <View style={styles.activeIndicator} />
        )}
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="none"
        onRequestClose={hideModal}
        statusBarTranslucent
      >
        <BlurView intensity={20} style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalSafeArea}>
            <Animated.View 
              style={[
                styles.modalContent,
                {
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              {/* Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Filter Breeds</Text>
                <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>

              {/* Handle Bar */}
              <View style={styles.handleBar} />

              {/* Content */}
              <ScrollView 
                style={styles.modalScrollView}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <View style={styles.categoriesContainer}>
                  {categories.map(renderCategory)}
                </View>
              </ScrollView>

              {/* Footer Actions */}
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.applyButton}
                  onPress={handleApply}
                  activeOpacity={0.8}
                >
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </SafeAreaView>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
  },
  
  // Filter Trigger Button
  filterTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 44,
    ...Shadows.sm,
  },
  filterTriggerActive: {
    backgroundColor: Colors.primarySoft,
    borderColor: Colors.primary,
  },
  filterTriggerText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginRight: Spacing.xs,
  },
  filterTriggerTextActive: {
    color: Colors.primary,
  },
  filterIcon: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIconActive: {
    backgroundColor: Colors.primary,
  },
  filterIconText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  filterIconTextActive: {
    color: Colors.surface,
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSafeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    maxHeight: screenHeight * 0.85,
    minHeight: screenHeight * 0.5,
    ...Shadows.xl,
  },
  
  // Modal Header
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
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
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  resetButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  resetButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  // Handle Bar
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  
  // Modal Content
  modalScrollView: {
    flex: 1,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  
  // Category Styles
  categoryContainer: {
    marginBottom: Spacing.xl,
  },
  categoryTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  optionsScrollView: {
    marginHorizontal: -Spacing.xl,
  },
  optionsContainer: {
    paddingHorizontal: Spacing.xl,
  },
  
  // Option Chip Styles
  optionChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.md,
    marginBottom: Spacing.sm,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionChipText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  selectedChipText: {
    color: Colors.surface,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  // Modal Footer
  modalFooter: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  applyButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.surface,
  },
});
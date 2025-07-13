// src/screens/HomeScreen.tsx
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { RootTabParamList } from '../types/navigation';

const { width: screenWidth } = Dimensions.get('window');

type HomeScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleExploreBreedsPress = () => {
    navigation.navigate('Breeds');
  };

  const handleViewFavoritesPress = () => {
    navigation.navigate('Favorites');
  };

  const features = [
    {
      icon: '🔍',
      title: 'Discover Breeds',
      description: 'Browse through hundreds of cat breeds with detailed information',
      color: Colors.primary,
    },
    {
      icon: '❤️',
      title: 'Save Favorites',
      description: 'Keep track of your favorite breeds for quick access',
      color: Colors.secondary,
    },
    {
      icon: '📊',
      title: 'Compare Cats',
      description: 'Learn about temperament, care needs, and characteristics',
      color: Colors.accent,
    },
    {
      icon: '🏠',
      title: 'Find Your Match',
      description: 'Discover the perfect cat breed for your lifestyle',
      color: Colors.success,
    },
  ];

  const renderFeatureCard = (feature: typeof features[0], index: number) => (
    <Card key={index} style={styles.featureCard} variant="elevated">
      <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
        <Text style={styles.featureIconText}>{feature.icon}</Text>
      </View>
      <Text style={styles.featureTitle}>{feature.title}</Text>
      <Text style={styles.featureDescription}>{feature.description}</Text>
    </Card>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroGradient}>
          <View style={styles.heroContent}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>Cat Breed Encyclopedia</Text>
              <Text style={styles.heroSubtitle}>
                Discover the perfect feline companion for your lifestyle
              </Text>
              <Text style={styles.heroDescription}>
                Explore comprehensive information about cat breeds, their characteristics, 
                care requirements, and more.
              </Text>
            </View>
            <View style={styles.heroImageContainer}>
              <Text style={styles.heroEmoji}>🐱</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <Button
            title="Explore Breeds"
            onPress={handleExploreBreedsPress}
            variant="primary"
            size="lg"
            leftIcon={<Text style={styles.buttonIcon}>🔍</Text>}
            style={styles.primaryAction}
          />
          <Button
            title="View Favorites"
            onPress={handleViewFavoritesPress}
            variant="outline"
            size="lg"
            leftIcon={<Text style={styles.buttonIcon}>❤️</Text>}
            style={styles.secondaryAction}
          />
        </View>
      </View>

      {/* Features Grid */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Use Our App?</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => renderFeatureCard(feature, index))}
        </View>
      </View>

      {/* Stats Section */}
      <Card style={styles.statsCard} variant="elevated">
        <Text style={styles.statsTitle}>Comprehensive Database</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>100+</Text>
            <Text style={styles.statLabel}>Cat Breeds</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>TICA</Text>
            <Text style={styles.statLabel}>Certified</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>Daily</Text>
            <Text style={styles.statLabel}>Updates</Text>
          </View>
        </View>
      </Card>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Hero Section
  heroSection: {
    marginBottom: Spacing.xl,
  },
  heroGradient: {
    backgroundColor: Colors.primary,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: Spacing.lg,
  },
  heroTitle: {
    fontSize: Typography.fontSize.xxxxl,
    fontWeight: Typography.fontWeight.extrabold,
    color: Colors.textInverse,
    marginBottom: Spacing.sm,
    lineHeight: Typography.fontSize.xxxxl * Typography.lineHeight.tight,
  },
  heroSubtitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textInverse,
    marginBottom: Spacing.md,
    opacity: 0.9,
  },
  heroDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textInverse,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    opacity: 0.8,
  },
  heroImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  
  // Quick Actions
  quickActionsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  quickActionsContainer: {
    gap: Spacing.md,
  },
  primaryAction: {
    marginBottom: Spacing.sm,
  },
  secondaryAction: {
    marginBottom: Spacing.sm,
  },
  buttonIcon: {
    fontSize: Typography.fontSize.lg,
  },
  
  // Features
  featuresSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  featureCard: {
    width: (screenWidth - Spacing.lg * 2 - Spacing.md) / 2,
    alignItems: 'center',
    padding: Spacing.lg,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  featureIconText: {
    fontSize: Typography.fontSize.xxl,
  },
  featureTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.relaxed,
  },
  
  // Stats
  statsCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  statsTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.extrabold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  
  bottomSpacing: {
    height: Spacing.xl,
  },
});
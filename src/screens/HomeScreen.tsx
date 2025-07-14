import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDatabase } from '../context/DatabaseContext';
import { Card, FeatureCard } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const { breeds, favorites } = useDatabase();
  const insets = useSafeAreaInsets();

  const navigateToBreeds = () => {
    // @ts-ignore
    navigation.navigate('Breeds');
  };

  const navigateToFavorites = () => {
    // @ts-ignore
    navigation.navigate('Favorites');
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} translucent />
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={[styles.heroGradient, { paddingTop: insets.top + 20 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>
                Cat Breed{'\n'}Encyclopedia
              </Text>
              <Text style={styles.heroSubtitle}>
                Discover the perfect feline companion for your lifestyle
              </Text>
              <Text style={styles.heroDescription}>
                Explore comprehensive information about cat breeds, their characteristics, care requirements, and more.
              </Text>
            </View>
            
            <View style={styles.heroImageContainer}>
              <Text style={styles.heroEmoji}>🐱</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions Section */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsContainer}>
            <Button
              title="🔍  Explore Breeds"
              onPress={navigateToBreeds}
              variant="primary"
              size="lg"
              fullWidth
              style={styles.primaryAction}
            />
            
            <Button
              title="❤️  View Favorites"
              onPress={navigateToFavorites}
              variant="outline"
              size="lg"
              fullWidth
              style={styles.secondaryAction}
            />
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Use Our App?</Text>
          
          <View style={styles.featuresGrid}>
            <FeatureCard
              icon={<Text style={styles.featureIcon}>🔍</Text>}
              title="Discover Breeds"
              description="Browse through hundreds of cat breeds with detailed information"
              variant="primary"
              style={styles.featureCardItem}
            />
            
            <FeatureCard
              icon={<Text style={styles.featureIcon}>❤️</Text>}
              title="Save Favorites"
              description="Keep track of your favorite breeds for quick access"
              variant="secondary"
              style={styles.featureCardItem}
            />
            
            <FeatureCard
              icon={<Text style={styles.featureIcon}>📊</Text>}
              title="Compare Cats"
              description="Learn about temperament, care needs, and characteristics"
              variant="accent"
              style={styles.featureCardItem}
            />
            
            <FeatureCard
              icon={<Text style={styles.featureIcon}>🏠</Text>}
              title="Find Your Match"
              description="Discover the perfect cat breed for your lifestyle"
              variant="neutral"
              style={styles.featureCardItem}
            />
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Card style={styles.statsCard} variant="elevated" shadow="md">
            <Text style={styles.statsTitle}>Database Stats</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{breeds.length}</Text>
                <Text style={styles.statLabel}>Total Breeds</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{favorites.length}</Text>
                <Text style={styles.statLabel}>Your Favorites</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>Daily</Text>
                <Text style={styles.statLabel}>Updates</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  
  // Hero Section
  heroGradient: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 200,
  },
  heroTextContainer: {
    flex: 1,
    marginRight: Spacing.lg,
  },
  heroTitle: {
    fontSize: Platform.OS === 'ios' ? 34 : 32,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textInverse,
    marginBottom: Spacing.md,
    lineHeight: Platform.OS === 'ios' ? 40 : 38,
  },
  heroSubtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textInverse,
    opacity: 0.9,
    marginBottom: Spacing.md,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.fontSize.lg * 1.3,
  },
  heroDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textInverse,
    opacity: 0.8,
    lineHeight: Typography.fontSize.base * 1.4,
    fontWeight: Typography.fontWeight.normal,
  },
  heroImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 80,
  },
  
  // Quick Actions
  quickActionsSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  quickActionsContainer: {
    gap: Spacing.md,
  },
  primaryAction: {
    backgroundColor: Colors.primary,
    marginBottom: 0,
  },
  secondaryAction: {
    borderColor: Colors.primary,
    marginBottom: 0,
  },
  
  // Features Section
  featuresSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  featureCardItem: {
    width: (screenWidth - (Spacing.lg * 2) - Spacing.md) / 2,
    marginHorizontal: 0,
    marginBottom: Spacing.md,
  },
  featureIcon: {
    fontSize: 24,
  },
  
  // Stats Section
  statsSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  statsCard: {
    padding: Spacing.lg,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  statsTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
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
    fontWeight: Typography.fontWeight.black,
    color: Colors.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
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
    opacity: 0.5,
    marginHorizontal: Spacing.sm,
  },
});
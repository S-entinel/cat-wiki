
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useDatabase } from '../context/DatabaseContext';
import { Card, FeatureCard } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Colors, Typography, Spacing, BorderRadius, Layout, responsive } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const { breeds, favorites } = useDatabase();

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
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.heroGradient}
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

        {/* Bottom Spacing for Tab Navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Hero Section
  heroGradient: {
    paddingTop: responsive.getValue(Spacing.xxxl + 20, Spacing.xxxl + 40),
    paddingBottom: responsive.getValue(Spacing.xxxl, Spacing.xxxl + 10),
    paddingHorizontal: Layout.content.paddingHorizontal,
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
    fontSize: responsive.fontSize(Typography.fontSize.xxxxl, 0.15),
    fontWeight: Typography.fontWeight.black,
    color: Colors.textInverse,
    marginBottom: Spacing.md,
    lineHeight: Typography.fontSize.xxxxl * Typography.lineHeight.tight,
  },
  
  heroSubtitle: {
    fontSize: responsive.fontSize(Typography.fontSize.lg, 0.1),
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textInverse,
    marginBottom: Spacing.md,
    opacity: 0.95,
    lineHeight: Typography.fontSize.lg * Typography.lineHeight.normal,
  },
  
  heroDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textInverse,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    opacity: 0.85,
  },
  
  heroImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  heroEmoji: {
    fontSize: responsive.getValue(64, 80),
    textAlign: 'center',
  },
  
  // Sections
  quickActionsSection: {
    paddingHorizontal: Layout.content.paddingHorizontal,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
  },
  
  featuresSection: {
    paddingHorizontal: Layout.content.paddingHorizontal,
    paddingBottom: Spacing.xxxl,
  },
  
  sectionTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xl,
    textAlign: 'left',
  },
  
  // Quick Actions
  quickActionsContainer: {
    gap: Spacing.md,
  },
  
  primaryAction: {
    marginBottom: Spacing.sm,
  },
  
  secondaryAction: {
    marginBottom: 0,
  },
  
  // Features Grid
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  
  featureCardItem: {
    width: (screenWidth - (Layout.content.paddingHorizontal * 2) - Spacing.md) / 2,
    marginHorizontal: 0,
  },
  
  featureIcon: {
    fontSize: Typography.fontSize.xxxl,
  },
  
  // Stats Section
  statsCard: {
    marginHorizontal: Layout.content.paddingHorizontal,
    marginBottom: Spacing.xxxl,
    padding: Spacing.xl,
  },
  
  statsTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xl,
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
  },
  
  bottomSpacing: {
    height: Layout.tabBar.heightSafe,
  },
});
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
                Nyandex
              </Text>
              <Text style={styles.heroSubtitle}>
                Your feline companion finder
              </Text>
              <Text style={styles.heroDescription}>
                Discover adorable cat breeds with detailed information about their personalities and care.
              </Text>
            </View>
            
            <View style={styles.heroImageContainer}>
              <View style={styles.heroEmojiContainer}>
                <Text style={styles.heroEmoji}>🐱</Text>
                <View style={styles.sparkles}>
                  <Text style={[styles.sparkle, { top: 5, right: 10 }]}>✨</Text>
                  <Text style={[styles.sparkle, { top: 15, right: 25 }]}>✨</Text>
                  <Text style={[styles.sparkle, { top: 0, right: 20 }]}>✨</Text>
                </View>
              </View>
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
          <Text style={styles.sectionTitle}>Features</Text>
          
          <View style={styles.featuresGrid}>
            <FeatureCard
              icon={<Text style={styles.featureIcon}>🔍</Text>}
              title="Discover"
              description="Browse cat breeds"
              variant="primary"
              style={styles.featureCardItem}
            />
            
            <FeatureCard
              icon={<Text style={styles.featureIcon}>❤️</Text>}
              title="Favorites"
              description="Save your picks"
              variant="secondary"
              style={styles.featureCardItem}
            />
            
            <FeatureCard
              icon={<Text style={styles.featureIcon}>📊</Text>}
              title="Compare"
              description="Learn traits"
              variant="accent"
              style={styles.featureCardItem}
            />
            
            <FeatureCard
              icon={<Text style={styles.featureIcon}>🎯</Text>}
              title="Match"
              description="Find your perfect cat"
              variant="neutral"
              style={styles.featureCardItem}
            />
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Card style={styles.statsCard} variant="elevated" shadow="md">
            <Text style={styles.statsTitle}>Collection</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: Colors.coralSoft }]}>
                  <Text style={styles.statIcon}>🐾</Text>
                </View>
                <Text style={styles.statNumber}>{breeds.length}</Text>
                <Text style={styles.statLabel}>Breeds</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: Colors.lavenderSoft }]}>
                  <Text style={styles.statIcon}>💖</Text>
                </View>
                <Text style={styles.statNumber}>{favorites.length}</Text>
                <Text style={styles.statLabel}>Favorites</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: Colors.mintSoft }]}>
                  <Text style={styles.statIcon}>🌟</Text>
                </View>
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
  
  heroGradient: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    borderBottomLeftRadius: BorderRadius.xxxl,
    borderBottomRightRadius: BorderRadius.xxxl,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 180,
  },
  heroTextContainer: {
    flex: 1,
    marginRight: Spacing.lg,
  },
  heroTitle: {
    fontSize: Platform.OS === 'ios' ? 38 : 36,
    fontWeight: Typography.fontWeight.black,
    color: Colors.textInverse,
    marginBottom: Spacing.sm,
    lineHeight: Platform.OS === 'ios' ? 44 : 42,
  },
  heroSubtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textInverse,
    opacity: 0.95,
    marginBottom: Spacing.md,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.fontSize.lg * 1.2,
  },
  heroDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textInverse,
    opacity: 0.85,
    lineHeight: Typography.fontSize.base * 1.3,
    fontWeight: Typography.fontWeight.normal,
  },
  heroImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroEmojiContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 56,
  },
  sparkles: {
    position: 'absolute',
    width: 60,
    height: 60,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 10,
    color: Colors.textInverse,
    opacity: 0.9,
  },
  
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
    textAlign: 'center',
  },
  quickActionsContainer: {
    gap: Spacing.md,
  },
  primaryAction: {
    backgroundColor: Colors.primary,
    marginBottom: 0,
    borderRadius: BorderRadius.xl,
  },
  secondaryAction: {
    borderColor: Colors.primary,
    marginBottom: 0,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
  },
  
  featuresSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  featureCardItem: {
    width: (screenWidth - (Spacing.lg * 2) - Spacing.sm) / 2,
    marginHorizontal: 0,
    marginBottom: Spacing.sm,
    height: 120,
  },
  featureIcon: {
    fontSize: 24,
  },
  
  statsSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  statsCard: {
    padding: Spacing.xl,
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
  },
  statsTitle: {
    fontSize: Typography.fontSize.xl,
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
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statIcon: {
    fontSize: 20,
  },
  statNumber: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
  statDivider: {
    width: 2,
    height: 40,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    marginHorizontal: Spacing.sm,
  },
});
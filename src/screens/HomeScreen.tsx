import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDatabase } from '../context/DatabaseContext';
import { Card, FeatureCard } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const { breeds, favorites } = useDatabase();
  const insets = useSafeAreaInsets();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Staggered entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const navigateToBreeds = () => {
    // @ts-ignore
    navigation.navigate('Breeds');
  };

  const navigateToFavorites = () => {
    // @ts-ignore
    navigation.navigate('Favorites');
  };

  const navigateToQuiz = () => {
    // @ts-ignore
    navigation.navigate('Quiz');
  };

  const FloatingActionButton = ({ icon, onPress, color = Colors.primary }: any) => (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.fabIcon}>{icon}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Enhanced Hero Section */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark, '#1a365d']}
          style={[styles.heroGradient, { paddingTop: insets.top + 30 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View 
            style={[
              styles.heroContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.heroTextContainer}>
              <Text style={styles.appName}>Nyandex</Text>
              <Text style={styles.heroTitle}>
                Find Your Perfect{'\n'}
                <Text style={styles.heroTitleAccent}>Feline Friend</Text>
              </Text>
              <Text style={styles.heroDescription}>
                Discover cat breeds that match your lifestyle with our personality quiz and comprehensive breed database.
              </Text>
            </View>
            
            <Animated.View 
              style={[
                styles.heroVisual,
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              <View style={styles.catContainer}>
                <Text style={styles.heroEmoji}>🐱</Text>
                <View style={styles.floatingElements}>
                  <Text style={[styles.floatingElement, styles.heart1]}>💖</Text>
                  <Text style={[styles.floatingElement, styles.star1]}>⭐</Text>
                  <Text style={[styles.floatingElement, styles.heart2]}>💕</Text>
                </View>
              </View>
            </Animated.View>
          </Animated.View>
        </LinearGradient>

        {/* Quick Actions with Modern Cards */}
        <Animated.View 
          style={[
            styles.quickActionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Start</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={navigateToQuiz}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.actionCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.actionCardIcon}>🧠</Text>
                <Text style={styles.actionCardTitle}>Take Quiz</Text>
                <Text style={styles.actionCardSubtitle}>Find your match</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={navigateToBreeds}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[Colors.secondary, '#e2a857']}
                style={styles.actionCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.actionCardIcon}>🔍</Text>
                <Text style={styles.actionCardTitle}>Explore</Text>
                <Text style={styles.actionCardSubtitle}>Browse breeds</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.favoriteActionCard}
            onPress={navigateToFavorites}
            activeOpacity={0.9}
          >
            <View style={styles.favoriteCardContent}>
              <View style={styles.favoriteCardLeft}>
                <Text style={styles.favoriteCardIcon}>❤️</Text>
                <View>
                  <Text style={styles.favoriteCardTitle}>My Favorites</Text>
                  <Text style={styles.favoriteCardCount}>
                    {favorites.length} saved breed{favorites.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
              <Text style={styles.favoriteCardArrow}>→</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Enhanced Stats Section */}
        <Animated.View 
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Card style={styles.statsCard} shadow="lg">
            <Text style={styles.statsTitle}>Your Collection</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: Colors.mintSoft }]}>
                  <Text style={styles.statIcon}>🐾</Text>
                </View>
                <Text style={styles.statNumber}>{breeds.length}</Text>
                <Text style={styles.statLabel}>Total Breeds</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: Colors.coralSoft }]}>
                  <Text style={styles.statIcon}>💖</Text>
                </View>
                <Text style={styles.statNumber}>{favorites.length}</Text>
                <Text style={styles.statLabel}>Favorites</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: Colors.skySoft }]}>
                  <Text style={styles.statIcon}>🌟</Text>
                </View>
                <Text style={styles.statNumber}>New</Text>
                <Text style={styles.statLabel}>Features</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Features Grid with Better Mobile Layout */}
        <Animated.View 
          style={[
            styles.featuresSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Discover Features</Text>
          
          <View style={styles.featuresGrid}>
            <FeatureCard
              icon={<Text style={styles.featureIcon}>📊</Text>}
              title="Compare Breeds"
              description="Side-by-side comparisons"
              variant="primary"
              style={styles.featureCardItem}
            />
            
            <FeatureCard
              icon={<Text style={styles.featureIcon}>📚</Text>}
              title="Learn More"
              description="Detailed breed guides"
              variant="secondary"
              style={styles.featureCardItem}
            />
            
            <FeatureCard
              icon={<Text style={styles.featureIcon}>🎯</Text>}
              title="Perfect Match"
              description="AI-powered recommendations"
              variant="accent"
              style={styles.featureCardItem}
            />
            
            <FeatureCard
              icon={<Text style={styles.featureIcon}>📱</Text>}
              title="Mobile First"
              description="Optimized experience"
              variant="neutral"
              style={styles.featureCardItem}
            />
          </View>
        </Animated.View>
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <FloatingActionButton 
          icon="🧠" 
          onPress={navigateToQuiz}
          color={Colors.accent}
        />
      </View>
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
  
  // Enhanced Hero Section
  heroGradient: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    borderBottomLeftRadius: BorderRadius.xxxl,
    borderBottomRightRadius: BorderRadius.xxxl,
    minHeight: screenHeight * 0.5,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 220,
  },
  heroTextContainer: {
    flex: 1,
    marginRight: Spacing.lg,
  },
  appName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textInverse,
    opacity: 0.8,
    marginBottom: Spacing.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: Platform.OS === 'ios' ? 34 : 32,
    fontWeight: Typography.fontWeight.black,
    color: Colors.textInverse,
    marginBottom: Spacing.lg,
    lineHeight: Platform.OS === 'ios' ? 40 : 38,
  },
  heroTitleAccent: {
    color: Colors.accent,
  },
  heroDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textInverse,
    opacity: 0.9,
    lineHeight: Typography.fontSize.base * 1.5,
    fontWeight: Typography.fontWeight.normal,
  },
  heroVisual: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  catContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  heroEmoji: {
    fontSize: 64,
    textAlign: 'center',
  },
  floatingElements: {
    position: 'absolute',
    width: 120,
    height: 120,
    top: -10,
    left: -10,
  },
  floatingElement: {
    position: 'absolute',
    fontSize: 16,
  },
  heart1: {
    top: 5,
    right: 15,
    fontSize: 14,
  },
  star1: {
    top: 25,
    right: 5,
    fontSize: 12,
  },
  heart2: {
    top: 15,
    left: 10,
    fontSize: 10,
  },
  
  // Modern Quick Actions
  quickActionsSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionCard: {
    flex: 1,
    height: 120,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  actionCardGradient: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCardIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  actionCardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textInverse,
    marginBottom: Spacing.xs,
  },
  actionCardSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textInverse,
    opacity: 0.9,
  },
  
  favoriteActionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  favoriteCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  favoriteCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  favoriteCardIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  favoriteCardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  favoriteCardCount: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  favoriteCardArrow: {
    fontSize: Typography.fontSize.xl,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
  },
  
  // Enhanced Stats
  statsSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  statsCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xxl,
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
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  statIcon: {
    fontSize: 24,
  },
  statNumber: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
  statDivider: {
    width: 2,
    height: 50,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    marginHorizontal: Spacing.sm,
  },
  
  // Enhanced Features
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
    height: 140,
    marginBottom: Spacing.md,
  },
  featureIcon: {
    fontSize: 28,
  },
  
  // Floating Action Button
  fabContainer: {
    position: 'absolute',
    bottom: 100, 
    right: Spacing.lg,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.xl,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: Colors.textInverse,
  },
});
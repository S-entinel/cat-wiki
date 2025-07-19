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

  // Enhanced Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animation with smoother timing
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Floating animation for decorative elements
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatingAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(floatingAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ),
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
    <Animated.View style={[
      styles.fabContainer,
      {
        transform: [{
          scale: scaleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          })
        }]
      }
    ]}>
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: color }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.fabIcon}>{icon}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Enhanced Hero Section */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark, Colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroGradient, { paddingTop: insets.top + 20 }]}
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
              <Animated.Text 
                style={[
                  styles.appName,
                  {
                    opacity: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.8],
                    })
                  }
                ]}
              >
                Purrfect Companion
              </Animated.Text>
              
              <Animated.View style={{
                transform: [{ scale: scaleAnim }]
              }}>
                <Text style={styles.heroTitle}>
                  Find Your{'\n'}
                  <Text style={styles.heroTitleAccent}>Purrfect Match</Text>
                </Text>
              </Animated.View>
              
              <Animated.Text 
                style={[
                  styles.heroDescription,
                  {
                    opacity: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.9],
                    })
                  }
                ]}
              >
                Explore feline breeds, discover your personality match, and find the cat that's meant to be your companion
              </Animated.Text>
            </View>

            {/* Enhanced Hero Visual */}
            <Animated.View 
              style={[
                styles.heroVisual,
                {
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <View style={styles.catContainer}>
                <Text style={styles.heroEmoji}>🐱</Text>
                
                {/* Simplified Floating Elements */}
                <Animated.View 
                  style={[
                    styles.floatingElements,
                    {
                      transform: [{
                        translateY: floatingAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -8],
                        })
                      }]
                    }
                  ]}
                >
                  <Animated.Text 
                    style={[
                      styles.floatingElement,
                      styles.heart1,
                      {
                        opacity: floatingAnim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0.6, 1, 0.6],
                        })
                      }
                    ]}
                  >
                    💝
                  </Animated.Text>
                  <Animated.Text 
                    style={[
                      styles.floatingElement,
                      styles.star1,
                      {
                        opacity: floatingAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 0.4],
                        })
                      }
                    ]}
                  >
                    🐾
                  </Animated.Text>
                </Animated.View>
              </View>
            </Animated.View>
          </Animated.View>
        </LinearGradient>

        {/* Enhanced Quick Actions Section */}
        <Animated.View 
          style={[
            styles.quickActionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={navigateToBreeds}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.actionCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.actionCardTitle}>Explore Breeds</Text>
                <Text style={styles.actionCardSubtitle}>Browse all cat breeds</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={navigateToQuiz}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.accent, Colors.secondary]}
                style={styles.actionCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.actionCardTitle}>Find Your Match</Text>
                <Text style={styles.actionCardSubtitle}>Take personality quiz</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Enhanced Favorites Action Card */}
          <TouchableOpacity 
            style={styles.favoriteActionCard}
            onPress={navigateToFavorites}
            activeOpacity={0.8}
          >
            <View style={styles.favoriteCardContent}>
              <View style={styles.favoriteCardLeft}>
                <Text style={styles.favoriteCardIcon}>♥</Text>
                <View>
                  <Text style={styles.favoriteCardTitle}>Your Favorites</Text>
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
            <Text style={styles.statsTitle}>Your Cat Journey</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: Colors.mintSoft }]}>
                  <Text style={styles.statIcon}>♦</Text>
                </View>
                <Text style={styles.statNumber}>{breeds.length}</Text>
                <Text style={styles.statLabel}>Cat Breeds</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: Colors.coralSoft }]}>
                  <Text style={styles.statIcon}>♥</Text>
                </View>
                <Text style={styles.statNumber}>{favorites.length}</Text>
                <Text style={styles.statLabel}>Favorites</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: Colors.skySoft }]}>
                  <Text style={styles.statIcon}>♠</Text>
                </View>
                <Text style={styles.statNumber}>Quiz</Text>
                <Text style={styles.statLabel}>Ready</Text>
              </View>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>

      {/* Enhanced Floating Action Button */}
      <FloatingActionButton 
        icon="Quiz" 
        onPress={navigateToQuiz}
        color={Colors.accent}
      />
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
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl * 1.5,
    borderBottomLeftRadius: BorderRadius.xxxl,
    borderBottomRightRadius: BorderRadius.xxxl,
    minHeight: screenHeight * 0.52,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 240,
    paddingVertical: Spacing.xl,
  },
  heroTextContainer: {
    flex: 1,
    marginRight: Spacing.xl,
  },
  appName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textInverse,
    opacity: 0.85,
    marginBottom: Spacing.sm,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: Platform.OS === 'ios' ? 36 : 34,
    fontWeight: Typography.fontWeight.black,
    color: Colors.textInverse,
    marginBottom: Spacing.xl,
    lineHeight: Platform.OS === 'ios' ? 42 : 40,
  },
  heroTitleAccent: {
    color: Colors.accent,
  },
  heroDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textInverse,
    opacity: 0.9,
    lineHeight: Typography.fontSize.base * 1.6,
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
    width: 110,
    height: 110,
  },
  heroEmoji: {
    fontSize: 68,
    textAlign: 'center',
  },
  floatingElements: {
    position: 'absolute',
    width: 130,
    height: 130,
    top: -15,
    left: -15,
  },
  floatingElement: {
    position: 'absolute',
    fontSize: 18,
  },
  heart1: {
    top: 8,
    right: 18,
    fontSize: 16,
  },
  star1: {
    top: 30,
    right: 8,
    fontSize: 14,
  },
  
  // Enhanced Quick Actions
  quickActionsSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  actionCard: {
    flex: 1,
    height: 130,
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
  actionCardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textInverse,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  actionCardSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textInverse,
    opacity: 0.9,
    textAlign: 'center',
  },
  
  favoriteActionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
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
    fontSize: 28,
    marginRight: Spacing.lg,
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
    paddingHorizontal: Spacing.xl,
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
    marginBottom: Spacing.xl,
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
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  statIcon: {
    fontSize: 26,
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
    height: 55,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    marginHorizontal: Spacing.sm,
  },
  
  // Enhanced Features
  featuresSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.lg,
  },
  featureCardItem: {
    width: (screenWidth - (Spacing.xl * 2) - Spacing.lg) / 2,
    height: 150,
    marginBottom: Spacing.lg,
  },
  featureIcon: {
    fontSize: 30,
  },
  
  // Enhanced Floating Action Button
  fabContainer: {
    position: 'absolute',
    bottom: 100, 
    right: Spacing.xl,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.xl,
    elevation: 12,
  },
  fabIcon: {
    fontSize: 26,
    color: Colors.textInverse,
  },
});
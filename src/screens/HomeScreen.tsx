import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDatabase } from '../context/DatabaseContext';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { breeds, favorites } = useDatabase();
  const insets = useSafeAreaInsets();

  // Minimal animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
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
    ]).start();
  }, []);

  const navigateToBreeds = () => {
    navigation.navigate('Breeds' as never);
  };

  const navigateToFavorites = () => {
    navigation.navigate('Favorites' as never);
  };

  const navigateToQuiz = () => {
    navigation.navigate('Quiz' as never);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Professional Header */}
        <Animated.View 
          style={[
            styles.header,
            { 
              paddingTop: insets.top + 40,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.headerContent}>
            <Text style={styles.appTitle}>Nyandex</Text>
            <Text style={styles.appSubtitle}>Cat Breed Index</Text>
          </View>
          <View style={styles.headerIcon}>
            <Text style={styles.headerSymbol}>◆</Text>
          </View>
        </Animated.View>

        {/* Statistics Section */}
        <Animated.View 
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.statsGrid}>
            <TouchableOpacity 
              style={styles.statCard}
              onPress={navigateToBreeds}
              activeOpacity={0.8}
              accessibilityLabel={`${breeds.length} cat breeds available`}
              accessibilityRole="button"
            >
              <Text style={styles.statNumber}>{breeds.length}</Text>
              <Text style={styles.statLabel}>Breeds</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.statCard}
              onPress={navigateToFavorites}
              activeOpacity={0.8}
              accessibilityLabel={`${favorites.length} favorite breeds saved`}
              accessibilityRole="button"
            >
              <Text style={styles.statNumber}>{favorites.length}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Action Cards */}
        <Animated.View 
          style={[
            styles.actionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={navigateToBreeds}
            activeOpacity={0.7}
            accessibilityLabel="Browse all cat breeds"
            accessibilityRole="button"
          >
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Browse Breeds</Text>
              <Text style={styles.actionSymbol}>→</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={navigateToQuiz}
            activeOpacity={0.7}
            accessibilityLabel="Take personality quiz to find your perfect cat breed"
            accessibilityRole="button"
          >
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Personality Quiz</Text>
              <Text style={styles.actionSymbol}>→</Text>
            </View>
          </TouchableOpacity>

          {favorites.length > 0 && (
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={navigateToFavorites}
              activeOpacity={0.7}
              accessibilityLabel="View your favorite cat breeds"
              accessibilityRole="button"
            >
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Your Favorites</Text>
                <Text style={styles.actionSymbol}>→</Text>
              </View>
            </TouchableOpacity>
          )}
        </Animated.View>
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

  // Professional Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  headerContent: {
    flex: 1,
  },
  appTitle: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: Spacing.xs / 2,
  },
  appSubtitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headerIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.text,
    borderRadius: BorderRadius.sm,
  },
  headerSymbol: {
    fontSize: 16,
    color: Colors.textInverse,
    fontWeight: Typography.fontWeight.bold,
  },

  // Statistics Section
  statsSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Actions Section
  actionsSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  actionCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  actionSymbol: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.normal,
  },
});
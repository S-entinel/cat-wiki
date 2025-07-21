import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { 
  QUIZ_QUESTIONS, 
  calculatePersonalityType, 
  PersonalityScores, 
  QuizQuestion, 
  QuizOption,
  PERSONALITY_PROFILES 
} from '../types/PersonalityQuiz';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PersonalityQuizScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [scores, setScores] = useState<PersonalityScores>({
    energy: 0,
    social: 0,
    routine: 0,
    attention: 0,
    playfulness: 0
  });

  // Enhanced animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;
  const isLastQuestion = currentQuestion === QUIZ_QUESTIONS.length - 1;

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const animateQuestionTransition = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 20,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const option = question.options.find(opt => opt.id === selectedOption);
    if (!option) return;

    // Update scores
    const newScores = {
      energy: scores.energy + option.scores.energy,
      social: scores.social + option.scores.social,
      routine: scores.routine + option.scores.routine,
      attention: scores.attention + option.scores.attention,
      playfulness: scores.playfulness + option.scores.playfulness
    };

    setScores(newScores);
    setAnswers([...answers, selectedOption]);

    if (isLastQuestion) {
      // Calculate final personality type and navigate to results
      const personalityType = calculatePersonalityType(newScores);
      const profile = PERSONALITY_PROFILES[personalityType];
      
      // @ts-ignore
      navigation.navigate('QuizResults', {
        personalityType,
        scores: newScores,
        profile
      });
    } else {
      animateQuestionTransition();
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption('');
      }, 200);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      animateQuestionTransition();
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setSelectedOption(answers[currentQuestion - 1]);
        
        // Recalculate scores by removing the last answer
        const lastAnswer = answers[currentQuestion - 1];
        const lastOption = QUIZ_QUESTIONS[currentQuestion].options.find(opt => opt.id === lastAnswer);
        
        if (lastOption) {
          setScores({
            energy: scores.energy - lastOption.scores.energy,
            social: scores.social - lastOption.scores.social,
            routine: scores.routine - lastOption.scores.routine,
            attention: scores.attention - lastOption.scores.attention,
            playfulness: scores.playfulness - lastOption.scores.playfulness
          });
        }
        
        setAnswers(answers.slice(0, -1));
      }, 200);
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>Find Your Purrfect Match</Text>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
        </Text>
      </View>
      
      <View style={styles.progressBar}>
        <Animated.View style={[
          styles.progressFill,
          {
            width: progressAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            })
          }
        ]}>
          <LinearGradient
            colors={[Colors.primary, Colors.accent]}
            style={styles.progressGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>
      </View>
      
      <View style={styles.progressDots}>
        {QUIZ_QUESTIONS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index <= currentQuestion && styles.progressDotActive
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderOption = (option: QuizOption, index: number) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.optionCard,
        selectedOption === option.id && styles.selectedOption
      ]}
      onPress={() => handleOptionSelect(option.id)}
      activeOpacity={0.8}
    >
      <View style={styles.optionContent}>
        <View style={[
          styles.optionNumber,
          selectedOption === option.id && styles.selectedOptionNumber
        ]}>
          <Text style={[
            styles.optionNumberText,
            selectedOption === option.id && styles.selectedOptionNumberText
          ]}>
            {String.fromCharCode(65 + index)}
          </Text>
        </View>
        <Text style={[
          styles.optionText,
          selectedOption === option.id && styles.selectedOptionText
        ]}>
          {option.text}
        </Text>
        {selectedOption === option.id && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedIndicatorText}>✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Enhanced Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark, Colors.accent]}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <Text style={styles.headerTitle}>Personality Quiz</Text>
        <Text style={styles.headerSubtitle}>Discover your ideal feline companion</Text>
      </LinearGradient>
      
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {renderProgressBar()}
        
        {/* Enhanced Question Card */}
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}>
          <Card style={styles.questionCard} shadow="lg">
            <View style={styles.questionHeader}>
              <Text style={styles.questionCategory}>
                {question.category.charAt(0).toUpperCase() + question.category.slice(1)} Preference
              </Text>
            </View>
            <Text style={styles.questionText}>{question.question}</Text>
          </Card>
        </Animated.View>

        {/* Enhanced Options */}
        <Animated.View 
          style={[
            styles.optionsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {question.options.map((option, index) => renderOption(option, index))}
        </Animated.View>

        {/* Enhanced Button Container */}
        <View style={styles.buttonContainer}>
          {currentQuestion > 0 && (
            <Button
              title="Previous"
              onPress={handleBack}
              variant="outline"
              size="lg"
              style={styles.backButton}
            />
          )}
          
          <Button
            title={isLastQuestion ? "Get My Results" : "Next Question"}
            onPress={handleNext}
            variant="primary"
            size="lg"
            disabled={!selectedOption}
            style={currentQuestion === 0 ? styles.nextButtonFullWidth : styles.nextButton}
          />
        </View>

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
  
  // Enhanced Header
  header: {
    paddingHorizontal: '5%',
    paddingBottom: '8%',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.textInverse,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textInverse,
    opacity: 0.9,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
  
  // Enhanced Progress Section
  progressContainer: {
    paddingHorizontal: '5%',
    paddingVertical: '6%',
    backgroundColor: Colors.background,
  },
  progressHeader: {
    alignItems: 'center',
    marginBottom: '4%',
  },
  progressTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  progressText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: '4%',
    ...Shadows.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  progressGradient: {
    flex: 1,
    borderRadius: BorderRadius.full,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceVariant,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
  },
  
  // Enhanced Question Card
  questionCard: {
    marginHorizontal: '5%',
    marginBottom: '6%',
    padding: '5%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    width: '90%',
    alignSelf: 'center',
  },
  questionHeader: {
    alignItems: 'center',
    marginBottom: '4%',
  },
  questionCategory: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray700,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: Typography.fontSize.xl * 1.4,
  },
  
  // Enhanced Options
  optionsContainer: {
    paddingHorizontal: '5%',
    gap: Spacing.md,
  },
  optionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.sm,
    marginBottom: Spacing.sm,
    width: '100%',
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
    ...Shadows.md,
    transform: [{ scale: 1.02 }],
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    position: 'relative',
  },
  optionNumber: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  selectedOptionNumber: {
    backgroundColor: Colors.primary,
  },
  optionNumberText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
  },
  selectedOptionNumberText: {
    color: Colors.textInverse,
  },
  optionText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.fontSize.base * 1.5,
  },
  selectedOptionText: {
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
  },
  selectedIndicator: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  selectedIndicatorText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textInverse,
    fontWeight: Typography.fontWeight.bold,
  },
  
  // Enhanced Buttons
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: '5%',
    paddingTop: '8%',
    gap: Spacing.lg,
    alignItems: 'center',
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  nextButtonFullWidth: {
    flex: 1,
    width: '100%',
  },
  
  bottomSpacing: {
    height: screenHeight * 0.12,
  },
});
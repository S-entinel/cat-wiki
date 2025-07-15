import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
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

const { width: screenWidth } = Dimensions.get('window');

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

  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;
  const isLastQuestion = currentQuestion === QUIZ_QUESTIONS.length - 1;

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
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption('');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
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
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={[styles.progressFill, { width: `${progress}%` }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
      <Text style={styles.progressText}>
        {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
      </Text>
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
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <Text style={styles.headerTitle}>Personality Quiz</Text>
        <Text style={styles.headerSubtitle}>Find your perfect feline match</Text>
      </LinearGradient>
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {renderProgressBar()}
        
        <Card style={styles.questionCard} shadow="md">
          <Text style={styles.questionText}>{question.question}</Text>
        </Card>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => renderOption(option, index))}
        </View>

        <View style={styles.buttonContainer}>
          {currentQuestion > 0 && (
            <Button
              title="Back"
              onPress={handleBack}
              variant="ghost"
              size="md"
              style={styles.backButton}
            />
          )}
          
          <Button
            title={isLastQuestion ? "Get Results" : "Next"}
            onPress={handleNext}
            variant="primary"
            size="lg"
            disabled={!selectedOption}
            style={styles.nextButton}
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
  
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.textInverse,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textInverse,
    opacity: 0.9,
    fontWeight: Typography.fontWeight.medium,
  },
  
  progressContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  questionCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
  },
  questionText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: Typography.fontSize.xl * 1.3,
  },
  
  optionsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  optionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.xs,
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
    ...Shadows.md,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  optionNumber: {
    width: 36,
    height: 36,
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
    lineHeight: Typography.fontSize.base * 1.4,
  },
  selectedOptionText: {
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    gap: Spacing.md,
    alignItems: 'center',
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  
  bottomSpacing: {
    height: 40,
  },
});
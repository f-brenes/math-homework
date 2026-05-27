import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '../../constants/theme';
import { quizQuestions } from '../../constants/placeholderData';

type QuizState = 'intro' | 'active' | 'result';

const modes = [
  { label: 'Quick Fire', icon: '⚡', desc: '5 questions · 30 sec each', color: Colors.accentOrange },
  { label: 'Practice', icon: '🎯', desc: '10 questions · no timer', color: Colors.accentGreen },
  { label: 'Challenge', icon: '🏆', desc: '20 questions · 20 sec each', color: Colors.primary },
];

const leaderboard = [
  { rank: 1, name: 'Alex M.', score: 980, icon: '🥇' },
  { rank: 2, name: 'Jordan S.', score: 945, icon: '🥈' },
  { rank: 3, name: 'You', score: 870, icon: '🥉' },
  { rank: 4, name: 'Sam R.', score: 820, icon: '4' },
];

export default function QuizScreen() {
  const [quizState, setQuizState] = useState<QuizState>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const question = quizQuestions[currentQ];
  const total = quizQuestions.length;

  function handleAnswer(idx: number) {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (idx === question.correct) setScore(s => s + 1);
  }

  function handleNext() {
    if (currentQ < total - 1) {
      setCurrentQ(q => q + 1);
      setSelectedOption(null);
    } else {
      setQuizState('result');
    }
  }

  function resetQuiz() {
    setCurrentQ(0);
    setSelectedOption(null);
    setScore(0);
    setAnswers([]);
    setQuizState('intro');
  }

  function getOptionStyle(idx: number) {
    if (selectedOption === null) return styles.optionDefault;
    if (idx === question.correct) return styles.optionCorrect;
    if (idx === selectedOption) return styles.optionWrong;
    return styles.optionDefault;
  }

  function getOptionTextStyle(idx: number) {
    if (selectedOption === null) return styles.optionTextDefault;
    if (idx === question.correct) return styles.optionTextCorrect;
    if (idx === selectedOption) return styles.optionTextWrong;
    return styles.optionTextDefault;
  }

  if (quizState === 'active') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.quizContainer}>
          {/* Progress */}
          <View style={styles.quizHeader}>
            <TouchableOpacity onPress={resetQuiz}>
              <Ionicons name="close" size={22} color={Colors.textMuted} />
            </TouchableOpacity>
            <Text style={styles.qCounter}>{currentQ + 1} / {total}</Text>
            <View style={styles.scoreBadge}>
              <Ionicons name="star" size={13} color={Colors.accentOrange} />
              <Text style={styles.scoreText}>{score}</Text>
            </View>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentQ + 1) / total) * 100}%` }]} />
          </View>

          {/* Question */}
          <View style={styles.questionCard}>
            <Text style={styles.questionLabel}>Solve for x</Text>
            <Text style={styles.questionEquation}>{question.equation}</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsGrid}>
            {question.options.map((opt, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.option, getOptionStyle(idx)]}
                onPress={() => handleAnswer(idx)}
                activeOpacity={0.8}
                disabled={selectedOption !== null}
              >
                <Text style={[styles.optionText, getOptionTextStyle(idx)]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Explanation */}
          {selectedOption !== null && (
            <View style={styles.explanation}>
              <Ionicons
                name={selectedOption === question.correct ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={selectedOption === question.correct ? Colors.accentGreen : Colors.accentRed}
              />
              <Text style={styles.explanationText}>{question.explanation}</Text>
            </View>
          )}

          {selectedOption !== null && (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.nextBtnText}>
                {currentQ < total - 1 ? 'Next Question' : 'See Results'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (quizState === 'result') {
    const pct = Math.round((score / total) * 100);
    const grade = pct >= 80 ? '🌟 Excellent!' : pct >= 60 ? '👍 Good job!' : '💪 Keep practicing!';
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.resultContent}>
          <View style={styles.resultCircle}>
            <Text style={styles.resultPct}>{pct}%</Text>
            <Text style={styles.resultSub}>{score}/{total} correct</Text>
          </View>
          <Text style={styles.gradeText}>{grade}</Text>
          <View style={styles.resultStats}>
            {[
              { label: 'Correct', value: score, color: Colors.accentGreen },
              { label: 'Wrong', value: total - score, color: Colors.accentRed },
              { label: 'Score', value: score * 100, color: Colors.primary },
            ].map(stat => (
              <View key={stat.label} style={styles.resultStat}>
                <Text style={[styles.resultStatVal, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.resultStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.nextBtn} onPress={resetQuiz} activeOpacity={0.85}>
            <Text style={styles.nextBtnText}>Back to Quiz Menu</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Quiz</Text>
          <Text style={styles.headerSub}>Test your linear equation skills</Text>
        </View>

        {/* Modes */}
        <Text style={styles.sectionTitle}>Choose Mode</Text>
        <View style={styles.modeList}>
          {modes.map(mode => (
            <TouchableOpacity
              key={mode.label}
              style={[styles.modeCard, { borderColor: mode.color + '44' }]}
              onPress={() => setQuizState('active')}
              activeOpacity={0.8}
            >
              <Text style={styles.modeIcon}>{mode.icon}</Text>
              <View style={styles.modeBody}>
                <Text style={styles.modeLabel}>{mode.label}</Text>
                <Text style={styles.modeDesc}>{mode.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Leaderboard */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Leaderboard</Text>
        <View style={styles.leaderCard}>
          {leaderboard.map(entry => (
            <View key={entry.rank} style={[styles.leaderRow, entry.name === 'You' && styles.leaderYou]}>
              <Text style={styles.leaderRank}>{entry.icon}</Text>
              <Text style={[styles.leaderName, entry.name === 'You' && styles.leaderYouText]}>
                {entry.name}
              </Text>
              <Text style={styles.leaderScore}>{entry.score} pts</Text>
            </View>
          ))}
        </View>

        {/* Stats Banner */}
        <View style={styles.statBanner}>
          <View style={styles.bannerStat}>
            <Text style={styles.bannerVal}>12</Text>
            <Text style={styles.bannerLabel}>Quizzes Taken</Text>
          </View>
          <View style={styles.bannerDivider} />
          <View style={styles.bannerStat}>
            <Text style={styles.bannerVal}>76%</Text>
            <Text style={styles.bannerLabel}>Avg Score</Text>
          </View>
          <View style={styles.bannerDivider} />
          <View style={styles.bannerStat}>
            <Text style={styles.bannerVal}>5</Text>
            <Text style={styles.bannerLabel}>Best Streak</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  content: { padding: Spacing.md, paddingBottom: 100 },

  header: { marginBottom: Spacing.lg, marginTop: Spacing.sm },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  headerSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },

  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  modeList: { gap: Spacing.sm, marginBottom: Spacing.sm },
  modeCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
  },
  modeIcon: { fontSize: 28 },
  modeBody: { flex: 1 },
  modeLabel: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  modeDesc: { fontSize: FontSize.sm, color: Colors.textMuted },

  leaderCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  leaderYou: { backgroundColor: Colors.primary + '18' },
  leaderRank: { fontSize: 18, width: 28, textAlign: 'center' },
  leaderName: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: '600' },
  leaderYouText: { color: Colors.primary, fontWeight: '700' },
  leaderScore: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },

  statBanner: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bannerStat: { alignItems: 'center', gap: 4 },
  bannerVal: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  bannerLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  bannerDivider: { width: 1, backgroundColor: Colors.border },

  // Active quiz
  quizContainer: { flex: 1, padding: Spacing.md },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  qCounter: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textSecondary },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: Spacing.lg,
  },
  progressFill: { height: 4, backgroundColor: Colors.primary, borderRadius: 2 },

  questionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  questionLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  questionEquation: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: 'monospace',
  },

  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  option: {
    flex: 1,
    minWidth: '45%',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
  },
  optionDefault: { backgroundColor: Colors.surface, borderColor: Colors.border },
  optionCorrect: { backgroundColor: Colors.accentGreen + '22', borderColor: Colors.accentGreen },
  optionWrong: { backgroundColor: Colors.accentRed + '22', borderColor: Colors.accentRed },
  optionText: { fontSize: FontSize.lg, fontWeight: '700', fontFamily: 'monospace' },
  optionTextDefault: { color: Colors.textPrimary },
  optionTextCorrect: { color: Colors.accentGreen },
  optionTextWrong: { color: Colors.accentRed },

  explanation: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  explanationText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },

  nextBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  nextBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white },

  // Results
  resultContent: {
    padding: Spacing.lg,
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingBottom: 100,
  },
  resultCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  resultPct: { fontSize: FontSize.display, fontWeight: '900', color: Colors.white },
  resultSub: { fontSize: FontSize.sm, color: Colors.white + 'CC', fontWeight: '600' },
  gradeText: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing.lg },
  resultStats: {
    flexDirection: 'row',
    gap: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  resultStat: { alignItems: 'center', gap: 4 },
  resultStatVal: { fontSize: FontSize.xxl, fontWeight: '800' },
  resultStatLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
});

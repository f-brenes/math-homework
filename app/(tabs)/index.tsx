import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '../../constants/theme';
import { recentProblems, dashboardStats } from '../../constants/placeholderData';
import SectionHeader from '../../components/SectionHeader';
import EquationCard from '../../components/EquationCard';
import PhotoUploadWidget from '../../components/PhotoUploadWidget';

const statItems = [
  { label: 'Solved Today', value: dashboardStats.solvedToday, icon: 'checkmark-circle', color: Colors.accentGreen },
  { label: 'Day Streak', value: dashboardStats.weeklyStreak, icon: 'flame', color: Colors.accentOrange },
  { label: 'Total Solved', value: dashboardStats.totalSolved, icon: 'trophy', color: Colors.primary },
  { label: 'Accuracy %', value: dashboardStats.accuracy, icon: 'bar-chart', color: Colors.accent },
];

const quickActions = [
  { label: 'One Variable', icon: '1️⃣', color: Colors.primary },
  { label: 'Two Sides', icon: '⚖️', color: Colors.accentGreen },
  { label: 'With Fractions', icon: '½', color: Colors.accentOrange },
  { label: 'Parentheses', icon: '()', color: Colors.accent },
];

export default function DashboardScreen() {
  const [inputText, setInputText] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning! 👋</Text>
            <Text style={styles.tagline}>Ready to solve some equations?</Text>
          </View>
          <TouchableOpacity style={styles.avatarBtn}>
            <Ionicons name="person-circle" size={40} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Solver Input */}
        <View style={styles.solverCard}>
          <Text style={styles.solverLabel}>Enter an Equation</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="e.g.  2x + 6 = 14"
              placeholderTextColor={Colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              keyboardType="ascii-capable"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.solveBtn} activeOpacity={0.8}>
              <Ionicons name="calculator" size={20} color={Colors.white} />
              <Text style={styles.solveBtnText}>Solve</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.solverHint}>
            Supports: ax + b = c · ax + b = cx + d · with fractions & parentheses
          </Text>
        </View>

        {/* Photo Upload Widget */}
        <View style={styles.section}>
          <PhotoUploadWidget />
        </View>

        {/* Stats Row */}
        <View style={styles.statsGrid}>
          {statItems.map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <SectionHeader title="Quick Solve by Type" />
          <View style={styles.quickGrid}>
            {quickActions.map(action => (
              <TouchableOpacity
                key={action.label}
                style={[styles.quickCard, { borderColor: action.color + '44' }]}
                activeOpacity={0.8}
              >
                <Text style={styles.quickIcon}>{action.icon}</Text>
                <Text style={styles.quickLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Progress Banner */}
        <View style={styles.progressBanner}>
          <View style={styles.progressLeft}>
            <Text style={styles.progressTitle}>Daily Goal</Text>
            <Text style={styles.progressSub}>8 of 10 equations solved</Text>
          </View>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPct}>80%</Text>
          </View>
        </View>

        {/* Recent Problems */}
        <View style={styles.section}>
          <SectionHeader title="Recent Problems" actionLabel="View All" />
          {recentProblems.slice(0, 3).map(item => (
            <EquationCard key={item.id} item={item} compact />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  content: { padding: Spacing.md, paddingBottom: 100 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  greeting: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  tagline: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  avatarBtn: { padding: 4 },

  solverCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '55',
  },
  solverLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  inputRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    fontFamily: 'monospace',
  },
  solveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  solveBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.sm },
  solverHint: { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 16 },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: { fontSize: FontSize.xxl, fontWeight: '800' },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },

  section: { marginBottom: Spacing.lg },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
  quickIcon: { fontSize: 24 },
  quickLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600', textAlign: 'center' },

  progressBanner: {
    backgroundColor: Colors.primary + '22',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
  },
  progressLeft: { gap: 4 },
  progressTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  progressSub: { fontSize: FontSize.sm, color: Colors.textSecondary },
  progressCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPct: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.white },
});

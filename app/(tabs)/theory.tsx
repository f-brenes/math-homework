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
import { theoryTopics, TheoryTopic, Difficulty } from '../../constants/placeholderData';
import DifficultyBadge from '../../components/DifficultyBadge';

const difficultyFilters: Array<'All' | Difficulty> = ['All', 'Easy', 'Medium', 'Hard'];

function TopicCard({ topic }: { topic: TheoryTopic }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.cardLeft}>
        <View style={styles.iconBox}>
          <Text style={styles.cardIcon}>{topic.icon}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.subtitle}>{topic.subtitle}</Text>
          <Text style={styles.cardTitle}>{topic.title}</Text>
          <Text style={styles.preview} numberOfLines={2}>{topic.preview}</Text>
          <View style={styles.cardMeta}>
            <DifficultyBadge difficulty={topic.difficulty} small />
            <View style={styles.readTime}>
              <Ionicons name="time-outline" size={11} color={Colors.textMuted} />
              <Text style={styles.readTimeText}>{topic.readTime} read</Text>
            </View>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function TheoryScreen() {
  const [activeFilter, setActiveFilter] = useState<'All' | Difficulty>('All');

  const filtered = theoryTopics.filter(
    t => activeFilter === 'All' || t.difficulty === activeFilter
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Theory</Text>
          <Text style={styles.headerSub}>Master linear equations step by step</Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <View>
              <Text style={styles.progressTitle}>Your Progress</Text>
              <Text style={styles.progressSub}>2 of {theoryTopics.length} topics completed</Text>
            </View>
            <Ionicons name="school" size={32} color={Colors.primary} />
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(2 / theoryTopics.length) * 100}%` }]} />
          </View>
          <Text style={styles.progressHint}>Keep going — you're building a strong foundation!</Text>
        </View>

        {/* Difficulty filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {difficultyFilters.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterLabel, activeFilter === f && styles.filterLabelActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Topics */}
        <View style={styles.topicList}>
          {filtered.map((topic, i) => (
            <View key={topic.id}>
              {i === 0 || filtered[i - 1].difficulty !== topic.difficulty ? (
                <Text style={styles.diffSection}>{topic.difficulty}</Text>
              ) : null}
              <TopicCard topic={topic} />
            </View>
          ))}
        </View>

        {/* Formula cheatsheet */}
        <View style={styles.cheatCard}>
          <Text style={styles.cheatTitle}>📋 Quick Reference</Text>
          <View style={styles.cheatDivider} />
          {[
            { label: 'Standard Form', formula: 'ax + b = c' },
            { label: 'Two-Side Form', formula: 'ax + b = cx + d' },
            { label: 'Solution', formula: 'x = (c - b) / a' },
          ].map(row => (
            <View key={row.label} style={styles.cheatRow}>
              <Text style={styles.cheatLabel}>{row.label}</Text>
              <Text style={styles.cheatFormula}>{row.formula}</Text>
            </View>
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

  header: { marginBottom: Spacing.lg, marginTop: Spacing.sm },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  headerSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },

  progressCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  progressSub: { fontSize: FontSize.sm, color: Colors.textSecondary },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressHint: { fontSize: FontSize.xs, color: Colors.textMuted },

  filterScroll: { flexGrow: 0, marginBottom: Spacing.md },
  filterContent: { gap: Spacing.sm, paddingRight: Spacing.md },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  filterLabelActive: { color: Colors.white },

  topicList: { gap: Spacing.xs, marginBottom: Spacing.lg },
  diffSection: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cardLeft: { flex: 1, flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: { fontSize: 22 },
  cardBody: { flex: 1, gap: 2 },
  subtitle: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  cardTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  preview: { fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 16, marginTop: 2 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 4 },
  readTime: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  readTimeText: { fontSize: FontSize.xs, color: Colors.textMuted },

  cheatCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.accent + '44',
    gap: Spacing.sm,
  },
  cheatTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  cheatDivider: { height: 1, backgroundColor: Colors.border },
  cheatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cheatLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  cheatFormula: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
});

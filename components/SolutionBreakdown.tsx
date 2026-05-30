import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '../constants/theme';
import { MathSolution } from '../services/mathAnalyzer';

interface Props {
  solutions: MathSolution[];
  rawText: string;
  onClose: () => void;
}

function StepRow({ index, text }: { index: number; text: string }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepBubble}>
        <Text style={styles.stepNum}>{index + 1}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

function SolutionCard({ sol }: { sol: MathSolution }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={styles.solutionCard}>
      {/* Problem header */}
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setExpanded(e => !e)}
        activeOpacity={0.8}
      >
        <View style={styles.problemBadge}>
          <Text style={styles.problemBadgeText}>#{sol.problemNumber}</Text>
        </View>
        <Text style={styles.problemText} numberOfLines={expanded ? undefined : 2}>
          {sol.problem}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={Colors.textMuted}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.cardBody}>
          {/* Approach */}
          {sol.approach ? (
            <View style={styles.approachRow}>
              <Ionicons name="bulb-outline" size={14} color={Colors.accentOrange} />
              <Text style={styles.approachText}>{sol.approach}</Text>
            </View>
          ) : null}

          {/* Steps */}
          <Text style={styles.sectionLabel}>Step-by-Step</Text>
          {sol.steps.map((step, i) => (
            <StepRow key={i} index={i} text={step} />
          ))}

          {/* Answer */}
          <View style={styles.answerBox}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.accentGreen} />
            <View style={{ flex: 1 }}>
              <Text style={styles.answerLabel}>Answer</Text>
              <Text style={styles.answerText}>{sol.answer}</Text>
            </View>
          </View>

          {/* Key Concepts */}
          {sol.keyConcepts.length > 0 && (
            <View style={styles.conceptsBox}>
              <Text style={styles.sectionLabel}>Key Concepts</Text>
              {sol.keyConcepts.map((c, i) => (
                <View key={i} style={styles.conceptRow}>
                  <Text style={styles.conceptDot}>•</Text>
                  <Text style={styles.conceptText}>{c}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default function SolutionBreakdown({ solutions, rawText, onClose }: Props) {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="sparkles" size={18} color={Colors.primary} />
          <Text style={styles.headerTitle}>
            {solutions.length} Problem{solutions.length !== 1 ? 's' : ''} Solved
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {solutions.length > 0 ? (
          solutions.map(sol => <SolutionCard key={sol.problemNumber} sol={sol} />)
        ) : (
          <View style={styles.noResults}>
            <Ionicons name="alert-circle-outline" size={36} color={Colors.textMuted} />
            <Text style={styles.noResultsText}>
              Couldn't parse structured results. See raw output below.
            </Text>
          </View>
        )}

        {/* Raw output toggle */}
        <TouchableOpacity
          style={styles.rawToggle}
          onPress={() => setShowRaw(r => !r)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={showRaw ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={Colors.textMuted}
          />
          <Text style={styles.rawToggleText}>
            {showRaw ? 'Hide' : 'Show'} raw AI output
          </Text>
        </TouchableOpacity>

        {showRaw && (
          <View style={styles.rawBox}>
            <Text style={styles.rawText}>{rawText}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
    overflow: 'hidden',
    maxHeight: 600,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  closeBtn: { padding: 4 },

  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.lg },

  solutionCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  problemBadge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  problemBadgeText: { color: Colors.white, fontWeight: '800', fontSize: FontSize.xs },
  problemText: { flex: 1, color: Colors.textPrimary, fontWeight: '600', fontSize: FontSize.sm, fontFamily: 'monospace' },

  cardBody: { padding: Spacing.md, paddingTop: 0, gap: Spacing.sm },

  approachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accentOrange + '18',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  approachText: { color: Colors.accentOrange, fontSize: FontSize.sm, flex: 1 },

  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: Spacing.sm,
    marginBottom: 4,
  },

  stepRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start', marginBottom: 6 },
  stepBubble: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary + '33',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  stepNum: { color: Colors.primary, fontSize: FontSize.xs, fontWeight: '800' },
  stepText: { flex: 1, color: Colors.textSecondary, fontSize: FontSize.sm, lineHeight: 20 },

  answerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.accentGreen + '18',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.accentGreen + '44',
    marginTop: Spacing.sm,
  },
  answerLabel: { fontSize: FontSize.xs, color: Colors.accentGreen, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  answerText: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary, marginTop: 2 },

  conceptsBox: { marginTop: Spacing.xs },
  conceptRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  conceptDot: { color: Colors.accent, fontWeight: '700' },
  conceptText: { flex: 1, color: Colors.textSecondary, fontSize: FontSize.sm },

  noResults: { alignItems: 'center', gap: Spacing.sm, padding: Spacing.xl },
  noResultsText: { color: Colors.textMuted, fontSize: FontSize.sm, textAlign: 'center' },

  rawToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    padding: Spacing.sm,
  },
  rawToggleText: { color: Colors.textMuted, fontSize: FontSize.xs },
  rawBox: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rawText: { color: Colors.textSecondary, fontSize: FontSize.xs, lineHeight: 18, fontFamily: 'monospace' },
});

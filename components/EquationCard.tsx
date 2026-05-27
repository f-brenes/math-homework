import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, FontSize } from '../constants/theme';
import { SavedEquation } from '../constants/placeholderData';
import DifficultyBadge from './DifficultyBadge';

interface Props {
  item: SavedEquation;
  compact?: boolean;
}

export default function EquationCard({ item, compact }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.compact]}
      onPress={() => setExpanded(e => !e)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.equationRow}>
          <Text style={styles.equation}>{item.equation}</Text>
          <Text style={styles.arrow}>{expanded ? '↑' : '↓'}</Text>
        </View>
        <View style={styles.meta}>
          <DifficultyBadge difficulty={item.difficulty} small />
          <Text style={styles.time}>{item.savedAt}</Text>
        </View>
      </View>

      {expanded && (
        <View style={styles.bodyExpanded}>
          <View style={styles.divider} />
          <Text style={styles.solutionLabel}>Solution</Text>
          <Text style={styles.solution}>{item.solution}</Text>
          <Text style={styles.stepsLabel}>Steps</Text>
          {item.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepDot} />
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
          <View style={styles.tagsRow}>
            {item.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  compact: {
    marginBottom: Spacing.xs,
  },
  header: {
    gap: 6,
  },
  equationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  equation: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'monospace',
  },
  arrow: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  time: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  solutionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  solution: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.accentGreen,
    fontFamily: 'monospace',
    marginBottom: Spacing.sm,
  },
  stepsLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: Spacing.sm,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  stepText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing.sm,
  },
  tag: {
    backgroundColor: 'rgba(99,102,241,0.15)',
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: FontSize.xs,
    color: Colors.primaryLight,
  },
  bodyExpanded: {
    marginTop: 0,
  },
});

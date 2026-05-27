import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '../constants/theme';
import { Difficulty } from '../constants/placeholderData';

interface Props {
  difficulty: Difficulty;
  small?: boolean;
}

const config: Record<Difficulty, { color: string; bg: string }> = {
  Easy: { color: Colors.accentGreen, bg: 'rgba(16,185,129,0.15)' },
  Medium: { color: Colors.accentOrange, bg: 'rgba(245,158,11,0.15)' },
  Hard: { color: Colors.accentRed, bg: 'rgba(239,68,68,0.15)' },
};

export default function DifficultyBadge({ difficulty, small }: Props) {
  const { color, bg } = config[difficulty];
  return (
    <View style={[styles.badge, { backgroundColor: bg }, small && styles.small]}>
      <Text style={[styles.text, { color }, small && styles.smallText]}>
        {difficulty}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  smallText: {
    fontSize: FontSize.xs,
  },
});

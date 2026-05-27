import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '../../constants/theme';

interface ToggleSetting {
  id: string;
  label: string;
  description: string;
  value: boolean;
}

interface SelectSetting {
  id: string;
  label: string;
  value: string;
  options: string[];
}

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface RowItem {
  label: string;
  icon: IconName;
  iconColor?: string;
  value?: string;
  danger?: boolean;
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.groupCard}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    showSteps: true,
    darkMode: true,
    notifications: false,
    sound: true,
    haptics: true,
    autoSave: false,
  });

  const [difficulty, setDifficulty] = useState('Medium');
  const [notation, setNotation] = useState('Standard');

  function toggle(id: string) {
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const profileRows: RowItem[] = [
    { label: 'Display Name', icon: 'person-outline', value: 'Math Student' },
    { label: 'Email', icon: 'mail-outline', value: 'student@email.com' },
    { label: 'Grade Level', icon: 'school-outline', value: 'Grade 9' },
  ];

  const appearanceToggles: ToggleSetting[] = [
    { id: 'darkMode', label: 'Dark Mode', description: 'Use dark theme throughout the app', value: toggles.darkMode },
    { id: 'sound', label: 'Sound Effects', description: 'Play sounds for correct/incorrect answers', value: toggles.sound },
    { id: 'haptics', label: 'Haptic Feedback', description: 'Vibrate on interactions', value: toggles.haptics },
  ];

  const mathToggles: ToggleSetting[] = [
    { id: 'showSteps', label: 'Show Steps', description: 'Always display step-by-step solutions', value: toggles.showSteps },
    { id: 'autoSave', label: 'Auto Save', description: 'Automatically save solved equations', value: toggles.autoSave },
    { id: 'notifications', label: 'Daily Reminder', description: 'Get a daily push to practice', value: toggles.notifications },
  ];

  const supportRows: RowItem[] = [
    { label: 'Help & FAQ', icon: 'help-circle-outline', iconColor: Colors.accent },
    { label: 'Report a Bug', icon: 'bug-outline', iconColor: Colors.accentOrange },
    { label: 'Rate the App', icon: 'star-outline', iconColor: Colors.accentOrange },
    { label: 'Privacy Policy', icon: 'shield-checkmark-outline', iconColor: Colors.accentGreen },
    { label: 'Sign Out', icon: 'log-out-outline', danger: true },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>Settings</Text>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>M</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Math Student</Text>
            <Text style={styles.profileEmail}>student@email.com</Text>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>🔥 5 day streak</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="pencil" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Profile Rows */}
        <SettingsGroup title="Profile">
          {profileRows.map((row, i) => (
            <View key={row.label}>
              <TouchableOpacity style={styles.row} activeOpacity={0.7}>
                <View style={[styles.rowIcon, { backgroundColor: Colors.primary + '22' }]}>
                  <Ionicons name={row.icon} size={17} color={Colors.primary} />
                </View>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <View style={styles.rowRight}>
                  {row.value && <Text style={styles.rowValue}>{row.value}</Text>}
                  <Ionicons name="chevron-forward" size={15} color={Colors.textMuted} />
                </View>
              </TouchableOpacity>
              {i < profileRows.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
        </SettingsGroup>

        {/* Math Preferences */}
        <SettingsGroup title="Math Preferences">
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: Colors.accentGreen + '22' }]}>
              <Ionicons name="options-outline" size={17} color={Colors.accentGreen} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>Default Difficulty</Text>
              <Text style={styles.rowSub}>Starting level for new quizzes</Text>
            </View>
            <View style={styles.segmentRow}>
              {['Easy', 'Medium', 'Hard'].map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.segBtn, difficulty === opt && styles.segBtnActive]}
                  onPress={() => setDifficulty(opt)}
                >
                  <Text style={[styles.segLabel, difficulty === opt && styles.segLabelActive]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: Colors.accent + '22' }]}>
              <Ionicons name="text-outline" size={17} color={Colors.accent} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>Notation Style</Text>
              <Text style={styles.rowSub}>How equations are displayed</Text>
            </View>
            <View style={styles.segmentRow}>
              {['Standard', 'Formal'].map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.segBtn, notation === opt && styles.segBtnActive]}
                  onPress={() => setNotation(opt)}
                >
                  <Text style={[styles.segLabel, notation === opt && styles.segLabelActive]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.rowDivider} />
          {mathToggles.map((item, i) => (
            <View key={item.id}>
              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: Colors.primary + '22' }]}>
                  <Ionicons
                    name={item.id === 'showSteps' ? 'list-outline' : item.id === 'autoSave' ? 'save-outline' : 'notifications-outline'}
                    size={17}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.rowBody}>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <Text style={styles.rowSub}>{item.description}</Text>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={() => toggle(item.id)}
                  trackColor={{ false: Colors.border, true: Colors.primary + '88' }}
                  thumbColor={item.value ? Colors.primary : Colors.textMuted}
                />
              </View>
              {i < mathToggles.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
        </SettingsGroup>

        {/* Appearance */}
        <SettingsGroup title="Appearance & Feedback">
          {appearanceToggles.map((item, i) => (
            <View key={item.id}>
              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: Colors.accentOrange + '22' }]}>
                  <Ionicons
                    name={item.id === 'darkMode' ? 'moon-outline' : item.id === 'sound' ? 'musical-notes-outline' : 'phone-portrait-outline'}
                    size={17}
                    color={Colors.accentOrange}
                  />
                </View>
                <View style={styles.rowBody}>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <Text style={styles.rowSub}>{item.description}</Text>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={() => toggle(item.id)}
                  trackColor={{ false: Colors.border, true: Colors.accentOrange + '88' }}
                  thumbColor={item.value ? Colors.accentOrange : Colors.textMuted}
                />
              </View>
              {i < appearanceToggles.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
        </SettingsGroup>

        {/* Support & Legal */}
        <SettingsGroup title="Support & Legal">
          {supportRows.map((row, i) => (
            <View key={row.label}>
              <TouchableOpacity style={styles.row} activeOpacity={0.7}>
                <View style={[styles.rowIcon, { backgroundColor: (row.iconColor || Colors.accentRed) + '22' }]}>
                  <Ionicons
                    name={row.icon}
                    size={17}
                    color={row.danger ? Colors.accentRed : (row.iconColor || Colors.textMuted)}
                  />
                </View>
                <Text style={[styles.rowLabel, row.danger && { color: Colors.accentRed }]}>
                  {row.label}
                </Text>
                {!row.danger && (
                  <Ionicons name="chevron-forward" size={15} color={Colors.textMuted} />
                )}
              </TouchableOpacity>
              {i < supportRows.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
        </SettingsGroup>

        <Text style={styles.version}>LinearSolve v1.0.0 · Expo SDK 54</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  content: { padding: Spacing.md, paddingBottom: 100 },

  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },

  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  profileEmail: { fontSize: FontSize.sm, color: Colors.textMuted },
  profileBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentOrange + '22',
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  profileBadgeText: { fontSize: FontSize.xs, color: Colors.accentOrange, fontWeight: '600' },

  group: { marginBottom: Spacing.lg },
  groupTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs + 2,
    paddingLeft: Spacing.xs,
  },
  groupCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
    minHeight: 56,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1 },
  rowLabel: { fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: '500' },
  rowSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue: { fontSize: FontSize.sm, color: Colors.textMuted },
  rowDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 66 },

  segmentRow: { flexDirection: 'row', gap: 4 },
  segBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  segLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '600' },
  segLabelActive: { color: Colors.white },

  version: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '../constants/theme';
import { analyzeMathImage, AnalysisResult } from '../services/mathAnalyzer';
import SolutionBreakdown from './SolutionBreakdown';

type Phase = 'idle' | 'preview' | 'analyzing' | 'done' | 'error';

export default function PhotoUploadWidget() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  function reset() {
    setImageUri(null);
    setPhase('idle');
    setResult(null);
    setErrorMsg('');
  }

  async function pickFromLibrary() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.9,
    });
    if (!res.canceled) {
      setImageUri(res.assets[0].uri);
      setPhase('preview');
      setResult(null);
    }
  }

  async function pickFromCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.9 });
    if (!res.canceled) {
      setImageUri(res.assets[0].uri);
      setPhase('preview');
      setResult(null);
    }
  }

  async function analyzeImage() {
    if (!imageUri) return;
    setPhase('analyzing');
    const analysis = await analyzeMathImage(imageUri);
    if (analysis.error) {
      setErrorMsg(analysis.error);
      setPhase('error');
    } else {
      setResult(analysis);
      setPhase('done');
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Scan a Problem</Text>
      <Text style={styles.sub}>Upload or take a photo of your equation</Text>

      {/* Photo preview / placeholder */}
      {phase === 'idle' && (
        <View style={styles.placeholder}>
          <Ionicons name="image-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.placeholderText}>No photo selected</Text>
        </View>
      )}

      {(phase === 'preview' || phase === 'analyzing') && imageUri && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" />
          {phase !== 'analyzing' && (
            <TouchableOpacity style={styles.clearBtn} onPress={reset}>
              <Ionicons name="close-circle" size={26} color={Colors.accentRed} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Analyzing spinner */}
      {phase === 'analyzing' && (
        <View style={styles.analyzingRow}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.analyzingText}>Analyzing with AI…</Text>
        </View>
      )}

      {/* Error */}
      {phase === 'error' && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={18} color={Colors.accentRed} />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      {/* Solution breakdown */}
      {phase === 'done' && result && (
        <SolutionBreakdown
          solutions={result.solutions}
          rawText={result.rawText}
          onClose={reset}
        />
      )}

      {/* Action buttons */}
      {phase !== 'done' && (
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, phase === 'analyzing' && styles.btnDisabled]}
            onPress={pickFromLibrary}
            activeOpacity={0.8}
            disabled={phase === 'analyzing'}
          >
            <Ionicons name="folder-open-outline" size={18} color={Colors.white} />
            <Text style={styles.btnText}>Upload</Text>
          </TouchableOpacity>

          {Platform.OS !== 'web' && (
            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary, phase === 'analyzing' && styles.btnDisabled]}
              onPress={pickFromCamera}
              activeOpacity={0.8}
              disabled={phase === 'analyzing'}
            >
              <Ionicons name="camera-outline" size={18} color={Colors.primary} />
              <Text style={[styles.btnText, styles.btnTextSecondary]}>Camera</Text>
            </TouchableOpacity>
          )}

          {(phase === 'preview' || phase === 'error') && (
            <TouchableOpacity
              style={[styles.btn, styles.btnGreen]}
              onPress={analyzeImage}
              activeOpacity={0.8}
            >
              <Ionicons name="sparkles-outline" size={18} color={Colors.white} />
              <Text style={styles.btnText}>
                {phase === 'error' ? 'Retry' : 'Solve with AI'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {phase === 'done' && (
        <TouchableOpacity style={[styles.btn, styles.btnFullWidth]} onPress={reset} activeOpacity={0.8}>
          <Ionicons name="camera-outline" size={18} color={Colors.white} />
          <Text style={styles.btnText}>Scan Another</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.accent + '44',
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary },

  placeholder: {
    height: 160,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  placeholderText: { fontSize: FontSize.sm, color: Colors.textMuted },

  previewContainer: { position: 'relative' },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: Radius.lg,
    backgroundColor: Colors.background,
  },
  clearBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
  },

  analyzingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  analyzingText: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '600' },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.accentRed + '18',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.accentRed + '44',
  },
  errorText: { flex: 1, color: Colors.accentRed, fontSize: FontSize.sm },

  btnRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm + 2,
  },
  btnFullWidth: { flex: 0, width: '100%' },
  btnSecondary: {
    backgroundColor: Colors.primary + '22',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  btnGreen: { backgroundColor: Colors.accentGreen },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.sm },
  btnTextSecondary: { color: Colors.primary },
});

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

export default function PhotoUploadWidget() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function pickFromLibrary() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    setLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    setLoading(false);
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  async function pickFromCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    setLoading(true);
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    setLoading(false);
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Scan a Problem</Text>
      <Text style={styles.sub}>Upload or take a photo of your equation</Text>

      {imageUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" />
          <TouchableOpacity style={styles.clearBtn} onPress={() => setImageUri(null)}>
            <Ionicons name="close-circle" size={26} color={Colors.accentRed} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.placeholder}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <Ionicons name="image-outline" size={48} color={Colors.textMuted} />
          )}
          <Text style={styles.placeholderText}>
            {loading ? 'Loading…' : 'No photo selected'}
          </Text>
        </View>
      )}

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btn} onPress={pickFromLibrary} activeOpacity={0.8}>
          <Ionicons name="folder-open-outline" size={18} color={Colors.white} />
          <Text style={styles.btnText}>Upload</Text>
        </TouchableOpacity>

        {/* Camera only works on native; hide on web */}
        {Platform.OS !== 'web' && (
          <TouchableOpacity
            style={[styles.btn, styles.btnSecondary]}
            onPress={pickFromCamera}
            activeOpacity={0.8}
          >
            <Ionicons name="camera-outline" size={18} color={Colors.primary} />
            <Text style={[styles.btnText, styles.btnTextSecondary]}>Camera</Text>
          </TouchableOpacity>
        )}

        {imageUri && (
          <TouchableOpacity style={[styles.btn, styles.btnGreen]} activeOpacity={0.8}>
            <Ionicons name="sparkles-outline" size={18} color={Colors.white} />
            <Text style={styles.btnText}>Solve</Text>
          </TouchableOpacity>
        )}
      </View>
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
  sub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
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
  placeholderText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  previewContainer: {
    position: 'relative',
  },
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
  btnRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
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
  btnSecondary: {
    backgroundColor: Colors.primary + '22',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  btnGreen: {
    backgroundColor: Colors.accentGreen,
  },
  btnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: FontSize.sm,
  },
  btnTextSecondary: {
    color: Colors.primary,
  },
});

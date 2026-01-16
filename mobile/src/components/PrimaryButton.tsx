import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  disabled?: boolean;
}

export function PrimaryButton({ label, onPress, variant = 'primary', disabled }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6
  },
  primary: {
    backgroundColor: '#2563EB'
  },
  outline: {
    borderWidth: 1,
    borderColor: '#2563EB'
  },
  danger: {
    backgroundColor: '#DC2626'
  },
  pressed: {
    opacity: 0.8
  },
  disabled: {
    opacity: 0.6
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '600'
  }
});

import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  secureTextEntry
}: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#0F172A'
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF'
  },
  multiline: {
    minHeight: 120
  }
});

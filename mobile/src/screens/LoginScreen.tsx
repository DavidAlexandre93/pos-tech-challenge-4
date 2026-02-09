import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Login', 'Informe e-mail e senha para continuar.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao autenticar.';
      Alert.alert('Login', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Portal do Blog</Text>
            <Text style={styles.subtitle}>Acesse com suas credenciais de docente ou aluno.</Text>
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="email@instituicao.edu"
              keyboardType="email-address"
            />
            <TextField
              label="Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
            />
            <PrimaryButton label={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center'
  },
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#0F172A'
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 16
  }
});

import React, { useContext, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '@/context/AuthContext';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';

export function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      await login(email, password);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao autenticar.';
      Alert.alert('Login', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Portal do Blog</Text>
        <Text style={styles.subtitle}>Acesse com suas credenciais de docente.</Text>
        <TextField label="Email" value={email} onChangeText={setEmail} placeholder="email@instituicao.edu" />
        <TextField
          label="Senha"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />
        <PrimaryButton label={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#F8FAFC'
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

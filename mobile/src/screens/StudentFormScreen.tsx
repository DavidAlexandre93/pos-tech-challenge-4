import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { apiRequest } from '@/api/client';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import type { Student } from '@/types';

interface StudentFormParams {
  studentId?: string;
}

export function StudentFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Record<string, StudentFormParams>, string>>();
  const { studentId } = (route.params ?? {}) as StudentFormParams;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');

  useEffect(() => {
    async function loadStudent() {
      if (!studentId) return;
      const data = await apiRequest<Student>(`/students/${studentId}`);
      setName(data.name);
      setEmail(data.email);
      setCourse(data.course ?? '');
    }

    loadStudent();
  }, [studentId]);

  async function handleSubmit() {
    try {
      if (studentId) {
        await apiRequest(`/students/${studentId}`, {
          method: 'PUT',
          body: JSON.stringify({ name, email, course })
        });
        Alert.alert('Alunos', 'Aluno atualizado com sucesso.');
      } else {
        await apiRequest('/students', {
          method: 'POST',
          body: JSON.stringify({ name, email, course })
        });
        Alert.alert('Alunos', 'Aluno cadastrado com sucesso.');
      }
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao salvar aluno.';
      Alert.alert('Alunos', message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextField label="Nome" value={name} onChangeText={setName} placeholder="Nome completo" />
      <TextField label="Email" value={email} onChangeText={setEmail} placeholder="email@instituicao.edu" />
      <TextField label="Curso" value={course} onChangeText={setCourse} placeholder="Curso" />
      <PrimaryButton label={studentId ? 'Salvar alterações' : 'Cadastrar'} onPress={handleSubmit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F1F5F9'
  }
});

import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { apiRequest } from '@/api/client';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import type { Teacher } from '@/types';

interface TeacherFormParams {
  teacherId?: string;
}

export function TeacherFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Record<string, TeacherFormParams>, string>>();
  const { teacherId } = (route.params ?? {}) as TeacherFormParams;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    async function loadTeacher() {
      if (!teacherId) return;
      const data = await apiRequest<Teacher>(`/teachers/${teacherId}`);
      setName(data.name);
      setEmail(data.email);
      setDepartment(data.department ?? '');
    }

    loadTeacher();
  }, [teacherId]);

  async function handleSubmit() {
    try {
      if (teacherId) {
        await apiRequest(`/teachers/${teacherId}`, {
          method: 'PUT',
          body: JSON.stringify({ name, email, department })
        });
        Alert.alert('Docentes', 'Docente atualizado com sucesso.');
      } else {
        await apiRequest('/teachers', {
          method: 'POST',
          body: JSON.stringify({ name, email, department })
        });
        Alert.alert('Docentes', 'Docente cadastrado com sucesso.');
      }
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao salvar docente.';
      Alert.alert('Docentes', message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextField label="Nome" value={name} onChangeText={setName} placeholder="Nome completo" />
      <TextField label="Email" value={email} onChangeText={setEmail} placeholder="email@instituicao.edu" />
      <TextField label="Departamento" value={department} onChangeText={setDepartment} placeholder="Departamento" />
      <PrimaryButton label={teacherId ? 'Salvar alterações' : 'Cadastrar'} onPress={handleSubmit} />
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

import React, { useContext, useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { TeacherOnly } from '@/components/TeacherOnly';
import { AppDataContext } from '@/context/AppDataContext';
import type { TeachersStackParamList } from '@/navigation/AppTabs';
import { ROUTES } from '@/utils/constants';

export function TeacherFormScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<TeachersStackParamList>>();
  const route = useRoute<RouteProp<TeachersStackParamList, typeof ROUTES.teacherForm>>();
  const { getTeacher, createTeacher, updateTeacher } = useContext(AppDataContext);
  const { teacherId } = route.params ?? {};
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    async function loadTeacher() {
      if (!teacherId) return;
      const data = await getTeacher(teacherId);
      setName(data.name);
      setEmail(data.email);
      setDepartment(data.department ?? '');
    }

    loadTeacher();
  }, [teacherId, getTeacher]);

  async function handleSubmit() {
    try {
      if (teacherId) {
        await updateTeacher(teacherId, { name, email, department });
        Alert.alert('Docentes', 'Docente atualizado com sucesso.');
      } else {
        await createTeacher({ name, email, department });
        Alert.alert('Docentes', 'Docente cadastrado com sucesso.');
      }
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao salvar docente.';
      Alert.alert('Docentes', message);
    }
  }

  return (
    <TeacherOnly>
      <SafeAreaView style={styles.container}>
        {!teacherId && (
          <View style={styles.header}>
            <Text style={styles.title}>Criação de professores</Text>
            <Text style={styles.description}>Formulário para que professores possam cadastrar outros professores.</Text>
          </View>
        )}
        <TextField label="Nome" value={name} onChangeText={setName} placeholder="Nome completo" />
        <TextField label="Email" value={email} onChangeText={setEmail} placeholder="email@instituicao.edu" />
        <TextField label="Departamento" value={department} onChangeText={setDepartment} placeholder="Departamento" />
        <PrimaryButton label={teacherId ? 'Salvar alterações' : 'Cadastrar'} onPress={handleSubmit} />
      </SafeAreaView>
    </TeacherOnly>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F1F5F9'
  },
  header: {
    marginBottom: 16,
    gap: 6
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A'
  },
  description: {
    color: '#475569',
    lineHeight: 20
  }
});

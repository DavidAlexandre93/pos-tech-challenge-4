import React, { useContext, useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { TeacherOnly } from '@/components/TeacherOnly';
import { AppDataContext } from '@/context/AppDataContext';
import type { StudentsStackParamList } from '@/navigation/AppTabs';
import { ROUTES } from '@/utils/constants';

export function StudentFormScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<StudentsStackParamList>>();
  const route = useRoute<RouteProp<StudentsStackParamList, typeof ROUTES.studentForm>>();
  const { getStudent, createStudent, updateStudent } = useContext(AppDataContext);
  const { studentId } = route.params ?? {};
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');

  useEffect(() => {
    async function loadStudent() {
      if (!studentId) return;
      const data = await getStudent(studentId);
      setName(data.name);
      setEmail(data.email);
      setCourse(data.course ?? '');
    }

    loadStudent();
  }, [studentId, getStudent]);

  async function handleSubmit() {
    try {
      if (studentId) {
        await updateStudent(studentId, { name, email, course });
        Alert.alert('Alunos', 'Aluno atualizado com sucesso.');
      } else {
        await createStudent({ name, email, course });
        Alert.alert('Alunos', 'Aluno cadastrado com sucesso.');
      }
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao salvar aluno.';
      Alert.alert('Alunos', message);
    }
  }

  return (
    <TeacherOnly>
      <SafeAreaView style={styles.container}>
        <TextField label="Nome" value={name} onChangeText={setName} placeholder="Nome completo" />
        <TextField label="Email" value={email} onChangeText={setEmail} placeholder="email@instituicao.edu" />
        <TextField label="Curso" value={course} onChangeText={setCourse} placeholder="Curso" />
        <PrimaryButton label={studentId ? 'Salvar alterações' : 'Cadastrar'} onPress={handleSubmit} />
      </SafeAreaView>
    </TeacherOnly>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F1F5F9'
  }
});

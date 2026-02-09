import React, { useCallback, useContext } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TeacherOnly } from '@/components/TeacherOnly';
import { AppDataContext } from '@/context/AppDataContext';
import type { StudentsStackParamList } from '@/navigation/AppTabs';
import { ROUTES } from '@/utils/constants';

export function StudentsListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<StudentsStackParamList>>();
  const { students, loadStudents, deleteStudent, studentsPage, studentsTotalPages } = useContext(AppDataContext);

  useFocusEffect(
    useCallback(() => {
      loadStudents(1);
    }, [loadStudents])
  );

  async function handleDelete(studentId: string) {
    try {
      await deleteStudent(studentId);
      Alert.alert('Alunos', 'Aluno removido com sucesso.');
      const targetPage = students.length === 1 && studentsPage > 1 ? studentsPage - 1 : studentsPage;
      await loadStudents(targetPage);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao remover aluno.';
      Alert.alert('Alunos', message);
    }
  }

  return (
    <TeacherOnly>
      <SafeAreaView style={styles.container}>
        <PrimaryButton label="Cadastrar aluno" onPress={() => navigation.navigate(ROUTES.studentForm)} />
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.subtitle}>{item.email}</Text>
              <View style={styles.actions}>
                <PrimaryButton
                  label="Editar"
                  variant="outline"
                  onPress={() => navigation.navigate(ROUTES.studentForm, { studentId: item.id })}
                />
                <PrimaryButton label="Excluir" variant="danger" onPress={() => handleDelete(item.id)} />
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum aluno encontrado.</Text>}
        />
        <View style={styles.pagination}>
          <PrimaryButton
            label="Anterior"
            variant="outline"
            onPress={() => loadStudents(Math.max(1, studentsPage - 1))}
            disabled={studentsPage <= 1}
          />
          <Text style={styles.pageLabel}>
            Página {studentsPage} de {studentsTotalPages}
          </Text>
          <PrimaryButton
            label="Próxima"
            variant="outline"
            onPress={() => loadStudents(Math.min(studentsTotalPages, studentsPage + 1))}
            disabled={studentsPage >= studentsTotalPages}
          />
        </View>
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
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 12
  },
  title: {
    fontSize: 16,
    fontWeight: '700'
  },
  subtitle: {
    color: '#475569',
    marginBottom: 8
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12
  },
  pageLabel: {
    color: '#475569'
  },
  empty: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 24
  }
});

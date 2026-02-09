import React, { useContext, useEffect } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TeacherOnly } from '@/components/TeacherOnly';
import { AppDataContext } from '@/context/AppDataContext';
import type { TeachersStackParamList } from '@/navigation/AppTabs';
import { ROUTES } from '@/utils/constants';

export function TeachersListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<TeachersStackParamList>>();
  const { teachers, loadTeachers, deleteTeacher, teachersPage, teachersTotalPages } = useContext(AppDataContext);

  useEffect(() => {
    loadTeachers(1);
  }, [loadTeachers]);

  async function handleDelete(teacherId: string) {
    try {
      await deleteTeacher(teacherId);
      Alert.alert('Docentes', 'Docente removido com sucesso.');
      const targetPage = teachers.length === 1 && teachersPage > 1 ? teachersPage - 1 : teachersPage;
      await loadTeachers(targetPage);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao remover docente.';
      Alert.alert('Docentes', message);
    }
  }

  return (
    <TeacherOnly>
      <SafeAreaView style={styles.container}>
        <PrimaryButton label="Cadastrar docente" onPress={() => navigation.navigate(ROUTES.teacherForm)} />
        <FlatList
          data={teachers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.subtitle}>{item.email}</Text>
              <View style={styles.actions}>
                <PrimaryButton
                  label="Editar"
                  variant="outline"
                  onPress={() => navigation.navigate(ROUTES.teacherForm, { teacherId: item.id })}
                />
                <PrimaryButton label="Excluir" variant="danger" onPress={() => handleDelete(item.id)} />
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum docente encontrado.</Text>}
        />
        <View style={styles.pagination}>
          <PrimaryButton
            label="Anterior"
            variant="outline"
            onPress={() => loadTeachers(Math.max(1, teachersPage - 1))}
            disabled={teachersPage <= 1}
          />
          <Text style={styles.pageLabel}>
            Página {teachersPage} de {teachersTotalPages}
          </Text>
          <PrimaryButton
            label="Próxima"
            variant="outline"
            onPress={() => loadTeachers(Math.min(teachersTotalPages, teachersPage + 1))}
            disabled={teachersPage >= teachersTotalPages}
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
    padding: 12,
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

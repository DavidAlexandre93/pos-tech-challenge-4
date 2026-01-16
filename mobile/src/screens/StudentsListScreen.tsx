import React, { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiRequest } from '@/api/client';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { Student } from '@/types';
import { ROUTES } from '@/utils/constants';

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
}

export function StudentsListScreen() {
  const navigation = useNavigation();
  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadStudents(currentPage: number) {
    const response = await apiRequest<PaginatedResponse<Student>>(`/students?page=${currentPage}`);
    setStudents(response.data);
    setPage(response.page);
    setTotalPages(response.totalPages);
  }

  useEffect(() => {
    loadStudents(1);
  }, []);

  async function handleDelete(studentId: string) {
    try {
      await apiRequest(`/students/${studentId}`, { method: 'DELETE' });
      Alert.alert('Alunos', 'Aluno removido com sucesso.');
      loadStudents(page);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao remover aluno.';
      Alert.alert('Alunos', message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <PrimaryButton label="Cadastrar aluno" onPress={() => navigation.navigate(ROUTES.studentForm as never)} />
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
                onPress={() => navigation.navigate(ROUTES.studentForm as never, { studentId: item.id } as never)}
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
          onPress={() => loadStudents(Math.max(1, page - 1))}
          disabled={page <= 1}
        />
        <Text style={styles.pageLabel}>
          Página {page} de {totalPages}
        </Text>
        <PrimaryButton
          label="Próxima"
          variant="outline"
          onPress={() => loadStudents(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
        />
      </View>
    </SafeAreaView>
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

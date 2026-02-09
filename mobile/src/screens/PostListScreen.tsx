import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PostCard } from '@/components/PostCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { AppDataContext } from '@/context/AppDataContext';
import { useAuth } from '@/hooks/useAuth';
import { PostsStackParamList } from '@/navigation/AppTabs';
import { ROUTES } from '@/utils/constants';

export function PostListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<PostsStackParamList>>();
  const { hasRole, logout, user } = useAuth();
  const { posts, loadPosts } = useContext(AppDataContext);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const refreshPosts = useCallback(async () => {
    try {
      setLoading(true);
      await loadPosts();
    } finally {
      setLoading(false);
    }
  }, [loadPosts]);

  async function handleLogout() {
    try {
      await logout();
    } catch {
      Alert.alert('Sessão', 'Não foi possível encerrar a sessão agora.');
    }
  }

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return posts;

    const lowerQuery = query.toLowerCase();
    return posts.filter((post) =>
      [post.title, post.content, post.author, post.description]
        .filter(Boolean)
        .some((field) => field?.toLowerCase().includes(lowerQuery))
    );
  }, [posts, query]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Posts recentes</Text>
        <Text style={styles.subtitle}>Olá, {user?.name ?? 'usuário'}.</Text>
        <View style={styles.headerActions}>
          {hasRole('teacher') && (
            <PrimaryButton label="Nova postagem" onPress={() => navigation.navigate(ROUTES.postCreate)} />
          )}
          <PrimaryButton label="Sair" variant="outline" onPress={handleLogout} />
        </View>
      </View>
      <TextField label="Buscar" value={query} onChangeText={setQuery} placeholder="Digite palavras-chave" autoCapitalize="none" />
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshPosts} />}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate(ROUTES.postDetail, { postId: item.id })}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum post encontrado para a busca informada.</Text>}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F1F5F9'
  },
  header: {
    marginBottom: 12
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A'
  },
  subtitle: {
    color: '#475569',
    marginTop: 4,
    marginBottom: 8
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  list: {
    paddingBottom: 24
  },
  empty: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 24
  }
});

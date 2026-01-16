import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiRequest } from '@/api/client';
import { PostCard } from '@/components/PostCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { AuthContext } from '@/context/AuthContext';
import type { Post } from '@/types';
import { ROUTES } from '@/utils/constants';

export function PostListScreen() {
  const navigation = useNavigation();
  const { hasRole } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadPosts() {
    try {
      setLoading(true);
      const data = await apiRequest<Post[]>('/posts');
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

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
        {hasRole('teacher') && (
          <PrimaryButton label="Nova postagem" onPress={() => navigation.navigate(ROUTES.postCreate as never)} />
        )}
      </View>
      <TextField label="Buscar" value={query} onChangeText={setQuery} placeholder="Digite palavras-chave" />
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadPosts} />}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate(ROUTES.postDetail as never, { postId: item.id } as never)}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum post encontrado.</Text>}
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
    color: '#0F172A',
    marginBottom: 8
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

import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { apiRequest } from '@/api/client';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import type { Post } from '@/types';

interface PostEditParams {
  postId: string;
}

export function PostEditScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Record<string, PostEditParams>, string>>();
  const { postId } = route.params as PostEditParams;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    async function loadPost() {
      const data = await apiRequest<Post>(`/posts/${postId}`);
      setTitle(data.title);
      setContent(data.content);
      setAuthor(data.author);
    }

    loadPost();
  }, [postId]);

  async function handleSubmit() {
    try {
      await apiRequest(`/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({ title, content, author })
      });
      Alert.alert('Postagem', 'Post atualizado com sucesso.');
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar post.';
      Alert.alert('Postagem', message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextField label="Título" value={title} onChangeText={setTitle} placeholder="Digite o título" />
      <TextField label="Autor" value={author} onChangeText={setAuthor} placeholder="Nome do autor" />
      <TextField label="Conteúdo" value={content} onChangeText={setContent} placeholder="Conteúdo" multiline />
      <PrimaryButton label="Salvar alterações" onPress={handleSubmit} />
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

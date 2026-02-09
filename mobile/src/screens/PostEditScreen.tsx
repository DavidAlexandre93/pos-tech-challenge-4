import React, { useContext, useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { TeacherOnly } from '@/components/TeacherOnly';
import { AppDataContext } from '@/context/AppDataContext';
import type { AdminStackParamList, PostsStackParamList } from '@/navigation/AppTabs';
import { ROUTES } from '@/utils/constants';

export function PostEditScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<PostsStackParamList | AdminStackParamList>>();
  const route = useRoute<RouteProp<PostsStackParamList, typeof ROUTES.postEdit>>();
  const { getPost, updatePost } = useContext(AppDataContext);
  const { postId } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        setIsLoading(true);
        const data = await getPost(postId);
        setTitle(data.title);
        setContent(data.content);
        setAuthor(data.author);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao carregar dados do post.';
        Alert.alert('Postagem', message, [{ text: 'Voltar', onPress: () => navigation.goBack() }]);
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [getPost, navigation, postId]);

  async function handleSubmit() {
    if (!title.trim() || !content.trim() || !author.trim()) {
      Alert.alert('Postagem', 'Preencha título, autor e conteúdo antes de salvar.');
      return;
    }

    try {
      setIsSaving(true);
      await updatePost(postId, { title: title.trim(), content: content.trim(), author: author.trim() });
      Alert.alert('Postagem', 'Post atualizado com sucesso.');
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar post.';
      Alert.alert('Postagem', message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <TeacherOnly>
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <Text style={styles.loading}>Carregando dados atuais da postagem...</Text>
        ) : (
          <>
            <TextField label="Título" value={title} onChangeText={setTitle} placeholder="Digite o título" />
            <TextField label="Autor" value={author} onChangeText={setAuthor} placeholder="Nome do autor" />
            <TextField label="Conteúdo" value={content} onChangeText={setContent} placeholder="Conteúdo" multiline />
            <PrimaryButton
              label={isSaving ? 'Salvando...' : 'Salvar alterações'}
              onPress={handleSubmit}
              disabled={isSaving}
            />
          </>
        )}
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
  loading: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 24
  }
});

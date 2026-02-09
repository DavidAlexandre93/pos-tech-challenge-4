import React, { useContext, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { TeacherOnly } from '@/components/TeacherOnly';
import { AppDataContext } from '@/context/AppDataContext';

export function PostCreateScreen() {
  const navigation = useNavigation();
  const { createPost } = useContext(AppDataContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || !content.trim() || !author.trim()) {
      Alert.alert('Postagem', 'Preencha título, conteúdo e autor para continuar.');
      return;
    }

    try {
      setIsSubmitting(true);
      await createPost({ title: title.trim(), content: content.trim(), author: author.trim() });
      Alert.alert('Postagem', 'Post criado com sucesso.');
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao enviar post.';
      Alert.alert('Postagem', message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <TeacherOnly>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Criação de postagens</Text>
        <Text style={styles.subtitle}>Formulário exclusivo para professores.</Text>
        <TextField label="Título" value={title} onChangeText={setTitle} placeholder="Digite o título" />
        <TextField label="Autor" value={author} onChangeText={setAuthor} placeholder="Nome do autor" />
        <TextField label="Conteúdo" value={content} onChangeText={setContent} placeholder="Escreva o conteúdo" multiline />
        <PrimaryButton label={isSubmitting ? 'Enviando...' : 'Enviar postagem'} onPress={handleSubmit} disabled={isSubmitting} />
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12
  }
});

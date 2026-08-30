/**
 * LOCALIZAÇÃO: src/app/index.tsx
 * PROPÓSITO: Tela 1 - Menu Principal da aplicação.
 * 
 * ONDE VÃO AS AÇÕES DESTA TELA:
 * - Ação 'Cadastrar': router.push('/cadastrar') -> Direciona para a tela de formulário de cadastro.
 * - Ação 'Consultar': router.push('/consultar') -> Direciona para a tela de lista de cadastros.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { colors } from '@/theme';

/**
 * Componente HomeScreen
 * Renderiza o Menu Principal da aplicação contendo os 2 botões para as funcionalidades de Cadastrar e Consultar.
 */
export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.title}>Sistema de Cadastros</Text>
        <Text style={styles.subtitle}>
          Selecione uma opção abaixo para navegar pelo sistema:
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Cadastrar"
          onPress={() => router.push('/cadastrar')}
          variant="primary"
          size="large"
          style={styles.mainButton}
        />

        <Button
          title="Consultar"
          onPress={() => router.push('/consultar')}
          variant="secondary"
          size="large"
          style={styles.mainButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
    gap: 16,
  },
  mainButton: {
    width: '100%',
  },
});

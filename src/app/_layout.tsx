/**
 * LOCALIZAÇÃO: src/app/_layout.tsx
 * PROPÓSITO: Layout raiz do aplicativo utilizando Expo Router (Stack Navigator).
 * 
 * ONDE FICA CADA ROTA:
 * - Tela Principal (index):     src/app/index.tsx
 * - Tela de Cadastro:           src/app/cadastrar.tsx
 * - Tela de Consulta/Lista:     src/app/consultar.tsx
 * 
 * ONDE VÃO AS AÇÕES DE CONFIGURAÇÃO DE NAVEGAÇÃO:
 * - Alteração de títulos de cabeçalho, cores do tema e botão Home no menu superior.
 */

import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme';

/**
 * Componente HeaderHomeButton
 * Renderiza o botão "Home" no cabeçalho superior para voltar à tela inicial de qualquer lugar do app.
 */
function HeaderHomeButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Não precisa exibir o botão Home se já estiver na tela inicial
  if (pathname === '/' || pathname === '/index') {
    return null;
  }

  /**
   * Ação de navegação para a tela inicial
   */
  const handleGoHome = () => {
    router.replace('/');
  };

  return (
    <TouchableOpacity style={styles.homeButton} onPress={handleGoHome} activeOpacity={0.7}>
      <Text style={styles.homeButtonText}>Início</Text>
    </TouchableOpacity>
  );
}

/**
 * Componente RootLayout
 * Define o container principal da pilha de telas (Stack) e configura o visual da barra de cabeçalho e status bar.
 */
export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
          headerRight: () => <HeaderHomeButton />,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Menu Principal',
          }}
        />
        <Stack.Screen
          name="cadastrar"
          options={{
            title: 'Cadastrar Pessoa',
          }}
        />
        <Stack.Screen
          name="consultar"
          options={{
            title: 'Consultar Cadastros',
          }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  homeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 4,
  },
  homeButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
});

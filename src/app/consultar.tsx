/**
 * LOCALIZAÇÃO: src/app/consultar.tsx
 * PROPÓSITO: Tela 3 - Consulta de Cadastros (Exibição de lista com dados fixos).
 * 
 * ONDE VÃO AS AÇÕES DESTA TELA:
 * - Ação 'Abrir':   Função `handleAbrir(item)`   -> Exibe modal/alerta com detalhes do cadastro.
 * - Ação 'Editar':  Função `handleEditar(item)`  -> Redireciona para a tela de cadastro com os dados preenchidos.
 * - Ação 'Excluir': Função `handleExcluir(id)`   -> Pede confirmação e remove o cadastro do estado da lista.
 * - Ação '+ Novo':  `router.push('/cadastrar')`  -> Redireciona para a tela de novo cadastro.
 */

import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Cadastro } from '@/types/cadastro';
import { CadastroItemCard } from '@/components/CadastroItemCard';
import { Button } from '@/components/Button';
import { colors } from '@/theme';

// Dados fixos para demonstração
const DADOS_INICIAIS: Cadastro[] = [
  {
    id: '1',
    nome: 'Ana Souza',
    email: 'ana.souza@email.com',
    telefone: '(11) 98765-4321',
  },
  {
    id: '2',
    nome: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    telefone: '(21) 99887-7665',
  },
  {
    id: '3',
    nome: 'Mariana Santos',
    email: 'mariana.santos@email.com',
    telefone: '(31) 97654-3210',
  },
];

/**
 * Componente ConsultarScreen
 * Renderiza a lista de registros cadastrados com opções de visualização, edição e exclusão.
 */
export default function ConsultarScreen() {
  const router = useRouter();
  const [cadastros, setCadastros] = useState<Cadastro[]>(DADOS_INICIAIS);

  /**
   * Função handleEditar
   * Navega para a tela de cadastro enviando os dados do registro selecionado para edição.
   */
  const handleEditar = (item: Cadastro) => {
    router.push({
      pathname: '/cadastrar',
      params: {
        id: item.id,
        nome: item.nome,
        email: item.email,
        telefone: item.telefone,
      },
    });
  };

  /**
   * Função handleExcluir
   * Solicita confirmação ao usuário e remove o item correspondente do estado da lista.
   */
  const handleExcluir = (id: string) => {
    const item = cadastros.find((c) => c.id === id);
    Alert.alert(
      'Excluir Cadastro',
      `Tem certeza que deseja excluir ${item?.nome || 'este item'}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setCadastros((prev) => prev.filter((c) => c.id !== id));
          },
        },
      ]
    );
  };

  /**
   * Função handleAbrir
   * Exibe alerta detalhado com todas as informações do cadastro selecionado.
   */
  const handleAbrir = (item: Cadastro) => {
    Alert.alert(
      'Detalhes do Cadastro',
      `ID: ${item.id}\nNome: ${item.nome}\nEmail: ${item.email}\nTelefone: ${item.telefone}`
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.totalText}>Total: {cadastros.length} cadastro(s)</Text>
        <Button
          title="+ Novo"
          onPress={() => router.push('/cadastrar')}
          variant="primary"
          size="small"
        />
      </View>

      <FlatList
        data={cadastros}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CadastroItemCard
            item={item}
            onEditar={handleEditar}
            onExcluir={handleExcluir}
            onAbrir={handleAbrir}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum cadastro encontrado.</Text>
            <Button
              title="Cadastrar Agora"
              onPress={() => router.push('/cadastrar')}
              variant="outline"
              size="medium"
              style={styles.emptyButton}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  emptyButton: {
    minWidth: 160,
  },
});

/**
 * LOCALIZAÇÃO: src/app/consultar.tsx
 * PROPÓSITO: Tela 3 - Consulta de Cadastros (agora buscando os dados de verdade no Turso).
 *
 * ONDE VÃO AS AÇÕES DESTA TELA:
 * - Buscar a lista:  Função `carregarContatos()`  -> chama `listarContatos()` do service.
 * - Ação 'Abrir':    Função `handleAbrir(item)`   -> Exibe alerta com detalhes do cadastro.
 * - Ação 'Editar':   Função `handleEditar(item)`  -> Redireciona para a tela de cadastro com os dados preenchidos.
 * - Ação 'Excluir':  Função `handleExcluir(id)`   -> Pede confirmação e remove o cadastro no banco.
 * - Ação '+ Novo':   `router.push('/cadastrar')`  -> Redireciona para a tela de novo cadastro.
 *
 * DICA: sempre que uma tela precisa "buscar dados quando abre", o padrão é
 * usar `useEffect(() => { minhaFuncao(); }, [])` — o array vazio `[]` no
 * final significa "rode só uma vez, quando o componente for exibido".
 */

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Cadastro } from '@/types/cadastro';
import { CadastroItemCard } from '@/components/CadastroItemCard';
import { Button } from '@/components/Button';
import { colors } from '@/theme';
import { listarContatos, excluirContato } from '@/services/contatos';

/**
 * Componente ConsultarScreen
 * Renderiza a lista de registros cadastrados (vindos do Turso) com opções
 * de visualização, edição e exclusão.
 */
export default function ConsultarScreen() {
  const router = useRouter();

  // Lista de contatos exibida na tela. Começa vazia até a busca terminar.
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);

  // Controla o "carregando..." exibido enquanto buscamos os dados no Turso.
  const [carregando, setCarregando] = useState(true);

  // Guarda uma mensagem de erro, caso a busca no banco falhe (ex: sem internet).
  const [erro, setErro] = useState<string | null>(null);

  /**
   * Função carregarContatos
   * Busca a lista de contatos no Turso (através do service `contatos.ts`)
   * e atualiza o estado da tela.
   *
   * DICA: essa é a função que você deve chamar de novo sempre que quiser
   * "atualizar a lista" (ex: depois de excluir um item, ou com um botão
   * de "puxar para atualizar" — pull to refresh).
   */
  const carregarContatos = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const listaDoBanco = await listarContatos();
      setCadastros(listaDoBanco);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro desconhecido ao buscar contatos';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  // Roda `carregarContatos()` automaticamente assim que a tela é aberta.
  useEffect(() => {
    carregarContatos();
  }, []);

  /**
   * Função handleEditar
   * Navega para a tela de cadastro enviando os dados do registro selecionado para edição.
   *
   * DICA: aqui estamos enviando os dados já carregados na lista (mais rápido).
   * Se quisesse ter certeza de pegar os dados mais atualizados do banco antes
   * de editar, poderíamos usar `buscarContatoPorId(item.id)` do service.
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
   * Pergunta se o usuário tem certeza e, se confirmado, chama `excluirContato`
   * no Turso. Assim que o banco confirma a exclusão, atualizamos a lista
   * na tela removendo o item (sem precisar recarregar tudo de novo).
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
          onPress: async () => {
            try {
              await excluirContato(id);
              setCadastros((prev) => prev.filter((c) => c.id !== id));
            } catch (err) {
              const mensagem = err instanceof Error ? err.message : 'Erro desconhecido';
              Alert.alert('Erro ao excluir', mensagem);
            }
          },
        },
      ]
    );
  };

  /**
   * Função handleAbrir
   * Exibe alerta detalhado com todas as informações do cadastro selecionado.
   *
   * DICA: em um projeto maior, no lugar de um `Alert`, essa ação normalmente
   * abriria uma nova tela de "detalhes" (ex: router.push('/detalhes/' + item.id)).
   */
  const handleAbrir = (item: Cadastro) => {
    Alert.alert(
      'Detalhes do Cadastro',
      `ID: ${item.id}\nNome: ${item.nome}\nEmail: ${item.email}\nTelefone: ${item.telefone}`
    );
  };

  // Enquanto os dados ainda estão sendo buscados, mostramos um spinner de carregamento.
  if (carregando) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.totalText}>Carregando contatos...</Text>
      </View>
    );
  }

  // Se algo deu errado na busca, mostramos a mensagem de erro e um botão para tentar de novo.
  if (erro) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>{erro}</Text>
        <Button title="Tentar Novamente" onPress={carregarContatos} variant="primary" size="medium" />
      </View>
    );
  }

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
        // DICA: "onRefresh" + "refreshing" ativam o gesto de "puxar para atualizar".
        onRefresh={carregarContatos}
        refreshing={carregando}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
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

/**
 * LOCALIZAÇÃO: src/app/cadastrar.tsx
 * PROPÓSITO: Tela 2 - Formulário para Cadastrar/Editar pessoa (Nome completo, E-mail, Telefone).
 *
 * ONDE VÃO AS AÇÕES DESTA TELA:
 * - Preenchimento automático (Edição): Preenche os campos se houver parâmetros na rota (`params`).
 * - Validação dos campos:      Função `validate()` - verifica se os campos foram preenchidos corretamente.
 * - Ação 'Salvar Cadastro':    Função `handleSalvar()` - decide entre CRIAR ou ATUALIZAR e chama o service.
 * - Ação 'Voltar':             `router.back()` - retorna para a tela anterior.
 *
 * DICA: essa mesma tela serve tanto para CADASTRAR quanto para EDITAR.
 * A variável `isEditing` é quem decide o comportamento (veja mais abaixo).
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors } from '@/theme';
import { criarContato, atualizarContato } from '@/services/contatos';

/**
 * Componente CadastrarScreen
 * Renderiza o formulário de cadastro/edição de pessoa e gerencia os dados de entrada e validações.
 */
export default function CadastrarScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; nome?: string; email?: string; telefone?: string }>();

  // Modo edição ativado se um ID for passado nos parâmetros da rota.
  // DICA: é assim que a tela "sabe" se deve criar um contato novo ou editar
  // um que já existe — repare que quem envia esse `id` é a função
  // `handleEditar` lá em src/app/consultar.tsx.
  const isEditing = Boolean(params.id);

  const [nome, setNome] = useState(params.nome || '');
  const [email, setEmail] = useState(params.email || '');
  const [telefone, setTelefone] = useState(params.telefone || '');

  const [errors, setErrors] = useState<{ nome?: string; email?: string; telefone?: string }>({});
  const [salvando, setSalvando] = useState(false);

  /**
   * Preenche os campos com os dados do parâmetro se for recebido um cadastro para edição.
   *
   * DICA: o array `[params.id, params.nome, params.email, params.telefone]`
   * no final são as "dependências" do efeito. Ele só roda de novo se algum
   * desses valores mudar (ex: quando você clica em "Editar" em outro item).
   */
  useEffect(() => {
    if (params.nome) setNome(params.nome);
    if (params.email) setEmail(params.email);
    if (params.telefone) setTelefone(params.telefone);
  }, [params.id, params.nome, params.email, params.telefone]);

  /**
   * Função validate
   * Executa a validação dos campos obrigatórios (nome, e-mail válido, telefone).
   * Retorna `true` se todos os dados forem válidos, e preenche `errors` com
   * as mensagens de cada campo que estiver errado.
   *
   * DICA: se quiser validar o telefone com uma quantidade mínima de números,
   * dá pra adicionar algo como:
   *   if (telefone.replace(/\D/g, '').length < 10) { newErrors.telefone = 'Telefone incompleto'; }
   */
  const validate = () => {
    const newErrors: { nome?: string; email?: string; telefone?: string } = {};

    if (!nome.trim()) {
      newErrors.nome = 'Nome completo é obrigatório';
    }
    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!email.includes('@')) {
      newErrors.email = 'Informe um e-mail válido';
    }
    if (!telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Função handleSalvar
   * Disparada ao clicar em 'Salvar Cadastro' ou 'Atualizar Cadastro'.
   *
   * COMO FUNCIONA:
   * 1. Valida os campos (validate());
   * 2. Se `isEditing` for verdadeiro, chama `atualizarContato` (UPDATE no banco);
   *    caso contrário, chama `criarContato` (INSERT no banco);
   * 3. Mostra uma mensagem de sucesso e volta para a tela de consulta.
   *
   * DICA: repare que as duas chamadas (`criarContato`/`atualizarContato`) usam
   * `await` e estão dentro de um `try/catch`. Isso é o padrão para lidar com
   * operações que podem demorar (chamadas de rede) e podem falhar (sem internet,
   * erro no banco, etc.) sem travar o aplicativo.
   */
  const handleSalvar = async () => {
    if (!validate()) {
      return;
    }

    setSalvando(true);
    try {
      if (isEditing && params.id) {
        await atualizarContato(params.id, { nome, email, telefone });
      } else {
        await criarContato({ nome, email, telefone });
      }

      const mensagem = isEditing
        ? `Cadastro de "${nome}" atualizado com sucesso!`
        : `Cadastro de "${nome}" efetuado com sucesso!`;

      Alert.alert(
        'Sucesso',
        mensagem,
        [
          {
            text: 'OK',
            onPress: () => {
              setNome('');
              setEmail('');
              setTelefone('');
              router.push('/consultar');
            },
          },
        ]
      );
    } catch (err) {
      // DICA: sempre trate o erro mostrando algo para o usuário — nunca deixe
      // a tela "travada" sem explicação caso o Turso recuse a operação.
      const mensagem = err instanceof Error ? err.message : 'Erro desconhecido';
      Alert.alert('Erro ao salvar', mensagem);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.formCard}>
        <Input
          label="Nome Completo"
          placeholder="Ex: Maria Silva"
          value={nome}
          onChangeText={setNome}
          error={errors.nome}
          autoCapitalize="words"
        />

        <Input
          label="E-mail"
          placeholder="Ex: maria.silva@email.com"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Telefone"
          placeholder="Ex: (11) 99999-8888"
          value={telefone}
          onChangeText={setTelefone}
          error={errors.telefone}
          keyboardType="phone-pad"
        />

        <View style={styles.buttonRow}>
          {/* Ação de submissão do formulário (Salvar ou Atualizar) */}
          <Button
            title={isEditing ? 'Atualizar Cadastro' : 'Salvar Cadastro'}
            onPress={handleSalvar}
            variant="success"
            size="large"
            loading={salvando}
            disabled={salvando}
            style={styles.submitBtn}
          />
          {/* Ação de retorno para a tela anterior */}
          <Button
            title="Voltar"
            onPress={() => router.back()}
            variant="outline"
            size="medium"
            disabled={salvando}
            style={styles.cancelBtn}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonRow: {
    marginTop: 12,
    gap: 10,
  },
  submitBtn: {
    width: '100%',
  },
  cancelBtn: {
    width: '100%',
  },
});

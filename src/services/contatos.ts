/**
 * LOCALIZAÇÃO: src/services/contatos.ts
 * PROPÓSITO: Esta é a nossa "camada de dados" (Service Layer).
 *
 * O QUE É ISSO? Em vez de chamar o Supabase diretamente dentro das telas (app/*.tsx),
 * concentramos aqui TODAS as funções que conversam com o banco de dados.
 *
 * VANTAGEM DIDÁTICA: se um dia precisarmos trocar o Supabase por outra API,
 * só mudamos este arquivo — as telas continuam chamando as mesmas funções.
 *
 * Tabela usada: 'contacts' (criada no Supabase com os campos: id, created_at, name, email, phone)
 */

import { supabase } from '@/services/supabase';
import { Cadastro } from '@/types/cadastro';

// Nome da tabela no banco de dados. Ficou centralizado aqui para evitar
// digitar "contacts" (em inglês) várias vezes pelo arquivo.
const NOME_DA_TABELA = 'contacts';

/**
 * Formato "cru" (bruto) que a tabela do Supabase devolve.
 * Repare que os nomes das colunas estão em inglês (name, phone) porque foi
 * assim que a tabela foi criada no banco (veja o `create table` do Supabase).
 */
interface LinhaDaTabelaContacts {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
}

/**
 * Dados que o formulário de cadastro (tela cadastrar.tsx) envia para nós.
 * Aqui já usamos nomes em português para facilitar a leitura nas telas.
 */
interface DadosDoFormulario {
  nome: string;
  email: string;
  telefone: string;
}

/**
 * Função auxiliar (helper) de tradução.
 * Converte uma linha do banco (inglês) para o formato usado nas telas (português).
 *
 * DICA: sempre que você adicionar uma nova coluna na tabela (ex: "idade"),
 * lembre de adicionar ela aqui também, senão a informação some na tela!
 */
function converterLinhaParaCadastro(linha: LinhaDaTabelaContacts): Cadastro {
  return {
    id: String(linha.id),
    nome: linha.name,
    email: linha.email,
    telefone: linha.phone,
  };
}

/**
 * 1) LISTAR (Consultar todos os contatos)
 *
 * COMO FUNCIONA: pedimos ao Supabase um "select" de todas as colunas (*)
 * da tabela 'contacts', ordenando pelos mais recentes primeiro.
 *
 * USADA EM: src/app/consultar.tsx (para preencher a lista de cadastros)
 *
 * DICA: se você quiser buscar só os contatos que contêm "Ana" no nome, pode
 * trocar o `.select('*')` por:
 *   .select('*').ilike('name', '%Ana%')
 */
export async function listarContatos(): Promise<Cadastro[]> {
  const { data, error } = await supabase
    .from(NOME_DA_TABELA)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Não foi possível carregar os contatos: ${error.message}`);
  }

  // O banco pode devolver "null" se a tabela estiver vazia, por isso o "|| []"
  const linhas = (data || []) as LinhaDaTabelaContacts[];
  return linhas.map(converterLinhaParaCadastro);
}

/**
 * 2) CRIAR (Cadastrar um novo contato)
 *
 * COMO FUNCIONA: enviamos um "insert" com os 3 campos obrigatórios.
 * O Supabase gera automaticamente o "id" e o "created_at".
 *
 * USADA EM: src/app/cadastrar.tsx (botão "Salvar Cadastro")
 *
 * DICA: o `.select().single()` no final serve para o Supabase devolver o
 * registro recém-criado (já com o id gerado). Sem isso, o "data" viria vazio.
 */
export async function criarContato(dados: DadosDoFormulario): Promise<Cadastro> {
  const { data, error } = await supabase
    .from(NOME_DA_TABELA)
    .insert({ name: dados.nome, email: dados.email, phone: dados.telefone })
    .select()
    .single();

  if (error) {
    throw new Error(`Não foi possível salvar o cadastro: ${error.message}`);
  }

  return converterLinhaParaCadastro(data as LinhaDaTabelaContacts);
}

/**
 * 3) ATUALIZAR (Editar um contato existente)
 *
 * COMO FUNCIONA: enviamos um "update" filtrando pelo id (`.eq('id', id)`)
 * para garantir que só AQUELE registro específico seja alterado.
 *
 * USADA EM: src/app/cadastrar.tsx (quando a tela é aberta em modo edição,
 * vinda do botão "Editar" da tela de consulta)
 *
 * DICA: se quiser atualizar só um campo (ex: apenas o telefone), basta
 * enviar `{ phone: novoTelefone }` no lugar do objeto completo.
 */
export async function atualizarContato(id: string, dados: DadosDoFormulario): Promise<Cadastro> {
  const { data, error } = await supabase
    .from(NOME_DA_TABELA)
    .update({ name: dados.nome, email: dados.email, phone: dados.telefone })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Não foi possível atualizar o cadastro: ${error.message}`);
  }

  return converterLinhaParaCadastro(data as LinhaDaTabelaContacts);
}

/**
 * 4) EXCLUIR (Remover um contato)
 *
 * COMO FUNCIONA: enviamos um "delete" filtrando pelo id, igual fizemos no
 * "atualizarContato". Aqui não precisamos devolver nada, só confirmar que
 * não deu erro.
 *
 * USADA EM: src/app/consultar.tsx (botão "Excluir" de cada item da lista)
 *
 * DICA: no lugar de excluir de verdade, muitos sistemas preferem um
 * "soft delete" (ex: uma coluna `ativo: boolean`) e apenas escondem o
 * registro da listagem. Isso evita perda de dados por engano.
 */
export async function excluirContato(id: string): Promise<void> {
  const { error } = await supabase.from(NOME_DA_TABELA).delete().eq('id', id);

  if (error) {
    throw new Error(`Não foi possível excluir o cadastro: ${error.message}`);
  }
}

/**
 * 5) BUSCAR UM ÚNICO CONTATO (bônus)
 *
 * COMO FUNCIONA: mesmo esquema do "listarContatos", mas filtrando por id
 * e usando `.single()` porque esperamos apenas 1 resultado.
 *
 * USADA EM: opcionalmente pode substituir a busca via parâmetros de rota
 * na tela de edição, buscando os dados mais atualizados direto do banco.
 *
 * DICA: use essa função se quiser garantir que a tela de edição sempre
 * mostre os dados mais recentes (e não os dados "antigos" que vieram da lista).
 */
export async function buscarContatoPorId(id: string): Promise<Cadastro> {
  const { data, error } = await supabase
    .from(NOME_DA_TABELA)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Não foi possível encontrar o cadastro: ${error.message}`);
  }

  return converterLinhaParaCadastro(data as LinhaDaTabelaContacts);
}

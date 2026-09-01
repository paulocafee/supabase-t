/**
 * LOCALIZAÇÃO: src/services/contatos.ts
 * PROPÓSITO: Esta é a nossa "camada de dados" (Service Layer), agora usando o Turso.
 *
 * O QUE É ISSO? Em vez de chamar o Turso diretamente dentro das telas (app/*.tsx),
 * concentramos aqui TODAS as funções que conversam com o banco de dados.
 *
 * VANTAGEM DIDÁTICA: se um dia precisarmos trocar o Turso por outra API,
 * só mudamos este arquivo — as telas continuam chamando as mesmas funções.
 *
 * Tabela usada: 'contacts' (id, name, email, phone)
 *
 * REFERÊNCIA: a versão anterior deste arquivo, usando Supabase, foi mantida
 * em src/services/supabase-contatos.ts para consulta.
 */

import { turso } from '@/services/turso';
import { Cadastro } from '@/types/cadastro';

const NOME_DA_TABELA = 'contacts';

/**
 * Formato "cru" (bruto) que a tabela do Turso devolve.
 * Os nomes das colunas estão em inglês (name, phone) para manter compatibilidade
 * com a tabela criada originalmente no Supabase.
 */
interface LinhaDaTabelaContacts {
  id: number;
  name: string;
  email: string;
  phone: string;
}

/**
 * Dados que o formulário de cadastro (tela cadastrar.tsx) envia para nós.
 */
interface DadosDoFormulario {
  nome: string;
  email: string;
  telefone: string;
}

/**
 * Converte uma linha do banco (inglês) para o formato usado nas telas (português).
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
 * USADA EM: src/app/consultar.tsx
 * 
 * 1. resultado.rows[0]: Pega o primeiro item (registro) do array de resultados retornado pela consulta SQL.
 * 2. as unknown: "Limpa" o tipo original do Turso (que vem como um tipo genérico 'Row' ou 'any') 
 * para evitar que o TypeScript reclame de incompatibilidade direta de tipos.
 * 3. as LinhaDaTabelaContacts: Força o TypeScript a entender e tratar aquele objeto com a estrutura 
 * da interface 'LinhaDaTabelaContacts' (com os campos id, name, email e phone).
 */
export async function listarContatos(): Promise<Cadastro[]> {

  const resultado = await turso.execute(
    `SELECT * FROM ${NOME_DA_TABELA} ORDER BY id DESC`
  );

  const linhas = resultado.rows as unknown as LinhaDaTabelaContacts[];
  return linhas.map(converterLinhaParaCadastro);
}

/**
 * 2) CRIAR (Cadastrar um novo contato)
 * USADA EM: src/app/cadastrar.tsx (botão "Salvar Cadastro")
 */
export async function criarContato(dados: DadosDoFormulario): Promise<Cadastro> {

  const resultado = await turso.execute({
    sql: `INSERT INTO ${NOME_DA_TABELA} (name, email, phone) VALUES (?, ?, ?) RETURNING *`,
    args: [dados.nome, dados.email, dados.telefone],
  });

  const linha = resultado.rows[0] as unknown as LinhaDaTabelaContacts;
  return converterLinhaParaCadastro(linha);
}

/**
 * 3) ATUALIZAR (Editar um contato existente)
 * USADA EM: src/app/cadastrar.tsx (modo edição)
 */
export async function atualizarContato(id: string, dados: DadosDoFormulario): Promise<Cadastro> {

  const resultado = await turso.execute({
    sql: `UPDATE ${NOME_DA_TABELA} SET name = ?, email = ?, phone = ? WHERE id = ? RETURNING *`,
    args: [dados.nome, dados.email, dados.telefone, id],
  });

  if (resultado.rows.length === 0) {
    throw new Error('Não foi possível atualizar o cadastro: registro não encontrado.');
  }

  const linha = resultado.rows[0] as unknown as LinhaDaTabelaContacts;
  return converterLinhaParaCadastro(linha);
}

/**
 * 4) EXCLUIR (Remover um contato)
 * USADA EM: src/app/consultar.tsx (botão "Excluir" de cada item da lista)
 */
export async function excluirContato(id: string): Promise<void> {

  await turso.execute({
    sql: `DELETE FROM ${NOME_DA_TABELA} WHERE id = ?`,
    args: [id],
  });
}

/**
 * 5) BUSCAR UM ÚNICO CONTATO (bônus)
 */
export async function buscarContatoPorId(id: string): Promise<Cadastro> {

  const resultado = await turso.execute({
    sql: `SELECT * FROM ${NOME_DA_TABELA} WHERE id = ?`,
    args: [id],
  });

  if (resultado.rows.length === 0) {
    throw new Error('Não foi possível encontrar o cadastro.');
  }

  const linha = resultado.rows[0] as unknown as LinhaDaTabelaContacts;
  return converterLinhaParaCadastro(linha);
}


> ⚠️ **Lembrando: essas informações não aparecem do céu.** Tudo o que está documentado
> aqui foi tirado da documentação oficial do Turso. **Leiam a documentação!**
> Referência completa do cliente TypeScript (`@libsql/client`): https://docs.turso.tech/sdk/ts/quickstart
>
> Links diretos para cada operação do CRUD básico usada neste projeto:
> - `execute` com `SELECT` (consultar/listar): https://docs.turso.tech/sdk/ts/reference#execute
> - `execute` com `INSERT ... RETURNING` (cadastrar): https://docs.turso.tech/sdk/ts/reference#execute
> - `execute` com `UPDATE ... RETURNING` (editar): https://docs.turso.tech/sdk/ts/reference#execute
> - `execute` com `DELETE` (excluir): https://docs.turso.tech/sdk/ts/reference#execute
> - `createClient` (conexão inicial): https://docs.turso.tech/sdk/ts/reference#createclient

## instalado
npm install @libsql/client --legacy-peer-deps

## Passo 1: Criar o Banco de Dados no Turso
Acesse turso.tech (ou use a CLI `turso`) e faça login.

Crie um banco novo:

```bash
turso db create crudapp
```

Anote o nome do banco — ele será usado para pegar a URL de conexão.

## Passo 2: Criar a Tabela no Banco de Dados
1. Abra o shell do banco: `turso db shell crudapp`.
2. Cole o código abaixo:

```sql
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL
);
```

3. Pressione Enter. Se não der erro, a tabela foi criada.
> Observação: você também pode rodar essa consulta pelo dashboard web do Turso.

## Passo 3: Pegar a URL e o Token de Acesso
Para conectar o app ao banco, você precisa da URL e de um token de autenticação:

```bash
turso db show crudapp --url
turso db tokens create crudapp
```

- **URL**: algo como `libsql://crudapp-usuario.aws-us-east-1.turso.io`
- **Token**: um JWT longo gerado pelo comando acima

## Passo 4: Configurar as Variáveis no React Native Expo
No seu projeto React Native, crie um arquivo chamado `.env` na raiz do projeto (no mesmo nível do `package.json`).

Cole as informações que você copiou do Turso dentro dele:

```
EXPO_PUBLIC_TURSO_URL=cole_aqui_a_sua_url
EXPO_PUBLIC_TURSO_TOKEN=cole_aqui_o_seu_token
```

(Lembre-se de não colocar aspas e nem espaços ao lado do sinal de igual).

## Passo 5: Instalar as dependências do Turso no projeto
No terminal, dentro da pasta do projeto, rode:

```bash
npx expo install @libsql/client --legacy-peer-deps
```

- **@libsql/client**: biblioteca oficial que sabe "conversar" com o Turso/libSQL.

## Passo 6: Criar o cliente de conexão (src/services/turso.ts)
Esse arquivo é criado UMA ÚNICA VEZ e reutilizado em todo o app. Ele lê as
variáveis do `.env` e monta a conexão:

```ts
import { createClient } from '@libsql/client/web';

const urlDoTurso = process.env.EXPO_PUBLIC_TURSO_URL;
const tokenDoTurso = process.env.EXPO_PUBLIC_TURSO_TOKEN;

export const turso = createClient({
  url: urlDoTurso!,
  authToken: tokenDoTurso!,
});
```

> DICA: usamos a build `@libsql/client/web` porque a build padrão depende de
> módulos nativos do Node (`node:buffer`), que não existem no React Native.
>
> DICA: nunca crie um `createClient` dentro de uma tela. Sempre importe o
> `turso` já pronto deste arquivo (`import { turso } from '@/services/turso'`).

## Passo 7: Criar a camada de serviços (src/services/contatos.ts)
Em vez de chamar o Turso direto dentro das telas, concentramos as
funções de banco de dados em um só lugar. Isso deixa o código mais fácil
de entender e de dar manutenção:

- `listarContatos()` → busca todos os contatos (SELECT).
- `criarContato(dados)` → cadastra um novo contato (INSERT ... RETURNING).
- `atualizarContato(id, dados)` → edita um contato existente (UPDATE ... RETURNING).
- `excluirContato(id)` → remove um contato (DELETE).
- `buscarContatoPorId(id)` → busca um único contato (bônus, também é um SELECT).

> DICA: toda função do service segue o mesmo padrão: chama o Turso via
> `turso.execute(...)` e, se a query falhar, a Promise rejeita — por isso
> usamos `try/catch` nas telas para tratar os erros.

## Passo 8: Usar o service nas telas
- **src/app/cadastrar.tsx**: chama `criarContato` (cadastro novo) ou
  `atualizarContato` (quando a tela é aberta em modo edição, a partir do
  botão "Editar" da lista).
- **src/app/consultar.tsx**: chama `listarContatos` assim que a tela abre
  (dentro de um `useEffect`) e `excluirContato` no botão "Excluir" de cada item.

> DICA: se a lista não atualizar depois de cadastrar um novo contato, dê um
> "puxar para atualizar" (pull to refresh) na tela de consulta — ela chama
> `carregarContatos()` de novo automaticamente.

## Próximos passos sugeridos (para praticar)
- Adicionar um campo de busca que filtra os contatos pelo nome (`WHERE name LIKE '%...%'`).
- Adicionar paginação na listagem quando o número de contatos crescer.
- Usar o [Turso Sync](https://docs.turso.tech/sync/usage) para funcionar offline.

## Sobre a versão anterior (Supabase)
Este projeto usava Supabase antes da migração para o Turso. Os arquivos
originais foram mantidos como referência (não são mais usados pelas telas):
- `src/services/supabase.ts`
- `src/services/supabase-contatos.ts`
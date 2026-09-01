/**
 * LOCALIZAÇÃO: src/services/turso.ts
 * PROPÓSITO: Este arquivo cria a "conexão" (cliente) com o Turso (libSQL).
 *
 * IMPORTANTE: crie esse cliente UMA ÚNICA VEZ e o reutilize em todo o app
 * (por isso ele é exportado e importado em src/services/contatos.ts).
 *
 * De onde vêm as credenciais? Do arquivo .env na raiz do projeto:
 *   EXPO_PUBLIC_TURSO_URL
 *   EXPO_PUBLIC_TURSO_TOKEN
 *
 * DICA: no Expo, variáveis de ambiente só ficam visíveis no app se o nome
 * começar com "EXPO_PUBLIC_". Se você criar uma variável sem esse prefixo,
 * ela vai funcionar no servidor mas o app não vai enxergá-la.
 */

// Usamos a build "/web" porque a build padrão do @libsql/client depende de
// módulos nativos do Node (ex: "node:buffer"), que não existem no React Native.
import { createClient } from '@libsql/client/web';

const urlDoTurso = process.env.EXPO_PUBLIC_TURSO_URL;
const tokenDoTurso = process.env.EXPO_PUBLIC_TURSO_TOKEN;

// Conferência simples para avisar o desenvolvedor caso esqueça de configurar o .env
if (!urlDoTurso || !tokenDoTurso) {
  throw new Error(
    'Variáveis de ambiente do Turso não configuradas. Verifique o arquivo .env (EXPO_PUBLIC_TURSO_URL / EXPO_PUBLIC_TURSO_TOKEN).'
  );
}

/**
 * Cliente do Turso pronto para uso em toda a aplicação.
 * Ex.: turso.execute('SELECT * FROM contacts')
 */
export const turso = createClient({
  url: urlDoTurso,
  authToken: tokenDoTurso,
});

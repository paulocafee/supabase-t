/**
 * LOCALIZAÇÃO: src/services/supabase.ts
 * PROPÓSITO: Este arquivo cria a "conexão" (cliente) com o Supabase.
 *
 * IMPORTANTE PARA OS ALUNOS: crie esse cliente UMA ÚNICA VEZ e o reutilize
 * em todo o app (por isso ele é exportado e importado nos outros services,
 * como em src/services/contatos.ts). Nunca crie um `createClient` novo
 * dentro de cada tela!
 *
 * De onde vêm as credenciais? Do arquivo .env na raiz do projeto:
 *   EXPO_PUBLIC_SUPABASE_URL
 *   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
 *
 * DICA: no Expo, variáveis de ambiente só ficam visíveis no app se o nome
 * começar com "EXPO_PUBLIC_". Se você criar uma variável sem esse prefixo,
 * ela vai funcionar no servidor mas o app não vai enxergá-la.
 */

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const urlDoSupabase = process.env.EXPO_PUBLIC_SUPABASE_URL;
const chaveDoSupabase = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Conferência simples para avisar o desenvolvedor caso esqueça de configurar o .env
if (!urlDoSupabase || !chaveDoSupabase) {
  throw new Error(
    'Variáveis de ambiente do Supabase não configuradas. Verifique o arquivo .env (EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY).'
  );
}

/**
 * Cliente do Supabase pronto para uso em toda a aplicação.
 * Ex.: supabase.from('contacts').select('*')
 *
 * O bloco `auth` configura onde a sessão do usuário fica salva no celular
 * (AsyncStorage), para que ele não precise "logar" toda vez que abrir o app.
 * Como ainda não usamos login neste projeto, essa parte é só a base pronta
 * para quando vocês quiserem adicionar autenticação no futuro.
 */
export const supabase = createClient(urlDoSupabase, chaveDoSupabase, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

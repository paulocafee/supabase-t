/**
 * LOCALIZAÇÃO: src/theme/colors.ts
 * PROPÓSITO: Coleção centralizada de cores do tema da aplicação baseada na paleta do usuário:
 * - #F24B4B (Coral / Destaque)
 * - #070C26 (Azul Noturno Profundo / Texto Principal)
 * - #180E59 (Aço Índigo Escuro)
 * - #3711BF (Índigo Vibrante / Cor Principal)
 * - #280D8C (Azul Real Profundo)
 */

export const colors = {
  // Cores Principais
  primary: '#3711BF',        // Índigo Vibrante (Botões principais, cabeçalho)
  primaryDark: '#280D8C',    // Azul Real Profundo (Estados ativos / variância escura)
  primaryLight: '#5A38E6',   // Variante clara de apoio

  // Cores Complementares e Destaque
  secondary: '#180E59',      // Aço Índigo Escuro (Elementos secundários)
  accent: '#F24B4B',         // Coral / Vermelho Vibrante (Destaques, botões de ação e alertas)

  // Status e Feedback
  success: '#28A745',
  danger: '#F24B4B',         // Coral para ações destrutivas / erros
  warning: '#FFC107',
  info: '#3711BF',

  // Fundo e Neutros
  background: '#F4F5FA',     // Fundo suave levemente azulado
  card: '#FFFFFF',
  border: '#E2E5F0',

  // Textos
  text: '#070C26',           // Azul Noturno Profundo (Excelente legibilidade)
  textSecondary: '#4A5270',
  textLight: '#8C94B2',
  white: '#FFFFFF',
};

export type Colors = typeof colors;

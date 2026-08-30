/**
 * LOCALIZAÇÃO: src/components/CadastroItemCard.tsx
 * PROPÓSITO: Componente de item da lista de cadastros. Exibe as informações da pessoa
 *            e renderiza os 3 botões de ação: Abrir, Editar e Excluir.
 * 
 * ONDE VÃO AS AÇÕES:
 * - Ação 'Abrir'  -> dispara a prop `onAbrir` repassando os dados do item.
 * - Ação 'Editar' -> dispara a prop `onEditar` repassando os dados do item.
 * - Ação 'Excluir'-> dispara a prop `onExcluir` repassando o ID do item.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Cadastro } from '@/types/cadastro';
import { Button } from '@/components/Button';
import { colors } from '@/theme';

interface CadastroItemCardProps {
  item: Cadastro;
  onEditar: (item: Cadastro) => void;
  onExcluir: (id: string) => void;
  onAbrir: (item: Cadastro) => void;
}

/**
 * Componente CadastroItemCard
 * Renderiza um cartão contendo as informações do cadastro e os três botões principais de ação (Abrir, Editar e Excluir).
 */
export const CadastroItemCard: React.FC<CadastroItemCardProps> = ({
  item,
  onEditar,
  onExcluir,
  onAbrir,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{item.nome}</Text>
        <Text style={styles.detailText}>📧 {item.email}</Text>
        <Text style={styles.detailText}>📱 {item.telefone}</Text>
      </View>

      <View style={styles.actionsContainer}>
        {/* Ação do Botão Abrir: invoca o callback repassando o cadastro selecionado */}
        <Button
          title="Abrir"
          onPress={() => onAbrir(item)}
          variant="primary"
          size="small"
          style={styles.actionBtn}
        />
        {/* Ação do Botão Editar: invoca o callback para navegação até a tela de edição */}
        <Button
          title="Editar"
          onPress={() => onEditar(item)}
          variant="secondary"
          size="small"
          style={styles.actionBtn}
        />
        {/* Ação do Botão Excluir: invoca o callback repassando o ID do item a ser removido */}
        <Button
          title="Excluir"
          onPress={() => onExcluir(item.id)}
          variant="danger"
          size="small"
          style={styles.actionBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContainer: {
    marginBottom: 12,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  actionBtn: {
    minWidth: 70,
  },
});

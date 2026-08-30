/**
 * LOCALIZAÇÃO: src/components/Button.tsx
 * PROPÓSITO: Componente reutilizável de Botão estilizado.
 * AÇÃO: Dispara a callback `onPress` passada como propriedade quando o usuário clica no botão.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { colors } from '@/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Componente Button
 * Botão genérico e reutilizável com suporte a múltiplas variantes de cor, tamanhos e estados de carregamento.
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  /**
   * Retorna os estilos visuais de fundo de acordo com a variante informada.
   */
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: colors.secondary };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary };
      case 'danger':
        return { backgroundColor: colors.danger };
      case 'success':
        return { backgroundColor: colors.success };
      case 'primary':
      default:
        return { backgroundColor: colors.primary };
    }
  };

  /**
   * Retorna a cor apropriada do texto do botão baseando-se na variante.
   */
  const getTextColor = (): string => {
    if (variant === 'outline') return colors.primary;
    return colors.white;
  };

  /**
   * Retorna o dimensionamento de padding e tamanho de fonte de acordo com a propriedade `size`.
   */
  const getSizeStyle = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'small':
        return {
          container: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
          text: { fontSize: 13, fontWeight: '600' },
        };
      case 'large':
        return {
          container: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 10 },
          text: { fontSize: 18, fontWeight: '700' },
        };
      case 'medium':
      default:
        return {
          container: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 8 },
          text: { fontSize: 15, fontWeight: '600' },
        };
    }
  };

  const sizeStyles = getSizeStyle();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        sizeStyles.container,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, sizeStyles.text, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

/**
 * Componente Button - Botão customizado
 * 
 * @param title - Texto do botão
 * @param onPress - Callback ao pressionar
 * @param variant - Estilo do botão (primary, secondary, outline)
 * @param loading - Se está carregando
 * @param disabled - Se está desabilitado
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        styles[variant],
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? Colors.primary.red : Colors.text.white}
        />
      ) : (
        <Text style={[styles.title, styles[`${variant}Text`]]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: Colors.interactive.blue,
  },
  secondary: {
    backgroundColor: Colors.interactive.gray,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.red,
  },
  disabled: {
    opacity: 0.5,
  },
  title: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
  },
  primaryText: {
    color: Colors.text.white,
  },
  secondaryText: {
    color: Colors.text.primary,
  },
  outlineText: {
    color: Colors.primary.red,
  },
});

export default Button;

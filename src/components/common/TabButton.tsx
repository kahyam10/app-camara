import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

/**
 * Componente TabButton - Botão para tabs
 * 
 * @param label - Texto do botão
 * @param isActive - Se está ativo/selecionado
 * @param onPress - Callback ao pressionar
 */
export const TabButton: React.FC<TabButtonProps> = ({
  label,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.containerActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, isActive && styles.labelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  containerActive: {
    borderBottomColor: Colors.text.primary,
  },
  label: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  labelActive: {
    color: Colors.text.primary,
  },
});

export default TabButton;

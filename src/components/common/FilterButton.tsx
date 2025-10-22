import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

interface FilterButtonProps {
  label: string;
  onPress: () => void;
  isActive?: boolean;
}

/**
 * Componente FilterButton - Botão de filtro arredondado
 * 
 * @param label - Texto do botão
 * @param onPress - Callback ao pressionar
 * @param isActive - Se está ativo/selecionado (opcional)
 */
export const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  onPress,
  isActive = false,
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
      <Ionicons
        name="chevron-down"
        size={16}
        color={isActive ? Colors.primary.red : Colors.text.secondary}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.gray100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    minHeight: 40,
  },
  containerActive: {
    backgroundColor: Colors.primary.red + '20',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginRight: 4,
  },
  labelActive: {
    color: Colors.primary.red,
    fontWeight: '600',
  },
  icon: {
    marginLeft: 2,
  },
});

export default FilterButton;

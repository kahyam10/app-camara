import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

interface SearchBarProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

/**
 * Componente SearchBar - Barra de pesquisa com ícone
 * 
 * @param value - Valor do input
 * @param onChangeText - Callback quando texto muda
 * @param onClear - Callback ao limpar (opcional)
 * @param placeholder - Texto placeholder
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Pesquisar...',
  ...textInputProps
}) => {
  return (
    <View style={styles.container}>
      {/* Ícone de busca */}
      <Ionicons
        name="search"
        size={20}
        color={Colors.text.secondary}
        style={styles.searchIcon}
      />

      {/* Input de texto */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.text.light}
        returnKeyType="search"
        {...textInputProps}
      />

      {/* Botão limpar (aparece quando há texto) */}
      {value.length > 0 && onClear && (
        <TouchableOpacity
          onPress={onClear}
          style={styles.clearButton}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle" size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.gray100,
    borderRadius: Layout.borderRadius.lg,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  searchIcon: {
    marginRight: Layout.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Layout.fontSize.md,
    color: Colors.text.primary,
    paddingVertical: Layout.spacing.xs,
  },
  clearButton: {
    marginLeft: Layout.spacing.sm,
    padding: Layout.spacing.xs,
  },
});

export default SearchBar;

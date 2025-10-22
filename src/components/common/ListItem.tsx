import React, { ReactNode } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: ReactNode;
}

/**
 * Componente ListItem - Item de lista genérico
 * 
 * @param title - Título principal
 * @param subtitle - Subtítulo (opcional)
 * @param icon - Ícone/Avatar à esquerda (opcional)
 * @param onPress - Callback ao pressionar (opcional)
 * @param showChevron - Se deve mostrar seta à direita (padrão: true se onPress existir)
 * @param rightElement - Elemento customizado à direita (opcional)
 */
export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  showChevron = !!onPress,
  rightElement,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Ícone/Avatar */}
      {icon && <View style={styles.iconContainer}>{icon}</View>}

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Elemento direito */}
      {rightElement && <View style={styles.rightElement}>{rightElement}</View>}

      {/* Chevron */}
      {showChevron && !rightElement && (
        <Ionicons name="chevron-forward" size={24} color={Colors.text.light} />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    backgroundColor: Colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  iconContainer: {
    marginRight: Layout.spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: Layout.fontSize.md,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  subtitle: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
  },
  rightElement: {
    marginLeft: Layout.spacing.sm,
  },
});

export default ListItem;

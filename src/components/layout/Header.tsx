import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

/**
 * Componente Header - Cabeçalho institucional do aplicativo
 * 
 * @param title - Título da página (opcional, mostra logo se não fornecido)
 * @param showBackButton - Se deve mostrar botão voltar
 * @param onBackPress - Callback ao pressionar voltar
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Botão Voltar */}
        {showBackButton && onBackPress && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text.white} />
          </TouchableOpacity>
        )}

        {/* Conteúdo do Header */}
        <View style={styles.titleContainer}>
          {!title ? (
            // Logo e título institucional
            <>
              <View style={styles.logoContainer}>
                <View style={styles.logo} />
                <Text style={styles.mainTitle}>PODER LEGISLATIVO</Text>
              </View>
              <Text style={styles.subtitle}>IBIRAPITANGA</Text>
            </>
          ) : (
            // Título da página
            <Text style={styles.pageTitle}>{title}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary.red,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.md,
    // Gradiente simulado com shadow
    shadowColor: Colors.primary.redDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    zIndex: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  logo: {
    width: 32,
    height: 32,
    backgroundColor: Colors.text.white,
    borderRadius: Layout.borderRadius.sm,
    marginRight: Layout.spacing.sm,
  },
  mainTitle: {
    color: Colors.text.white,
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Colors.text.white,
    fontSize: Layout.fontSize.xxl,
    fontWeight: 'bold',
  },
  pageTitle: {
    color: Colors.text.white,
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Header;

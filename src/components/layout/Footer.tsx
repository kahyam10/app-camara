import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Config } from '../../constants/Config';

/**
 * Componente Footer - Rodapé institucional fixo
 */
export const Footer: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{Config.camara.nome}</Text>
      <Text style={styles.subtitle}>{Config.camara.cidade}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary.red,
    paddingVertical: Layout.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.text.white,
    fontSize: Layout.fontSize.sm,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Colors.text.white,
    fontSize: Layout.fontSize.md,
    fontWeight: 'bold',
  },
});

export default Footer;

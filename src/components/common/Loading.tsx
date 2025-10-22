import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
}

/**
 * Componente Loading - Indicador de carregamento
 */
export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = Colors.primary.red,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default Loading;

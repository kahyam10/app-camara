import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Header, SearchBar, FilterButton, EmptyState } from '../components';
import { Colors } from '../constants/Colors';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { Vereador } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Vereadores'>;

export default function VereadoresScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartido, setSelectedPartido] = useState<string | null>(null);
  const [vereadores, setVereadores] = useState<Vereador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar vereadores da API
  useEffect(() => {
    loadVereadores();
  }, []);

  const loadVereadores = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getVereadores();
      setVereadores(data);
    } catch (err) {
      setError('Erro ao carregar vereadores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Obter partidos únicos
  const partidos = ['Todos', ...Array.from(new Set(vereadores.map(v => v.partido)))];

  // Filtrar vereadores
  const vereadoresFiltrados = vereadores.filter((v) => {
    const matchSearch =
      searchQuery === '' ||
      v.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.partido.toLowerCase().includes(searchQuery.toLowerCase());

    const matchPartido =
      selectedPartido === null ||
      selectedPartido === 'Todos' ||
      v.partido === selectedPartido;

    return matchSearch && matchPartido;
  });

  const renderVereador = ({ item }: { item: typeof vereadores[0] }) => (
    <TouchableOpacity
      style={styles.vereadorCard}
      onPress={() =>
        navigation.navigate('VereadorDetalhes', { vereadorId: item.id.toString() })
      }
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.foto }}
        style={styles.foto}
        defaultSource={require('../../assets/icon.png')}
      />
      <View style={styles.vereadorInfo}>
        <Text style={styles.nome}>{item.nome}</Text>
        <View style={styles.partidoContainer}>
          <Ionicons name="flag" size={14} color={Colors.primary.red} />
          <Text style={styles.partido}>{item.partido}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color={Colors.text.secondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Vereadores" 
        showBackButton 
        onBackPress={() => navigation.goBack()} 
      />

      <View style={styles.content}>
        {/* Busca */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar vereador..."
        />

        {/* Loading */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary.red} />
            <Text style={styles.loadingText}>Carregando vereadores...</Text>
          </View>
        ) : error ? (
          <EmptyState
            icon="alert-circle-outline"
            title="Erro ao carregar"
            message={error}
          />
        ) : (
          <>
            {/* Filtros de Partido */}
            <FlatList
              horizontal
              data={partidos}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <FilterButton
                  label={item}
                  isActive={selectedPartido === item || (item === 'Todos' && selectedPartido === null)}
                  onPress={() =>
                    setSelectedPartido(item === 'Todos' ? null : item)
                  }
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContainer}
            />

            {/* Contador */}
            <Text style={styles.counterText}>
              {vereadoresFiltrados.length} vereador(es) encontrado(s)
            </Text>

            {/* Lista */}
            {vereadoresFiltrados.length > 0 ? (
              <FlatList
                data={vereadoresFiltrados}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderVereador}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <EmptyState
                icon="people-outline"
                title="Nenhum vereador encontrado"
                message="Tente ajustar sua busca ou filtros"
              />
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.gray50,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  filterContainer: {
    gap: 8,
    marginBottom: 12,
  },
  counterText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  vereadorCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.primary.red,
  },
  vereadorInfo: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  partidoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  partido: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  cargoContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary.redLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cargo: {
    fontSize: 12,
    color: Colors.text.white,
    fontWeight: '600',
  },
});

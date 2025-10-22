import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Header, SearchBar, FilterButton, EmptyState } from '../components';
import { Colors } from '../constants/Colors';
import { mockData } from '../mocks/data';
import { Ionicons } from '@expo/vector-icons';
import { format, getYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Props = NativeStackScreenProps<RootStackParamList, 'Leis'>;

export default function LeisScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const leis = mockData.leis;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simular atualização de dados
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Obter anos disponíveis
  const anosDisponiveis = useMemo(() => {
    const anos = leis.map((lei) => getYear(lei.dataPublicacao));
    return Array.from(new Set(anos)).sort((a, b) => b - a);
  }, [leis]);

  // Filtrar leis
  const leisFiltradas = useMemo(() => {
    return leis
      .filter((lei) => {
        // Filtro por ano
        const matchYear =
          selectedYear === null || getYear(lei.dataPublicacao) === selectedYear;

        // Filtro por busca
        const matchSearch =
          searchQuery === '' ||
          lei.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lei.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lei.categoria.toLowerCase().includes(searchQuery.toLowerCase());

        return matchYear && matchSearch;
      })
      .sort((a, b) => b.dataPublicacao.getTime() - a.dataPublicacao.getTime());
  }, [leis, selectedYear, searchQuery]);

  const renderLei = ({ item }: { item: typeof leis[0] }) => {
    return (
      <TouchableOpacity
        style={styles.leiCard}
        onPress={() => navigation.navigate('LeiDetalhes', { leiId: item.id.toString() })}
        activeOpacity={0.7}
      >
        {/* Header */}
        <View style={styles.leiHeader}>
          <View style={styles.numeroContainer}>
            <Ionicons name="shield-checkmark" size={18} color={Colors.primary.red} />
            <Text style={styles.leiNumero}>{item.numero}</Text>
          </View>
          <View style={styles.yearBadge}>
            <Text style={styles.yearText}>{getYear(item.dataPublicacao)}</Text>
          </View>
        </View>

        {/* Descrição */}
        <Text style={styles.ementa} numberOfLines={3}>
          {item.descricao}
        </Text>

        {/* Informações */}
        <View style={styles.infoContainer}>
          {/* Categoria */}
          <View style={styles.infoRow}>
            <Ionicons name="folder-outline" size={14} color={Colors.text.secondary} />
            <Text style={styles.infoText}>{item.categoria}</Text>
          </View>

          {/* Data de publicação */}
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color={Colors.text.secondary} />
            <Text style={styles.infoText}>
              Publicada em {format(item.dataPublicacao, "dd/MM/yyyy", { locale: ptBR })}
            </Text>
          </View>
        </View>

        {/* Ver detalhes */}
        <View style={styles.chevronContainer}>
          <Text style={styles.verDetalhes}>Ver texto completo</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.primary.red} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Leis Municipais" 
        showBackButton 
        onBackPress={() => navigation.goBack()} 
      />

      <View style={styles.content}>
        {/* Barra de pesquisa */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar lei por número, descrição..."
        />

        {/* Filtros por ano */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filtrar por ano:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <FilterButton
              label="Todos"
              isActive={selectedYear === null}
              onPress={() => setSelectedYear(null)}
            />
            {anosDisponiveis.map((ano) => (
              <FilterButton
                key={ano}
                label={ano.toString()}
                isActive={selectedYear === ano}
                onPress={() => setSelectedYear(ano)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Contador */}
        <Text style={styles.counterText}>
          {leisFiltradas.length} {leisFiltradas.length === 1 ? 'lei' : 'leis'}{' '}
          {searchQuery || selectedYear ? 'encontrada(s)' : ''}
        </Text>

        {/* Lista */}
        {leisFiltradas.length > 0 ? (
          <FlatList
            data={leisFiltradas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderLei}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary.red]}
                tintColor={Colors.primary.red}
              />
            }
          />
        ) : (
          <EmptyState
            icon="document-text-outline"
            title="Nenhuma lei encontrada"
            message="Tente ajustar sua busca ou filtros"
          />
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
    padding: 15,
  },
  filterContainer: {
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  filterScroll: {
    gap: 8,
  },
  counterText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 10,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  leiCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  numeroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leiNumero: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.primary.red,
    marginLeft: 6,
  },
  yearBadge: {
    backgroundColor: Colors.background.gray50,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  yearText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  ementa: {
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 12,
    lineHeight: 20,
  },
  infoContainer: {
    gap: 6,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  chevronContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  verDetalhes: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary.red,
    marginRight: 4,
  },
});

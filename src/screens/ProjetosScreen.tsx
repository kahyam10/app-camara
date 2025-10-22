import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Header, SearchBar, TabButton, EmptyState } from '../components';
import { Colors } from '../constants/Colors';
import { mockData } from '../mocks/data';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFavorites } from '../contexts';

type Props = NativeStackScreenProps<RootStackParamList, 'Projetos'>;

export default function ProjetosScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'andamento' | 'aprovados' | 'arquivados'>('andamento');
  const [refreshing, setRefreshing] = useState(false);
  const { isFavoriteProject, toggleFavoriteProject } = useFavorites();

  const projetos = mockData.projetos;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Filtrar projetos
  const projetosFiltrados = useMemo(() => {
    return projetos
      .filter((p) => {
        // Filtro por status
        const matchStatus =
          (activeTab === 'andamento' && p.status === 'Em Andamento') ||
          (activeTab === 'aprovados' && p.status === 'Aprovado') ||
          (activeTab === 'arquivados' && p.status === 'Arquivado');

        // Filtro por busca
        const matchSearch =
          searchQuery === '' ||
          p.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.autor.toLowerCase().includes(searchQuery.toLowerCase());

        return matchStatus && matchSearch;
      })
      .sort((a, b) => b.dataApresentacao.getTime() - a.dataApresentacao.getTime());
  }, [projetos, activeTab, searchQuery]);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'Em Andamento':
        return '#2563EB';
      case 'Aprovado':
        return '#059669';
      case 'Arquivado':
        return '#6B7280';
      default:
        return Colors.text.secondary;
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'Em Andamento':
        return 'time';
      case 'Aprovado':
        return 'checkmark-circle';
      case 'Arquivado':
        return 'archive';
      default:
        return 'help-circle';
    }
  }, []);

  const renderProjeto = useCallback(({ item }: { item: typeof projetos[0] }) => {
    const statusColor = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);

    return (
      <TouchableOpacity
        style={styles.projetoCard}
        onPress={() => navigation.navigate('ProjetoDetalhes', { projetoId: item.id.toString() })}
        activeOpacity={0.7}
      >
        {/* Botão de favorito */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavoriteProject(item.id);
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavoriteProject(item.id) ? "heart" : "heart-outline"}
            size={20}
            color={Colors.primary.red}
          />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.projetoHeader}>
          <Text style={styles.projetoNumero}>{item.numero}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Ionicons name={statusIcon as any} size={14} color={Colors.text.white} />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        {/* Título */}
        <Text style={styles.projetoTitulo} numberOfLines={2}>
          {item.titulo}
        </Text>

        {/* Descrição */}
        <Text style={styles.ementa} numberOfLines={3}>
          {item.descricao}
        </Text>

        {/* Informações */}
        <View style={styles.infoContainer}>
          {/* Autor */}
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={14} color={Colors.text.secondary} />
            <Text style={styles.infoText}>Autor: {item.autor}</Text>
          </View>

          {/* Data */}
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color={Colors.text.secondary} />
            <Text style={styles.infoText}>
              {format(item.dataApresentacao, "dd/MM/yyyy", { locale: ptBR })}
            </Text>
          </View>
        </View>

        {/* Ver detalhes */}
        <View style={styles.chevronContainer}>
          <Text style={styles.verDetalhes}>Ver detalhes completos</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.primary.red} />
        </View>
      </TouchableOpacity>
    );
  }, [navigation, toggleFavoriteProject, isFavoriteProject, getStatusColor, getStatusIcon, projetos]);

  return (
    <View style={styles.container}>
      <Header 
        title="Projetos de Lei" 
        showBackButton 
        onBackPress={() => navigation.goBack()} 
      />

      <View style={styles.content}>
        {/* Barra de pesquisa */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar projeto, autor..."
        />

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TabButton
            label="Em Andamento"
            isActive={activeTab === 'andamento'}
            onPress={() => setActiveTab('andamento')}
          />
          <TabButton
            label="Aprovados"
            isActive={activeTab === 'aprovados'}
            onPress={() => setActiveTab('aprovados')}
          />
          <TabButton
            label="Arquivados"
            isActive={activeTab === 'arquivados'}
            onPress={() => setActiveTab('arquivados')}
          />
        </View>

        {/* Contador */}
        <Text style={styles.counterText}>
          {projetosFiltrados.length}{' '}
          {projetosFiltrados.length === 1 ? 'projeto' : 'projetos'}{' '}
          {searchQuery && 'encontrado(s)'}
        </Text>

        {/* Lista */}
        {projetosFiltrados.length > 0 ? (
          <FlatList
            data={projetosFiltrados}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProjeto}
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
            title="Nenhum projeto encontrado"
            message={
              searchQuery
                ? 'Tente ajustar sua busca'
                : `Não há projetos ${
                    activeTab === 'andamento'
                      ? 'em andamento'
                      : activeTab === 'aprovados'
                      ? 'aprovados'
                      : 'arquivados'
                  } no momento`
            }
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
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
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
  projetoCard: {
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
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.background.white,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  projetoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projetoNumero: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary.red,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text.white,
    marginLeft: 4,
  },
  projetoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
    lineHeight: 22,
  },
  ementa: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 12,
    lineHeight: 18,
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

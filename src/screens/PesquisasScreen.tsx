import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components';
import { Colors } from '../constants/Colors';
import {
  pesquisaPublicaService,
  PesquisaPublica,
} from '../services/pesquisaPublica.service';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Pesquisas'>;

const PesquisasScreen = ({ navigation }: Props) => {
  const [pesquisas, setPesquisas] = useState<PesquisaPublica[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPesquisas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await pesquisaPublicaService.getPublicas();
      console.log('Response completo:', JSON.stringify(response, null, 2));
      
      // A resposta vem com sucesso e data aninhado
      const pesquisasData = response.data || [];
      console.log('Pesquisas carregadas:', pesquisasData.length);
      setPesquisas(pesquisasData);
    } catch (error) {
      console.error('Erro ao carregar pesquisas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as pesquisas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPesquisas();
  }, [loadPesquisas]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadPesquisas();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isPesquisaExpirada = (dataLimite: string) => {
    return new Date(dataLimite) < new Date();
  };

  const renderPesquisa = ({ item }: { item: PesquisaPublica }) => {
    const expirada = isPesquisaExpirada(item.dataLimite);

    return (
      <TouchableOpacity
        style={[styles.card, expirada && styles.cardExpirada]}
        onPress={() => navigation.navigate('VotarPesquisa', { pesquisa: item })}
        disabled={expirada}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            {expirada && (
              <View style={styles.expiradaBadge}>
                <Text style={styles.expiradaText}>Encerrada</Text>
              </View>
            )}
          </View>
          <Ionicons
            name={expirada ? 'lock-closed' : 'chevron-forward'}
            size={24}
            color={expirada ? Colors.text.secondary : Colors.primary.red}
          />
        </View>

        {item.descricao && (
          <Text style={styles.descricao} numberOfLines={2}>
            {item.descricao}
          </Text>
        )}

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              {expirada ? 'Encerrada em: ' : 'Até: '}
              {formatDate(item.dataLimite)}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              {item.totalVotos} {item.totalVotos === 1 ? 'voto' : 'votos'}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.alternativasInfo}>
            <Ionicons name="list-outline" size={16} color="#0066CC" />
            <Text style={styles.alternativasText}>
              {item.alternativas.length} alternativas
            </Text>
          </View>
          {item.documentoUrl && (
            <View style={styles.documentoIcon}>
              <Ionicons name="document-attach" size={16} color="#0066CC" />
              <Text style={styles.documentoText}>Anexo</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <Header 
          title="Pesquisas Públicas" 
          showBackButton 
          onBackPress={() => navigation.goBack()} 
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary.red} />
          <Text style={styles.loadingText}>Carregando pesquisas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Pesquisas Públicas" 
        showBackButton 
        onBackPress={() => navigation.goBack()} 
      />

      <View style={styles.content}>
        {/* Contador de pesquisas */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            {pesquisas.length} {pesquisas.length === 1 ? 'pesquisa ativa' : 'pesquisas ativas'}
          </Text>
        </View>

        <FlatList
          data={pesquisas}
          renderItem={renderPesquisa}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary.red]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="clipboard-outline" size={64} color="#CCC" />
              <Text style={styles.emptyText}>Nenhuma pesquisa ativa</Text>
              <Text style={styles.emptySubtext}>
                Puxe para baixo para atualizar
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.gray50,
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.gray50,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  counterContainer: {
    backgroundColor: Colors.background.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  counterText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardExpirada: {
    opacity: 0.6,
    backgroundColor: Colors.background.gray50,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  expiradaBadge: {
    backgroundColor: Colors.primary.red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  expiradaText: {
    color: Colors.text.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alternativasInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alternativasText: {
    fontSize: 13,
    color: Colors.primary.red,
    fontWeight: '600',
  },
  documentoIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  documentoText: {
    fontSize: 12,
    color: Colors.primary.red,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BBB',
    marginTop: 8,
  },
});

export default PesquisasScreen;

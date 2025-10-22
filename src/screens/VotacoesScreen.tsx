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
import { Header, SearchBar, EmptyState } from '../components';
import { Colors } from '../constants/Colors';
import { mockData } from '../mocks/data';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Props = NativeStackScreenProps<RootStackParamList, 'Votacoes'>;

export default function VotacoesScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const votacoes = mockData.votacoes;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simular atualização de dados
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Filtrar votações
  const votacoesFiltradas = useMemo(() => {
    return votacoes
      .filter((v) =>
        v.projetoTitulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.projetoNumero.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.data.getTime() - a.data.getTime());
  }, [votacoes, searchQuery]);

  const getResultadoColor = (resultado: string) => {
    switch (resultado) {
      case 'Aprovado':
        return '#059669';
      case 'Rejeitado':
        return '#DC2626';
      case 'Em Tramitação':
        return '#2563EB';
      default:
        return Colors.text.secondary;
    }
  };

  const getResultadoIcon = (resultado: string) => {
    switch (resultado) {
      case 'Aprovado':
        return 'checkmark-circle';
      case 'Rejeitado':
        return 'close-circle';
      case 'Em Tramitação':
        return 'time';
      default:
        return 'help-circle';
    }
  };

  const calcularPorcentagem = (votos: number, total: number) => {
    return total > 0 ? Math.round((votos / total) * 100) : 0;
  };

  const renderVotacao = ({ item }: { item: typeof votacoes[0] }) => {
    const resultadoColor = getResultadoColor(item.resultado);
    const totalVotos = item.votosFavor + item.votosContra + item.abstencoes;
    const porcentagemFavor = calcularPorcentagem(item.votosFavor, totalVotos);

    return (
      <TouchableOpacity
        style={styles.votacaoCard}
        onPress={() => navigation.navigate('VotacaoDetalhes', { votacaoId: item.id.toString() })}
        activeOpacity={0.7}
      >
        {/* Header */}
        <View style={styles.votacaoHeader}>
          <Text style={styles.projetoNumero}>{item.projetoNumero}</Text>
          <View style={[styles.resultadoBadge, { backgroundColor: resultadoColor }]}>
            <Ionicons
              name={getResultadoIcon(item.resultado) as any}
              size={14}
              color={Colors.text.white}
            />
            <Text style={styles.resultadoText}>{item.resultado}</Text>
          </View>
        </View>

        {/* Título do projeto */}
        <Text style={styles.projetoTitulo} numberOfLines={2}>
          {item.projetoTitulo}
        </Text>

        {/* Data */}
        <View style={styles.dataRow}>
          <Ionicons name="calendar-outline" size={14} color={Colors.text.secondary} />
          <Text style={styles.dataText}>
            {format(item.data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </Text>
        </View>

        {/* Barra de progresso */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${porcentagemFavor}%`,
                  backgroundColor: '#059669',
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{porcentagemFavor}% a favor</Text>
        </View>

        {/* Votos */}
        <View style={styles.votosRow}>
          <View style={styles.votoItem}>
            <View style={[styles.votoDot, { backgroundColor: '#059669' }]} />
            <Text style={styles.votoLabel}>
              Favor: <Text style={styles.votoNumero}>{item.votosFavor}</Text>
            </Text>
          </View>

          <View style={styles.votoItem}>
            <View style={[styles.votoDot, { backgroundColor: '#DC2626' }]} />
            <Text style={styles.votoLabel}>
              Contra: <Text style={styles.votoNumero}>{item.votosContra}</Text>
            </Text>
          </View>

          <View style={styles.votoItem}>
            <View style={[styles.votoDot, { backgroundColor: '#6B7280' }]} />
            <Text style={styles.votoLabel}>
              Abstenções: <Text style={styles.votoNumero}>{item.abstencoes}</Text>
            </Text>
          </View>
        </View>

        {/* Ver detalhes */}
        <View style={styles.chevronContainer}>
          <Text style={styles.verDetalhes}>Ver votação completa</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.primary.red} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Votações" 
        showBackButton 
        onBackPress={() => navigation.goBack()} 
      />

      <View style={styles.content}>
        {/* Barra de pesquisa */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar votação ou projeto..."
        />

        {/* Contador */}
        <Text style={styles.counterText}>
          {votacoesFiltradas.length}{' '}
          {votacoesFiltradas.length === 1 ? 'votação' : 'votações'}{' '}
          {searchQuery && 'encontrada(s)'}
        </Text>

        {/* Lista */}
        {votacoesFiltradas.length > 0 ? (
          <FlatList
            data={votacoesFiltradas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderVotacao}
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
            icon="checkbox-outline"
            title="Nenhuma votação encontrada"
            message="Tente ajustar sua busca"
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
  counterText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 10,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  votacaoCard: {
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
  votacaoHeader: {
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
  resultadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resultadoText: {
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
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dataText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.background.gray50,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  votosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  votoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  votoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  votoLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  votoNumero: {
    fontWeight: 'bold',
    color: Colors.text.primary,
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

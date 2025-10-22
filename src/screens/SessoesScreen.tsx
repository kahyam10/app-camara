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
import { Header, TabButton, EmptyState } from '../components';
import { Colors } from '../constants/Colors';
import { mockData } from '../mocks/data';
import { Ionicons } from '@expo/vector-icons';
import { format, isFuture, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Props = NativeStackScreenProps<RootStackParamList, 'Sessoes'>;

export default function SessoesScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'proximas' | 'passadas'>('proximas');
  const [refreshing, setRefreshing] = useState(false);

  const sessoes = mockData.sessoes;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Filtrar sessões por tab
  const sessoesFiltradas = useMemo(() => {
    if (activeTab === 'proximas') {
      return sessoes
        .filter((s) => isFuture(s.data) || s.status === 'Em Andamento')
        .sort((a, b) => a.data.getTime() - b.data.getTime());
    } else {
      return sessoes
        .filter((s) => isPast(s.data) && s.status !== 'Em Andamento')
        .sort((a, b) => b.data.getTime() - a.data.getTime());
    }
  }, [sessoes, activeTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Andamento':
        return '#059669';
      case 'Agendada':
        return '#2563EB';
      case 'Concluída':
        return '#6B7280';
      case 'Cancelada':
        return '#DC2626';
      default:
        return Colors.text.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Em Andamento':
        return 'radio-button-on';
      case 'Agendada':
        return 'calendar';
      case 'Concluída':
        return 'checkmark-circle';
      case 'Cancelada':
        return 'close-circle';
      default:
        return 'ellipse';
    }
  };

  const renderSessao = ({ item }: { item: typeof sessoes[0] }) => {
    const statusColor = getStatusColor(item.status);
    const isTipoExtraordinaria = item.tipo === 'Sessão Extraordinária';

    return (
      <TouchableOpacity
        style={styles.sessaoCard}
        onPress={() => navigation.navigate('SessaoDetalhes', { sessaoId: item.id.toString() })}
        activeOpacity={0.7}
      >
        {/* Header */}
        <View style={styles.sessaoHeader}>
          <View style={styles.numeroContainer}>
            <Ionicons
              name={isTipoExtraordinaria ? 'alert-circle' : 'calendar'}
              size={20}
              color={Colors.primary.red}
            />
            <Text style={styles.numeroText}>
              {item.tipo}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Ionicons
              name={getStatusIcon(item.status) as any}
              size={14}
              color={Colors.text.white}
            />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        {/* Tipo */}
        <Text style={styles.tipoText}>{format(item.data, 'yyyy', { locale: ptBR })}</Text>

        {/* Informações */}
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color={Colors.text.secondary} />
          <Text style={styles.infoText}>
            {format(item.data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
          <Text style={styles.infoText}>{item.horario}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color={Colors.text.secondary} />
          <Text style={styles.infoText}>{item.local}</Text>
        </View>

        {/* Pauta preview */}
        {item.pauta && item.pauta.length > 0 && (
          <View style={styles.pautaContainer}>
            <Text style={styles.pautaLabel}>
              Pauta ({item.pauta.length} {item.pauta.length === 1 ? 'item' : 'itens'})
            </Text>
            <Text style={styles.pautaPreview} numberOfLines={2}>
              {item.pauta[0]}
              {item.pauta.length > 1 && '...'}
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.cardFooter}>
          <Text style={styles.verDetalhes}>Ver detalhes</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.primary.red} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Sessões Legislativas" 
        showBackButton 
        onBackPress={() => navigation.goBack()} 
      />

      <View style={styles.content}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TabButton
            label="Próximas"
            isActive={activeTab === 'proximas'}
            onPress={() => setActiveTab('proximas')}
          />
          <TabButton
            label="Passadas"
            isActive={activeTab === 'passadas'}
            onPress={() => setActiveTab('passadas')}
          />
        </View>

        {/* Contador */}
        <Text style={styles.counterText}>
          {sessoesFiltradas.length} {sessoesFiltradas.length === 1 ? 'sessão' : 'sessões'}
        </Text>

        {/* Lista */}
        {sessoesFiltradas.length > 0 ? (
          <FlatList
            data={sessoesFiltradas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderSessao}
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
            icon="calendar-outline"
            title={activeTab === 'proximas' ? 'Nenhuma sessão agendada' : 'Nenhuma sessão realizada'}
            message={
              activeTab === 'proximas'
                ? 'Não há sessões futuras no momento'
                : 'Histórico de sessões está vazio'
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
    marginBottom: 15,
    gap: 10,
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
  sessaoCard: {
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
  sessaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  numeroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numeroText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginLeft: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.white,
    marginLeft: 4,
  },
  tipoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  pautaContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  pautaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  pautaPreview: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  verDetalhes: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary.red,
    marginRight: 4,
  },
});

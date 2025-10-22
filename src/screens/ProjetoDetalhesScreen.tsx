import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Header, EmptyState } from '../components';
import { Colors } from '../constants/Colors';
import { mockData } from '../mocks/data';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFavorites } from '../contexts';

type Props = NativeStackScreenProps<RootStackParamList, 'ProjetoDetalhes'>;

export default function ProjetoDetalhesScreen({ route, navigation }: Props) {
  const { projetoId } = route.params;
  const { isFavoriteProject, toggleFavoriteProject } = useFavorites();

  const projeto = useMemo(() => {
    return mockData.projetos.find((p) => p.id.toString() === projetoId);
  }, [projetoId]);

  if (!projeto) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="alert-circle-outline"
          title="Projeto não encontrado"
          message="Não foi possível carregar os detalhes"
        />
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Andamento':
        return '#2563EB';
      case 'Aprovado':
        return '#059669';
      case 'Rejeitado':
        return '#DC2626';
      case 'Arquivado':
        return '#6B7280';
      default:
        return Colors.text.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Em Andamento':
        return 'time';
      case 'Aprovado':
        return 'checkmark-circle';
      case 'Rejeitado':
        return 'close-circle';
      case 'Arquivado':
        return 'archive';
      default:
        return 'help-circle';
    }
  };

  const statusColor = getStatusColor(projeto.status);
  const statusIcon = getStatusIcon(projeto.status);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card principal */}
        <View style={styles.mainCard}>
          {/* Número */}
          <Text style={styles.projetoNumero}>{projeto.numero}</Text>

          {/* Tipo */}
          <View style={styles.tipoContainer}>
            <Ionicons name="document-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.tipoText}>{projeto.tipo}</Text>
          </View>

          {/* Título */}
          <Text style={styles.projetoTitulo}>{projeto.titulo}</Text>

          {/* Status */}
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Ionicons name={statusIcon as any} size={16} color={Colors.text.white} />
            <Text style={styles.statusText}>{projeto.status}</Text>
          </View>
        </View>

        {/* Informações gerais */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações Gerais</Text>

          <View style={styles.infoList}>
            {/* Autor */}
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="person-outline" size={18} color={Colors.primary.red} />
                <Text style={styles.infoLabelText}>Autor</Text>
              </View>
              <Text style={styles.infoValue}>{projeto.autor}</Text>
            </View>

            {/* Data de apresentação */}
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="calendar-outline" size={18} color={Colors.primary.red} />
                <Text style={styles.infoLabelText}>Data de Apresentação</Text>
              </View>
              <Text style={styles.infoValue}>
                {format(projeto.dataApresentacao, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </Text>
            </View>

            {/* Categoria */}
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="folder-outline" size={18} color={Colors.primary.red} />
                <Text style={styles.infoLabelText}>Categoria</Text>
              </View>
              <Text style={styles.infoValue}>{projeto.categoria}</Text>
            </View>
          </View>
        </View>

        {/* Descrição/Ementa */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ementa</Text>
          <Text style={styles.descricao}>{projeto.descricao}</Text>
        </View>

        {/* Texto Completo */}
        {projeto.textoCompleto && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Texto Completo</Text>
            <Text style={styles.textoCompleto}>{projeto.textoCompleto}</Text>
          </View>
        )}

        {/* Histórico de Tramitação */}
        {projeto.historico && projeto.historico.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Tramitação</Text>
            <Text style={styles.sectionSubtitle}>
              Histórico de movimentações deste projeto
            </Text>

            <View style={styles.timelineContainer}>
              {projeto.historico.map((item, index) => (
                <View key={index} style={styles.timelineItem}>
                  {/* Linha vertical */}
                  {index < projeto.historico!.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}

                  {/* Dot */}
                  <View style={styles.timelineDot} />

                  {/* Conteúdo */}
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineData}>
                      {format(item.data, "dd/MM/yyyy", { locale: ptBR })}
                    </Text>
                    <Text style={styles.timelineLocal}>{item.local}</Text>
                    <Text style={styles.timelineDescricao}>{item.descricao}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Ações */}
        <View style={styles.actionsContainer}>
          {/* Ver Votação */}
          {(projeto.status === 'Aprovado' || projeto.status === 'Rejeitado') && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                // Buscar votação relacionada
                const votacao = mockData.votacoes.find(
                  (v) => v.projetoId === projeto.id
                );
                if (votacao) {
                  navigation.navigate('VotacaoDetalhes', {
                    votacaoId: votacao.id.toString(),
                  });
                }
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="checkbox-outline" size={20} color={Colors.primary.red} />
              <Text style={styles.actionButtonText}>Ver Votação</Text>
            </TouchableOpacity>
          )}

          {/* Baixar PDF */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // TODO: Implementar download de PDF
              console.log('Baixar PDF do projeto');
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="download-outline" size={20} color={Colors.primary.red} />
            <Text style={styles.actionButtonText}>Baixar PDF</Text>
          </TouchableOpacity>

          {/* Compartilhar */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // TODO: Implementar compartilhamento
              console.log('Compartilhar projeto');
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="share-social-outline" size={20} color={Colors.primary.red} />
            <Text style={styles.actionButtonText}>Compartilhar</Text>
          </TouchableOpacity>

          {/* Favoritar */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleFavoriteProject(projeto.id)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isFavoriteProject(projeto.id) ? "heart" : "heart-outline"} 
              size={20} 
              color={Colors.primary.red} 
            />
            <Text style={styles.actionButtonText}>
              {isFavoriteProject(projeto.id) ? 'Salvo' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  mainCard: {
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
  projetoNumero: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary.red,
    marginBottom: 8,
  },
  tipoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipoText: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  projetoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
    lineHeight: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.text.white,
    marginLeft: 6,
  },
  card: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  infoList: {
    gap: 16,
    marginTop: 12,
  },
  infoRow: {
    gap: 8,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  infoValue: {
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  descricao: {
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 22,
    marginTop: 8,
  },
  textoCompleto: {
    fontSize: 13,
    color: Colors.text.primary,
    lineHeight: 20,
    marginTop: 8,
  },
  timelineContainer: {
    marginTop: 8,
  },
  timelineItem: {
    position: 'relative',
    paddingLeft: 28,
    marginBottom: 20,
  },
  timelineLine: {
    position: 'absolute',
    left: 7,
    top: 20,
    bottom: -20,
    width: 2,
    backgroundColor: Colors.border.light,
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary.red,
    borderWidth: 3,
    borderColor: Colors.background.white,
  },
  timelineContent: {
    gap: 2,
  },
  timelineData: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary.red,
  },
  timelineLocal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  timelineDescricao: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary.red,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary.red,
    marginLeft: 8,
  },
});

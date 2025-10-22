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

type Props = NativeStackScreenProps<RootStackParamList, 'VotacaoDetalhes'>;

export default function VotacaoDetalhesScreen({ route, navigation }: Props) {
  const { votacaoId } = route.params;

  const votacao = useMemo(() => {
    return mockData.votacoes.find((v) => v.id.toString() === votacaoId);
  }, [votacaoId]);

  // Gerar votos nominais dos vereadores
  const votosNominais = useMemo(() => {
    if (!votacao) return [];

    const vereadores = mockData.vereadores;
    const votos: Array<{
      vereadorId: number;
      vereadorNome: string;
      voto: 'Favor' | 'Contra' | 'Abstenção';
    }> = [];

    let favorRestante = votacao.votosFavor;
    let contraRestante = votacao.votosContra;
    let abstencoesRestante = votacao.abstencoes;

    vereadores.forEach((vereador) => {
      let voto: 'Favor' | 'Contra' | 'Abstenção';

      if (favorRestante > 0) {
        voto = 'Favor';
        favorRestante--;
      } else if (contraRestante > 0) {
        voto = 'Contra';
        contraRestante--;
      } else if (abstencoesRestante > 0) {
        voto = 'Abstenção';
        abstencoesRestante--;
      } else {
        voto = 'Favor';
      }

      votos.push({
        vereadorId: vereador.id,
        vereadorNome: vereador.nome,
        voto,
      });
    });

    return votos.sort((a, b) => a.vereadorNome.localeCompare(b.vereadorNome));
  }, [votacao]);

  if (!votacao) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="alert-circle-outline"
          title="Votação não encontrada"
          message="Não foi possível carregar os detalhes"
        />
      </View>
    );
  }

  const totalVotos = votacao.votosFavor + votacao.votosContra + votacao.abstencoes;
  const porcentagemFavor = totalVotos > 0 ? Math.round((votacao.votosFavor / totalVotos) * 100) : 0;
  const porcentagemContra = totalVotos > 0 ? Math.round((votacao.votosContra / totalVotos) * 100) : 0;
  const porcentagemAbstencao = totalVotos > 0 ? Math.round((votacao.abstencoes / totalVotos) * 100) : 0;

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

  const getVotoColor = (voto: string) => {
    switch (voto) {
      case 'Favor':
        return '#059669';
      case 'Contra':
        return '#DC2626';
      case 'Abstenção':
        return '#6B7280';
      default:
        return Colors.text.secondary;
    }
  };

  const getVotoIcon = (voto: string) => {
    switch (voto) {
      case 'Favor':
        return 'checkmark-circle';
      case 'Contra':
        return 'close-circle';
      case 'Abstenção':
        return 'remove-circle';
      default:
        return 'help-circle';
    }
  };

  const resultadoColor = getResultadoColor(votacao.resultado);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card principal */}
        <View style={styles.mainCard}>
          {/* Número do projeto */}
          <Text style={styles.projetoNumero}>{votacao.projetoNumero}</Text>

          {/* Título */}
          <Text style={styles.projetoTitulo}>{votacao.projetoTitulo}</Text>

          {/* Data */}
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.infoText}>
              {format(votacao.data, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
            </Text>
          </View>

          {/* Resultado */}
          <View style={[styles.resultadoBadge, { backgroundColor: resultadoColor }]}>
            <Text style={styles.resultadoText}>{votacao.resultado}</Text>
          </View>
        </View>

        {/* Resumo de votos */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resumo da Votação</Text>

          <View style={styles.totalVotosContainer}>
            <Text style={styles.totalVotosLabel}>Total de Votos</Text>
            <Text style={styles.totalVotosNumero}>{totalVotos}</Text>
          </View>

          {/* Barra visual */}
          <View style={styles.barraVisual}>
            {votacao.votosFavor > 0 && (
              <View
                style={[
                  styles.barraSegmento,
                  {
                    width: `${porcentagemFavor}%`,
                    backgroundColor: '#059669',
                  },
                ]}
              />
            )}
            {votacao.votosContra > 0 && (
              <View
                style={[
                  styles.barraSegmento,
                  {
                    width: `${porcentagemContra}%`,
                    backgroundColor: '#DC2626',
                  },
                ]}
              />
            )}
            {votacao.abstencoes > 0 && (
              <View
                style={[
                  styles.barraSegmento,
                  {
                    width: `${porcentagemAbstencao}%`,
                    backgroundColor: '#6B7280',
                  },
                ]}
              />
            )}
          </View>

          {/* Detalhamento */}
          <View style={styles.votosDetalhamento}>
            {/* Favor */}
            <View style={styles.votoDetalheItem}>
              <View style={styles.votoDetalheHeader}>
                <View style={[styles.votoDot, { backgroundColor: '#059669' }]} />
                <Text style={styles.votoDetalheLabel}>A Favor</Text>
              </View>
              <Text style={styles.votoDetalheNumero}>
                {votacao.votosFavor} ({porcentagemFavor}%)
              </Text>
            </View>

            {/* Contra */}
            <View style={styles.votoDetalheItem}>
              <View style={styles.votoDetalheHeader}>
                <View style={[styles.votoDot, { backgroundColor: '#DC2626' }]} />
                <Text style={styles.votoDetalheLabel}>Contra</Text>
              </View>
              <Text style={styles.votoDetalheNumero}>
                {votacao.votosContra} ({porcentagemContra}%)
              </Text>
            </View>

            {/* Abstenções */}
            <View style={styles.votoDetalheItem}>
              <View style={styles.votoDetalheHeader}>
                <View style={[styles.votoDot, { backgroundColor: '#6B7280' }]} />
                <Text style={styles.votoDetalheLabel}>Abstenções</Text>
              </View>
              <Text style={styles.votoDetalheNumero}>
                {votacao.abstencoes} ({porcentagemAbstencao}%)
              </Text>
            </View>
          </View>
        </View>

        {/* Votos nominais */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Votos Nominais</Text>
          <Text style={styles.sectionSubtitle}>
            Como cada vereador votou nesta matéria
          </Text>

          <View style={styles.votosNominaisList}>
            {votosNominais.map((voto, index) => {
              const votoColor = getVotoColor(voto.voto);
              const votoIcon = getVotoIcon(voto.voto);

              return (
                <TouchableOpacity
                  key={voto.vereadorId}
                  style={[
                    styles.votoNominalItem,
                    index === votosNominais.length - 1 && { borderBottomWidth: 0 },
                  ]}
                  onPress={() =>
                    navigation.navigate('VereadorDetalhes', {
                      vereadorId: voto.vereadorId.toString(),
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.vereadorNome} numberOfLines={1}>
                    {voto.vereadorNome}
                  </Text>

                  <View style={[styles.votoBadge, { backgroundColor: votoColor }]}>
                    <Ionicons name={votoIcon as any} size={14} color={Colors.text.white} />
                    <Text style={styles.votoTexto}>{voto.voto}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Botões de ação */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate('ProjetoDetalhes', {
                projetoId: votacao.projetoId.toString(),
              })
            }
            activeOpacity={0.7}
          >
            <Ionicons name="document-text-outline" size={20} color={Colors.primary.red} />
            <Text style={styles.actionButtonText}>Ver Projeto Completo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate('SessaoDetalhes', {
                sessaoId: '1',
              })
            }
            activeOpacity={0.7}
          >
            <Ionicons name="list-outline" size={20} color={Colors.primary.red} />
            <Text style={styles.actionButtonText}>Ver Sessão</Text>
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
    marginBottom: 4,
  },
  projetoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  resultadoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  resultadoText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.text.white,
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
  totalVotosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  totalVotosLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  totalVotosNumero: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.red,
  },
  barraVisual: {
    flexDirection: 'row',
    height: 32,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  barraSegmento: {
    height: '100%',
  },
  votosDetalhamento: {
    gap: 12,
  },
  votoDetalheItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  votoDetalheHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  votoDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  votoDetalheLabel: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  votoDetalheNumero: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  votosNominaisList: {
    marginTop: 8,
  },
  votoNominalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  vereadorNome: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
    marginRight: 12,
  },
  votoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  votoTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.white,
    marginLeft: 4,
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

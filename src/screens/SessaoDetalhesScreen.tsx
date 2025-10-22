import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Header } from '../components';
import { Colors } from '../constants/Colors';
import { mockData } from '../mocks/data';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Props = NativeStackScreenProps<RootStackParamList, 'SessaoDetalhes'>;

export default function SessaoDetalhesScreen({ navigation, route }: Props) {
  const { sessaoId } = route.params;

  const sessao = mockData.sessoes.find((s) => s.id.toString() === sessaoId);

  if (!sessao) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={Colors.text.secondary} />
          <Text style={styles.errorText}>Sessão não encontrada</Text>
        </View>
      </View>
    );
  }

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

  const statusColor = getStatusColor(sessao.status);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card principal */}
        <View style={styles.mainCard}>
          <View style={styles.mainHeader}>
            <Text style={styles.tipoText}>{sessao.tipo}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Ionicons
                name={getStatusIcon(sessao.status) as any}
                size={16}
                color={Colors.text.white}
              />
              <Text style={styles.statusText}>{sessao.status}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color={Colors.primary.red} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Data</Text>
              <Text style={styles.infoValue}>
                {format(sessao.data, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color={Colors.primary.red} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Horário</Text>
              <Text style={styles.infoValue}>{sessao.horario}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={Colors.primary.red} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Local</Text>
              <Text style={styles.infoValue}>{sessao.local}</Text>
            </View>
          </View>
        </View>

        {/* Ordem do Dia */}
        {sessao.pauta && sessao.pauta.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list" size={24} color={Colors.primary.red} />
              <Text style={styles.sectionTitle}>Ordem do Dia</Text>
            </View>

            {sessao.pauta.map((item, index) => (
              <View key={index} style={styles.pautaItem}>
                <View style={styles.pautaNumero}>
                  <Text style={styles.pautaNumeroText}>{index + 1}</Text>
                </View>
                <Text style={styles.pautaTexto}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Transmissão ao vivo */}
        {sessao.status === 'Em Andamento' && (
          <TouchableOpacity
            style={styles.transmissaoButton}
            onPress={() => navigation.navigate('Transmissao')}
          >
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>AO VIVO</Text>
            </View>
            <View style={styles.transmissaoContent}>
              <Ionicons name="tv" size={24} color={Colors.text.white} />
              <Text style={styles.transmissaoText}>Assistir Transmissão ao Vivo</Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color={Colors.text.white} />
          </TouchableOpacity>
        )}

        {/* Informações adicionais */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Ionicons name="information-circle" size={20} color={Colors.primary.red} />
            <Text style={styles.infoCardTitle}>Informações</Text>
          </View>
          <Text style={styles.infoCardText}>
            As sessões legislativas são abertas ao público e podem ser acompanhadas
            presencialmente no Plenário da Câmara Municipal ou pela transmissão ao
            vivo disponível neste aplicativo.
          </Text>
        </View>

        {/* Ações */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Votacoes')}
          >
            <Ionicons name="checkbox-outline" size={20} color={Colors.primary.red} />
            <Text style={styles.actionText}>Ver Votações</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Projetos')}
          >
            <Ionicons name="document-text-outline" size={20} color={Colors.primary.red} />
            <Text style={styles.actionText}>Ver Projetos</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 16,
  },
  mainCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tipoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.white,
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    textTransform: 'capitalize',
  },
  section: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginLeft: 10,
  },
  pautaItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  pautaNumero: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pautaNumeroText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
  pautaTexto: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 20,
    paddingTop: 4,
  },
  transmissaoButton: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.text.white,
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
  transmissaoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  transmissaoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.white,
    marginLeft: 10,
  },
  infoCard: {
    backgroundColor: Colors.background.gray50,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  infoCardText: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.white,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary.red,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.red,
    marginLeft: 6,
  },
});

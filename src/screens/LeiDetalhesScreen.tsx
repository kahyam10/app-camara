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

type Props = NativeStackScreenProps<RootStackParamList, 'LeiDetalhes'>;

export default function LeiDetalhesScreen({ route }: Props) {
  const { leiId } = route.params;

  const lei = useMemo(() => {
    return mockData.leis.find((l) => l.id.toString() === leiId);
  }, [leiId]);

  if (!lei) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="alert-circle-outline"
          title="Lei não encontrada"
          message="Não foi possível carregar os detalhes"
        />
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Vigente':
        return '#059669';
      case 'Revogada':
        return '#6B7280';
      case 'Em Revisão':
        return '#2563EB';
      default:
        return Colors.text.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Vigente':
        return 'checkmark-circle';
      case 'Revogada':
        return 'ban';
      case 'Em Revisão':
        return 'create';
      default:
        return 'help-circle';
    }
  };

  const statusColor = getStatusColor(lei.status);
  const statusIcon = getStatusIcon(lei.status);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card principal */}
        <View style={styles.mainCard}>
          {/* Número e ícone */}
          <View style={styles.numeroContainer}>
            <Ionicons name="shield-checkmark" size={24} color={Colors.primary.red} />
            <Text style={styles.leiNumero}>{lei.numero}</Text>
          </View>

          {/* Título */}
          <Text style={styles.leiTitulo}>{lei.titulo}</Text>

          {/* Status */}
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Ionicons name={statusIcon as any} size={16} color={Colors.text.white} />
            <Text style={styles.statusText}>{lei.status}</Text>
          </View>
        </View>

        {/* Informações gerais */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações Gerais</Text>

          <View style={styles.infoList}>
            {/* Categoria */}
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="folder-outline" size={18} color={Colors.primary.red} />
                <Text style={styles.infoLabelText}>Categoria</Text>
              </View>
              <Text style={styles.infoValue}>{lei.categoria}</Text>
            </View>

            {/* Data de publicação */}
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="calendar-outline" size={18} color={Colors.primary.red} />
                <Text style={styles.infoLabelText}>Data de Publicação</Text>
              </View>
              <Text style={styles.infoValue}>
                {format(lei.dataPublicacao, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </Text>
            </View>

            {/* Autor */}
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="person-outline" size={18} color={Colors.primary.red} />
                <Text style={styles.infoLabelText}>Autor</Text>
              </View>
              <Text style={styles.infoValue}>{lei.autor}</Text>
            </View>
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ementa</Text>
          <Text style={styles.descricao}>{lei.descricao}</Text>
        </View>

        {/* Texto Completo */}
        {lei.textoCompleto && (
          <View style={styles.card}>
            <View style={styles.textoHeader}>
              <Ionicons name="document-text" size={20} color={Colors.primary.red} />
              <Text style={styles.sectionTitle}>Texto Completo da Lei</Text>
            </View>
            <View style={styles.textoContainer}>
              <Text style={styles.textoCompleto}>{lei.textoCompleto}</Text>
            </View>
          </View>
        )}

        {/* Card informativo */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Ionicons name="information-circle" size={24} color={Colors.primary.red} />
            <Text style={styles.infoCardTitle}>Legislação Municipal</Text>
          </View>
          <Text style={styles.infoCardText}>
            Esta lei foi aprovada pela Câmara Municipal de Ibirapitanga e está disponível
            para consulta pública. Para mais informações sobre a aplicação desta lei,
            entre em contato com a assessoria jurídica da Câmara.
          </Text>
        </View>

        {/* Ações */}
        <View style={styles.actionsContainer}>
          {/* Baixar PDF */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // TODO: Implementar download de PDF
              console.log('Baixar PDF da lei');
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
              console.log('Compartilhar lei');
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="share-social-outline" size={20} color={Colors.primary.red} />
            <Text style={styles.actionButtonText}>Compartilhar</Text>
          </TouchableOpacity>

          {/* Imprimir */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // TODO: Implementar impressão
              console.log('Imprimir lei');
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="print-outline" size={20} color={Colors.primary.red} />
            <Text style={styles.actionButtonText}>Imprimir</Text>
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
  numeroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  leiNumero: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary.red,
    marginLeft: 8,
  },
  leiTitulo: {
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
  textoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  textoContainer: {
    backgroundColor: Colors.background.gray50,
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.red,
  },
  textoCompleto: {
    fontSize: 13,
    color: Colors.text.primary,
    lineHeight: 22,
    textAlign: 'justify',
  },
  infoCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#92400E',
    marginLeft: 8,
  },
  infoCardText: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 20,
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

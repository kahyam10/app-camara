import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../components/layout/Header';
import { Colors } from '../constants/Colors';
import type { RootStackParamList } from '../navigation/types';
import { mesaDiretoraService, MembroMesaDiretora } from '../services/mesa-diretora.service';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MesaDiretoraScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [membros, setMembros] = useState<MembroMesaDiretora[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMembros();
  }, []);

  const loadMembros = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mesaDiretoraService.getAll();
      setMembros(data);
    } catch (err) {
      console.error('Erro ao carregar mesa diretora:', err);
      setError('Não foi possível carregar os dados da Mesa Diretora. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (telefone: string | null, nome: string) => {
    if (!telefone) {
      Alert.alert('Aviso', 'Telefone não disponível para este membro.');
      return;
    }

    const message = encodeURIComponent(`Olá, ${nome}! Gostaria de entrar em contato.`);
    const whatsappUrl = `whatsapp://send?phone=55${telefone.replace(/\D/g, '')}&text=${message}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          const smsUrl = `sms:${telefone}?body=${message}`;
          return Linking.openURL(smsUrl);
        }
      })
      .catch(() =>
        Alert.alert(
          'Erro ao Enviar Mensagem',
          'Não foi possível abrir o WhatsApp ou SMS.',
          [{ text: 'OK' }]
        )
      );
  };

  const handleEmail = (email: string | null) => {
    if (!email) {
      Alert.alert('Aviso', 'E-mail não disponível para este membro.');
      return;
    }

    Linking.openURL(`mailto:${email}`).catch(() =>
      Alert.alert('Erro', 'Não foi possível abrir o cliente de e-mail')
    );
  };

  const handleVerDetalhes = (vereadorId: number) => {
    navigation.navigate('VereadorDetalhes', { vereadorId: String(vereadorId) });
  };

  const getCargoColor = (cargo: string) => {
    switch (cargo) {
      case 'Presidente':
        return Colors.primary.red;
      case 'Vice-Presidente':
        return '#DC2626';
      case '1º Secretário':
      case '2º Secretário':
        return '#2563EB';
      case '1º Suplente':
      case '2º Suplente':
        return '#059669';
      default:
        return '#666';
    }
  };

  const getCargoIcon = (cargo: string): any => {
    switch (cargo) {
      case 'Presidente':
        return 'ribbon';
      case 'Vice-Presidente':
        return 'shield';
      case '1º Secretário':
      case '2º Secretário':
        return 'document-text';
      case '1º Suplente':
      case '2º Suplente':
        return 'people';
      default:
        return 'person';
    }
  };

  const renderMembroCard = (membro: MembroMesaDiretora) => {
    const cargoColor = getCargoColor(membro.cargo);
    const isPresidente = membro.cargo === 'Presidente';

    return (
      <View
        key={membro.id}
        style={[
          styles.membroCard,
          isPresidente && styles.presidenteCard,
        ]}
      >
        {/* Header do Card */}
        <View style={styles.membroHeader}>
          <View style={[styles.cargoBadge, { backgroundColor: cargoColor }]}>
            <Ionicons name={getCargoIcon(membro.cargo)} size={16} color="#FFF" />
            <Text style={styles.cargoText}>{membro.cargo}</Text>
          </View>
        </View>

        {/* Foto e Info */}
        <View style={styles.membroContent}>
          <TouchableOpacity
            style={styles.fotoContainer}
            onPress={() => handleVerDetalhes(membro.vereador.id)}
          >
            {membro.vereador.foto ? (
              <Image source={{ uri: membro.vereador.foto }} style={styles.membroFoto} />
            ) : (
              <View style={[styles.membroFoto, styles.membroFotoPlaceholder]}>
                <Ionicons name="person" size={40} color="#999" />
              </View>
            )}
            {isPresidente && (
              <View style={styles.presidenteBadge}>
                <Ionicons name="star" size={16} color="#FFD700" />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.membroInfo}>
            <TouchableOpacity onPress={() => handleVerDetalhes(membro.vereador.id)}>
              <Text style={styles.membroNome}>{membro.vereador.nome}</Text>
            </TouchableOpacity>
            <View style={styles.partidoRow}>
              <Ionicons name="flag" size={14} color="#666" />
              <Text style={styles.membroPartido}>{membro.vereador.partido}</Text>
            </View>
          </View>
        </View>

        {/* Contatos */}
        <View style={styles.contatosRow}>
          {membro.vereador.telefone && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleSendMessage(membro.vereador.telefone, membro.vereador.nome)}
            >
              <Ionicons name="chatbubble-ellipses" size={18} color={cargoColor} />
            </TouchableOpacity>
          )}
          {membro.vereador.email && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleEmail(membro.vereador.email)}
            >
              <Ionicons name="mail" size={18} color={cargoColor} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => handleVerDetalhes(membro.vereador.id)}
          >
            <Ionicons name="chevron-forward" size={18} color={cargoColor} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getMembrosByCargo = (cargo: string) => {
    return membros.filter(m => m.cargo === cargo);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header 
          title="Mesa Diretora" 
          showBackButton 
          onBackPress={() => navigation.goBack()} 
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary.red} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header 
          title="Mesa Diretora" 
          showBackButton 
          onBackPress={() => navigation.goBack()} 
        />
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={60} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMembros}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const presidente = getMembrosByCargo('Presidente')[0];
  const vicePresidente = getMembrosByCargo('Vice-Presidente')[0];
  const secretarios = [
    ...getMembrosByCargo('1º Secretário'),
    ...getMembrosByCargo('2º Secretário'),
  ];
  const suplentes = [
    ...getMembrosByCargo('1º Suplente'),
    ...getMembrosByCargo('2º Suplente'),
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="Mesa Diretora" 
        showBackButton 
        onBackPress={() => navigation.goBack()} 
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={styles.headerCard}>
          <View style={styles.headerIcon}>
            <Ionicons name="people" size={40} color={Colors.primary.red} />
          </View>
          <Text style={styles.headerTitle}>Composição da Mesa Diretora</Text>
          <Text style={styles.headerSubtitle}>
            Biênio 2023-2024
          </Text>
          <Text style={styles.headerDescription}>
            A Mesa Diretora é responsável pela condução dos trabalhos legislativos
            e pela administração da Câmara Municipal.
          </Text>
        </View>

        {/* Presidente em Destaque */}
        {presidente && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="ribbon" size={24} color={Colors.primary.red} />
              <Text style={styles.sectionTitle}>Presidência</Text>
            </View>
            {renderMembroCard(presidente)}
          </View>
        )}

        {/* Vice-Presidência */}
        {vicePresidente && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield" size={24} color="#DC2626" />
              <Text style={styles.sectionTitle}>Vice-Presidência</Text>
            </View>
            {renderMembroCard(vicePresidente)}
          </View>
        )}

        {/* Secretaria */}
        {secretarios.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text" size={24} color="#2563EB" />
              <Text style={styles.sectionTitle}>Secretaria</Text>
            </View>
            {secretarios.map(membro => renderMembroCard(membro))}
          </View>
        )}

        {/* Suplentes */}
        {suplentes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people" size={24} color="#059669" />
              <Text style={styles.sectionTitle}>Suplentes</Text>
            </View>
            {suplentes.map(membro => renderMembroCard(membro))}
          </View>
        )}
        {/* Informações Adicionais */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#1565C0" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Competências da Mesa Diretora</Text>
            <Text style={styles.infoText}>
              • Dirigir os trabalhos legislativos{'\n'}
              • Representar a Câmara Municipal{'\n'}
              • Administrar o orçamento{'\n'}
              • Propor projetos de lei{'\n'}
              • Convocar sessões extraordinárias
            </Text>
          </View>
        </View>

        {/* Ações */}
        <View style={styles.actionsSection}>
          <Text style={styles.actionsTitle}>Informações</Text>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="document" size={22} color={Colors.primary.red} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionButtonTitle}>Regimento Interno</Text>
              <Text style={styles.actionButtonDescription}>
                Consulte as normas da Casa
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="calendar" size={22} color={Colors.primary.red} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionButtonTitle}>Calendário de Sessões</Text>
              <Text style={styles.actionButtonDescription}>
                Veja o cronograma completo
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="people" size={22} color={Colors.primary.red} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionButtonTitle}>Todos os Vereadores</Text>
              <Text style={styles.actionButtonDescription}>
                Conheça toda a bancada
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary.red,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  headerCard: {
    backgroundColor: '#FFF',
    padding: 25,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.red,
    marginBottom: 15,
  },
  headerDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  membroCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  presidenteCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  membroHeader: {
    marginBottom: 12,
  },
  cargoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  cargoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  membroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  fotoContainer: {
    position: 'relative',
    marginRight: 15,
  },
  membroFoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  membroFotoPlaceholder: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  presidenteBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  membroInfo: {
    flex: 1,
  },
  membroNome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  partidoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  membroPartido: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  contatosRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 10,
  },
  contactButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 22,
  },
  actionsSection: {
    marginHorizontal: 15,
    marginBottom: 30,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  actionButtonDescription: {
    fontSize: 13,
    color: '#666',
  },
});


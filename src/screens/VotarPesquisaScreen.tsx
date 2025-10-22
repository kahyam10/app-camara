import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { useRoute, useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  pesquisaPublicaService,
  PesquisaPublica,
  getDeviceId,
} from '../services/pesquisaPublica.service';
import { RootStackParamList } from '../navigation/types';

type VotarPesquisaRouteProp = RouteProp<RootStackParamList, 'VotarPesquisa'>;

const VotarPesquisaScreen = () => {
  const route = useRoute<VotarPesquisaRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { pesquisa: pesquisaInicial } = route.params;

  const [pesquisa, setPesquisa] = useState<PesquisaPublica>(pesquisaInicial);
  const [selectedAlternativa, setSelectedAlternativa] = useState<number | null>(null);
  const [jaVotou, setJaVotou] = useState(false);
  const [votando, setVotando] = useState(false);
  const [checking, setChecking] = useState(true);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  useEffect(() => {
    verificarSeJaVotou();
  }, []);

  const verificarSeJaVotou = async () => {
    try {
      setChecking(true);
      const votou = await pesquisaPublicaService.verificarVoto(pesquisa.id);
      setJaVotou(votou);
      
      if (votou) {
        // Se já votou, carrega os dados atualizados
        const response = await pesquisaPublicaService.getByIdPublico(pesquisa.id);
        console.log('Pesquisa atualizada:', JSON.stringify(response, null, 2));
        setPesquisa(response.data);
        setMostrarResultados(true);
      }
    } catch (error) {
      console.error('Erro ao verificar voto:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleVotar = async () => {
    if (selectedAlternativa === null) {
      Alert.alert('Atenção', 'Por favor, selecione uma alternativa');
      return;
    }

    Alert.alert(
      'Confirmar Voto',
      'Tem certeza que deseja votar nesta alternativa? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              setVotando(true);
              const deviceId = await getDeviceId();
              const votoResponse = await pesquisaPublicaService.votar(
                pesquisa.id,
                selectedAlternativa,
                deviceId
              );
              console.log('Voto registrado:', JSON.stringify(votoResponse, null, 2));

              // Recarrega os dados atualizados
              const response = await pesquisaPublicaService.getByIdPublico(pesquisa.id);
              console.log('Pesquisa atualizada após voto:', JSON.stringify(response, null, 2));
              setPesquisa(response.data);
              setJaVotou(true);
              setMostrarResultados(true);

              Alert.alert(
                'Sucesso! 🎉',
                'Seu voto foi registrado com sucesso!',
                [{ text: 'Ver Resultados', onPress: () => {} }]
              );
            } catch (error: any) {
              console.error('Erro ao votar:', error);
              Alert.alert(
                'Erro',
                error.response?.data?.message || 'Não foi possível registrar seu voto'
              );
            } finally {
              setVotando(false);
            }
          },
        },
      ]
    );
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

  const calcularPercentual = (votos: number) => {
    if (pesquisa.totalVotos === 0) return 0;
    return (votos / pesquisa.totalVotos) * 100;
  };

  const abrirDocumento = async () => {
    if (pesquisa.documentoUrl) {
      try {
        await Linking.openURL(pesquisa.documentoUrl);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível abrir o documento');
      }
    }
  };

  if (checking) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pesquisa Pública</Text>
      </View>

      {/* Título e Descrição */}
      <View style={styles.section}>
        <Text style={styles.titulo}>{pesquisa.titulo}</Text>
        {pesquisa.descricao && (
          <Text style={styles.descricao}>{pesquisa.descricao}</Text>
        )}
      </View>

      {/* Informações */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#0066CC" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Data Limite</Text>
            <Text style={styles.infoValue}>{formatDate(pesquisa.dataLimite)}</Text>
          </View>
        </View>

        <View style={[styles.infoRow, styles.infoRowBorder]}>
          <Ionicons name="people-outline" size={20} color="#0066CC" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Total de Votos</Text>
            <Text style={styles.infoValue}>
              {pesquisa.totalVotos} {pesquisa.totalVotos === 1 ? 'voto' : 'votos'}
            </Text>
          </View>
        </View>

        {pesquisa.documentoUrl && (
          <TouchableOpacity
            style={[styles.infoRow, styles.infoRowBorder]}
            onPress={abrirDocumento}
          >
            <Ionicons name="document-attach" size={20} color="#0066CC" />
            <View style={[styles.infoContent, { flex: 1 }]}>
              <Text style={styles.infoLabel}>Documento Anexo</Text>
              <Text style={styles.linkText}>Clique para visualizar</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#0066CC" />
          </TouchableOpacity>
        )}
      </View>

      {/* Status de já votou */}
      {jaVotou && (
        <View style={styles.jaVotouBanner}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.jaVotouText}>
            Você já participou desta pesquisa
          </Text>
        </View>
      )}

      {/* Alternativas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {mostrarResultados ? 'Resultados' : 'Escolha uma alternativa'}
        </Text>

        {pesquisa.alternativas.map((alternativa) => {
          const percentual = calcularPercentual(alternativa.votos);
          const isSelected = selectedAlternativa === alternativa.id;
          const isWinner = alternativa.votos === Math.max(...pesquisa.alternativas.map(a => a.votos));

          return (
            <TouchableOpacity
              key={alternativa.id}
              style={[
                styles.alternativaCard,
                isSelected && styles.alternativaSelected,
                jaVotou && styles.alternativaDisabled,
              ]}
              onPress={() => !jaVotou && setSelectedAlternativa(alternativa.id)}
              disabled={jaVotou}
            >
              <View style={styles.alternativaHeader}>
                {!mostrarResultados ? (
                  <View style={styles.radioContainer}>
                    <View style={[styles.radio, isSelected && styles.radioSelected]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                    <Text style={[styles.alternativaTexto, isSelected && styles.alternativaTextoSelected]}>
                      {alternativa.texto}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.resultadoContainer}>
                    <View style={styles.resultadoHeader}>
                      {isWinner && alternativa.votos > 0 && (
                        <Text style={styles.winner}>👑</Text>
                      )}
                      <Text style={styles.alternativaTexto}>{alternativa.texto}</Text>
                    </View>
                    <View style={styles.resultadoInfo}>
                      <Text style={styles.votosText}>
                        {alternativa.votos} {alternativa.votos === 1 ? 'voto' : 'votos'}
                      </Text>
                      <Text style={styles.percentualText}>{percentual.toFixed(1)}%</Text>
                    </View>
                    <View style={styles.barraContainer}>
                      <View
                        style={[
                          styles.barra,
                          { width: `${percentual}%` },
                          isWinner && alternativa.votos > 0 && styles.barraWinner,
                        ]}
                      />
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Botão de votar */}
      {!jaVotou && (
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.votarButton,
              (selectedAlternativa === null || votando) && styles.votarButtonDisabled,
            ]}
            onPress={handleVotar}
            disabled={selectedAlternativa === null || votando}
          >
            {votando ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                <Text style={styles.votarButtonText}>Confirmar Voto</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  descricao: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  infoContent: {
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  linkText: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '600',
  },
  jaVotouBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  jaVotouText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  alternativaCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  alternativaSelected: {
    borderColor: '#0066CC',
    backgroundColor: '#E3F2FD',
  },
  alternativaDisabled: {
    borderColor: '#F0F0F0',
  },
  alternativaHeader: {
    flex: 1,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CCC',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#0066CC',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0066CC',
  },
  alternativaTexto: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  alternativaTextoSelected: {
    fontWeight: '600',
    color: '#0066CC',
  },
  resultadoContainer: {
    flex: 1,
  },
  resultadoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  winner: {
    fontSize: 20,
  },
  resultadoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  votosText: {
    fontSize: 14,
    color: '#666',
  },
  percentualText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  barraContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barra: {
    height: '100%',
    backgroundColor: '#0066CC',
    borderRadius: 4,
  },
  barraWinner: {
    backgroundColor: '#FFD700',
  },
  votarButton: {
    flexDirection: 'row',
    backgroundColor: '#0066CC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  votarButtonDisabled: {
    backgroundColor: '#CCC',
    elevation: 0,
  },
  votarButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VotarPesquisaScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/layout/Header';
import { Colors } from '../constants/Colors';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Transmissao'>;

// Simulação de dados de transmissão
interface TransmissaoData {
  isLive: boolean;
  titulo: string;
  descricao: string;
  dataInicio?: Date;
  proximaTransmissao?: Date;
  urlVideo?: string; // YouTube/Vimeo embed URL
  pauta?: string[];
  espectadores?: number;
}

export default function TransmissaoScreen({ navigation }: Props) {
  const [transmissao, setTransmissao] = useState<TransmissaoData>({
    isLive: false,
    titulo: 'Sessão Ordinária',
    descricao: 'Acompanhe ao vivo as sessões da Câmara Municipal',
    proximaTransmissao: new Date(2025, 9, 20, 14, 0), // 20/10/2025 14:00
    pauta: [
      'Abertura e leitura da ata',
      'Projeto de Lei Nº 045/2025 - Denominação de rua',
      'Projeto de Lei Nº 046/2025 - Horário de funcionamento',
      'Requerimentos diversos',
      'Encerramento',
    ],
  });

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Simular mudança de status (apenas para demonstração)
  useEffect(() => {
    // Em produção, isso viria de uma API em tempo real
    // const checkLiveStatus = setInterval(() => {
    //   // Verificar status da transmissão
    // }, 30000); // A cada 30 segundos
    
    // return () => clearInterval(checkLiveStatus);
  }, []);

  const handlePlayLive = () => {
    if (transmissao.isLive) {
      // Abrir player de vídeo
      Alert.alert(
        'Transmissão ao Vivo',
        'Abrindo player de vídeo...\n\nEm produção, aqui seria carregado o player do YouTube/Vimeo ou um componente de vídeo nativo.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Sem Transmissão',
        'Não há transmissão ao vivo no momento. Confira o agendamento da próxima sessão abaixo.',
        [{ text: 'OK' }]
      );
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderLivePlayer = () => {
    if (!transmissao.isLive) {
      return (
        <View style={styles.offlinePlayer}>
          <Ionicons name="videocam-off" size={60} color={Colors.text.secondary} />
          <Text style={styles.offlineTitle}>Fora do ar</Text>
          <Text style={styles.offlineText}>
            Não há transmissão ao vivo no momento
          </Text>
          <TouchableOpacity style={styles.notifyButton}>
            <Ionicons name="notifications-outline" size={20} color={Colors.text.white} />
            <Text style={styles.notifyButtonText}>Notificar-me</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.livePlayer}>
        {/* Badge AO VIVO */}
        <View style={styles.liveBadge}>
          <View style={styles.liveIndicator} />
          <Text style={styles.liveBadgeText}>AO VIVO</Text>
          <Text style={styles.viewersText}>• {transmissao.espectadores || 145} assistindo</Text>
        </View>

        {/* Controles do Player */}
        <TouchableOpacity 
          style={styles.playOverlay}
          onPress={handlePlayLive}
        >
          <View style={styles.playButton}>
            <Ionicons name="play" size={50} color={Colors.text.white} />
          </View>
        </TouchableOpacity>

        {/* Botão Fullscreen */}
        <TouchableOpacity 
          style={styles.fullscreenButton}
          onPress={toggleFullscreen}
        >
          <Ionicons 
            name={isFullscreen ? "contract" : "expand"} 
            size={24} 
            color={Colors.text.white} 
          />
        </TouchableOpacity>

        {/* Placeholder para vídeo real */}
        <Text style={styles.playerPlaceholder}>
          🎥 Player de Vídeo{'\n'}
          (YouTube/Vimeo Embed)
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Transmissão ao Vivo" 
        showBackButton 
        onBackPress={() => navigation.goBack()} 
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Player de Vídeo */}
        <View style={styles.playerContainer}>
          {renderLivePlayer()}
        </View>

        {/* Informações da Sessão */}
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>{transmissao.titulo}</Text>
          <Text style={styles.sessionDescription}>{transmissao.descricao}</Text>

          {transmissao.isLive && transmissao.dataInicio && (
            <View style={styles.dateRow}>
              <Ionicons name="time" size={16} color={Colors.text.secondary} />
              <Text style={styles.dateText}>
                Iniciada às {format(transmissao.dataInicio, "HH'h'mm", { locale: ptBR })}
              </Text>
            </View>
          )}
        </View>

        {/* Próxima Transmissão */}
        {!transmissao.isLive && transmissao.proximaTransmissao && (
          <View style={styles.nextSessionCard}>
            <View style={styles.nextSessionHeader}>
              <Ionicons name="calendar" size={24} color={Colors.primary.red} />
              <Text style={styles.nextSessionTitle}>Próxima Transmissão</Text>
            </View>
            <View style={styles.nextSessionContent}>
              <Text style={styles.nextSessionDate}>
                {format(transmissao.proximaTransmissao, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </Text>
              <Text style={styles.nextSessionTime}>
                às {format(transmissao.proximaTransmissao, "HH'h'mm", { locale: ptBR })}
              </Text>
            </View>
            <TouchableOpacity style={styles.addToCalendarButton}>
              <Ionicons name="calendar-outline" size={18} color={Colors.primary.red} />
              <Text style={styles.addToCalendarText}>Adicionar ao calendário</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Pauta da Sessão */}
        {transmissao.pauta && transmissao.pauta.length > 0 && (
          <View style={styles.pautaSection}>
            <View style={styles.pautaHeader}>
              <Ionicons name="list" size={24} color={Colors.text.primary} />
              <Text style={styles.pautaTitle}>Ordem do Dia</Text>
            </View>
            {transmissao.pauta.map((item, index) => (
              <View key={index} style={styles.pautaItem}>
                <View style={styles.pautaNumber}>
                  <Text style={styles.pautaNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.pautaItemText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Ações Rápidas */}
        <View style={styles.actionsSection}>
          <Text style={styles.actionsTitle}>Ações</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="share-social" size={22} color={Colors.primary.red} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionButtonTitle}>Compartilhar</Text>
              <Text style={styles.actionButtonDescription}>
                Envie o link da transmissão
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="chatbubbles" size={22} color={Colors.primary.red} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionButtonTitle}>Comentários</Text>
              <Text style={styles.actionButtonDescription}>
                Participe da discussão
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="document-text" size={22} color={Colors.primary.red} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionButtonTitle}>Ver Pauta Completa</Text>
              <Text style={styles.actionButtonDescription}>
                Documentos e detalhes
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="film" size={22} color={Colors.primary.red} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionButtonTitle}>Transmissões Anteriores</Text>
              <Text style={styles.actionButtonDescription}>
                Assista gravações
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
          </TouchableOpacity>
        </View>

        {/* Informação sobre Transmissões */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#1565C0" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Horário das Transmissões</Text>
            <Text style={styles.infoText}>
              As sessões ordinárias acontecem toda segunda-feira às 14h.
              As sessões extraordinárias são transmitidas conforme convocação.
            </Text>
          </View>
        </View>

        {/* Links Úteis */}
        <View style={styles.linksSection}>
          <Text style={styles.linksTitle}>Também assista em:</Text>
          <View style={styles.linksGrid}>
            <TouchableOpacity style={styles.linkButton}>
              <Ionicons name="logo-youtube" size={28} color="#FF0000" />
              <Text style={styles.linkButtonText}>YouTube</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton}>
              <Ionicons name="logo-facebook" size={28} color="#1877F2" />
              <Text style={styles.linkButtonText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton}>
              <Ionicons name="globe" size={28} color={Colors.text.secondary} />
              <Text style={styles.linkButtonText}>Site Oficial</Text>
            </TouchableOpacity>
          </View>
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
  },
  playerContainer: {
    backgroundColor: '#000',
    aspectRatio: 16 / 9,
    width: '100%',
  },
  livePlayer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  offlinePlayer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  offlineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.white,
    marginTop: 15,
    marginBottom: 5,
  },
  offlineText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 20,
  },
  notifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.red,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  notifyButtonText: {
    color: Colors.text.white,
    fontSize: 14,
    fontWeight: '600',
  },
  liveBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    zIndex: 10,
    gap: 6,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.text.white,
  },
  liveBadgeText: {
    color: Colors.text.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  viewersText: {
    color: Colors.text.white,
    fontSize: 12,
  },
  playOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.text.white,
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  playerPlaceholder: {
    color: Colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
  },
  sessionInfo: {
    backgroundColor: Colors.background.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  sessionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  sessionDescription: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 22,
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  nextSessionCard: {
    backgroundColor: Colors.background.white,
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextSessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  nextSessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  nextSessionContent: {
    marginBottom: 15,
  },
  nextSessionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  nextSessionTime: {
    fontSize: 15,
    color: Colors.text.secondary,
  },
  addToCalendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    gap: 8,
  },
  addToCalendarText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary.red,
  },
  pautaSection: {
    backgroundColor: Colors.background.white,
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pautaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  pautaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  pautaItem: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  pautaNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pautaNumberText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.text.secondary,
  },
  pautaItemText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 22,
    paddingTop: 3,
  },
  actionsSection: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: Colors.background.white,
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
    color: Colors.text.primary,
    marginBottom: 2,
  },
  actionButtonDescription: {
    fontSize: 13,
    color: Colors.text.secondary,
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
    marginBottom: 5,
  },
  infoText: {
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 20,
  },
  linksSection: {
    marginHorizontal: 15,
    marginBottom: 30,
  },
  linksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  linksGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  linkButton: {
    flex: 1,
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    gap: 8,
  },
  linkButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
});

import React, { useState, useEffect } from 'react';
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
  Modal,
  Dimensions,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/layout/Header';
import { Colors } from '../constants/Colors';
import api from '../services/api';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { Vereador, Projeto } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'VereadorDetalhes'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function VereadorDetalhesScreen({ route }: Props) {
  const { vereadorId } = route.params;
  const [vereador, setVereador] = useState<Vereador | null>(null);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sobre' | 'projetos' | 'contato'>('sobre');
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  useEffect(() => {
    loadVereadorData();
  }, [vereadorId]);

  const loadVereadorData = async () => {
    try {
      setLoading(true);
      const vereadorData = await api.getVereadorById(Number(vereadorId));
      setVereador(vereadorData || null);
      
      // Debug: Verificar URL da foto
      console.log('🖼️ [DEBUG] URL da foto:', vereadorData?.foto);
      
      // Carregar todos os projetos e filtrar pelo autor
      const allProjetos = await api.getProjetos();
      const projetosVereador = allProjetos.filter((p: Projeto) => p.autor === vereadorData?.nome);
      setProjetos(projetosVereador);
    } catch (err) {
      console.error('Erro ao carregar vereador:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.red} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    );
  }

  if (!vereador) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={60} color="#999" />
          <Text style={styles.errorText}>Vereador não encontrado</Text>
        </View>
      </View>
    );
  }

  const handleSendMessage = () => {
    // Envia mensagem por WhatsApp (pode ser adaptado para SMS ou outro meio)
    const message = encodeURIComponent(`Olá, ${vereador.nome}! Gostaria de entrar em contato.`);
    const whatsappUrl = `whatsapp://send?phone=55${vereador.telefone.replace(/\D/g, '')}&text=${message}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          // Fallback para SMS
          const smsUrl = `sms:${vereador.telefone}?body=${message}`;
          return Linking.openURL(smsUrl);
        }
      })
      .catch(() =>
        Alert.alert(
          'Erro ao Enviar Mensagem',
          'Não foi possível abrir o WhatsApp ou SMS. Verifique se você tem um app de mensagens instalado.',
          [{ text: 'OK' }]
        )
      );
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${vereador.email}`).catch(() =>
      Alert.alert('Erro', 'Não foi possível abrir o cliente de e-mail')
    );
  };

  const handleSocialMedia = (platform: 'facebook' | 'instagram' | 'twitter') => {
    const url = vereador.redeSocial?.[platform];
    if (url) {
      Linking.openURL(url).catch(() =>
        Alert.alert('Erro', 'Não foi possível abrir o link')
      );
    }
  };

  const renderSobreTab = () => (
    <View style={styles.tabContent}>
      {/* Biografia */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Biografia</Text>
        <Text style={styles.bioText}>
          {vereador.biografia ||
            'Vereador comprometido com o desenvolvimento de Ibirapitanga e o bem-estar da população. Atuação focada em melhorias para a comunidade e transparência na gestão pública.'}
        </Text>
      </View>

      {/* Informações Gerais */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Gerais</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nome Completo</Text>
              <Text style={styles.infoValue}>{vereador.nome}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="flag" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Partido</Text>
              <Text style={styles.infoValue}>{vereador.partido}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Mandato</Text>
              <Text style={styles.infoValue}>{vereador.mandato || '2021 - 2024'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Áreas de Atuação */}
      {vereador.areaAtuacao && vereador.areaAtuacao.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Áreas de Atuação</Text>
          <View style={styles.tagsContainer}>
            {vereador.areaAtuacao.map((area, index) => {
              // Cores diferentes para cada área
              const colors = [
                { bg: '#DBEAFE', text: '#1E40AF' },
                { bg: '#DCFCE7', text: '#166534' },
                { bg: '#FEF3C7', text: '#92400E' },
                { bg: '#F3E8FF', text: '#6B21A8' },
                { bg: '#FEE2E2', text: '#991B1B' },
                { bg: '#E0F2FE', text: '#075985' },
              ];
              const color = colors[index % colors.length];
              
              return (
                <View key={index} style={[styles.tag, { backgroundColor: color.bg }]}>
                  <Text style={[styles.tagText, { color: color.text }]}>{area}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Estatísticas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Atividade Parlamentar</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{projetos.length}</Text>
            <Text style={styles.statLabel}>Projetos</Text>
            <Text style={styles.statLabel}>Apresentados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {projetos.filter((p) => p.status === 'Aprovado').length}
            </Text>
            <Text style={styles.statLabel}>Projetos</Text>
            <Text style={styles.statLabel}>Aprovados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {vereador.presencaSessoes !== undefined ? vereador.presencaSessoes : '-'}
            </Text>
            <Text style={styles.statLabel}>Presenças</Text>
            <Text style={styles.statLabel}>em Sessões</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderProjetosTab = () => (
    <View style={styles.tabContent}>
      {projetos.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={60} color="#CCC" />
          <Text style={styles.emptyText}>Nenhum projeto apresentado ainda</Text>
        </View>
      ) : (
        <>
          <Text style={styles.tabDescription}>
            Projetos de lei apresentados por {vereador.nome}
          </Text>
          {projetos.map((projeto) => (
            <View key={projeto.id} style={styles.projectCard}>
              <View style={styles.projectHeader}>
                <Text style={styles.projectNumber}>{projeto.numero}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        projeto.status === 'Aprovado'
                          ? '#DCFCE7'
                          : projeto.status === 'Em Andamento'
                          ? '#FEF3C7'
                          : '#FEE2E2',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          projeto.status === 'Aprovado'
                            ? '#166534'
                            : projeto.status === 'Em Andamento'
                            ? '#92400E'
                            : '#991B1B',
                      },
                    ]}
                  >
                    {projeto.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.projectTitle}>{projeto.titulo}</Text>
              <Text style={styles.projectDescription} numberOfLines={2}>
                {projeto.descricao}
              </Text>
              <View style={styles.projectFooter}>
                <View style={styles.projectDate}>
                  <Ionicons name="calendar-outline" size={14} color="#666" />
                  <Text style={styles.projectDateText}>
                    {projeto.dataApresentacao.toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <TouchableOpacity style={styles.projectLink}>
                  <Text style={styles.projectLinkText}>Ver detalhes</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.primary.red} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );

  const renderContatoTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabDescription}>Entre em contato com o vereador</Text>

      {/* Enviar Mensagem */}
      <TouchableOpacity style={styles.contactCard} onPress={handleSendMessage}>
        <View style={styles.contactIcon}>
          <Ionicons name="chatbubble-ellipses" size={24} color={Colors.primary.red} />
        </View>
        <View style={styles.contactContent}>
          <Text style={styles.contactLabel}>Enviar Mensagem</Text>
          <Text style={styles.contactValue}>{vereador.telefone}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* E-mail */}
      <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
        <View style={styles.contactIcon}>
          <Ionicons name="mail" size={24} color={Colors.primary.red} />
        </View>
        <View style={styles.contactContent}>
          <Text style={styles.contactLabel}>E-mail</Text>
          <Text style={styles.contactValue}>{vereador.email}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* Redes Sociais */}
      {vereador.redeSocial && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Redes Sociais</Text>
          <View style={styles.socialContainer}>
            {vereador.redeSocial.facebook && (
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: '#1877F2' }]}
                onPress={() => handleSocialMedia('facebook')}
              >
                <Ionicons name="logo-facebook" size={28} color="#FFF" />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
            )}
            {vereador.redeSocial.instagram && (
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: '#E4405F' }]}
                onPress={() => handleSocialMedia('instagram')}
              >
                <Ionicons name="logo-instagram" size={28} color="#FFF" />
                <Text style={styles.socialText}>Instagram</Text>
              </TouchableOpacity>
            )}
            {vereador.redeSocial.twitter && (
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}
                onPress={() => handleSocialMedia('twitter')}
              >
                <Ionicons name="logo-twitter" size={28} color="#FFF" />
                <Text style={styles.socialText}>Twitter</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Gabinete */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gabinete</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="business" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Localização</Text>
              <Text style={styles.infoValue}>
                {vereador.numeroGabinete 
                  ? `${vereador.numeroGabinete}${vereador.andarGabinete ? ` - ${vereador.andarGabinete}` : ''}\n`
                  : ''
                }Câmara Municipal de Ibirapitanga{'\n'}
                Praça da Independência, Centro
              </Text>
            </View>
          </View>
          
          {vereador.ramal && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Ionicons name="call" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Ramal</Text>
                  <Text style={styles.infoValue}>{vereador.ramal}</Text>
                </View>
              </View>
            </>
          )}
          
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Horário de Atendimento</Text>
              <Text style={styles.infoValue}>
                {vereador.horarioAtendimento || 'Segunda a Sexta: 8h às 12h e 14h às 18h'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card do Perfil */}
        <View style={styles.profileCard}>
          <TouchableOpacity 
            onPress={() => setPhotoModalVisible(true)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: vereador.foto }} style={styles.profileImage} />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{vereador.nome}</Text>
            <View style={styles.profileParty}>
              <Ionicons name="flag" size={16} color="#666" />
              <Text style={styles.profilePartyText}>{vereador.partido}</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'sobre' && styles.activeTab]}
            onPress={() => setActiveTab('sobre')}
          >
            <Ionicons
              name="person"
              size={20}
              color={activeTab === 'sobre' ? Colors.primary.red : '#666'}
            />
            <Text
              style={[styles.tabText, activeTab === 'sobre' && styles.activeTabText]}
            >
              Sobre
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'projetos' && styles.activeTab]}
            onPress={() => setActiveTab('projetos')}
          >
            <Ionicons
              name="document-text"
              size={20}
              color={activeTab === 'projetos' ? Colors.primary.red : '#666'}
            />
            <Text
              style={[styles.tabText, activeTab === 'projetos' && styles.activeTabText]}
            >
              Projetos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'contato' && styles.activeTab]}
            onPress={() => setActiveTab('contato')}
          >
            <Ionicons
              name="mail"
              size={20}
              color={activeTab === 'contato' ? Colors.primary.red : '#666'}
            />
            <Text
              style={[styles.tabText, activeTab === 'contato' && styles.activeTabText]}
            >
              Contato
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo das Tabs */}
        {activeTab === 'sobre' && renderSobreTab()}
        {activeTab === 'projetos' && renderProjetosTab()}
        {activeTab === 'contato' && renderContatoTab()}
      </ScrollView>

      {/* Modal de Foto Ampliada */}
      <Modal
        visible={photoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setPhotoModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              {/* Foto em formato retangular */}
              <View style={styles.modalImageContainer}>
                <Image 
                  source={{ uri: vereador.foto }} 
                  style={styles.modalImage}
                  resizeMode="cover"
                />
              </View>
              
              {/* Informações estilo "santinho de candidato" */}
              <View style={styles.candidateInfo}>
                <Text style={styles.candidateName}>{vereador.nome}</Text>
                <View style={styles.candidateParty}>
                  <Ionicons name="flag" size={20} color="#FFF" />
                  <Text style={styles.candidatePartyText}>{vereador.partido}</Text>
                </View>
              </View>

              {/* Botão Fechar */}
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setPhotoModalVisible(false)}
              >
                <Ionicons name="close" size={28} color="#FFF" />
              </TouchableOpacity>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    marginTop: 15,
  },
  profileCard: {
    backgroundColor: '#FFF',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: Colors.primary.red,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  profileParty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  profilePartyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary.red,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: Colors.primary.red,
  },
  tabContent: {
    padding: 15,
  },
  tabDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  bioText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary.red,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  projectCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  projectNumber: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  projectDateText: {
    fontSize: 12,
    color: '#666',
  },
  projectLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  projectLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary.red,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 15,
  },
  contactCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  socialButton: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  socialText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    maxWidth: 500,
  },
  modalImageContainer: {
    width: '100%',
    aspectRatio: 3 / 4, // Formato retangular tipo santinho (3:4)
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  // Informações estilo santinho
  candidateInfo: {
    marginTop: 20,
    backgroundColor: Colors.primary.red,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  candidateName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  candidateParty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  candidatePartyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  closeButton: {
    position: 'absolute',
    top: -60,
    right: 0,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
});

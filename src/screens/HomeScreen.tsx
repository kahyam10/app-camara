import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors } from '../constants/Colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  screen: keyof RootStackParamList;
}

const menuItems: MenuItem[] = [
  {
    id: '1',
    title: 'Vereadores',
    icon: 'people',
    color: '#2563EB',
    screen: 'Vereadores',
  },
  {
    id: '2',
    title: 'Mesa Diretora',
    icon: 'ribbon',
    color: Colors.primary.red,
    screen: 'MesaDiretora',
  },
  {
    id: '3',
    title: 'Agenda',
    icon: 'calendar',
    color: '#7C3AED',
    screen: 'Agenda',
  },
  {
    id: '4',
    title: 'Sessões',
    icon: 'document-text',
    color: '#DC2626',
    screen: 'Sessoes',
  },
  {
    id: '5',
    title: 'Votações',
    icon: 'checkbox',
    color: '#059669',
    screen: 'Votacoes',
  },
  {
    id: '6',
    title: 'Projetos de Lei',
    icon: 'folder-open',
    color: '#D97706',
    screen: 'Projetos',
  },
  {
    id: '7',
    title: 'Leis',
    icon: 'document',
    color: '#0891B2',
    screen: 'Leis',
  },
  {
    id: '8',
    title: 'Pesquisas Públicas',
    icon: 'clipboard',
    color: '#8B5CF6',
    screen: 'Pesquisas',
  },
  {
    id: '9',
    title: 'Notícias',
    icon: 'newspaper',
    color: '#EF4444',
    screen: 'Noticias',
  },
  {
    id: '10',
    title: 'Transmissão',
    icon: 'videocam',
    color: '#F59E0B',
    screen: 'Transmissao',
  },
  {
    id: '11',
    title: 'Avaliar',
    icon: 'star',
    color: '#10B981',
    screen: 'Avaliar',
  },
  {
    id: '12',
    title: 'Contato',
    icon: 'call',
    color: '#6366F1',
    screen: 'Avaliar', // Reutilizando a tela de Avaliar para contato
  },
];

export default function HomeScreen({ navigation }: Props) {
  const handleMenuPress = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary.red} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="business" size={32} color={Colors.text.white} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Câmara Municipal</Text>
            <Text style={styles.headerSubtitle}>Ibirapitanga - BA</Text>
          </View>
        </View>
      </View>

      {/* Menu Grid */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Serviços Disponíveis</Text>
        
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              onPress={() => handleMenuPress(item.screen)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={32} color={Colors.text.white} />
              </View>
              <Text style={styles.menuTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.text.secondary} />
          <Text style={styles.footerText}>
            Acesse todas as informações da Câmara Municipal de forma rápida e transparente
          </Text>
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
  header: {
    backgroundColor: Colors.primary.red,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  menuCard: {
    width: '31%',
    backgroundColor: Colors.background.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 120,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    marginTop: 8,
  },
  footerText: {
    flex: 1,
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
});

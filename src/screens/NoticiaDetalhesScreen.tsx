import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Alert,
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

type Props = NativeStackScreenProps<RootStackParamList, 'NoticiaDetalhes'>;

export default function NoticiaDetalhesScreen({ route }: Props) {
  const { noticiaId } = route.params;
  const { isFavoriteNews, toggleFavoriteNews } = useFavorites();

  const noticia = useMemo(() => {
    return mockData.noticias.find((n) => n.id.toString() === noticiaId);
  }, [noticiaId]);

  if (!noticia) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="alert-circle-outline"
          title="Notícia não encontrada"
          message="Não foi possível carregar os detalhes"
        />
      </View>
    );
  }

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'Geral':
        return '#2563EB';
      case 'Sessões':
        return '#7C3AED';
      case 'Projetos':
        return '#059669';
      case 'Eventos':
        return '#DC2626';
      case 'Comunicados':
        return '#F59E0B';
      default:
        return Colors.text.secondary;
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${noticia.titulo}\n\n${noticia.resumo}\n\nCâmara Municipal de Ibirapitanga`,
        title: noticia.titulo,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      Alert.alert(
        'Erro ao Compartilhar',
        'Não foi possível compartilhar esta notícia. Tente novamente.',
        [{ text: 'OK' }]
      );
    }
  };

  const categoriaColor = getCategoriaColor(noticia.categoria);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Imagem em destaque */}
        {noticia.imagemUrl && (
          <Image
            source={{ uri: noticia.imagemUrl }}
            style={styles.imagemDestaque}
            resizeMode="cover"
          />
        )}

        {/* Card de conteúdo */}
        <View style={styles.contentCard}>
          {/* Categoria badge */}
          <View style={[styles.categoriaBadge, { backgroundColor: categoriaColor }]}>
            <Text style={styles.categoriaText}>{noticia.categoria}</Text>
          </View>

          {/* Título */}
          <Text style={styles.titulo}>{noticia.titulo}</Text>

          {/* Meta informações */}
          <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={16} color={Colors.text.secondary} />
              <Text style={styles.metaText}>
                {format(noticia.dataPublicacao, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="person-outline" size={16} color={Colors.text.secondary} />
              <Text style={styles.metaText}>{noticia.autor}</Text>
            </View>
          </View>

          {/* Resumo */}
          <View style={styles.resumoContainer}>
            <Text style={styles.resumo}>{noticia.resumo}</Text>
          </View>

          {/* Conteúdo completo */}
          <View style={styles.conteudoContainer}>
            <Text style={styles.conteudo}>{noticia.conteudo}</Text>
          </View>

          {/* Tags */}
          {noticia.tags && noticia.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Text style={styles.tagsLabel}>Tags:</Text>
              <View style={styles.tagsList}>
                {noticia.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Ionicons name="pricetag" size={12} color={Colors.primary.red} />
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Botões de ação */}
        <View style={styles.actionsContainer}>
          {/* Compartilhar */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Ionicons name="share-social-outline" size={22} color={Colors.primary.red} />
            <Text style={styles.actionButtonText}>Compartilhar</Text>
          </TouchableOpacity>

          {/* Favoritar */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleFavoriteNews(noticia.id)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isFavoriteNews(noticia.id) ? "heart" : "heart-outline"} 
              size={22} 
              color={Colors.primary.red} 
            />
            <Text style={styles.actionButtonText}>
              {isFavoriteNews(noticia.id) ? 'Salvo' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card informativo */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Ionicons name="information-circle" size={24} color={Colors.primary.red} />
            <Text style={styles.infoCardTitle}>Fonte Oficial</Text>
          </View>
          <Text style={styles.infoCardText}>
            Esta notícia foi publicada pela Assessoria de Comunicação da Câmara
            Municipal de Ibirapitanga. Para mais informações, entre em contato pelos
            nossos canais oficiais.
          </Text>
        </View>

        {/* Notícias relacionadas (opcional - pode ser implementado depois) */}
        <View style={styles.relacionadasContainer}>
          <Text style={styles.relacionadasTitle}>Notícias Relacionadas</Text>
          <Text style={styles.relacionadasSubtitle}>
            Confira outras notícias da categoria {noticia.categoria}
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
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
  imagemDestaque: {
    width: '100%',
    height: 250,
  },
  contentCard: {
    backgroundColor: Colors.background.white,
    padding: 16,
  },
  categoriaBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  categoriaText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    lineHeight: 32,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  resumoContainer: {
    backgroundColor: Colors.background.gray50,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.red,
    marginBottom: 20,
  },
  resumo: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text.primary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  conteudoContainer: {
    marginBottom: 20,
  },
  conteudo: {
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 24,
    textAlign: 'justify',
  },
  tagsContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  tagsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.gray50,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  tagText: {
    fontSize: 12,
    color: Colors.text.primary,
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  actionButton: {
    flex: 1,
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
  infoCard: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginLeft: 8,
  },
  infoCardText: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 20,
  },
  relacionadasContainer: {
    padding: 16,
  },
  relacionadasTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  relacionadasSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  bottomSpacer: {
    height: 20,
  },
});

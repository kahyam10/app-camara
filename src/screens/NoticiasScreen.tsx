import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Header, SearchBar, FilterButton, EmptyState } from '../components';
import { Colors } from '../constants/Colors';
import { mockData } from '../mocks/data';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFavorites } from '../contexts';

type Props = NativeStackScreenProps<RootStackParamList, 'Noticias'>;

type CategoriaFiltro = 'Todas' | 'Geral' | 'Sessões' | 'Projetos' | 'Eventos' | 'Comunicados';

export default function NoticiasScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaFiltro>('Todas');
  const [refreshing, setRefreshing] = useState(false);
  const { isFavoriteNews, toggleFavoriteNews } = useFavorites();

  const noticias = mockData.noticias;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simular reload de dados (em produção, seria uma chamada à API)
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Filtrar notícias
  const noticiasFiltradas = useMemo(() => {
    return noticias
      .filter((n) => {
        // Filtro por categoria
        const matchCategoria =
          selectedCategoria === 'Todas' || n.categoria === selectedCategoria;

        // Filtro por busca
        const matchSearch =
          searchQuery === '' ||
          n.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.resumo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.autor.toLowerCase().includes(searchQuery.toLowerCase());

        return matchCategoria && matchSearch;
      })
      .sort((a, b) => b.dataPublicacao.getTime() - a.dataPublicacao.getTime());
  }, [noticias, selectedCategoria, searchQuery]);

  const getCategoriaColor = useCallback((categoria: string) => {
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
  }, []);

  const renderNoticia = useCallback(({ item, index }: { item: typeof noticias[0]; index: number }) => {
    const categoriaColor = getCategoriaColor(item.categoria);

    // Primeira notícia em destaque
    if (index === 0 && searchQuery === '' && selectedCategoria === 'Todas') {
      return (
        <TouchableOpacity
          style={styles.noticiaDestaque}
          onPress={() => navigation.navigate('NoticiaDetalhes', { noticiaId: item.id.toString() })}
          activeOpacity={0.7}
        >
          {item.imagemUrl && (
            <Image
              source={{ uri: item.imagemUrl }}
              style={styles.imagemDestaque}
              resizeMode="cover"
            />
          )}
          <View style={styles.destaqueContent}>
            <View style={[styles.categoriaBadge, { backgroundColor: categoriaColor }]}>
              <Text style={styles.categoriaText}>{item.categoria}</Text>
            </View>
            <Text style={styles.tituloDestaque} numberOfLines={3}>
              {item.titulo}
            </Text>
            <Text style={styles.resumoDestaque} numberOfLines={2}>
              {item.resumo}
            </Text>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={14} color={Colors.text.white} />
              <Text style={styles.dataDestaque}>
                {format(item.dataPublicacao, "dd/MM/yyyy", { locale: ptBR })}
              </Text>
              <Text style={styles.separator}>•</Text>
              <Ionicons name="person-outline" size={14} color={Colors.text.white} />
              <Text style={styles.autorDestaque}>{item.autor}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // Notícias regulares
    return (
      <TouchableOpacity
        style={styles.noticiaCard}
        onPress={() => navigation.navigate('NoticiaDetalhes', { noticiaId: item.id.toString() })}
        activeOpacity={0.7}
      >
        {item.imagemUrl && (
          <Image
            source={{ uri: item.imagemUrl }}
            style={styles.noticiaImagem}
            resizeMode="cover"
          />
        )}
        {/* Botão de favorito */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavoriteNews(item.id);
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavoriteNews(item.id) ? "heart" : "heart-outline"}
            size={20}
            color={Colors.primary.red}
          />
        </TouchableOpacity>
        <View style={styles.noticiaContent}>
          <View style={[styles.categoriaBadgeSmall, { backgroundColor: categoriaColor }]}>
            <Text style={styles.categoriaTextSmall}>{item.categoria}</Text>
          </View>
          <Text style={styles.noticiaTitulo} numberOfLines={2}>
            {item.titulo}
          </Text>
          <Text style={styles.noticiaResumo} numberOfLines={2}>
            {item.resumo}
          </Text>
          <View style={styles.noticiaFooter}>
            <View style={styles.infoRowSmall}>
              <Ionicons name="calendar-outline" size={12} color={Colors.text.secondary} />
              <Text style={styles.noticiaData}>
                {format(item.dataPublicacao, "dd/MM/yyyy", { locale: ptBR })}
              </Text>
            </View>
            <View style={styles.infoRowSmall}>
              <Ionicons name="person-outline" size={12} color={Colors.text.secondary} />
              <Text style={styles.noticiaAutor}>{item.autor}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [navigation, searchQuery, selectedCategoria, toggleFavoriteNews, isFavoriteNews, getCategoriaColor, noticias]);

  const categorias: CategoriaFiltro[] = ['Todas', 'Geral', 'Sessões', 'Projetos', 'Eventos', 'Comunicados'];

  return (
    <View style={styles.container}>
      <Header 
        title="Notícias" 
        showBackButton 
        onBackPress={() => navigation.goBack()} 
      />

      <View style={styles.content}>
        {/* Barra de pesquisa */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar notícias..."
        />

        {/* Filtros por categoria */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {categorias.map((cat) => (
              <FilterButton
                key={cat}
                label={cat}
                isActive={selectedCategoria === cat}
                onPress={() => setSelectedCategoria(cat)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Contador */}
        <Text style={styles.counterText}>
          {noticiasFiltradas.length}{' '}
          {noticiasFiltradas.length === 1 ? 'notícia' : 'notícias'}{' '}
          {searchQuery || selectedCategoria !== 'Todas' ? 'encontrada(s)' : ''}
        </Text>

        {/* Lista */}
        {noticiasFiltradas.length > 0 ? (
          <FlatList
            data={noticiasFiltradas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderNoticia}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary.red]}
                tintColor={Colors.primary.red}
              />
            }
          />
        ) : (
          <EmptyState
            icon="newspaper-outline"
            title="Nenhuma notícia encontrada"
            message={
              searchQuery
                ? 'Tente ajustar sua busca'
                : `Não há notícias na categoria ${selectedCategoria}`
            }
          />
        )}
      </View>
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
  filterContainer: {
    marginBottom: 10,
  },
  filterScroll: {
    gap: 8,
  },
  counterText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 10,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  // Notícia em destaque
  noticiaDestaque: {
    backgroundColor: Colors.background.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  imagemDestaque: {
    width: '100%',
    height: 200,
  },
  destaqueContent: {
    padding: 16,
    backgroundColor: Colors.primary.red,
  },
  tituloDestaque: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.white,
    marginBottom: 8,
    lineHeight: 26,
  },
  resumoDestaque: {
    fontSize: 14,
    color: Colors.text.white,
    marginBottom: 12,
    lineHeight: 20,
    opacity: 0.9,
  },
  dataDestaque: {
    fontSize: 12,
    color: Colors.text.white,
    marginLeft: 4,
  },
  autorDestaque: {
    fontSize: 12,
    color: Colors.text.white,
    marginLeft: 4,
  },
  separator: {
    color: Colors.text.white,
    marginHorizontal: 8,
  },
  // Notícia regular
  noticiaCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.background.white,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  noticiaImagem: {
    width: '100%',
    height: 140,
  },
  noticiaContent: {
    padding: 12,
  },
  categoriaBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  categoriaText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
  categoriaBadgeSmall: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoriaTextSmall: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
  noticiaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 6,
    lineHeight: 22,
  },
  noticiaResumo: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  noticiaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoRowSmall: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noticiaData: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  noticiaAutor: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
});

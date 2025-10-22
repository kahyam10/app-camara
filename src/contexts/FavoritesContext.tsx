import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesContextData {
  favoriteNews: number[];
  favoriteProjects: number[];
  toggleFavoriteNews: (id: number) => Promise<void>;
  toggleFavoriteProject: (id: number) => Promise<void>;
  isFavoriteNews: (id: number) => boolean;
  isFavoriteProject: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextData>({} as FavoritesContextData);

const STORAGE_KEYS = {
  NEWS: '@legislativo:favorite_news',
  PROJECTS: '@legislativo:favorite_projects',
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favoriteNews, setFavoriteNews] = useState<number[]>([]);
  const [favoriteProjects, setFavoriteProjects] = useState<number[]>([]);

  // Carregar favoritos ao iniciar
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const [newsData, projectsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.NEWS),
        AsyncStorage.getItem(STORAGE_KEYS.PROJECTS),
      ]);

      if (newsData) {
        setFavoriteNews(JSON.parse(newsData));
      }

      if (projectsData) {
        setFavoriteProjects(JSON.parse(projectsData));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const toggleFavoriteNews = async (id: number) => {
    try {
      const newFavorites = favoriteNews.includes(id)
        ? favoriteNews.filter((favId) => favId !== id)
        : [...favoriteNews, id];

      setFavoriteNews(newFavorites);
      await AsyncStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Erro ao salvar favorito de notícia:', error);
    }
  };

  const toggleFavoriteProject = async (id: number) => {
    try {
      const newFavorites = favoriteProjects.includes(id)
        ? favoriteProjects.filter((favId) => favId !== id)
        : [...favoriteProjects, id];

      setFavoriteProjects(newFavorites);
      await AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Erro ao salvar favorito de projeto:', error);
    }
  };

  const isFavoriteNews = (id: number) => favoriteNews.includes(id);
  const isFavoriteProject = (id: number) => favoriteProjects.includes(id);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteNews,
        favoriteProjects,
        toggleFavoriteNews,
        toggleFavoriteProject,
        isFavoriteNews,
        isFavoriteProject,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de FavoritesProvider');
  }

  return context;
}

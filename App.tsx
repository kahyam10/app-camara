import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation';
import { mockData } from './src/mocks/data';
import { FavoritesProvider } from './src/contexts';
import { ErrorBoundary } from './src/components';

export default function App() {
  useEffect(() => {
    // Testa se os dados mockados estão funcionando
    console.log('📊 Dados mockados carregados:');
    console.log('   Vereadores:', mockData.vereadores.length);
    console.log('   Mesa Diretora:', mockData.mesaDiretora.length);
    console.log('   Leis:', mockData.leis.length);
    console.log('   Projetos:', mockData.projetos.length);
    console.log('   Sessões:', mockData.sessoes.length);
    console.log('   Votações:', mockData.votacoes.length);
    console.log('   Notícias:', mockData.noticias.length);
    console.log('   Eventos:', mockData.eventos.length);
  }, []);

  return (
    <ErrorBoundary>
      <FavoritesProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </FavoritesProvider>
    </ErrorBoundary>
  );
}



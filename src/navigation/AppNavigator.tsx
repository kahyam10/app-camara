import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { Colors } from '../constants/Colors';

// Screens
import HomeScreen from '../screens/HomeScreen';
import VereadoresScreen from '../screens/VereadoresScreen';
import VereadorDetalhesScreen from '../screens/VereadorDetalhesScreen';
import MesaDiretoraScreen from '../screens/MesaDiretoraScreen';
import AgendaScreen from '../screens/AgendaScreen';
import SessoesScreen from '../screens/SessoesScreen';
import SessaoDetalhesScreen from '../screens/SessaoDetalhesScreen';
import VotacoesScreen from '../screens/VotacoesScreen';
import VotacaoDetalhesScreen from '../screens/VotacaoDetalhesScreen';
import ProjetosScreen from '../screens/ProjetosScreen';
import ProjetoDetalhesScreen from '../screens/ProjetoDetalhesScreen';
import LeisScreen from '../screens/LeisScreen';
import LeiDetalhesScreen from '../screens/LeiDetalhesScreen';
import NoticiasScreen from '../screens/NoticiasScreen';
import NoticiaDetalhesScreen from '../screens/NoticiaDetalhesScreen';
import AvaliarScreen from '../screens/AvaliarScreen';
import TransmissaoScreen from '../screens/TransmissaoScreen';
import PesquisasScreen from '../screens/PesquisasScreen';
import VotarPesquisaScreen from '../screens/VotarPesquisaScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{ 
        headerStyle: { 
          backgroundColor: Colors.primary.red,
        }, 
        headerTintColor: Colors.text.white, 
        headerTitleStyle: { 
          fontWeight: 'bold', 
          fontSize: 18 
        }, 
        headerShadowVisible: false, 
        animation: 'slide_from_right',
        contentStyle: {
          paddingTop: Platform.OS === 'ios' ? 0 : 0,
        },
      }}
    >
      {/* Home */}
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      
      {/* Vereadores */}
      <Stack.Screen name="Vereadores" component={VereadoresScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VereadorDetalhes" component={VereadorDetalhesScreen} options={{ title: 'Vereador' }} />
      <Stack.Screen name="MesaDiretora" component={MesaDiretoraScreen} options={{ headerShown: false }} />
      
      {/* Agenda */}
      <Stack.Screen name="Agenda" component={AgendaScreen} options={{ headerShown: false }} />
      
      {/* Sessões e Votações */}
      <Stack.Screen name="Sessoes" component={SessoesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SessaoDetalhes" component={SessaoDetalhesScreen} options={{ title: 'Sessão Legislativa' }} />
      <Stack.Screen name="Votacoes" component={VotacoesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VotacaoDetalhes" component={VotacaoDetalhesScreen} options={{ title: 'Votação' }} />
      
      {/* Projetos e Leis */}
      <Stack.Screen name="Projetos" component={ProjetosScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProjetoDetalhes" component={ProjetoDetalhesScreen} options={{ title: 'Projeto de Lei' }} />
      <Stack.Screen name="Leis" component={LeisScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LeiDetalhes" component={LeiDetalhesScreen} options={{ title: 'Lei Municipal' }} />
      
      {/* Notícias */}
      <Stack.Screen name="Noticias" component={NoticiasScreen} options={{ headerShown: false }} />
      <Stack.Screen name="NoticiaDetalhes" component={NoticiaDetalhesScreen} options={{ title: 'Notícia' }} />
      
      {/* Pesquisas Públicas */}
      <Stack.Screen name="Pesquisas" component={PesquisasScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VotarPesquisa" component={VotarPesquisaScreen} options={{ headerShown: false }} />
      
      {/* Outros */}
      <Stack.Screen name="Avaliar" component={AvaliarScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Transmissao" component={TransmissaoScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

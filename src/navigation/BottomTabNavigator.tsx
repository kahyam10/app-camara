/**
 * BOTTOM TAB NAVIGATOR
 * Navegação por abas principais do aplicativo
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabParamList } from './types';
import { Colors } from '../constants/Colors';
import PesquisasScreen from '../screens/PesquisasScreen';

// Placeholder screens (serão substituídas na próxima etapa)
import { View, Text, StyleSheet } from 'react-native';

// Telas temporárias
const HomeScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>🏠 Tela Inicial</Text>
  </View>
);

const NoticiasScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>📰 Notícias</Text>
  </View>
);

const AgendaScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>📅 Agenda</Text>
  </View>
);

const VereadoresScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>👥 Vereadores</Text>
  </View>
);

const ContatoScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>📞 Contato</Text>
  </View>
);

const Tab = createBottomTabNavigator<BottomTabParamList>();

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary.red,
        tabBarInactiveTintColor: Colors.text.secondary,
        tabBarStyle: {
          backgroundColor: Colors.background.white,
          borderTopColor: Colors.border.light,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="NoticiasTab"
        component={NoticiasScreen}
        options={{
          title: 'Notícias',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="AgendaTab"
        component={AgendaScreen}
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="VereadoresTab"
        component={VereadoresScreen}
        options={{
          title: 'Vereadores',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="PesquisasTab"
        component={PesquisasScreen}
        options={{
          title: 'Pesquisas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="ContatoTab"
        component={ContatoScreen}
        options={{
          title: 'Contato',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mail" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.gray50,
  },
  text: {
    fontSize: 24,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Header, EmptyState } from '../components';
import { Colors } from '../constants/Colors';
import { mockData } from '../mocks/data';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Configurar calendário em português
LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

type Props = NativeStackScreenProps<RootStackParamList, 'Agenda'>;

export default function AgendaScreen({ navigation }: Props) {
  const [selectedDate, setSelectedDate] = useState('');

  const eventos = mockData.eventos || [];

  // Marcar datas com eventos no calendário
  const markedDates: any = {};
  eventos.forEach((evento) => {
    const dateKey = format(evento.data, 'yyyy-MM-dd');
    if (!markedDates[dateKey]) {
      markedDates[dateKey] = {
        marked: true,
        dots: [],
      };
    }
    const isSessao = evento.tipo.includes('Sessão');
    markedDates[dateKey].dots.push({
      color: isSessao ? Colors.primary.red : '#2563EB',
    });
  });

  // Se houver data selecionada, destacar
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: Colors.primary.red,
    };
  }

  // Filtrar eventos da data selecionada
  const eventosDoDia = selectedDate
    ? eventos.filter(
        (evento) => format(evento.data, 'yyyy-MM-dd') === selectedDate
      )
    : [];

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'sessao':
        return 'document-text';
      case 'reuniao':
        return 'people';
      case 'audiencia':
        return 'mic';
      default:
        return 'calendar';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'sessao':
        return Colors.primary.red;
      case 'reuniao':
        return '#2563EB';
      case 'audiencia':
        return '#059669';
      default:
        return Colors.text.secondary;
    }
  };

  const renderEvento = ({ item }: { item: typeof eventos[0] }) => (
    <TouchableOpacity
      style={styles.eventoCard}
      onPress={() => {
        if (item.tipo.includes('Sessão')) {
          // Navegar para detalhes da sessão
          navigation.navigate('Sessoes');
        }
      }}
      activeOpacity={0.7}
    >
      <View
        style={[styles.tipoIndicator, { backgroundColor: getTipoColor(item.tipo) }]}
      />
      <View style={styles.eventoContent}>
        <View style={styles.eventoHeader}>
          <Ionicons
            name={getTipoIcon(item.tipo)}
            size={20}
            color={getTipoColor(item.tipo)}
          />
          <Text style={styles.eventoTipo}>{item.tipo.toUpperCase()}</Text>
        </View>
        <Text style={styles.eventoTitulo}>{item.titulo}</Text>
        <Text style={styles.eventoHorario}>
          <Ionicons name="time-outline" size={14} color={Colors.text.secondary} />{' '}
          {item.horario}
        </Text>
        {item.local && (
          <Text style={styles.eventoLocal}>
            <Ionicons name="location-outline" size={14} color={Colors.text.secondary} />{' '}
            {item.local}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Agenda Legislativa" 
        showBackButton 
        onBackPress={() => navigation.goBack()} 
      />

      <View style={styles.content}>
        {/* Calendário */}
        <Calendar
          onDayPress={(day: any) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          markingType="multi-dot"
          theme={{
            backgroundColor: Colors.background.white,
            calendarBackground: Colors.background.white,
            selectedDayBackgroundColor: Colors.primary.red,
            selectedDayTextColor: Colors.text.white,
            todayTextColor: Colors.primary.red,
            dayTextColor: Colors.text.primary,
            textDisabledColor: Colors.text.secondary,
            dotColor: Colors.primary.red,
            selectedDotColor: Colors.text.white,
            arrowColor: Colors.primary.red,
            monthTextColor: Colors.text.primary,
            textDayFontWeight: '400',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
          }}
        />

        {/* Lista de Eventos */}
        <View style={styles.eventosContainer}>
          {selectedDate ? (
            <>
              <Text style={styles.sectionTitle}>
                Eventos do dia{' '}
                {format(new Date(selectedDate + 'T00:00:00'), "dd 'de' MMMM", {
                  locale: ptBR,
                })}
              </Text>
              {eventosDoDia.length > 0 ? (
                <FlatList
                  data={eventosDoDia}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderEvento}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <EmptyState
                  icon="calendar-outline"
                  title="Nenhum evento neste dia"
                  message="Selecione outra data no calendário"
                />
              )}
            </>
          ) : (
            <View style={styles.emptySelection}>
              <Ionicons name="hand-left-outline" size={48} color={Colors.text.secondary} />
              <Text style={styles.emptyText}>Selecione uma data no calendário</Text>
              <Text style={styles.emptySubtext}>
                Os dias marcados possuem eventos agendados
              </Text>
            </View>
          )}
        </View>
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
  },
  eventosContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  eventoCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipoIndicator: {
    width: 4,
  },
  eventoContent: {
    flex: 1,
    padding: 16,
  },
  eventoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  eventoTipo: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text.secondary,
    letterSpacing: 0.5,
  },
  eventoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  eventoHorario: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  eventoLocal: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  emptySelection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});

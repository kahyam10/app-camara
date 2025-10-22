import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/layout/Header';
import { Colors } from '../constants/Colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Avaliar'>;

export default function AvaliarScreen({ navigation }: Props) {
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleStarPress = (star: number) => {
    setRating(star);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Atenção', 'Por favor, selecione uma avaliação em estrelas.');
      return;
    }

    // Aqui seria enviado para API/AsyncStorage
    console.log('Avaliação enviada:', { rating, comentario });
    
    setSubmitted(true);
    
    // Reset após 3 segundos
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setComentario('');
    }, 3000);
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <Header title="Avaliar App" />
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={80} color={Colors.primary.red} />
          <Text style={styles.successTitle}>Obrigado!</Text>
          <Text style={styles.successMessage}>
            Sua avaliação foi enviada com sucesso.
          </Text>
          <Text style={styles.successSubMessage}>
            Seu feedback é muito importante para melhorarmos o aplicativo.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Avaliar App" 
        showBackButton 
        onBackPress={() => navigation.goBack()} 
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ícone do App */}
        <View style={styles.iconContainer}>
          <View style={styles.appIcon}>
            <Ionicons name="business" size={40} color="#FFF" />
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>Como você avalia o aplicativo?</Text>
        <Text style={styles.subtitle}>
          Sua opinião nos ajuda a melhorar continuamente
        </Text>

        {/* Rating com Estrelas */}
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => handleStarPress(star)}
              style={styles.starButton}
            >
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={50}
                color={star <= rating ? '#FFD700' : '#CCC'}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Label da Avaliação */}
        {rating > 0 && (
          <Text style={styles.ratingLabel}>{getRatingLabel(rating)}</Text>
        )}

        {/* Campo de Comentário */}
        <View style={styles.commentSection}>
          <Text style={styles.commentLabel}>
            Deixe seu comentário {rating > 0 && '(opcional)'}
          </Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Conte-nos mais sobre sua experiência..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={comentario}
            onChangeText={setComentario}
          />
          <Text style={styles.charCounter}>{comentario.length}/500</Text>
        </View>

        {/* Botão Enviar */}
        <TouchableOpacity
          style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={rating === 0}
        >
          <Ionicons name="send" size={20} color="#FFF" style={styles.submitIcon} />
          <Text style={styles.submitButtonText}>Enviar Avaliação</Text>
        </TouchableOpacity>

        {/* Informações Adicionais */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={Colors.primary.red} />
          <Text style={styles.infoText}>
            Suas avaliações são anônimas e nos ajudam a identificar melhorias
            necessárias no aplicativo.
          </Text>
        </View>

        {/* Outras Formas de Contato */}
        <View style={styles.otherOptionsSection}>
          <Text style={styles.otherOptionsTitle}>Outras formas de contato</Text>
          
          <TouchableOpacity style={styles.contactOption}>
            <View style={styles.contactOptionIcon}>
              <Ionicons name="mail" size={24} color={Colors.primary.red} />
            </View>
            <View style={styles.contactOptionContent}>
              <Text style={styles.contactOptionTitle}>E-mail</Text>
              <Text style={styles.contactOptionValue}>contato@camaraibirapitanga.ba.gov.br</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactOption}>
            <View style={styles.contactOptionIcon}>
              <Ionicons name="call" size={24} color={Colors.primary.red} />
            </View>
            <View style={styles.contactOptionContent}>
              <Text style={styles.contactOptionTitle}>Telefone</Text>
              <Text style={styles.contactOptionValue}>(73) 3548-2100</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactOption}>
            <View style={styles.contactOptionIcon}>
              <Ionicons name="location" size={24} color={Colors.primary.red} />
            </View>
            <View style={styles.contactOptionContent}>
              <Text style={styles.contactOptionTitle}>Endereço</Text>
              <Text style={styles.contactOptionValue}>
                Praça da Independência, Centro - Ibirapitanga/BA
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function getRatingLabel(rating: number): string {
  const labels: { [key: number]: string } = {
    1: '😞 Muito Insatisfeito',
    2: '😕 Insatisfeito',
    3: '😐 Regular',
    4: '😊 Satisfeito',
    5: '🤩 Muito Satisfeito',
  };
  return labels[rating] || '';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.primary.red,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  starButton: {
    padding: 5,
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 30,
  },
  commentSection: {
    marginBottom: 25,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  commentInput: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: '#1a1a1a',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  charCounter: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: Colors.primary.red,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.red,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1565C0',
    marginLeft: 10,
    lineHeight: 20,
  },
  otherOptionsSection: {
    marginBottom: 30,
  },
  otherOptionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  contactOption: {
    backgroundColor: '#FFF',
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
  contactOptionIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactOptionContent: {
    flex: 1,
  },
  contactOptionTitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  contactOptionValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

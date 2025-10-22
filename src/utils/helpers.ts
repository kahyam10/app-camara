// Funções utilitárias

import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Formata uma data para o formato brasileiro
 */
export const formatDate = (
  date: Date,
  pattern: string = "dd/MM/yyyy"
): string => {
  return format(date, pattern, { locale: ptBR });
};

/**
 * Formata uma data para exibição relativa (ex: "há 2 horas")
 */
export const formatRelativeDate = (date: Date): string => {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: ptBR,
  });
};

/**
 * Formata data e hora
 */
export const formatDateTime = (date: Date): string => {
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
};

/**
 * Formata hora
 */
export const formatTime = (date: Date): string => {
  return format(date, "HH:mm", { locale: ptBR });
};

/**
 * Trunca um texto para um número máximo de caracteres
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

/**
 * Capitaliza a primeira letra de cada palavra
 */
export const capitalizeWords = (text: string): string => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Remove acentos de uma string
 */
export const removeAccents = (text: string): string => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

/**
 * Valida email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida telefone brasileiro
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/;
  return phoneRegex.test(phone);
};

/**
 * Formata número de telefone
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
      7
    )}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
      6
    )}`;
  }

  return phone;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Gera cor baseada em status
 */
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    Aprovado: "#059669",
    Rejeitado: "#DC2626",
    "Em Tramitação": "#D97706",
    "Em Andamento": "#D97706",
    Vigente: "#059669",
    Revogada: "#DC2626",
    Agendada: "#2563EB",
    Concluída: "#059669",
    Cancelada: "#DC2626",
  };

  return statusColors[status] || "#6B7280";
};

/**
 * Compartilhar conteúdo (placeholder para implementação futura)
 */
export const shareContent = async (
  title: string,
  message: string,
  url?: string
) => {
  // TODO: Implementar com Expo Sharing
  console.log("Compartilhar:", { title, message, url });
};

/**
 * Abrir URL externa
 */
export const openURL = async (url: string) => {
  // TODO: Implementar com Expo Linking
  console.log("Abrir URL:", url);
};

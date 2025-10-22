// Constantes de layout e dimensões

import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export const Layout = {
  window: {
    width,
    height,
  },

  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 768,
  isLargeDevice: width >= 768,

  // Espaçamentos
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },

  // Tamanhos de ícones
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  },

  // Tamanhos de fonte
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Header heights
  headerHeight: Platform.OS === "ios" ? 44 : 56,
  tabBarHeight: 60,

  // Grid
  gridColumns: 3,
  gridGap: 16,
};

export default Layout;

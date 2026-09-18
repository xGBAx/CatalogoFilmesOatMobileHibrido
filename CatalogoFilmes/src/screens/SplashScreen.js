import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function SplashScreen({ navigation }) {
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, 
        duration: 1200, 
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1, 
        friction: 4, 
        useNativeDriver: true,
      })
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Main'); 
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <FontAwesome name="film" size={90} color={colors.primary} />
        <Text style={styles.title}>Cine<Text style={styles.titleAccent}>Prime</Text></Text>
        <Text style={styles.subtitle}>O seu catálogo de filmes</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
  },
  titleAccent: {
    color: colors.accent, 
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
  }
});
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { theme } from '../theme/theme';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      <View style={styles.brandContainer}>
        <Text style={styles.appName}>FotoOwl.ai</Text>
        <Text style={styles.tagline}>Your Infinite Image Gallery</Text>
      </View>
      <ActivityIndicator size="large" color="#FFFFFF" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F46E5', // Brand Indigo color
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: '#E0E7FF', // Light indigo text
    marginTop: theme.spacing.xs,
    fontWeight: '500',
  },
  spinner: {
    marginTop: theme.spacing.md,
  },
});

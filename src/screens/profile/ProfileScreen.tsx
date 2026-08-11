import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No user session found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={50} color="#FFFFFF" />
        </View>
        <Text style={styles.nameText}>{user.fullName}</Text>
        <Text style={styles.emailText}>{user.email}</Text>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Details</Text>

        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={20} color={theme.colors.light.textSecondary} style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Mobile Number</Text>
            <Text style={styles.infoValue}>{user.mobileNumber}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Ionicons name="male-female-outline" size={20} color={theme.colors.light.textSecondary} style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{user.gender}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color={theme.colors.light.textSecondary} style={styles.infoIcon} />
          <View style={styles.infoValueContainer}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue} numberOfLines={3}>
              {user.address}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={20} color={theme.colors.light.textSecondary} style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>City</Text>
            <Text style={styles.infoValue}>{user.city}</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={22} color="#FFFFFF" style={styles.logoutIcon} />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.light.background,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.light.error,
  },
  header: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.light.text,
  },
  emailText: {
    fontSize: 14,
    color: theme.colors.light.textSecondary,
    marginTop: theme.spacing.xs,
  },
  card: {
    backgroundColor: theme.colors.light.surface,
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.light.text,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  infoIcon: {
    marginRight: theme.spacing.md,
    width: 24,
  },
  infoValueContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.colors.light.textSecondary,
  },
  infoValue: {
    fontSize: 15,
    color: theme.colors.light.text,
    marginTop: 2,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.light.border,
    marginVertical: theme.spacing.xs,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.light.error,
    height: 50,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.light.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutIcon: {
    marginRight: theme.spacing.xs,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
});

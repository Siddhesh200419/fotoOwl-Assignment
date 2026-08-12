import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Switch,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { useTheme } from '../../hooks/useTheme';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { storage } from '../../services/storage';
import { useForm } from '../../hooks/useForm';
import { User } from '../../types';
import FormField from '../../components/FormField';
import RadioGroup from '../../components/RadioGroup';
import Dropdown from '../../components/Dropdown';
import ScreenContainer from '../../components/ScreenContainer';
import { hapticTap, hapticMedium, hapticSuccess, hapticSelection } from '../../services/haptics';

const { width } = Dimensions.get('window');
const AVATAR_SIZE = 90;

const INDIAN_CITIES = [
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Hyderabad',
  'Ahmedabad',
  'Chennai',
  'Kolkata',
  'Surat',
  'Pune',
  'Jaipur',
];

const PRESET_AVATARS: string[] = [
  'https://i.pravatar.cc/150?img=12',
  'https://i.pravatar.cc/150?img=32',
  'https://i.pravatar.cc/150?img=47',
  'https://i.pravatar.cc/150?img=58',
  'https://i.pravatar.cc/150?img=5',
  'https://i.pravatar.cc/150?img=26',
  'https://i.pravatar.cc/150?img=68',
  'https://i.pravatar.cc/150?img=15',
];

type EditFormValues = {
  fullName: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  mobileNumber: string;
  address: string;
  city: string;
  avatarUrl: string;
};

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuthStore();
  const { colors, isDark } = useTheme();
  const mode = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const [isEditing, setIsEditing] = useState(false);

  const initialEditValues: EditFormValues = {
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    gender: (user?.gender ?? '') as EditFormValues['gender'],
    mobileNumber: user?.mobileNumber ?? '',
    address: user?.address ?? '',
    city: user?.city ?? '',
    avatarUrl: user?.avatarUrl ?? '',
  };

  const validateForm = (values: EditFormValues) => {
    const errors: Partial<Record<keyof EditFormValues, string>> = {};

    if (!values.fullName.trim()) errors.fullName = 'Full Name is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(values.email)) {
      errors.email = 'Please enter a valid email address';
    } else if (values.email !== user?.email) {
      errors.email = 'Email cannot be changed';
    }

    if (!values.gender) errors.gender = 'Gender is required';

    const mobileRegex = /^\d{10}$/;
    if (!values.mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile number is required';
    } else if (!mobileRegex.test(values.mobileNumber)) {
      errors.mobileNumber = 'Mobile number must be exactly 10 digits';
    }

    if (!values.address.trim()) errors.address = 'Address is required';
    if (!values.city) errors.city = 'City selection is required';

    return errors;
  };

  const { values, errors, handleChange, handleSubmit, setValues } = useForm(
    initialEditValues,
    validateForm
  );

  const handleLogout = () => {
    hapticMedium();
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            hapticTap();
            logout();
          },
        },
      ]
    );
  };

  const handleEnterEdit = () => {
    hapticTap();
    setValues({
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      gender: user?.gender ?? '',
      mobileNumber: user?.mobileNumber ?? '',
      address: user?.address ?? '',
      city: user?.city ?? '',
      avatarUrl: user?.avatarUrl ?? '',
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    hapticTap();
    setIsEditing(false);
  };

  const onSave = async (formValues: EditFormValues) => {
    if (!user) return;

    try {
      const updatedUser: User = {
        ...user,
        fullName: formValues.fullName,
        email: formValues.email,
        gender: formValues.gender as 'Male' | 'Female' | 'Other',
        mobileNumber: formValues.mobileNumber,
        address: formValues.address,
        city: formValues.city,
        avatarUrl: formValues.avatarUrl || undefined,
      };

      await storage.saveUser({ ...updatedUser, password: user.password });
      updateUser(updatedUser);
      hapticSuccess();
      setIsEditing(false);
      Alert.alert('Profile Updated', 'Your changes have been saved successfully.');
    } catch (error) {
      hapticMedium();
      Alert.alert('Save Failed', 'Could not update profile. Please try again.');
    }
  };

  if (!user) {
    return (
      <ScreenContainer>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>No user session found.</Text>
        </View>
      </ScreenContainer>
    );
  }

  const avatarSource = isEditing ? values.avatarUrl : user.avatarUrl;

  const renderAvatar = (size = AVATAR_SIZE) => {
    if (avatarSource) {
      return (
        <Image
          source={{ uri: avatarSource }}
          style={[styles.avatarImage, {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: colors.primary,
            backgroundColor: colors.surfaceVariant,
          }]}
          contentFit="cover"
          transition={200}
        />
      );
    }
    return (
      <View
        style={[
          styles.avatarFallback,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.primary,
          },
        ]}
      >
        <Ionicons name="person" size={size * 0.55} color="#FFFFFF" />
      </View>
    );
  };

  return (
    <ScreenContainer>
      <View style={[styles.headerBar, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        {!isEditing ? (
          <TouchableOpacity
            onPress={handleEnterEdit}
            activeOpacity={0.7}
            style={styles.editBtn}
          >
            <Ionicons name="create-outline" size={18} color={colors.primary} />
            <Text style={[styles.editBtnText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleCancelEdit}
            activeOpacity={0.7}
            style={styles.editBtn}
          >
            <Ionicons name="close-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          {renderAvatar()}
          <Text style={[styles.nameText, { color: colors.text }]}>
            {isEditing ? values.fullName || user.fullName : user.fullName}
          </Text>
          <Text style={[styles.emailText, { color: colors.textSecondary }]}>{user.email}</Text>
        </View>

        {isEditing ? (
          <>
            <View style={[styles.card, {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Choose Avatar</Text>
              <View style={styles.avatarGrid}>
                <TouchableOpacity
                  style={styles.avatarOption}
                  onPress={() => {
                    hapticSelection();
                    handleChange('avatarUrl', '');
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.miniAvatar, styles.miniAvatarFallback, {
                    backgroundColor: colors.primary,
                    borderColor: !values.avatarUrl ? colors.primary : 'transparent',
                  }]}>
                    <Ionicons name="person" size={22} color="#FFFFFF" />
                  </View>
                  <Text style={[styles.avatarOptionLabel, { color: colors.textSecondary }]}>None</Text>
                </TouchableOpacity>
                {PRESET_AVATARS.map((url, idx) => {
                  const selected = values.avatarUrl === url;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={styles.avatarOption}
                      onPress={() => {
                        hapticSelection();
                        handleChange('avatarUrl', url);
                      }}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={{ uri: url }}
                        style={[styles.miniAvatar, { backgroundColor: colors.surfaceVariant, borderColor: selected ? colors.primary : 'transparent' }]}
                        contentFit="cover"
                      />
                      {selected && (
                        <View style={[styles.avatarCheckBadge, { backgroundColor: colors.success }]}>
                          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={[styles.card, {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Personal Details</Text>

              <FormField
                label="Full Name"
                placeholder="John Doe"
                value={values.fullName}
                onChangeText={(text) => handleChange('fullName', text)}
                error={errors.fullName}
              />

              <FormField
                label="Email (read-only)"
                placeholder="john.doe@example.com"
                keyboardType="email-address"
                value={values.email}
                onChangeText={(text) => handleChange('email', text)}
                error={errors.email}
                editable={false}
                style={styles.readOnlyField}
              />

              <RadioGroup
                label="Gender"
                options={['Male', 'Female', 'Other']}
                selectedValue={values.gender}
                onValueChange={(val) => handleChange('gender', val)}
                error={errors.gender}
              />

              <FormField
                label="Mobile Number"
                placeholder="9876543210"
                keyboardType="phone-pad"
                maxLength={10}
                value={values.mobileNumber}
                onChangeText={(text) => handleChange('mobileNumber', text)}
                error={errors.mobileNumber}
              />

              <FormField
                label="Address"
                placeholder="123 Street Name"
                multiline
                numberOfLines={2}
                value={values.address}
                onChangeText={(text) => handleChange('address', text)}
                error={errors.address}
                style={styles.addressInput}
              />

              <Dropdown
                label="City"
                options={INDIAN_CITIES}
                selectedValue={values.city}
                onValueChange={(val) => handleChange('city', val)}
                error={errors.city}
              />

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSubmit(onSave)}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={[styles.card, {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Personal Details</Text>

              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color={colors.textSecondary} style={styles.infoIcon} />
                <View>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Mobile Number</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{user.mobileNumber}</Text>
                </View>
              </View>

              <View style={[styles.separator, { backgroundColor: colors.border }]} />

              <View style={styles.infoRow}>
                <Ionicons name="male-female-outline" size={20} color={colors.textSecondary} style={styles.infoIcon} />
                <View>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Gender</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{user.gender}</Text>
                </View>
              </View>

              <View style={[styles.separator, { backgroundColor: colors.border }]} />

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color={colors.textSecondary} style={styles.infoIcon} />
                <View style={styles.infoValueContainer}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Address</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={3}>
                    {user.address}
                  </Text>
                </View>
              </View>

              <View style={[styles.separator, { backgroundColor: colors.border }]} />

              <View style={styles.infoRow}>
                <Ionicons name="business-outline" size={20} color={colors.textSecondary} style={styles.infoIcon} />
                <View>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>City</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{user.city}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.card, {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Preferences</Text>
              <View style={styles.settingRow}>
                <View style={styles.settingIconWrap}>
                  <Ionicons
                    name={isDark ? 'moon' : 'sunny'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </View>
                <View style={styles.settingLabels}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                    Switches between light & dark themes
                  </Text>
                </View>
                <Switch
                  value={mode === 'dark'}
                  onValueChange={() => {
                    hapticMedium();
                    toggleTheme();
                  }}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={mode === 'dark' ? colors.primary : '#FFFFFF'}
                  ios_backgroundColor={colors.surfaceVariant}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: colors.error }]}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={22} color="#FFFFFF" style={styles.logoutIcon} />
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: theme.typography.titleMedium.fontSize,
    fontWeight: theme.typography.titleMedium.fontWeight,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  avatarImage: {
    marginBottom: theme.spacing.md,
    borderWidth: 3,
  },
  avatarFallback: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
  },
  emailText: {
    fontSize: 14,
    marginTop: theme.spacing.xs,
  },
  card: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
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
  },
  infoValue: {
    fontSize: 15,
    marginTop: 2,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    marginVertical: theme.spacing.xs,
  },
  readOnlyField: {
    opacity: 0.6,
  },
  addressInput: {
    height: 70,
    textAlignVertical: 'top',
    paddingVertical: theme.spacing.sm,
  },
  saveButton: {
    flexDirection: 'row',
    height: 50,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    gap: theme.spacing.xs,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
  logoutButton: {
    flexDirection: 'row',
    height: 50,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  settingIconWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabels: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  settingSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    justifyContent: 'flex-start',
  },
  avatarOption: {
    position: 'relative',
    alignItems: 'center',
    gap: theme.spacing.xs,
    width: (width - theme.spacing.lg * 2 - theme.spacing.md * 3) / 4,
  },
  miniAvatar: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.md * 3) / 4,
    height: (width - theme.spacing.lg * 2 - theme.spacing.md * 3) / 4,
    borderRadius: ((width - theme.spacing.lg * 2 - theme.spacing.md * 3) / 4) / 2,
    borderWidth: 2,
  },
  miniAvatarFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarOptionLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  avatarCheckBadge: {
    position: 'absolute',
    top: 0,
    right: ((width - theme.spacing.lg * 2 - theme.spacing.md * 3) / 4) * 0.05,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

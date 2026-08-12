import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { theme } from '../../theme/theme';
import { useTheme } from '../../hooks/useTheme';
import { useForm } from '../../hooks/useForm';
import { storage } from '../../services/storage';
import FormField from '../../components/FormField';
import RadioGroup from '../../components/RadioGroup';
import Dropdown from '../../components/Dropdown';
import { hapticMedium, hapticSuccess } from '../../services/haptics';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

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

const initialValues = {
  fullName: '',
  email: '',
  gender: '' as 'Male' | 'Female' | 'Other' | '',
  mobileNumber: '',
  address: '',
  city: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterScreen({ navigation }: Props) {
  const { colors, isDark } = useTheme();

  const validateForm = (values: typeof initialValues) => {
    const errors: Partial<Record<keyof typeof initialValues, string>> = {};

    if (!values.fullName.trim()) errors.fullName = 'Full Name is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(values.email)) {
      errors.email = 'Please enter a valid email address';
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

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const { values, errors, handleChange, handleSubmit } = useForm(
    initialValues,
    validateForm
  );

  const onSubmit = async (formValues: typeof initialValues) => {
    try {
      const existingUser = await storage.getUserByEmail(formValues.email);
      if (existingUser) {
        Alert.alert('Registration Failed', 'A user with this email already exists.');
        return;
      }

      const { confirmPassword, ...userData } = formValues;
      await storage.saveUser({
        ...userData,
        gender: userData.gender as 'Male' | 'Female' | 'Other',
      });

      hapticSuccess();
      Alert.alert(
        'Success',
        'Account registered successfully! Please log in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Error', 'An error occurred during registration. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.keyboardContainer, { backgroundColor: colors.background }]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign up to access your infinite gallery
            </Text>
          </View>

          <View style={styles.form}>
            <FormField
              label="Full Name"
              placeholder="John Doe"
              value={values.fullName}
              onChangeText={(text) => handleChange('fullName', text)}
              error={errors.fullName}
            />

            <FormField
              label="Email"
              placeholder="john.doe@example.com"
              keyboardType="email-address"
              value={values.email}
              onChangeText={(text) => handleChange('email', text)}
              error={errors.email}
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

            <FormField
              label="Password"
              placeholder="••••••"
              secureTextEntry
              value={values.password}
              onChangeText={(text) => handleChange('password', text)}
              error={errors.password}
            />

            <FormField
              label="Confirm Password"
              placeholder="••••••"
              secureTextEntry
              value={values.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
              error={errors.confirmPassword}
            />

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit(onSubmit)}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>Register</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  hapticMedium();
                  navigation.navigate('Login');
                }}
              >
                <Text style={[styles.loginLink, { color: colors.primary }]}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.titleLarge.fontSize,
    fontWeight: theme.typography.titleLarge.fontWeight,
  },
  subtitle: {
    fontSize: 15,
    marginTop: theme.spacing.xs,
  },
  form: {
    width: '100%',
  },
  addressInput: {
    height: 70,
    textAlignVertical: 'top',
    paddingVertical: theme.spacing.sm,
  },
  submitButton: {
    height: 50,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  footerText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { theme } from '../../theme/theme';
import { useTheme } from '../../hooks/useTheme';
import { useForm } from '../../hooks/useForm';
import { storage } from '../../services/storage';
import { useAuthStore } from '../../store/authStore';
import FormField from '../../components/FormField';
import { hapticMedium, hapticSuccess } from '../../services/haptics';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const initialValues = {
  email: '',
  password: '',
};

export default function LoginScreen({ navigation }: Props) {
  const login = useAuthStore((state) => state.login);
  const { colors, isDark } = useTheme();

  const validateForm = (values: typeof initialValues) => {
    const errors: Partial<Record<keyof typeof initialValues, string>> = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(values.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

  const { values, errors, handleChange, handleSubmit, setErrors } = useForm(
    initialValues,
    validateForm
  );

  const onSubmit = async (formValues: typeof initialValues) => {
    try {
      const user = await storage.getUserByEmail(formValues.email);

      if (!user) {
        setErrors({ email: 'No account found with this email' });
        return;
      }

      if (user.password !== formValues.password) {
        setErrors({ password: 'Incorrect password' });
        return;
      }

      hapticSuccess();
      const { password, ...safeUser } = user;
      login(safeUser);
    } catch (error) {
      Alert.alert('Error', 'An error occurred during log in. Please try again.');
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
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Log in to access your dashboard
            </Text>
          </View>

          <View style={styles.form}>
            <FormField
              label="Email"
              placeholder="john.doe@example.com"
              keyboardType="email-address"
              value={values.email}
              onChangeText={(text) => handleChange('email', text)}
              error={errors.email}
            />

            <FormField
              label="Password"
              placeholder="••••••"
              secureTextEntry
              value={values.password}
              onChangeText={(text) => handleChange('password', text)}
              error={errors.password}
            />

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit(onSubmit)}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>Log In</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  hapticMedium();
                  navigation.navigate('Register');
                }}
              >
                <Text style={[styles.registerLink, { color: colors.primary }]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: theme.spacing.xl,
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
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

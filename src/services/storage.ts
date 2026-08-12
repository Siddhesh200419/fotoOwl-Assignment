import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

export const storage = {
  async saveUser(user: User) {
    const key = `users:${user.email.toLowerCase()}`;
    await AsyncStorage.setItem(key, JSON.stringify(user));
  },

  async getUserByEmail(email: string) {
    const data = await AsyncStorage.getItem(`users:${email.toLowerCase()}`);
    return data ? (JSON.parse(data) as User) : null;
  },
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const USER_KEY_PREFIX = 'users:';

export const storage = {
  /**
   * Save a user record, keyed by email
   */
  async saveUser(user: User): Promise<void> {
    try {
      const key = `${USER_KEY_PREFIX}${user.email.toLowerCase()}`;
      await AsyncStorage.setItem(key, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to storage:', error);
      throw new Error('Failed to save user data.');
    }
  },

  /**
   * Fetch a single user record by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const key = `${USER_KEY_PREFIX}${email.toLowerCase()}`;
      const data = await AsyncStorage.getItem(key);
      if (data) {
        return JSON.parse(data) as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user by email from storage:', error);
      throw new Error('Failed to fetch user data.');
    }
  },

  /**
   * Retrieve all registered users
   */
  async getUsers(): Promise<User[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const userKeys = allKeys.filter(key => key.startsWith(USER_KEY_PREFIX));
      if (userKeys.length === 0) return [];
      
      const pairs = await AsyncStorage.multiGet(userKeys);
      const users: User[] = [];
      for (const [, val] of pairs) {
        if (val) {
          users.push(JSON.parse(val) as User);
        }
      }
      return users;
    } catch (error) {
      console.error('Error listing all users from storage:', error);
      throw new Error('Failed to fetch users list.');
    }
  }
};

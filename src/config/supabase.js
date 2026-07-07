import { createClient } from '@supabase/supabase-js';

// Safe AsyncStorage loading with in-memory fallback
let storage;
try {
  // Use require to allow catching native module loading errors
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  if (!AsyncStorage) {
    throw new Error('AsyncStorage is undefined');
  }
  storage = AsyncStorage;
} catch (error) {
  console.warn('AsyncStorage is not available. Using in-memory fallback storage.');
  const memoryStorage = {};
  storage = {
    getItem: async (key) => {
      return memoryStorage[key] || null;
    },
    setItem: async (key, value) => {
      memoryStorage[key] = value;
      return Promise.resolve();
    },
    removeItem: async (key) => {
      delete memoryStorage[key];
      return Promise.resolve();
    }
  };
}

// Use Expo's public environment variables or fallback values.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder-project-id.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Supabase URL or Anon Key is missing. Fallback dummy values are being used for previewing.');
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

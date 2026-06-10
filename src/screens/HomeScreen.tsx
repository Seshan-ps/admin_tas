import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Button } from '../components/Button';

export const HomeScreen: React.FC = () => {
  const handlePress = () => {
    console.log('Button pressed!');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <View className="flex-1 items-center justify-center p-6 space-y-4">
        <Text className="text-3xl font-extrabold text-slate-900 dark:text-white text-center">
          Welcome to Your App
        </Text>
        <Text className="text-base text-slate-600 dark:text-slate-300 text-center max-w-xs mb-6">
          Tailwind CSS (NativeWind) and Supabase are configured and ready.
        </Text>
        <Button title="Get Started" onPress={handlePress} />
      </View>
    </SafeAreaView>
  );
};

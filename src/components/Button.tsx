import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
}

export const Button: React.FC<ButtonProps> = ({ onPress, title }) => {
  return (
    <TouchableOpacity
      className="bg-blue-600 active:bg-blue-700 px-6 py-3 rounded-lg shadow-md items-center justify-center"
      onPress={onPress}
    >
      <Text className="text-white font-semibold text-base">{title}</Text>
    </TouchableOpacity>
  );
};

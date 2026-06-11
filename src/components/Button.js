import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
export const Button = ({
  onPress,
  title
}) => {
  return <TouchableOpacity className="bg-blue-600 active:bg-blue-700 px-6 py-3 rounded-lg shadow-md items-center justify-center" onPress={onPress}>
      <Text className="text-white font-semibold text-base">{title}</Text>
    </TouchableOpacity>;
};

import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export const SplashScreen: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  useEffect(() => {
    if (onFinish) {
      const timer = setTimeout(() => {
        onFinish();
      }, 3000); // 3 seconds delay before transitioning
      return () => clearTimeout(timer);
    }
  }, [onFinish]);

  return (
    <View className="flex-1 bg-white justify-center items-center relative">
      <Image
        source={require('../../assets/background.png')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      {/* Center Content */}
      <View className="items-center justify-center px-8 z-10">
        {/* Logo Image */}
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: 260, height: 110 }}
          resizeMode="contain"
        />

        {/* Tagline */}
        <Text className="text-[17px] font-medium text-slate-500/90 text-center tracking-wide leading-relaxed max-w-[280px] mt-1">
          Connecting Professionals, Empowering Businesses.
        </Text>
      </View>
    </View>
  );
};

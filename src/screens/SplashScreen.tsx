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
    <View className="flex-1 bg-white relative">
      <Image
        source={require('../../assets/background.png')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View 
        style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}
        className="py-16 px-8"
      >
        {/* Top Spacer to balance layout */}
        <View style={{ height: 40 }} />

        {/* Center Content */}
        <View className="items-center justify-center z-10">
          {/* Logo Image */}
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 260, height: 110 }}
            resizeMode="contain"
          />

          {/* Tagline */}
          <Text className="text-[17px] font-medium text-slate-500/90 text-center tracking-wide leading-relaxed max-w-[280px] mt-8">
            Connecting Professionals, Empowering Businesses.
          </Text>
        </View>

        {/* Bottom Spacer to match Welcome Screen loader size for alignment */}
        <View className="w-full max-w-[270px] mt-12 mb-4">
          <View className="h-[5px] w-full bg-transparent" />
        </View>
      </View>
    </View>
  );
};

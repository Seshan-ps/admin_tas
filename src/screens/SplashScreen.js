import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SplashScreen = ({
  onFinish
}) => {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android'
    ? (insets.top === 0 ? 24 : insets.top)
    : insets.top;
  const bottomPadding = Platform.OS === 'android'
    ? (insets.bottom === 0 ? 24 : insets.bottom)
    : insets.bottom;

  useEffect(() => {
    if (onFinish) {
      const timer = setTimeout(() => {
        onFinish();
      }, 3000); // 3 seconds delay before transitioning
      return () => clearTimeout(timer);
    }
  }, [onFinish]);

  return <View className="flex-1 bg-white relative">
      <Image source={require('../../assets/background.png')} style={StyleSheet.absoluteFill} resizeMode="cover" />

      <View style={{
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: topPadding + 16,
      paddingBottom: bottomPadding + 16
    }} className="px-8">
        {/* Top Spacer to balance layout */}
        <View style={{
        height: 20
      }} />

        {/* Center Content */}
        <View className="items-center justify-center z-10">
          {/* Logo Image */}
          <Image source={require('../../assets/logo.png')} style={{
          width: 260,
          height: 110
        }} resizeMode="contain" />

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
    </View>;
};


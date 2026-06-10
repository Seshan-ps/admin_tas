import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, Animated, ScrollView } from 'react-native';

interface WelcomeScreenProps {
  onTransitionComplete: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onTransitionComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 2500; // 2.5 seconds

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);

      setProgress(progressPercent);

      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        // Short delay to let the user see 100% complete
        setTimeout(() => {
          onTransitionComplete();
        }, 150);
      }
    };

    const animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [onTransitionComplete]);

  // Generate dot grid (5x5) for the background corners
  const renderDotGrid = () => {
    return (
      <View className="flex-col space-y-1.5 opacity-30">
        {[...Array(5)].map((_, rowIndex) => (
          <View key={rowIndex} className="flex-row space-x-1.5">
            {[...Array(5)].map((_, colIndex) => (
              <View key={colIndex} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
        showsVerticalScrollIndicator={true}
        className="relative"
      >
        {/* Decorative Top-Left Circle Arch */}
        <View 
          style={styles.topLeftArchOuter} 
          className="absolute -top-[120px] -left-[120px] rounded-full border border-blue-200/40 bg-blue-100/10"
        />
        <View 
          style={styles.topLeftArchInner} 
          className="absolute -top-[160px] -left-[160px] rounded-full border border-blue-100/30"
        />

        {/* Decorative Top-Right Dot Grid */}
        <View className="absolute top-12 right-6">
          {renderDotGrid()}
        </View>

        {/* Center Content */}
        <View className="items-center justify-center px-8 z-10 py-12">
          {/* Logo Image */}
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 250, height: 100 }}
            resizeMode="contain"
          />

          {/* Welcome Text */}
          <Text className="text-3xl font-bold text-[#134074] text-center mt-6 tracking-wide leading-tight max-w-[280px]">
            Welcome to the{'\n'}Admin Portal
          </Text>
        </View>

        {/* Animated Progress Bar */}
        <View className="w-[80%] max-w-[300px] mt-6 mb-12">
          {/* Progress Bar Track */}
          <View className="h-1.5 w-full bg-blue-100/70 rounded-full overflow-hidden">
            {/* Progress Bar Fill */}
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${progress}%` }
              ]} 
              className="h-full bg-[#70B62C] rounded-full"
            />
          </View>
        </View>

        {/* Decorative Bottom-Left Dot Grid */}
        <View className="absolute bottom-12 left-6">
          {renderDotGrid()}
        </View>

        {/* Decorative Bottom-Right Circle Arch */}
        <View 
          style={styles.bottomRightArchOuter} 
          className="absolute -bottom-[120px] -right-[120px] rounded-full border border-blue-200/40 bg-blue-100/10"
        />
        <View 
          style={styles.bottomRightArchInner} 
          className="absolute -bottom-[160px] -right-[160px] rounded-full border border-blue-100/30"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topLeftArchOuter: {
    width: 280,
    height: 280,
  },
  topLeftArchInner: {
    width: 280,
    height: 280,
  },
  bottomRightArchOuter: {
    width: 280,
    height: 280,
  },
  bottomRightArchInner: {
    width: 280,
    height: 280,
  },
  progressBarFill: {
    shadowColor: '#70B62C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
});

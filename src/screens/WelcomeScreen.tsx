import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';

interface WelcomeScreenProps {
  onTransitionComplete: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onTransitionComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 2500; // 2.5 seconds loading duration

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);

      setProgress(progressPercent);

      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        // Delay slightly before transitioning
        setTimeout(() => {
          onTransitionComplete();
        }, 200);
      }
    };

    const animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [onTransitionComplete]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Image */}
      <Image
        source={require('../../assets/background.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <View style={styles.layoutWrapper}>
        {/* Top spacer to balance vertical layout */}
        <View style={{ height: 50 }} />

        {/* Center Content: Logo and Title */}
        <View style={styles.centerContent}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>
            Welcome to the{"\n"}Admin Portal
          </Text>
        </View>

        {/* Bottom Loading Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  layoutWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logo: {
    width: 260,
    height: 110,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0D3866',
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 40,
    letterSpacing: 0.5,
  },
  progressBarContainer: {
    width: '100%',
    maxWidth: 270,
    marginBottom: 16,
  },
  progressBarTrack: {
    height: 5,
    width: '100%',
    backgroundColor: 'rgba(210, 228, 249, 0.6)', // light blue background
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#467A18', // deep green loading fill
  },
});

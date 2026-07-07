import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home as HomeIcon, BarChart3, Users as UsersIcon, Newspaper, Calendar as CalendarIcon } from 'lucide-react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

// Custom premium Directory Icon (Book with lens)
const DirectoryBookIcon = ({ color }) => (
  <View style={{ width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="2" width="16" height="20" rx="3" fill="none" stroke={color} strokeWidth="2.5" />
      <Path d="M8 2v20" stroke={color} strokeWidth="1.5" />
      <Circle cx="14" cy="10" r="3" stroke={color} strokeWidth="2" fill="white" />
      <Path d="M16.5 12.5l2.5 2.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  </View>
);

// Custom Connection Icon (Connection symbol: overlapping nodes with linking line)
const ConnectionIcon = ({ color }) => (
  <View style={{ width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="6" cy="6" r="2.5" stroke={color} strokeWidth="2" />
      <Circle cx="18" cy="6" r="2.5" stroke={color} strokeWidth="2" />
      <Circle cx="12" cy="17" r="2.5" stroke={color} strokeWidth="2" />
      <Path d="M7.5 7.5l3 7M16.5 7.5l-3 7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  </View>
);

export function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  // Standard Android 3-button navigation height is 48. We place the floating bar slightly above it.
  const bottomOffset = Platform.OS === 'android' 
    ? (insets.bottom === 0 ? 48 + 12 : insets.bottom + 12) 
    : (insets.bottom > 0 ? insets.bottom + 4 : 12);

  return (
    <View style={[navStyles.tabContainer, { bottom: bottomOffset }]}>
      <View style={navStyles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined 
            ? options.tabBarLabel 
            : (options.title !== undefined ? options.title : route.name);
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const activeColor = '#70B62C'; // Green active state
          const inactiveColor = '#134074'; // Dark blue inactive state
          const color = isFocused ? activeColor : inactiveColor;

          const renderIcon = () => {
            switch (route.name) {
              case 'Home':
                return <HomeIcon size={22} color={color} />;
              case 'Analytics':
                return <BarChart3 size={22} color={color} />;
              case 'Post':
                return <Newspaper size={22} color={color} />;
              case 'Connection':
                return <ConnectionIcon color={color} />;
              case 'Community':
                return <UsersIcon size={22} color={color} />;
              case 'Directory':
                return <DirectoryBookIcon color={color} />;
              case 'Events':
                return <CalendarIcon size={22} color={color} />;
              default:
                return <HomeIcon size={22} color={color} />;
            }
          };

          return (
            <TouchableOpacity 
              key={route.key} 
              accessibilityRole="button" 
              accessibilityState={isFocused ? { selected: true } : {}} 
              onPress={onPress} 
              style={[navStyles.tabItem, isFocused ? navStyles.tabItemActive : null]}
            >
              {renderIcon()}
              {isFocused && (
                <Text style={navStyles.tabLabel}>
                  {label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const navStyles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF', // Solid white background
    borderRadius: 24, // Curved rectangle style (all corners rounded)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0', // Solid border
    overflow: 'hidden'
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'transparent', // Transparent inner view
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20
  },
  tabItemActive: {
    backgroundColor: '#f0fdf4' // Soft green background tint for active
  },
  tabLabel: {
    color: '#70B62C',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6
  }
});

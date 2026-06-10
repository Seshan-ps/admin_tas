import './global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home as HomeIcon, BarChart3, Users as UsersIcon, FileText } from 'lucide-react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

// Import Screens
import { SplashScreen } from './src/screens/SplashScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { DirectoryScreen } from './src/screens/DirectoryScreen';
import { PostManagementScreen } from './src/screens/PostManagementScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { MessagesScreen } from './src/screens/MessagesScreen';
import { ConnectionsScreen } from './src/screens/ConnectionsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Custom premium Directory Icon (Book with lens)
const DirectoryBookIcon = ({ color }: { color: string }) => (
  <View style={{ width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="2" width="16" height="20" rx="3" fill="none" stroke={color} strokeWidth="2.5" />
      <Path d="M8 2v20" stroke={color} strokeWidth="1.5" />
      <Circle cx="14" cy="10" r="3" stroke={color} strokeWidth="2" fill="white" />
      <Path d="M16.5 12.5l2.5 2.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  </View>
);

// Custom Bottom Tab Bar component
function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={navStyles.tabContainer}>
      <View style={navStyles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
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
              case 'Posts':
                return <FileText size={22} color={color} />;
              case 'Messages':
                return <UsersIcon size={22} color={color} />;
              case 'Directory':
                return <DirectoryBookIcon color={color} />;
              default:
                return <HomeIcon size={22} color={color} />;
            }
          };

          const displayLabel = route.name === 'Messages' ? 'Connect' : (route.name === 'Posts' ? 'Post' : label);

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={[
                navStyles.tabItem,
                isFocused ? navStyles.tabItemActive : null
              ]}
            >
              {renderIcon()}
              {isFocused && (
                <Text style={navStyles.tabLabel}>
                  {displayLabel}
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
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 35,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tabItemActive: {
    backgroundColor: '#f0fdf4', // Soft green background tint for active
  },
  tabLabel: {
    color: '#70B62C',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
});

// Bottom Tab Navigator for Post-Login Screens
function MainTabNavigator({ navigation }: any) {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home">
        {({ navigation }: any) => (
          <HomeScreen 
            navigation={navigation}
            onSignOut={() => navigation.replace('Login')} 
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Analytics">
        {({ navigation }: any) => (
          <AnalyticsScreen
            navigation={navigation}
            onBack={() => navigation.navigate('Home')}
            onTabPress={(tab) => navigation.navigate(tab)}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Posts">
        {({ navigation }: any) => (
          <PostManagementScreen
            navigation={navigation}
            onBack={() => navigation.navigate('Home')}
            onTabPress={(tab) => navigation.navigate(tab)}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Messages">
        {({ navigation }: any) => (
          <MessagesScreen
            navigation={navigation}
            onBack={() => navigation.navigate('Home')}
            onTabPress={(tab) => navigation.navigate(tab)}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Directory">
        {({ navigation }: any) => (
          <DirectoryScreen
            navigation={navigation}
            onBack={() => navigation.navigate('Home')}
            initialSubTab="members"
            onTabPress={(tab) => navigation.navigate(tab)}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash">
        {({ navigation }) => (
          <SplashScreen onFinish={() => navigation.replace('Login')} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Login">
        {({ navigation }) => (
          <LoginScreen onLoginSuccess={() => navigation.replace('Welcome')} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Welcome">
        {({ navigation }) => (
          <WelcomeScreen onTransitionComplete={() => navigation.replace('MainTabs')} />
        )}
      </Stack.Screen>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Profile">
        {({ navigation }) => (
          <ProfileScreen
            onBack={() => navigation.goBack()}
            onSignOut={() => navigation.replace('Login')}
            onTabPress={(tab) => navigation.navigate('MainTabs', { screen: tab })}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Connections">
        {({ navigation }) => (
          <ConnectionsScreen onBack={() => navigation.goBack()} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const container = (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );

  // Wrap in a phone frame on Web for visual fidelity
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <View style={styles.webFrame}>
          <View style={{ flex: 1, overflow: 'hidden' }}>
            {container}
          </View>
          <StatusBar style="auto" />
        </View>
      </View>
    );
  }

  return (
    <>
      {container}
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    width: '100vw' as any,
    height: '100vh' as any,
    backgroundColor: '#f1f5f9', // Slate background for web
    justifyContent: 'center',
    alignItems: 'center',
  },
  webFrame: {
    height: '95%',
    maxHeight: 844,
    aspectRatio: 390 / 844,
    backgroundColor: '#fff',
    borderRadius: 44, // iPhone-like rounded corners
    overflow: 'hidden',
    borderWidth: 10,
    borderColor: '#1e293b', // Sleek device bezel color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
    display: 'flex',
    flexDirection: 'column',
  },
});

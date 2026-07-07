import './global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View, StyleSheet, Text, TouchableOpacity, Modal, Alert } from 'react-native';

// Intercept and customize global React Native Alert.alert to render round corner modals
let alertTrigger = null;
const originalAlert = Alert.alert;
Alert.alert = (title, message, buttons, options) => {
  if (alertTrigger) {
    alertTrigger(title, message, buttons, options);
  } else {
    originalAlert(title, message, buttons, options);
  }
};
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home as HomeIcon, BarChart3, Users as UsersIcon, Newspaper, Calendar as CalendarIcon } from 'lucide-react-native';
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
import { MemberProfileScreen } from './src/screens/MemberProfileScreen';
import { CreateEventScreen } from './src/screens/CreateEventScreen';
import { EditDetailsScreen } from './src/screens/EditDetailsScreen';
import { EventsScreen } from './src/screens/EventsScreen';
import { NotificationScreen } from './src/screens/NotificationScreen';
import { CommunityScreen } from './src/screens/CommunityScreen';
import { CustomTabBar } from './src/components/CustomTabBar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for Post-Login Screens
function MainTabNavigator({
  navigation
}) {
  const mapTab = (tab) => {
    const mapping = {
      feed: 'Home',
      analytics: 'Analytics',
      posts_all: 'Post',
      Connect: 'Connection',
      community: 'Community',
      directory: 'Directory',
      events: 'Events'
    };
    return mapping[tab] || tab;
  };

  return <Tab.Navigator tabBar={props => <CustomTabBar {...props} />} screenOptions={{
    headerShown: false
  }}>
      <Tab.Screen name="Home">
        {({
        navigation
      }) => <HomeScreen navigation={navigation} onSignOut={() => navigation.replace('Login')} />}
      </Tab.Screen>

      <Tab.Screen name="Analytics">
        {({
        navigation
      }) => <AnalyticsScreen navigation={navigation} onBack={() => navigation.navigate('Home')} onTabPress={tab => navigation.navigate(mapTab(tab))} />}
      </Tab.Screen>

      <Tab.Screen name="Post">
        {({
        navigation,
        route
      }) => <PostManagementScreen navigation={navigation} route={route} onBack={() => navigation.navigate('Home')} onTabPress={tab => navigation.navigate(mapTab(tab))} />}
      </Tab.Screen>

      <Tab.Screen name="Connection">
        {({
        navigation
      }) => <ConnectionsScreen navigation={navigation} onBack={() => navigation.navigate('Home')} onTabPress={tab => navigation.navigate(mapTab(tab))} />}
      </Tab.Screen>
      <Tab.Screen name="Community">
        {({
        navigation
      }) => <CommunityScreen navigation={navigation} onBack={() => navigation.navigate('Home')} onTabPress={tab => navigation.navigate(mapTab(tab))} />}
      </Tab.Screen>

      <Tab.Screen name="Events">
        {({
        navigation
      }) => <EventsScreen navigation={navigation} onBack={() => navigation.navigate('Home')} onTabPress={tab => navigation.navigate(mapTab(tab))} />}
      </Tab.Screen>
    </Tab.Navigator>;
}

function RootNavigator() {
  return <Stack.Navigator screenOptions={{
    headerShown: false
  }} initialRouteName="Splash">
      <Stack.Screen name="Splash">
        {({
        navigation
      }) => <SplashScreen onFinish={() => navigation.replace('Login')} />}
      </Stack.Screen>
      <Stack.Screen name="Login">
        {({
        navigation
      }) => <LoginScreen onLoginSuccess={() => navigation.replace('Welcome')} />}
      </Stack.Screen>
      <Stack.Screen name="Welcome">
        {({
        navigation
      }) => <WelcomeScreen onTransitionComplete={() => navigation.replace('MainTabs')} />}
      </Stack.Screen>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Profile">
        {({
        navigation
      }) => <ProfileScreen onBack={() => navigation.goBack()} onSignOut={() => navigation.replace('Login')} />}
      </Stack.Screen>
      <Stack.Screen name="Connections">
        {({
        navigation
      }) => <ConnectionsScreen onBack={() => navigation.goBack()} />}
      </Stack.Screen>
      <Stack.Screen name="Directory">
        {({
        navigation
      }) => <DirectoryScreen navigation={navigation} onBack={() => navigation.goBack()} initialSubTab="members" />}
      </Stack.Screen>
      <Stack.Screen name="Messages">
        {({
        navigation,
        route
      }) => <MessagesScreen onBack={() => navigation.goBack()} navigation={navigation} route={route} />}
      </Stack.Screen>
      <Stack.Screen name="MemberProfile" component={MemberProfileScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
      <Stack.Screen name="EditDetails" component={EditDetailsScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>;
}
function CustomAlertModal({ config, onClose }) {
  if (!config) return null;

  const { title, message, buttons } = config;
  const alertButtons = buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={config !== null}
      onRequestClose={onClose}
    >
      <View style={appModalStyles.modalOverlay}>
        <View style={appModalStyles.confirmModalContent}>
          {title ? <Text style={appModalStyles.confirmModalTitle}>{title}</Text> : null}
          {message ? <Text style={appModalStyles.confirmModalBody}>{message}</Text> : null}
          <View style={appModalStyles.confirmModalButtons}>
            {alertButtons.map((btn, idx) => {
              const isDestructive = btn.style === 'destructive';
              const isCancel = btn.style === 'cancel';
              
              let textColor = '#0D3866'; // Default primary blue
              if (isDestructive) textColor = '#EF4444'; // Red
              else if (isCancel) textColor = '#64748B'; // Slate grey

              return (
                <TouchableOpacity
                  key={idx}
                  style={appModalStyles.confirmModalBtn}
                  onPress={() => {
                    onClose();
                    if (btn.onPress) {
                      btn.onPress();
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[appModalStyles.btnText, { color: textColor }]}>
                    {btn.text.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const appModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  confirmModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // Round corner box!
    padding: 24,
    width: '85%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8
  },
  confirmModalBody: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 24
  },
  confirmModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  confirmModalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 12
  },
  btnText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5
  }
});

export default function App() {
  const [alertConfig, setAlertConfig] = React.useState(null);

  React.useEffect(() => {
    alertTrigger = (title, message, buttons, options) => {
      setAlertConfig({ title, message, buttons, options });
    };
    return () => {
      alertTrigger = null;
    };
  }, []);

  const container = <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>;

  // Wrap in a phone frame on Web for visual fidelity
  if (Platform.OS === 'web') {
    return <View style={styles.webContainer}>
        <View style={styles.webFrame}>
          <View style={{
          flex: 1,
          overflow: 'hidden'
        }}>
            {container}
          </View>
          <StatusBar style="dark" />
          <CustomAlertModal config={alertConfig} onClose={() => setAlertConfig(null)} />
        </View>
      </View>;
  }
  return <>
      {container}
      <StatusBar style="dark" />
      <CustomAlertModal config={alertConfig} onClose={() => setAlertConfig(null)} />
    </>;
}
const styles = StyleSheet.create({
  webContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f1f5f9',
    // Slate background for web
    justifyContent: 'center',
    alignItems: 'center'
  },
  webFrame: {
    height: '95%',
    maxHeight: 844,
    aspectRatio: 390 / 844,
    backgroundColor: '#fff',
    borderRadius: 44,
    // iPhone-like rounded corners
    overflow: 'hidden',
    borderWidth: 10,
    borderColor: '#1e293b',
    // Sleek device bezel color
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12
    },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
    display: 'flex',
    flexDirection: 'column'
  }
});

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {
  User,
  MessageSquare,
  ChevronRight,
  Users,
  BarChart3,
  Calendar,
  FileText,
  ArrowUp,
  Send,
  ShieldCheck,
  MoreHorizontal,
  Video,
  MapPin,
  TrendingUp,
} from 'lucide-react-native';
import { ProfileScreen } from './ProfileScreen';
import { AnalyticsScreen } from './AnalyticsScreen';
import { PostManagementScreen } from './PostManagementScreen';
import { DirectoryScreen } from './DirectoryScreen';

const { width } = Dimensions.get('window');

type ActiveTab = 'feed' | 'analytics' | 'directory' | 'chat' | 'posts_all' | 'profile';
type DirectorySubTab = 'users' | 'events';
type ProfileUser = 'admin' | 'elena';

interface HomeScreenProps {
  onSignOut: () => void;
  navigation?: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSignOut, navigation }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [directorySubTab, setDirectorySubTab] = useState<DirectorySubTab>('users');
  const [profileUser, setProfileUser] = useState<ProfileUser>('elena');
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Broadcast states
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Scroll ref
  const scrollViewRef = useRef<ScrollView>(null);

  // Monitor scroll height to show/hide the back to top button
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 300);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleSendBroadcast = () => {
    if (!broadcastSubject || !broadcastMessage) {
      Alert.alert('Incomplete Broadcast', 'Please fill in both the subject and message fields.');
      return;
    }
    Alert.alert(
      'Secure Broadcast Sent',
      `Your notification has been encrypted and broadcasted successfully.\n\nSubject: ${broadcastSubject}`
    );
    setBroadcastSubject('');
    setBroadcastMessage('');
  };

  const viewUserProfile = (user: ProfileUser) => {
    if (navigation && user === 'admin') {
      navigation.navigate('Profile');
    } else {
      setProfileUser(user);
      setActiveTab('profile');
    }
  };

  // HEADER BAR
  const renderHeader = () => {
    return (
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-100 z-20">
        {/* Profile left */}
        <TouchableOpacity onPress={() => viewUserProfile('admin')}>
          <Image
            source={require('../../assets/admin_profile.png')}
            className="w-10 h-10 rounded-full border border-blue-100"
          />
        </TouchableOpacity>

        {/* Logo center */}
        <Image
          source={require('../../assets/logo.png')}
          className="w-28 h-8"
          resizeMode="contain"
        />

        {/* Message right */}
        <TouchableOpacity onPress={() => navigation ? navigation.navigate('Messages') : setActiveTab('chat')}>
          <MessageSquare size={24} color="#134074" />
        </TouchableOpacity>
      </View>
    );
  };

  // FOOTER NAVIGATION BAR
  const renderFooterNav = () => {
    return (
      <View className="flex-row justify-around items-center bg-white border-t border-slate-200 py-2.5 z-20">
        {/* Home */}
        <TouchableOpacity 
          className="items-center" 
          onPress={() => { setActiveTab('feed'); scrollToTop(); }}
        >
          <HomeIcon active={activeTab === 'feed'} />
          <Text className={`text-[10px] mt-0.5 font-medium ${activeTab === 'feed' ? 'text-[#70B62C]' : 'text-slate-400'}`}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Analytics (Financials) */}
        <TouchableOpacity 
          className="items-center" 
          onPress={() => setActiveTab('analytics')}
        >
          <BarChart3 
            size={24} 
            color={activeTab === 'analytics' ? '#134074' : '#94a3b8'} 
          />
          <Text className={`text-[10px] mt-0.5 font-medium ${activeTab === 'analytics' ? 'text-[#134074]' : 'text-slate-400'}`}>
            Analytics
          </Text>
        </TouchableOpacity>

        {/* Directory (Events) */}
        <TouchableOpacity 
          className="items-center" 
          onPress={() => {
            setActiveTab('directory');
            setDirectorySubTab('events');
          }}
        >
          <Calendar 
            size={24} 
            color={activeTab === 'directory' && directorySubTab === 'events' ? '#134074' : '#94a3b8'} 
          />
          <Text className={`text-[10px] mt-0.5 font-medium ${activeTab === 'directory' && directorySubTab === 'events' ? 'text-[#134074]' : 'text-slate-400'}`}>
            Events
          </Text>
        </TouchableOpacity>

        {/* Directory (Users) */}
        <TouchableOpacity 
          className="items-center" 
          onPress={() => {
            setActiveTab('directory');
            setDirectorySubTab('users');
          }}
        >
          <Users 
            size={24} 
            color={activeTab === 'directory' && directorySubTab === 'users' ? '#134074' : '#94a3b8'} 
          />
          <Text className={`text-[10px] mt-0.5 font-medium ${activeTab === 'directory' && directorySubTab === 'users' ? 'text-[#134074]' : 'text-slate-400'}`}>
            Directory
          </Text>
        </TouchableOpacity>

        {/* Post Management */}
        <TouchableOpacity 
          className="items-center" 
          onPress={() => setActiveTab('posts_all')}
        >
          <FileText 
            size={24} 
            color={activeTab === 'posts_all' ? '#134074' : '#94a3b8'} 
          />
          <Text className={`text-[10px] mt-0.5 font-medium ${activeTab === 'posts_all' ? 'text-[#134074]' : 'text-slate-400'}`}>
            Posts
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Helper custom Home icon styling
  const HomeIcon = ({ active }: { active: boolean }) => {
    return (
      <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
        <View 
          style={{
            width: 20,
            height: 18,
            borderWidth: 2,
            borderColor: active ? '#70B62C' : '#94a3b8',
            borderRadius: 2,
            position: 'relative'
          }}
        >
          <View 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 5,
              width: 6,
              height: 8,
              backgroundColor: active ? '#70B62C' : '#94a3b8'
            }}
          />
        </View>
      </View>
    );
  };

  // VIEW 1: HOME FEED VIEW
  const renderFeedView = () => {
    return (
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
        className="flex-1 bg-[#F8FAFC]"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* QUICK ACTIONS CARD */}
        <View className="bg-white m-3 p-4 rounded-2xl border border-slate-100 shadow-sm">
          <Text className="text-base font-bold text-[#134074] mb-3">Quick Actions</Text>
          <View className="space-y-2.5">
            {/* User Management */}
            <TouchableOpacity 
              onPress={() => {
                if (navigation) {
                  navigation.navigate('Directory');
                } else {
                  setActiveTab('directory');
                  setDirectorySubTab('users');
                }
              }}
              className="flex-row items-center border border-slate-200/80 rounded-xl p-3 bg-[#FCFDFE] active:bg-blue-50/20"
            >
              <View className="bg-[#134074] p-2 rounded-lg mr-3">
                <Users size={18} color="white" />
              </View>
              <Text className="text-slate-800 font-semibold text-[15px]">User Management</Text>
              <ChevronRight size={16} color="#64748b" className="ml-auto" />
            </TouchableOpacity>

            {/* Financial Reports */}
            <TouchableOpacity 
              onPress={() => {
                if (navigation) {
                  navigation.navigate('Analytics');
                } else {
                  setActiveTab('analytics');
                }
              }}
              className="flex-row items-center border border-slate-200/80 rounded-xl p-3 bg-[#FCFDFE] active:bg-blue-50/20"
            >
              <View className="bg-[#134074] p-2 rounded-lg mr-3">
                <BarChart3 size={18} color="white" />
              </View>
              <Text className="text-slate-800 font-semibold text-[15px]">Financial Reports</Text>
              <ChevronRight size={16} color="#64748b" className="ml-auto" />
            </TouchableOpacity>

            {/* Event Management */}
            <TouchableOpacity 
              onPress={() => {
                if (navigation) {
                  navigation.navigate('Events');
                } else {
                  setActiveTab('directory');
                  setDirectorySubTab('events');
                }
              }}
              className="flex-row items-center border border-slate-200/80 rounded-xl p-3 bg-[#FCFDFE] active:bg-blue-50/20"
            >
              <View className="bg-[#134074] p-2 rounded-lg mr-3">
                <Calendar size={18} color="white" />
              </View>
              <Text className="text-slate-800 font-semibold text-[15px]">Event Management</Text>
              <ChevronRight size={16} color="#64748b" className="ml-auto" />
            </TouchableOpacity>

            {/* Post Management */}
            <TouchableOpacity 
              onPress={() => {
                if (navigation) {
                  navigation.navigate('Posts');
                } else {
                  setActiveTab('posts_all');
                }
              }}
              className="flex-row items-center border border-slate-200/80 rounded-xl p-3 bg-[#FCFDFE] active:bg-blue-50/20"
            >
              <View className="bg-[#134074] p-2 rounded-lg mr-3">
                <FileText size={18} color="white" />
              </View>
              <Text className="text-slate-800 font-semibold text-[15px]">Post Management</Text>
              <ChevronRight size={16} color="#64748b" className="ml-auto" />
            </TouchableOpacity>
          </View>
        </View>

        {/* FEED ITEM 1 (PROMOTED Rollout Post) */}
        <View className="bg-white mb-3 border-y border-slate-100 p-4">
          {/* Header */}
          <View className="flex-row items-center mb-3">
            <Image
              source={require('../../assets/logo.png')}
              className="w-10 h-10 rounded-full border border-blue-50 bg-[#F0F7FF]"
              resizeMode="contain"
            />
            <View className="ml-2.5">
              <Text className="text-[15px] font-bold text-[#134074]">Texcity Accountants Society</Text>
              <Text className="text-[11px] text-slate-400">Promoted • 10,240 members</Text>
            </View>
          </View>

          {/* Text */}
          <Text className="text-slate-700 text-[14px] leading-relaxed mb-3">
            We are pleased to announce the successful rollout of the <Text className="font-bold text-[#134074]">Q3 Security Patch</Text> for the national administration portal. All member accounts now benefit from enhanced biometric authentication layers. Ensure your regional office has updated their node.
          </Text>

          {/* Server Room Graphic */}
          <View className="relative rounded-xl overflow-hidden mb-3 border border-slate-100">
            <Image
              source={require('../../assets/server_room_update.png')}
              className="w-full h-48"
              resizeMode="cover"
            />
            <View className="absolute bottom-2 left-2 bg-[#134074]/80 px-2 py-1 rounded">
              <Text className="text-white text-[10px] font-bold">System Update 4.2.0</Text>
            </View>
          </View>

          {/* Actions Bar */}
          <View className="flex-row items-center justify-between border-t border-slate-50 pt-2.5 mt-1">
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity className="flex-row items-center space-x-1">
                <Text className="text-slate-400">👍</Text>
                <Text className="text-[12px] text-slate-500 font-medium">42</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center space-x-1">
                <MessageSquare size={16} color="#64748b" />
                <Text className="text-[12px] text-slate-500 font-medium">12</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity>
              <Text className="text-slate-400 text-base">🔗</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FEED ITEM 2 (Elena Rodriguez post) */}
        <View className="bg-white mb-3 border-y border-slate-100 p-4">
          {/* Header */}
          <View className="flex-row items-center mb-3">
            <TouchableOpacity onPress={() => viewUserProfile('elena')}>
              <Image
                source={require('../../assets/elena_profile.png')}
                className="w-10 h-10 rounded-full border border-blue-50"
              />
            </TouchableOpacity>
            <View className="ml-2.5">
              <TouchableOpacity onPress={() => viewUserProfile('elena')}>
                <Text className="text-[15px] font-bold text-slate-800">Elena Rodriguez, CPA</Text>
              </TouchableOpacity>
              <Text className="text-[11px] text-slate-500">Regional Director at TAS South</Text>
            </View>
            <Text className="text-[11px] text-slate-400 ml-auto">2h ago</Text>
          </View>

          {/* Text */}
          <Text className="text-slate-700 text-[14px] leading-relaxed mb-3">
            Is anyone else observing a significant increase in automated reconciliation errors following the latest API update? We've had to revert to manual validation for three major enterprise audits this morning.
          </Text>

          {/* Quote Block */}
          <View className="bg-emerald-50/40 border-l-4 border-emerald-500 p-3 rounded-r-xl mb-3">
            <Text className="text-emerald-700 italic text-[13px] leading-relaxed font-medium">
              "Maintaining fiscal integrity requires human oversight, especially during transition phases."
            </Text>
          </View>

          {/* Actions Bar */}
          <View className="flex-row items-center justify-between border-t border-slate-50 pt-2.5 mt-1">
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity className="flex-row items-center space-x-1">
                <Text className="text-slate-400">👍</Text>
                <Text className="text-[12px] text-slate-500 font-medium">8</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center space-x-1">
                <MessageSquare size={16} color="#64748b" />
                <Text className="text-[12px] text-slate-500 font-medium">24</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity>
              <Text className="text-slate-400">🔖</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FEED ITEM 3: UPCOMING SOCIETY EVENTS */}
        <View className="bg-white mb-3 border-y border-slate-100 p-4">
          <Text className="text-base font-bold text-[#134074] mb-3">Upcoming Society Events</Text>
          <View className="space-y-4">
            {/* Event 1 */}
            <View className="flex-row">
              <View className="items-center justify-center bg-blue-50 rounded-lg p-2.5 w-16 h-16 border border-blue-100">
                <Text className="text-[10px] uppercase font-bold text-[#134074] tracking-wider">Oct</Text>
                <Text className="text-xl font-extrabold text-[#134074]">14</Text>
              </View>
              <View className="ml-3 justify-center flex-1">
                <Text className="text-[15px] font-bold text-slate-800">Tax Ethics Round-Table</Text>
                <Text className="text-[12px] text-slate-500 mt-0.5">Virtual • 148 Administrators Attending</Text>
              </View>
            </View>

            {/* Event 2 */}
            <View className="flex-row">
              <View className="items-center justify-center bg-emerald-50 rounded-lg p-2.5 w-16 h-16 border border-emerald-100">
                <Text className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Oct</Text>
                <Text className="text-xl font-extrabold text-emerald-700">22</Text>
              </View>
              <View className="ml-3 justify-center flex-1">
                <Text className="text-[15px] font-bold text-slate-800">Annual Society Gala</Text>
                <Text className="text-[12px] text-slate-500 mt-0.5">Grand Ballroom, City Center</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            onPress={() => {
              setActiveTab('directory');
              setDirectorySubTab('events');
            }}
            className="mt-4 pt-3 border-t border-slate-100 items-center justify-center"
          >
            <Text className="text-sm font-bold text-[#134074]">View All Events</Text>
          </TouchableOpacity>
        </View>

        {/* FEED ITEM 4: QUICK BROADCAST CARD */}
        <View className="bg-[#134074] m-3 p-5 rounded-2xl shadow-md">
          <Text className="text-lg font-bold text-white mb-1">Quick Broadcast</Text>
          <Text className="text-[13px] text-blue-100/80 mb-4">
            Send an instant secure push notification to all active administrative members.
          </Text>

          <TextInput
            placeholder="Subject..."
            placeholderTextColor="#94a3b8"
            value={broadcastSubject}
            onChangeText={setBroadcastSubject}
            className="bg-white/10 text-white rounded-lg px-3 py-2 text-[14px] mb-3 border border-white/10"
          />

          <TextInput
            placeholder="Your message here..."
            placeholderTextColor="#94a3b8"
            value={broadcastMessage}
            onChangeText={setBroadcastMessage}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="bg-white/10 text-white rounded-lg px-3 py-2 text-[14px] h-20 mb-4 border border-white/10"
          />

          <TouchableOpacity
            onPress={handleSendBroadcast}
            className="bg-white rounded-lg py-2.5 flex-row justify-center items-center space-x-2 active:bg-blue-50"
          >
            <Send size={16} color="#134074" />
            <Text className="text-[#134074] font-bold text-sm">Send Notification</Text>
          </TouchableOpacity>
        </View>

        {/* SCROLL EXTENSION: EXTRA MOCK FEEDS */}
        <View className="bg-white mb-3 border-y border-slate-100 p-4">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
              <Text className="text-blue-700 font-bold text-base">FS</Text>
            </View>
            <View className="ml-2.5">
              <Text className="text-[15px] font-bold text-slate-800">Financial Standards Board</Text>
              <Text className="text-[11px] text-slate-500">Official Updates Group</Text>
            </View>
            <Text className="text-[11px] text-slate-400 ml-auto">1d ago</Text>
          </View>
          <Text className="text-slate-700 text-[14px] leading-relaxed">
            The new 2026 Audit regulations draft has been uploaded to the regional resources folder. Please review the updated rules on cross-border tax disclosures.
          </Text>
          <View className="flex-row items-center justify-between border-t border-slate-50 pt-2.5 mt-3">
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity className="flex-row items-center space-x-1">
                <Text className="text-slate-400">👍</Text>
                <Text className="text-[12px] text-slate-500 font-medium">18</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  // VIEW 2: FINANCIAL REPORTS (ANALYTICS)
  const renderAnalyticsView = () => {
    return (
      <ScrollView className="flex-1 bg-[#F8FAFC] p-4" showsVerticalScrollIndicator={true}>
        <Text className="text-2xl font-bold text-[#134074] mb-1">Financial Reports</Text>
        <Text className="text-[13px] text-slate-500 mb-5">Analytics &gt; General Reports Overview</Text>

        {/* Financial Highlights */}
        <View className="bg-[#D2E4F9] rounded-2xl p-5 mb-4 border border-blue-100">
          <Text className="text-[#134074] font-bold text-base mb-3">Total Q2 Operating Capital</Text>
          <Text className="text-3xl font-extrabold text-[#134074]">$1,284,500.00</Text>
          <View className="flex-row items-center mt-2.5 space-x-1.5">
            <TrendingUp size={16} color="#3F7E1F" />
            <Text className="text-[#3F7E1F] text-[13px] font-bold">+12.4% vs last quarter</Text>
          </View>
        </View>

        {/* Analytical Cards */}
        <View className="flex-row space-x-4 mb-4">
          <View className="flex-1 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <Text className="text-slate-500 text-[12px] font-semibold">Active Memberships</Text>
            <Text className="text-2xl font-bold text-slate-800 mt-1">10,240</Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <Text className="text-slate-500 text-[12px] font-semibold">Processed Audits</Text>
            <Text className="text-2xl font-bold text-slate-800 mt-1">452</Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  // VIEW 3: DIRECTORY (USERS & EVENTS TABBED VIEW)
  const renderDirectoryView = () => {
    return (
      <View className="flex-1 bg-[#F8FAFC]">
        {/* Sub-navigation bar */}
        <View className="flex-row bg-white border-b border-slate-150">
          <TouchableOpacity
            onPress={() => setDirectorySubTab('users')}
            className={`flex-1 items-center py-3 border-b-2 ${directorySubTab === 'users' ? 'border-[#134074]' : 'border-transparent'}`}
          >
            <Text className={`font-semibold text-sm ${directorySubTab === 'users' ? 'text-[#134074]' : 'text-slate-400'}`}>
              Member Directory
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDirectorySubTab('events')}
            className={`flex-1 items-center py-3 border-b-2 ${directorySubTab === 'events' ? 'border-[#134074]' : 'border-transparent'}`}
          >
            <Text className={`font-semibold text-sm ${directorySubTab === 'events' ? 'text-[#134074]' : 'text-slate-400'}`}>
              Event Directory
            </Text>
          </TouchableOpacity>
        </View>

        {directorySubTab === 'users' ? (
          <ScrollView className="flex-1 p-3" showsVerticalScrollIndicator={true}>
            {/* Elena Rodriguez */}
            <TouchableOpacity 
              onPress={() => viewUserProfile('elena')}
              className="bg-white flex-row items-center p-3.5 rounded-xl border border-slate-100 mb-2.5 shadow-sm active:bg-slate-50"
            >
              <Image
                source={require('../../assets/elena_profile.png')}
                className="w-12 h-12 rounded-full border border-slate-100"
              />
              <View className="ml-3.5 flex-1">
                <Text className="font-bold text-slate-800 text-[15px]">Elena Rodriguez, CPA</Text>
                <Text className="text-[12px] text-[#134074] font-medium mt-0.5">Regional Director, TAS South</Text>
                <Text className="text-[11px] text-slate-400 mt-0.5">Dallas, TX • Active</Text>
              </View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>

            {/* Admin User */}
            <TouchableOpacity 
              onPress={() => viewUserProfile('admin')}
              className="bg-white flex-row items-center p-3.5 rounded-xl border border-slate-100 mb-2.5 shadow-sm active:bg-slate-50"
            >
              <Image
                source={require('../../assets/admin_profile.png')}
                className="w-12 h-12 rounded-full border border-slate-100"
              />
              <View className="ml-3.5 flex-1">
                <Text className="font-bold text-slate-800 text-[15px]">Alexander Davis</Text>
                <Text className="text-[12px] text-[#134074] font-medium mt-0.5">National System Administrator</Text>
                <Text className="text-[11px] text-slate-400 mt-0.5">HQ Houston • Active</Text>
              </View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <ScrollView className="flex-1 p-3" showsVerticalScrollIndicator={true}>
            {/* Event Cards */}
            <View className="bg-white p-4 rounded-xl border border-slate-100 mb-3 shadow-sm">
              <View className="flex-row justify-between items-start mb-2">
                <View className="bg-blue-50 px-2.5 py-1 rounded">
                  <Text className="text-xs font-bold text-[#134074]">OCT 14, 2026</Text>
                </View>
                <Text className="text-xs text-slate-400 font-semibold">148 Attending</Text>
              </View>
              <Text className="font-bold text-slate-800 text-[16px]">Tax Ethics Round-Table</Text>
              <Text className="text-[13px] text-slate-500 mt-1 leading-relaxed">
                A structured discussion regarding the draft regulations on digital bookkeeping and remote audit guidelines.
              </Text>
              <View className="flex-row items-center mt-3 pt-2.5 border-t border-slate-50">
                <Video size={14} color="#64748b" />
                <Text className="text-[12px] text-slate-500 ml-1.5">Virtual Meeting Link Available</Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    );
  };

  // VIEW 4: CHAT / MESSAGES SCREEN
  const renderChatView = () => {
    return (
      <View className="flex-1 bg-[#F8FAFC]">
        <View className="px-4 py-3 bg-white border-b border-slate-100">
          <Text className="text-lg font-bold text-[#134074]">Secured Chats</Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={true}>
          {/* Chat 1 */}
          <TouchableOpacity className="flex-row items-center p-4 bg-white border-b border-slate-50 active:bg-slate-50">
            <Image
              source={require('../../assets/elena_profile.png')}
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-3.5 flex-1">
              <View className="flex-row justify-between">
                <Text className="font-bold text-slate-800 text-[15px]">Elena Rodriguez, CPA</Text>
                <Text className="text-[11px] text-slate-400">10:45 AM</Text>
              </View>
              <Text className="text-[13px] text-slate-500 mt-1 font-semibold text-[#134074]" numberOfLines={1}>
                Let's verify the audit findings before submitting the final Q2 files...
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  // VIEW 5: POSTS ALL / POST MANAGEMENT SCREEN
  const renderPostsAllView = () => {
    return (
      <View className="flex-1 bg-[#F8FAFC]">
        <View className="px-4 py-3 bg-white border-b border-slate-100 flex-row justify-between items-center">
          <Text className="text-lg font-bold text-[#134074]">Post Management</Text>
        </View>

        <ScrollView className="flex-1 p-3" showsVerticalScrollIndicator={true}>
          {/* Post item */}
          <View className="bg-white p-4 rounded-xl border border-slate-100 mb-3 shadow-sm">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xs font-bold text-slate-400">PUBLISHED • 2 hours ago</Text>
              <TouchableOpacity><MoreHorizontal size={16} color="#64748b" /></TouchableOpacity>
            </View>
            <Text className="font-bold text-slate-800 text-[15px] mb-1">Reconciliation Error API Report</Text>
            <Text className="text-[13px] text-slate-500 leading-relaxed mb-3">
              Is anyone else observing a significant increase in automated reconciliation errors following the latest API update...
            </Text>
            <View className="flex-row items-center space-x-4 pt-2.5 border-t border-slate-50">
              <Text className="text-xs text-slate-400 font-semibold">8 Likes</Text>
              <Text className="text-xs text-slate-400 font-semibold">24 Comments</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  // VIEW 6: DETAILED PROFILE VIEW
  const renderProfileView = () => {
    const isElena = profileUser === 'elena';

    return (
      <ScrollView className="flex-1 bg-[#F8FAFC]" showsVerticalScrollIndicator={true}>
        {/* Banner */}
        <View className="h-32 bg-[#D2E4F9] w-full" />
        
        {/* User Details */}
        <View className="px-4 -mt-14 items-center">
          <Image
            source={isElena ? require('../../assets/elena_profile.png') : require('../../assets/admin_profile.png')}
            className="w-28 h-28 rounded-full border-4 border-white shadow-md"
          />
          <Text className="text-2xl font-bold text-slate-800 mt-3">
            {isElena ? 'Elena Rodriguez, CPA' : 'Alexander Davis'}
          </Text>
          <Text className="text-sm font-semibold text-[#134074] mt-1">
            {isElena ? 'Regional Director at TAS South' : 'National System Administrator'}
          </Text>
          <Text className="text-xs text-slate-400 mt-1">
            {isElena ? 'Dallas, Texas Office' : 'HQ Houston Operations'}
          </Text>

          {/* Bio info */}
          <View className="w-full bg-white border border-slate-100 rounded-xl p-4 mt-4 shadow-sm">
            <Text className="text-sm font-bold text-[#134074] mb-2">About</Text>
            <Text className="text-[13px] text-slate-600 leading-relaxed">
              {isElena 
                ? 'Senior certified accountant managing audits and fiscal integrations for regional societies. Specializes in computerized systems control, forensic audits, and corporate ledger management.'
                : 'Systems manager overseeing server integrity, user permission keys, encryption standards, and secure push notifications across the Texas Society network portal.'}
            </Text>
          </View>

          {/* Actions */}
          <View className="w-full flex-row space-x-3.5 my-5">
            <TouchableOpacity 
              onPress={() => setActiveTab('chat')}
              className="flex-1 bg-[#134074] rounded-lg py-2.5 items-center justify-center shadow-sm"
            >
              <Text className="text-white font-bold text-sm">Send Message</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setActiveTab('feed')}
              className="flex-1 bg-slate-100 border border-slate-200 rounded-lg py-2.5 items-center justify-center"
            >
              <Text className="text-slate-700 font-bold text-sm">Back to Feed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'feed':
        return renderFeedView();
      case 'analytics':
        return (
          <AnalyticsScreen
            onBack={() => {
              setActiveTab('feed');
            }}
            onTabPress={(tab) => setActiveTab(tab as ActiveTab)}
          />
        );
      case 'directory':
        return (
          <DirectoryScreen
            onBack={() => {
              setActiveTab('feed');
            }}
            onTabPress={(tab) => setActiveTab(tab as ActiveTab)}
            initialSubTab={directorySubTab === 'events' ? 'events' : 'members'}
          />
        );
      case 'chat':
        return renderChatView();
      case 'posts_all':
        return (
          <PostManagementScreen
            onBack={() => {
              setActiveTab('feed');
            }}
            onTabPress={(tab) => setActiveTab(tab as ActiveTab)}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            onBack={() => {
              setActiveTab('feed');
            }}
            onSignOut={onSignOut}
            onTabPress={(tab) => setActiveTab(tab as ActiveTab)}
          />
        );
      default:
        return renderFeedView();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top Header */}
      {renderHeader()}

      {/* Screen Body */}
      {renderActiveView()}

      {/* Back to Top Floating Button */}
      {activeTab === 'feed' && showScrollTop && (
        <TouchableOpacity
          onPress={scrollToTop}
          activeOpacity={0.85}
          style={styles.scrollTopButton}
          className="bg-[#134074] rounded-full justify-center items-center shadow-lg"
        >
          <ArrowUp size={20} color="white" />
        </TouchableOpacity>
      )}

      {/* Bottom Navigation */}
      {!navigation && renderFooterNav()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollTopButton: {
    position: 'absolute',
    bottom: 75,
    right: 20,
    width: 44,
    height: 44,
    zIndex: 99,
  },
});

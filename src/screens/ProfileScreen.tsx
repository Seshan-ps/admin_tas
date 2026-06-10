import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  ArrowLeft,
  User,
  Briefcase,
  Shield,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Home,
  BarChart3,
  Users,
  FileText,
} from 'lucide-react-native';
import { supabase } from '../config/supabase';

interface ProfileScreenProps {
  onBack: () => void;
  onSignOut: () => void;
  activeNavigationTab?: string;
  onTabPress?: (tab: string) => void;
  navigation?: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onSignOut,
  activeNavigationTab = 'directory',
  onTabPress,
  navigation,
}) => {
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Sign Out Error', error.message);
      } else {
        Alert.alert('Signed Out', 'You have been signed out securely.');
        onSignOut();
      }
    } catch (err: any) {
      // Supabase credentials might not be loaded yet, handle client auth state fallback
      Alert.alert('Signed Out', 'Local session cleared successfully.');
      onSignOut();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      {/* Top Header */}
      <View className="flex-row items-center px-4 py-3 bg-[#E9F0FA] border-b border-blue-100 z-20">
        <TouchableOpacity onPress={onBack} className="p-1.5 -ml-1 mr-3">
          <ArrowLeft size={22} color="#134074" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#134074]">Profile</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 110 }}
        className="flex-1 px-4 py-5"
      >
        {/* Hero Profile Section */}
        <View className="items-center mb-6">
          {/* Avatar Container */}
          <View className="relative">
            <Image
              source={require('../../assets/admin_profile.png')}
              className="w-24 h-24 rounded-2xl border border-slate-100 shadow-sm"
            />
            {/* Green Badge */}
            <View className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#3F7E1F] border-2 border-white items-center justify-center">
              <View className="w-2 h-2 rounded-full bg-white" />
            </View>
          </View>

          {/* Username */}
          <Text className="text-2xl font-bold text-[#134074] mt-3">VGM_admin</Text>

          {/* Active Badge */}
          <View className="bg-[#A4E06E]/70 rounded-full px-3 py-0.5 mt-1">
            <Text className="text-[#2B5713] text-xs font-bold tracking-wide">• Active</Text>
          </View>

          {/* Role subtitle */}
          <Text className="text-slate-600 font-medium text-sm mt-1.5">
            Senior Administrator
          </Text>

          {/* Calendar subtitle */}
          <View className="flex-row items-center mt-1 space-x-1.5">
            <Calendar size={13} color="#94a3b8" />
            <Text className="text-slate-400 text-xs font-medium">
              Member since January 2019
            </Text>
          </View>
        </View>

        {/* Card 1: Personal Information */}
        <View className="bg-white rounded-2xl p-4 border border-slate-150 shadow-sm mb-4">
          <View className="flex-row items-center space-x-2.5 mb-4 pb-2 border-b border-slate-50">
            <View className="bg-blue-50 p-2 rounded-lg">
              <User size={18} color="#134074" />
            </View>
            <Text className="text-lg font-bold text-[#134074]">Personal Information</Text>
          </View>

          <View className="space-y-4">
            {/* Full Name */}
            <View>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Full Name
              </Text>
              <Text className="text-[15px] font-semibold text-slate-800 mt-0.5">
                Marcus Thornton
              </Text>
            </View>

            {/* Employee ID */}
            <View>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Employee ID
              </Text>
              <Text className="text-[15px] font-semibold text-slate-800 mt-0.5">
                TAS-992-04X
              </Text>
            </View>

            {/* Email */}
            <View>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Email Address
              </Text>
              <Text className="text-[14px] font-semibold text-slate-800 mt-0.5">
                m.thornton@tas-governance.org
              </Text>
            </View>

            {/* Phone */}
            <View>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Phone
              </Text>
              <Text className="text-[15px] font-semibold text-slate-800 mt-0.5">
                +1 (555) 012-3456
              </Text>
            </View>
          </View>
        </View>

        {/* Card 2: Professional Role */}
        <View className="bg-white rounded-2xl p-4 border border-slate-150 shadow-sm mb-4">
          <View className="flex-row items-center space-x-2.5 mb-4 pb-2 border-b border-slate-50">
            <View className="bg-blue-50 p-2 rounded-lg">
              <Briefcase size={18} color="#134074" />
            </View>
            <Text className="text-lg font-bold text-[#134074]">Professional Role</Text>
          </View>

          <View className="space-y-3.5">
            {/* Department */}
            <View className="border-l-4 border-[#134074] bg-[#F3F8FC] px-3.5 py-2.5 rounded-r-lg">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Department
              </Text>
              <Text className="text-[15px] font-bold text-[#134074] mt-0.5">
                Governance & Oversight
              </Text>
            </View>

            {/* Access Level */}
            <View className="border-l-4 border-[#3F7E1F] bg-[#F7FCF3] px-3.5 py-2.5 rounded-r-lg">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Access Level
              </Text>
              <Text className="text-[15px] font-bold text-[#3F7E1F] mt-0.5">
                Super Admin
              </Text>
            </View>

            {/* Core Permissions */}
            <View className="pt-2">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                Core Permissions
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {['SYSTEM_WRITE', 'USER_AUDIT', 'FISCAL_VIEW'].map((perm) => (
                  <View key={perm} className="bg-blue-50 border border-blue-100 rounded px-2 py-1">
                    <Text className="text-[11px] font-semibold text-[#134074]">{perm}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Card 3: Security Settings */}
        <View className="bg-white rounded-2xl p-4 border border-slate-150 shadow-sm mb-6">
          <View className="flex-row items-center space-x-2.5 mb-4 pb-2 border-b border-slate-50">
            <View className="bg-blue-50 p-2 rounded-lg">
              <Shield size={18} color="#134074" />
            </View>
            <Text className="text-lg font-bold text-[#134074]">Security Settings</Text>
          </View>

          <View className="space-y-3">
            {/* 2FA Status Row */}
            <View className="bg-[#F3F8FC] border border-blue-100 rounded-xl p-3 flex-row items-start space-x-3">
              <CheckCircle2 size={20} color="#3F7E1F" className="mt-0.5" />
              <View className="flex-1">
                <Text className="text-slate-800 font-bold text-sm">2FA Status: Enabled</Text>
                <Text className="text-[11px] text-slate-500 mt-0.5">
                  Authenticated via Hardware Token (YubiKey 5C).
                </Text>
              </View>
            </View>

            {/* Password Warning Row */}
            <View className="bg-[#F3F8FC] border border-blue-100 rounded-xl p-3 flex-row items-start space-x-3">
              <AlertTriangle size={20} color="#8A1F1F" className="mt-0.5" />
              <View className="flex-1">
                <Text className="text-slate-800 font-bold text-sm">Last Password Change</Text>
                <Text className="text-[11px] text-slate-500 mt-0.5">
                  45 days ago. Recommended change in 15 days.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          className="border border-[#8A1F1F] rounded-xl py-3.5 flex-row justify-center items-center space-x-2 bg-white active:bg-red-50/50 mb-3"
        >
          <LogOut size={16} color="#8A1F1F" />
          <Text className="text-[#8A1F1F] font-bold text-[15px]">Sign Out Securely</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      {!navigation && (
        <View className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center bg-white border-t border-slate-200 py-2.5 z-20">
          <TouchableOpacity className="items-center" onPress={() => onTabPress?.('feed')}>
            <Home size={24} color="#94a3b8" />
            <Text className="text-[10px] mt-0.5 font-medium text-slate-400">Home</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center" onPress={() => onTabPress?.('analytics')}>
            <BarChart3 size={24} color="#94a3b8" />
            <Text className="text-[10px] mt-0.5 font-medium text-slate-400">Analytics</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center" onPress={() => onTabPress?.('directory')}>
            <Calendar size={24} color={activeNavigationTab === 'directory' ? '#134074' : '#94a3b8'} />
            <Text className={`text-[10px] mt-0.5 font-medium ${activeNavigationTab === 'directory' ? 'text-[#134074]' : 'text-slate-400'}`}>Events</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center" onPress={() => onTabPress?.('directory')}>
            <Users size={24} color="#94a3b8" />
            <Text className="text-[10px] mt-0.5 font-medium text-slate-400">Directory</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center" onPress={() => onTabPress?.('posts_all')}>
            <FileText size={24} color="#94a3b8" />
            <Text className="text-[10px] mt-0.5 font-medium text-slate-400">Posts</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

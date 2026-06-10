import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import {
  ArrowLeft,
  Users,
  CreditCard,
  Calendar,
  Lock,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Percent,
  PlusCircle,
  Home,
  BarChart3,
  MessageSquare,
  FileText,
  UserCheck,
} from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface AnalyticsScreenProps {
  onBack: () => void;
  onTabPress?: (tab: string) => void;
  navigation?: any;
}

type AnalysisTab = 'general' | 'memberships';

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ onBack, onTabPress, navigation }) => {
  const [activeSegment, setActiveSegment] = useState<AnalysisTab>('general');
  const [usagePeriod, setUsagePeriod] = useState<'weekly' | 'monthly'>('weekly');

  // SVG Donut Chart Parameters
  const size = 120;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Render SVG Donut Chart for Memberships
  const renderDonutChart = () => {
    // We will draw segments for: Platinum Fellow (40%), Senior Associate (25%), Associate (20%), Student (15%)
    // Colors: Platinum (#1E3A8A), Senior (#70B62C), Associate (#3B82F6), Student (#DBEAFE)
    const segments = [
      { percentage: 40, color: '#134074' }, // Platinum
      { percentage: 25, color: '#70B62C' }, // Senior
      { percentage: 20, color: '#3B82F6' }, // Associate
      { percentage: 15, color: '#DBEAFE' }, // Student
    ];

    let currentOffset = 0;

    return (
      <View className="items-center justify-center relative my-4" style={{ height: size }}>
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          {segments.map((seg, index) => {
            const strokeDashoffset = circumference - (circumference * seg.percentage) / 105; // Slightly space segments
            const offset = currentOffset;
            currentOffset += seg.percentage;
            
            return (
              <Circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={seg.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={circumference - (circumference * seg.percentage) / 100}
                rotation={(offset / 100) * 360}
                origin={`${size / 2}, ${size / 2}`}
              />
            );
          })}
        </Svg>
        {/* Central Text */}
        <View className="absolute items-center justify-center">
          <Text className="text-lg font-extrabold text-[#134074]">100%</Text>
          <Text className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active</Text>
        </View>
      </View>
    );
  };

  // GENERAL ANALYSIS VIEW
  const renderGeneralView = () => {
    // Days of the week height metrics (out of 100)
    const barData = [
      { day: 'Mon', val: 60, green: false },
      { day: 'Tue', val: 15, green: false },
      { day: 'Wed', val: 40, green: false },
      { day: 'Thu', val: 55, green: false },
      { day: 'Fri', val: 90, green: true }, // Friday highlighted
      { day: 'Sat', val: 40, green: false },
      { day: 'Sun', val: 62, green: false },
    ];

    return (
      <ScrollView showsVerticalScrollIndicator={true} className="flex-1 px-4 py-3">
        {/* Metrics Grid */}
        <View className="flex-row space-x-3 mb-3">
          <View className="flex-1 bg-white border border-slate-150 rounded-xl p-3.5 flex-row items-center space-x-3.5 shadow-sm">
            <View className="bg-blue-50 p-2.5 rounded-lg">
              <Users size={20} color="#134074" />
            </View>
            <View>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Members</Text>
              <Text className="text-xl font-extrabold text-[#134074] mt-0.5">4.2k</Text>
            </View>
          </View>
          <View className="flex-1 bg-white border border-slate-150 rounded-xl p-3.5 flex-row items-center space-x-3.5 shadow-sm">
            <View className="bg-blue-50 p-2.5 rounded-lg">
              <CreditCard size={20} color="#134074" />
            </View>
            <View>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revenue</Text>
              <Text className="text-xl font-extrabold text-[#134074] mt-0.5">₹85k</Text>
            </View>
          </View>
        </View>

        {/* Sub-Metric Card */}
        <View className="bg-white border border-slate-150 rounded-xl p-3.5 flex-row items-center space-x-3.5 shadow-sm mb-4">
          <View className="bg-blue-50 p-2.5 rounded-lg">
            <Calendar size={20} color="#134074" />
          </View>
          <View>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event Registrations</Text>
            <Text className="text-xl font-extrabold text-[#134074] mt-0.5">340</Text>
          </View>
        </View>

        {/* Usage Chart Card */}
        <View className="bg-white border border-slate-150 rounded-2xl p-4 shadow-sm mb-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-bold text-[#134074]">Usage</Text>
            <View className="flex-row bg-blue-50 rounded-full p-0.5">
              <TouchableOpacity
                onPress={() => setUsagePeriod('monthly')}
                className={`px-3 py-1 rounded-full ${usagePeriod === 'monthly' ? 'bg-[#134074]' : ''}`}
              >
                <Text className={`text-[10px] font-bold ${usagePeriod === 'monthly' ? 'text-white' : 'text-slate-400'}`}>Monthly</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setUsagePeriod('weekly')}
                className={`px-3 py-1 rounded-full ${usagePeriod === 'weekly' ? 'bg-[#134074]' : ''}`}
              >
                <Text className={`text-[10px] font-bold ${usagePeriod === 'weekly' ? 'text-white' : 'text-slate-400'}`}>Weekly</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bar Chart Graphics */}
          <View className="h-44 flex-row items-end justify-between px-2 pt-6">
            {barData.map((bar, index) => (
              <View key={index} className="items-center w-8 relative">
                {bar.green && (
                  <View className="absolute -top-6 bg-[#70B62C] px-1.5 py-0.5 rounded shadow-sm z-10">
                    <Text className="text-white text-[9px] font-bold">8hrs</Text>
                  </View>
                )}
                <View 
                  style={{ height: `${bar.val}%` }} 
                  className={`w-4 rounded-t-md ${bar.green ? 'bg-[#70B62C]' : 'bg-[#134074]'}`} 
                />
                <Text className="text-[10px] text-slate-400 font-semibold mt-2">{bar.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* System Config Card */}
        <View className="bg-white border border-slate-150 rounded-2xl p-4 shadow-sm mb-4">
          <Text className="text-base font-bold text-[#134074] mb-4">System Config</Text>

          <View className="space-y-4">
            {/* Server Uptime */}
            <View>
              <View className="flex-row justify-between mb-1.5">
                <Text className="text-xs font-semibold text-slate-500">Server Uptime</Text>
                <Text className="text-xs font-bold text-slate-800">99.9%</Text>
              </View>
              <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <View className="w-[99.9%] h-full bg-[#134074]" />
              </View>
            </View>

            {/* DB Latency */}
            <View className="flex-row justify-between items-center py-1.5">
              <Text className="text-xs font-semibold text-slate-500">DB Latency</Text>
              <View className="flex-row items-center space-x-1.5">
                <View className="w-2.5 h-2.5 rounded-full bg-[#70B62C]" />
                <Text className="text-xs font-bold text-[#70B62C]">Low</Text>
              </View>
            </View>

            {/* Lock Banner */}
            <View className="bg-[#F3F8FC] rounded-lg py-2 px-3 flex-row justify-center items-center space-x-2 border border-blue-50 mt-1">
              <Lock size={12} color="#94a3b8" />
              <Text className="text-[11px] text-slate-400 font-semibold">
                Secure Administrative Session Active
              </Text>
            </View>
          </View>
        </View>

        {/* Top Performing Regions Card */}
        <View className="bg-white border border-slate-150 rounded-2xl p-4 shadow-sm mb-8">
          <Text className="text-base font-bold text-[#134074] mb-4">Top Performing Regions</Text>

          <View className="space-y-4">
            {/* Maharashtra */}
            <View>
              <View className="flex-row justify-between mb-1.5">
                <Text className="text-xs font-bold text-slate-800">Maharashtra (Mumbai Cluster)</Text>
                <Text className="text-xs font-bold text-[#70B62C]">88% Capacity</Text>
              </View>
              <View className="h-2 bg-blue-50 rounded-full overflow-hidden">
                <View className="w-[88%] h-full bg-[#134074]" />
              </View>
            </View>

            {/* Delhi NCR */}
            <View>
              <View className="flex-row justify-between mb-1.5">
                <Text className="text-xs font-bold text-slate-800">Delhi NCR</Text>
                <Text className="text-xs font-bold text-[#70B62C]">74% Capacity</Text>
              </View>
              <View className="h-2 bg-blue-50 rounded-full overflow-hidden">
                <View className="w-[74%] h-full bg-[#134074]" />
              </View>
            </View>

            {/* Karnataka */}
            <View>
              <View className="flex-row justify-between mb-1.5">
                <Text className="text-xs font-bold text-slate-800">Karnataka (Bangalore Hub)</Text>
                <Text className="text-xs font-bold text-[#70B62C]">62% Capacity</Text>
              </View>
              <View className="h-2 bg-blue-50 rounded-full overflow-hidden">
                <View className="w-[62%] h-full bg-[#134074]" />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  // RELATED MEMBERSHIPS VIEW
  const renderMembershipsView = () => {
    const activityFeed = [
      { name: 'Julian Sterling', tier: 'Lifetime', time: 'Joined 45 mins ago', img: require('../../assets/admin_profile.png') },
      { name: 'Sarah Chen', tier: 'Premium', time: 'Joined 2 hours ago', img: require('../../assets/elena_profile.png') },
      { name: 'Marcus Thorne', tier: 'Basic', time: 'Joined 5 hours ago', img: require('../../assets/admin_profile.png') },
    ];

    return (
      <ScrollView showsVerticalScrollIndicator={true} className="flex-1 px-4 py-3">
        {/* Total Active Memberships */}
        <View className="bg-white border border-slate-150 rounded-xl p-3.5 flex-row items-center space-x-3.5 shadow-sm mb-3">
          <View className="bg-blue-50 p-2.5 rounded-lg">
            <Users size={20} color="#134074" />
          </View>
          <View>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Active Memberships</Text>
            <Text className="text-xl font-extrabold text-[#134074] mt-0.5">15,000</Text>
          </View>
        </View>

        {/* Tiers List */}
        <View className="space-y-2 mb-4">
          {[
            { tier: 'Lifetime', count: '1,000' },
            { tier: 'Premium', count: '8,000' },
            { tier: 'Professional', count: '3,000' },
            { tier: 'Basic', count: '3,000' },
          ].map((item, idx) => (
            <View key={idx} className="bg-white border border-slate-150 rounded-xl p-3.5 flex-row justify-between items-center shadow-sm">
              <Text className="font-bold text-[#134074] text-base">{item.tier}</Text>
              <View className="items-end">
                <Text className="font-extrabold text-slate-800 text-[15px]">{item.count}</Text>
                <Text className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5">Members</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Membership Analytics Header */}
        <Text className="text-lg font-bold text-[#134074] mb-3">Membership Analytics</Text>

        {/* Dropdown Styled Filter */}
        <TouchableOpacity className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex-row justify-between items-center mb-4 shadow-sm w-36">
          <View className="flex-row items-center space-x-1.5">
            <Calendar size={13} color="#64748b" />
            <Text className="text-xs font-semibold text-slate-600">Last 6 Months</Text>
          </View>
          <ChevronDown size={14} color="#64748b" />
        </TouchableOpacity>

        {/* Comparative Metric Cards */}
        <View className="space-y-3 mb-5">
          {/* Revenue */}
          <View className="bg-white border border-slate-150 rounded-xl p-4 shadow-sm relative">
            <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</Text>
            <View className="flex-row items-baseline mt-1 space-x-2">
              <Text className="text-2xl font-extrabold text-[#134074]">$428,500</Text>
              <Text className="text-[11px] font-bold text-[#70B62C]">↑12%</Text>
            </View>
            <View className="absolute right-4 top-4 bg-blue-50 p-1.5 rounded-lg">
              <CreditCard size={14} color="#134074" />
            </View>
          </View>

          {/* Conversion Rate */}
          <View className="bg-white border border-slate-150 rounded-xl p-4 shadow-sm relative">
            <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Conversion Rate</Text>
            <View className="flex-row items-baseline mt-1 space-x-2">
              <Text className="text-2xl font-extrabold text-[#134074]">24.8%</Text>
              <Text className="text-[11px] font-bold text-[#70B62C]">↑3.1%</Text>
            </View>
            <View className="absolute right-4 top-4 bg-blue-50 p-1.5 rounded-lg">
              <Percent size={14} color="#134074" />
            </View>
          </View>

          {/* New Sales MTD */}
          <View className="bg-white border border-slate-150 rounded-xl p-4 shadow-sm relative">
            <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">New Sales (MTD)</Text>
            <View className="flex-row items-baseline mt-1 space-x-2">
              <Text className="text-2xl font-extrabold text-[#134074]">142</Text>
              <Text className="text-[11px] font-bold text-[#8A1F1F]">↓2%</Text>
            </View>
            <View className="absolute right-4 top-4 bg-blue-50 p-1.5 rounded-lg">
              <PlusCircle size={14} color="#134074" />
            </View>
          </View>
        </View>

        {/* Tier Distribution Card */}
        <View className="bg-white border border-slate-150 rounded-2xl p-4 shadow-sm mb-4">
          <Text className="text-base font-bold text-[#134074] mb-2">Tier Distribution</Text>
          
          {/* Centered Donut SVG */}
          {renderDonutChart()}

          {/* Legend Rows */}
          <View className="space-y-2.5 pt-3 border-t border-slate-50">
            {[
              { label: 'Platinum Fellow', val: '40%', color: 'bg-[#134074]' },
              { label: 'Senior Associate', val: '25%', color: 'bg-[#70B62C]' },
              { label: 'Associate', val: '20%', color: 'bg-[#3B82F6]' },
              { label: 'Student', val: '15%', color: 'bg-[#DBEAFE]' },
            ].map((leg, idx) => (
              <View key={idx} className="flex-row justify-between items-center">
                <View className="flex-row items-center space-x-2">
                  <View className={`w-3 h-3 rounded-full ${leg.color}`} />
                  <Text className="text-xs font-semibold text-slate-600">{leg.label}</Text>
                </View>
                <Text className="text-xs font-bold text-slate-800">{leg.val}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity Feed */}
        <View className="bg-white border border-slate-150 rounded-2xl p-4 shadow-sm mb-8">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-bold text-[#134074]">Recent Activity</Text>
            <TouchableOpacity><Text className="text-xs font-bold text-[#134074]">View All &gt;</Text></TouchableOpacity>
          </View>

          <View className="space-y-2.5">
            {activityFeed.map((act, idx) => (
              <View key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex-row items-center">
                <Image source={act.img} className="w-10 h-10 rounded-full border border-slate-200" />
                <View className="ml-3 flex-1">
                  <View className="flex-row justify-between items-center">
                    <Text className="font-bold text-slate-800 text-[14px]">{act.name}</Text>
                    <View className="bg-[#134074]/15 px-2 py-0.5 rounded-full">
                      <Text className="text-[#134074] text-[9px] font-extrabold uppercase">✨ {act.tier}</Text>
                    </View>
                  </View>
                  <Text className="text-[11px] text-slate-400 mt-1 font-medium">{act.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  // HEADER BAR
  const renderHeader = () => {
    const isGeneral = activeSegment === 'general';
    return (
      <View className="px-4 py-3 bg-[#E9F0FA] border-b border-blue-100 z-20">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onBack} className="p-1.5 -ml-1">
            <ArrowLeft size={22} color="#134074" />
          </TouchableOpacity>
          
          <Text className="text-xl font-bold text-[#134074]">
            {isGeneral ? 'Analytics' : 'Connections'}
          </Text>

          {!isGeneral ? (
            <View className="flex-row items-center bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 space-x-1">
              <View className="w-1.5 h-1.5 rounded-full bg-[#3F7E1F]" />
              <Text className="text-[#3F7E1F] text-[9px] font-bold uppercase tracking-wider">Live Data</Text>
            </View>
          ) : (
            <View style={{ width: 24 }} />
          )}
        </View>

        {/* Segmented Control tab bar */}
        <View className="flex-row bg-[#D2E4F9]/30 rounded-xl p-1 mt-4 border border-blue-100/30">
          <TouchableOpacity
            onPress={() => setActiveSegment('general')}
            className={`flex-1 py-2 rounded-lg items-center ${isGeneral ? 'bg-[#134074]' : ''}`}
          >
            <Text className={`text-xs font-bold ${isGeneral ? 'text-white' : 'text-[#134074]'}`}>
              General Analysis
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveSegment('memberships')}
            className={`flex-1 py-2 rounded-lg items-center ${!isGeneral ? 'bg-[#134074]' : ''}`}
          >
            <Text className={`text-xs font-bold ${!isGeneral ? 'text-white' : 'text-[#134074]'}`}>
              Related Memberships
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // FOOTER NAVIGATION BAR (DYNAMIC ACCORDING TO REQUIREMENTS)
  const renderFooterNav = () => {
    const isGeneral = activeSegment === 'general';

    return (
      <View className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center bg-white border-t border-slate-200 py-2.5 z-20">
        {/* Home */}
        <TouchableOpacity className="items-center" onPress={() => onTabPress?.('feed')}>
          <Home size={24} color="#94a3b8" />
          <Text className="text-[10px] mt-0.5 font-medium text-slate-400">Home</Text>
        </TouchableOpacity>

        {/* Analytics (Active if General Analysis is open) */}
        <TouchableOpacity className="items-center" onPress={() => setActiveSegment('general')}>
          <BarChart3 size={24} color={isGeneral ? '#70B62C' : '#94a3b8'} />
          <Text className={`text-[10px] mt-0.5 font-medium ${isGeneral ? 'text-[#70B62C]' : 'text-slate-400'}`}>
            Analytics
          </Text>
        </TouchableOpacity>

        {/* Events */}
        <TouchableOpacity className="items-center" onPress={() => onTabPress?.('directory')}>
          <Calendar size={24} color="#94a3b8" />
          <Text className="text-[10px] mt-0.5 font-medium text-slate-400">Events</Text>
        </TouchableOpacity>

        {/* Connect (Active if Related Memberships is open) */}
        <TouchableOpacity className="items-center" onPress={() => setActiveSegment('memberships')}>
          <UserCheck size={24} color={!isGeneral ? '#70B62C' : '#94a3b8'} />
          <Text className={`text-[10px] mt-0.5 font-medium ${!isGeneral ? 'text-[#70B62C]' : 'text-slate-400'}`}>
            Connect
          </Text>
        </TouchableOpacity>

        {/* Posts */}
        <TouchableOpacity className="items-center" onPress={() => onTabPress?.('posts_all')}>
          <FileText size={24} color="#94a3b8" />
          <Text className="text-[10px] mt-0.5 font-medium text-slate-400">Posts</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {renderHeader()}
      {activeSegment === 'general' ? renderGeneralView() : renderMembershipsView()}
      {!navigation && renderFooterNav()}
    </SafeAreaView>
  );
};

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {
  ArrowLeft,
  Users,
  CreditCard,
  Calendar,
  Lock,
  ChevronDown,
  Percent,
  PlusCircle,
  Home,
  BarChart3,
  Newspaper,
  BookOpen,
  ArrowUp,
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 300);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  // SVG Donut Chart Parameters
  const size = 120;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const renderDonutChart = () => {
    const segments = [
      { percentage: 40, color: '#134074' },
      { percentage: 25, color: '#70B62C' },
      { percentage: 20, color: '#3B82F6' },
      { percentage: 15, color: '#DBEAFE' },
    ];
    let currentOffset = 0;
    return (
      <View className="items-center justify-center relative my-4" style={{ height: size }}>
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          {segments.map((seg, index) => {
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
        <View className="absolute items-center justify-center">
          <Text className="text-lg font-extrabold text-[#134074]">100%</Text>
          <Text className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active</Text>
        </View>
      </View>
    );
  };

  const renderGeneralView = () => {
    const barData = [
      { day: 'Mon', val: 60, green: false },
      { day: 'Tue', val: 15, green: false },
      { day: 'Wed', val: 40, green: false },
      { day: 'Thu', val: 55, green: false },
      { day: 'Fri', val: 90, green: true },
      { day: 'Sat', val: 40, green: false },
      { day: 'Sun', val: 62, green: false },
    ];

    return (
      <ScrollView 
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false} 
        className="flex-1 px-4 pt-3 pb-24"
      >
        {/* Metrics Grid */}
        <View className="flex-row space-x-3 mb-3">
          <View className="flex-1 bg-white border border-slate-200 rounded-xl p-3.5 flex-row items-center shadow-sm">
            <View className="border border-slate-100 bg-slate-50 p-2 rounded-lg mr-2.5">
              <Users size={20} color="#5C7A9F" />
            </View>
            <View>
              <Text className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Members</Text>
              <Text className="text-xl font-extrabold text-[#134074]">4.2k</Text>
            </View>
          </View>
          <View className="flex-1 bg-white border border-slate-200 rounded-xl p-3.5 flex-row items-center shadow-sm">
            <View className="border border-slate-100 bg-slate-50 p-2 rounded-lg mr-2.5">
              <CreditCard size={20} color="#5C7A9F" />
            </View>
            <View>
              <Text className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Revenue</Text>
              <Text className="text-xl font-extrabold text-[#134074]">₹85k</Text>
            </View>
          </View>
        </View>

        {/* Sub-Metric Card */}
        <View className="bg-white border border-slate-200 rounded-xl p-3.5 flex-row items-center shadow-sm mb-4">
          <View className="border border-slate-100 bg-slate-50 p-2 rounded-lg mr-2.5">
            <Calendar size={20} color="#5C7A9F" />
          </View>
          <View>
            <Text className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Event Registrations</Text>
            <Text className="text-xl font-extrabold text-[#134074]">340</Text>
          </View>
        </View>

        {/* Usage Chart Card */}
        <View className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-bold text-[#134074]">Usage</Text>
            <View className="flex-row bg-[#E9F0FA] rounded-full p-1">
              <TouchableOpacity
                onPress={() => setUsagePeriod('monthly')}
                className={`px-4 py-1.5 rounded-full ${usagePeriod === 'monthly' ? 'bg-[#134074]' : ''}`}
              >
                <Text className={`text-xs font-bold ${usagePeriod === 'monthly' ? 'text-white' : 'text-[#5C7A9F]'}`}>Monthly</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setUsagePeriod('weekly')}
                className={`px-4 py-1.5 rounded-full ${usagePeriod === 'weekly' ? 'bg-[#134074]' : ''}`}
              >
                <Text className={`text-xs font-bold ${usagePeriod === 'weekly' ? 'text-white' : 'text-[#5C7A9F]'}`}>Weekly</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bar Chart Graphics */}
          <View className="h-44 flex-row items-end justify-between px-1 pt-6">
            {barData.map((bar, index) => (
              <View key={index} className="items-center relative" style={{ width: `${100/7}%` }}>
                {bar.green && (
                  <View className="absolute -top-7 bg-[#70B62C] px-2 py-1 rounded shadow-sm z-10">
                    <Text className="text-white text-[10px] font-bold">8hrs</Text>
                  </View>
                )}
                <View 
                  style={{ height: `${bar.val}%`, width: 14 }} 
                  className={`${bar.green ? 'bg-[#70B62C]' : 'bg-[#134074]'}`} 
                />
                <Text className="text-[10px] text-slate-400 font-semibold mt-3">{bar.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* System Config Card */}
        <View className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-4">
          <Text className="text-base font-bold text-[#134074] mb-5">System Config</Text>

          <View className="space-y-4">
            {/* Server Uptime */}
            <View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-[13px] font-bold text-slate-600">Server Uptime</Text>
                <Text className="text-[13px] font-bold text-[#134074]">99.9%</Text>
              </View>
              <View className="h-2.5 bg-[#E9F0FA] rounded-full overflow-hidden">
                <View className="w-[99.9%] h-full bg-[#134074]" />
              </View>
            </View>

            {/* DB Latency */}
            <View className="flex-row justify-between items-center pb-2">
              <Text className="text-[13px] font-bold text-slate-600">DB Latency</Text>
              <View className="flex-row items-center space-x-1.5">
                <View className="w-2 h-2 rounded-full bg-[#70B62C]" />
                <Text className="text-[13px] font-bold text-[#70B62C]">Low</Text>
              </View>
            </View>

            <View className="h-[1px] bg-slate-100 w-full mb-1" />

            {/* Lock Banner */}
            <View className="flex-row items-center justify-center space-x-2 pt-1">
              <Lock size={14} color="#cbd5e1" />
              <Text className="text-[11px] text-slate-400 font-medium">
                Secure Administrative Session Active
              </Text>
            </View>
          </View>
        </View>

        {/* Top Performing Regions Card */}
        <View className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-8">
          <Text className="text-base font-bold text-[#134074] mb-5">Top Performing Regions</Text>

          <View className="space-y-5">
            {/* Maharashtra */}
            <View>
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-[13px] font-bold text-[#134074] flex-1 mr-4">Maharashtra (Mumbai{'\n'}Cluster)</Text>
                <View className="items-end mt-1">
                  <Text className="text-[11px] font-bold text-[#70B62C]">88%</Text>
                  <Text className="text-[11px] font-bold text-[#70B62C]">Capacity</Text>
                </View>
              </View>
              <View className="h-2.5 bg-[#E9F0FA] rounded-full overflow-hidden">
                <View className="w-[88%] h-full bg-[#134074]" />
              </View>
            </View>

            {/* Delhi NCR */}
            <View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-[13px] font-bold text-[#134074]">Delhi NCR</Text>
                <Text className="text-[11px] font-bold text-[#70B62C]">74% Capacity</Text>
              </View>
              <View className="h-2.5 bg-[#E9F0FA] rounded-full overflow-hidden">
                <View className="w-[74%] h-full bg-[#134074]" />
              </View>
            </View>

            {/* Karnataka */}
            <View>
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-[13px] font-bold text-[#134074] flex-1 mr-4">Karnataka (Bangalore{'\n'}Hub)</Text>
                <View className="items-end mt-1">
                  <Text className="text-[11px] font-bold text-[#70B62C]">62%</Text>
                  <Text className="text-[11px] font-bold text-[#70B62C]">Capacity</Text>
                </View>
              </View>
              <View className="h-2.5 bg-[#E9F0FA] rounded-full overflow-hidden">
                <View className="w-[62%] h-full bg-[#134074]" />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderMembershipsView = () => {
    return (
      <ScrollView 
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false} 
        className="flex-1 px-4 pt-3 pb-24"
      >
        <View className="bg-white border border-slate-150 rounded-xl p-3.5 flex-row items-center space-x-3.5 shadow-sm mb-3">
          <View className="bg-blue-50 p-2.5 rounded-lg">
            <Users size={20} color="#134074" />
          </View>
          <View>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Active Memberships</Text>
            <Text className="text-xl font-extrabold text-[#134074] mt-0.5">15,000</Text>
          </View>
        </View>

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

        <View className="bg-white border border-slate-150 rounded-2xl p-4 shadow-sm mb-4">
          <Text className="text-base font-bold text-[#134074] mb-2">Tier Distribution</Text>
          {renderDonutChart()}
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
      </ScrollView>
    );
  };

  const renderHeader = () => {
    const isGeneral = activeSegment === 'general';
    return (
      <View className="pt-2 z-20">
        <View className="px-4 py-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={onBack} className="p-1 -ml-1 mr-3">
              <ArrowLeft size={24} color="#134074" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-[#134074]">
              Analytics
            </Text>
          </View>
        </View>

        <View className="px-4 mt-2 mb-2">
          <View className="flex-row bg-[#F4F7FB] border border-slate-200 rounded-xl p-1 shadow-sm">
            <TouchableOpacity
              onPress={() => setActiveSegment('general')}
              className={`flex-1 py-2.5 rounded-lg items-center ${isGeneral ? 'bg-[#134074]' : ''}`}
            >
              <Text className={`text-[12px] text-center font-bold leading-tight ${isGeneral ? 'text-white' : 'text-slate-500'}`}>
                General{'\n'}Analysis
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveSegment('memberships')}
              className={`flex-1 py-2.5 rounded-lg items-center ${!isGeneral ? 'bg-[#134074]' : ''}`}
            >
              <Text className={`text-[12px] text-center font-bold leading-tight ${!isGeneral ? 'text-white' : 'text-slate-500'}`}>
                Related{'\n'}Memberships
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderFooterNav = () => {
    return (
      <View className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl border border-slate-200 py-3.5 px-6 shadow-md flex-row justify-between items-center z-20">
        <TouchableOpacity className="items-center" onPress={() => onTabPress?.('feed')}>
          <Home size={26} color="#134074" strokeWidth={2.5} />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center" onPress={() => setActiveSegment('general')}>
          <BarChart3 size={26} color="#70B62C" strokeWidth={2.5} />
          <Text className="text-[#70B62C] font-bold ml-1.5 text-[15px]">Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center" onPress={() => onTabPress?.('directory')}>
          <Newspaper size={26} color="#134074" strokeWidth={2.5} />
        </TouchableOpacity>

        <TouchableOpacity className="items-center" onPress={() => setActiveSegment('memberships')}>
          <Users size={26} color="#134074" strokeWidth={2.5} />
        </TouchableOpacity>

        <TouchableOpacity className="items-center" onPress={() => {}}>
          <BookOpen size={26} color="#134074" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7FB]">
      {renderHeader()}
      {activeSegment === 'general' ? renderGeneralView() : renderMembershipsView()}
      {!navigation && renderFooterNav()}
      {showScrollTop && (
        <TouchableOpacity
          onPress={scrollToTop}
          activeOpacity={0.85}
          className="absolute bottom-24 right-4 w-11 h-11 rounded-full bg-[#134074] justify-center items-center shadow-md z-[99]"
          style={{ elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4 }}
        >
          <ArrowUp size={20} color="white" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

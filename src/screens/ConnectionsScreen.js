import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native';
import { ArrowLeft, Home, BarChart3, Newspaper, Users } from 'lucide-react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { dbStore } from '../config/dbStore';
export const ConnectionsScreen = ({
  onBack,
  onTabPress,
  navigation
}) => {
  const [queue, setQueue] = useState(dbStore.getQueue());
  const [approvedList, setApprovedList] = useState(dbStore.getApprovedList());
  useEffect(() => {
    const unsubscribe = dbStore.subscribe(() => {
      setQueue([...dbStore.getQueue()]);
      setApprovedList([...dbStore.getApprovedList()]);
    });
    return unsubscribe;
  }, []);
  const handleAction = async (id, status) => {
    if (status === 'approved') {
      await dbStore.approveConnection(id);
    } else {
      await dbStore.declineConnection(id);
    }
    Alert.alert('Success', `Verification request has been ${status === 'approved' ? 'approved' : 'declined'}.`);
  };
  const DirectoryBookIcon = ({
    color
  }) => <View style={{
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center'
  }}>
      <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="2" width="16" height="20" rx="3" fill="none" stroke={color} strokeWidth="2.5" />
        <Path d="M8 2v20" stroke={color} strokeWidth="1.5" />
        <Circle cx="14" cy="10" r="3" stroke={color} strokeWidth="2" fill="white" />
        <Path d="M16.5 12.5l2.5 2.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </Svg>
    </View>;
  return <SafeAreaView className="flex-1 bg-[#F4F7FC] relative">
      {/* Top Header */}
      <View className="flex-row items-center px-4 py-4 bg-[#EBF3FC] border-b border-blue-100/50 z-20">
        {onBack && <TouchableOpacity onPress={onBack} className="p-1.5 -ml-1 mr-3 rounded-full bg-white shadow-sm border border-slate-100">
            <ArrowLeft size={18} color="#134074" />
          </TouchableOpacity>}
        <Text className="text-[20px] font-bold text-[#134074]">Connections</Text>
      </View>

      <ScrollView className="flex-1 no-scrollbar" showsVerticalScrollIndicator={false} contentContainerStyle={{
      paddingBottom: 130
    }}>
        {/* Verification Queue Section */}
        <Text className="text-[24px] font-extrabold text-[#134074] mx-4 mt-5 mb-3">Approval Requests</Text>

        {/* Info Banner */}
        <View className="bg-[#134074] mx-4 mb-4 px-5 py-3.5 rounded-xl flex-row items-center shadow-sm">
          <Text className="text-white font-extrabold text-[32px] mr-4 leading-none">{queue.length}</Text>
          <Text className="text-blue-100/80 text-[11px] font-extrabold tracking-widest uppercase">Awaiting Verification</Text>
        </View>

        {queue.length === 0 ? <View className="bg-white rounded-2xl p-6 mx-4 border border-slate-200 shadow-sm items-center justify-center mb-6">
            <Text className="text-slate-500 font-bold text-sm">All verification items resolved</Text>
          </View> : queue.map(item => <View key={item.id} className="bg-white border border-slate-200/80 rounded-2xl mx-4 mb-4 shadow-sm overflow-hidden">
              <View className="flex-row items-center p-4">
                <Image source={item.avatar} className="w-14 h-14 rounded-xl border border-slate-100" />
                <View className="ml-3.5 flex-1">
                  <View className="flex-row justify-between items-start">
                    <Text className="font-bold text-[#134074] text-[16px] flex-1 mr-2">{item.user_name}</Text>
                    <View className="bg-[#E9F0FA] border border-blue-150/40 rounded px-2 py-0.5">
                      <Text className="text-[10px] font-bold text-[#134074]">{item.id_badge}</Text>
                    </View>
                  </View>
                  <Text className="text-[13px] text-slate-500 mt-1">{item.designation}</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row border-t border-slate-100 overflow-hidden">
                <TouchableOpacity onPress={() => handleAction(item.id, 'declined')} className="flex-1 py-3.5 bg-white items-center justify-center border-r border-slate-100">
                  <Text className="text-slate-500 font-bold text-sm">Decline</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleAction(item.id, 'approved')} className="flex-1 py-3.5 bg-[#48752C] items-center justify-center">
                  <Text className="text-white font-bold text-sm">Approve</Text>
                </TouchableOpacity>
              </View>
            </View>)}

        {/* Recent Approvals Section */}
        <Text className="text-[20px] font-bold text-[#134074] mx-4 mt-2 mb-4">Recent Approvals</Text>

        <View className="mx-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm mb-4">
          <View className="divide-y divide-slate-100">
            {approvedList.map(log => <View key={log.id} className="flex-row justify-between items-center py-3.5 border-b border-slate-100 last:border-b-0">
                <View className="flex-row items-center flex-1 mr-2">
                  <Image source={log.avatar} className="w-12 h-12 rounded-xl border border-slate-100" />
                  <View className="ml-3.5 flex-1">
                    <Text className="text-[#134074] font-bold text-[15px]">{log.user_name}</Text>
                    <Text className="text-[12px] text-slate-500 mt-0.5">{log.designation}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Profile', `Opening profile of ${log.user_name}`)} className="bg-[#134074] px-4.5 py-1.5 rounded-full">
                  <Text className="text-white font-bold text-[11px] tracking-wider">VIEW</Text>
                </TouchableOpacity>
              </View>)}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation (Fallback when not in Navigation Stack) */}
      {!navigation && <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingVertical: 12,
      paddingHorizontal: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -4
      },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 8,
      zIndex: 20
    }}>
          <TouchableOpacity className="items-center" onPress={() => onTabPress?.('feed')}>
            <Home size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity className="items-center" onPress={() => onTabPress?.('analytics')}>
            <BarChart3 size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity className="items-center" onPress={() => onTabPress?.('posts_all')}>
            <Newspaper size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center px-4 py-2 rounded-full bg-[#f0fdf4]" onPress={() => onTabPress?.('Connect')}>
            <Users size={20} color="#70B62C" />
            <Text className="text-xs font-bold text-[#70B62C] ml-2">Connect</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center" onPress={() => onTabPress?.('directory')}>
            <DirectoryBookIcon color="#134074" />
          </TouchableOpacity>
        </View>}
    </SafeAreaView>;
};

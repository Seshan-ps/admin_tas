import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import {
  MessageSquare,
  Users,
  Search,
  Plus,
  Lock,
  Globe,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react-native';
import { supabase } from '../config/supabase';

interface MessagesScreenProps {
  onBack?: () => void;
  onTabPress?: (tab: string) => void;
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({ onBack, onTabPress }) => {
  const [activeSegment, setActiveSegment] = useState<'dms' | 'groups'>('dms');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  
  // Create group form states
  const [groupName, setGroupName] = useState('');
  const [groupCategory, setGroupCategory] = useState('Taxation');
  const [isPrivateGroup, setIsPrivateGroup] = useState(false);
  const [groupDescription, setGroupDescription] = useState('');

  // Local data fallback
  const [groups, setGroups] = useState([
    { id: '1', name: 'Tax Ethics Committee', category: 'Ethics', is_private: true, description: 'National administrative committee.', member_count: 24 },
    { id: '2', name: 'Southern Region Auditors', category: 'Audit', is_private: false, description: 'Auditing discussions for Southern region.', member_count: 156 },
    { id: '3', name: 'Public Finance Board', category: 'Finance', is_private: true, description: 'Policy and treasury discussions.', member_count: 12 },
  ]);

  const [dms, setDms] = useState([
    { id: '1', name: 'Elena Rodriguez, CPA', text: "Let's verify the audit findings before submitting...", time: '10:45 AM', avatar: require('../../assets/elena_profile.png'), unread: true },
    { id: '2', name: 'Dr. Alistair Vance', text: 'Secure database backup has been verified.', time: 'Yesterday', avatar: require('../../assets/admin_profile.png'), unread: false },
  ]);

  // Fetch groups in realtime from the backend (Supabase) if configured
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data, error } = await supabase.from('groups').select('*');
        if (data && data.length > 0) {
          setGroups(data);
        }
      } catch (e) {
        // Fallback to local data
      }
    };
    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName || !groupDescription) {
      Alert.alert('Incomplete Fields', 'Please fill in the group name and description.');
      return;
    }

    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      category: groupCategory,
      is_private: isPrivateGroup,
      description: groupDescription,
      member_count: 1,
    };

    try {
      const { data, error } = await supabase.from('groups').insert([newGroup]);
      if (error) throw error;
      Alert.alert('Group Created', `Group "${groupName}" has been registered in the database.`);
    } catch (err) {
      // Local fallback execution
      setGroups([newGroup as any, ...groups]);
      Alert.alert('Success (Offline)', `Group "${groupName}" has been successfully created.`);
    }

    setGroupName('');
    setGroupDescription('');
    setShowCreateGroup(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top Header */}
      <View className="px-4 py-3 bg-[#E9F0FA] border-b border-blue-100 flex-row justify-between items-center">
        <View className="flex-row items-center space-x-2">
          {onBack && (
            <TouchableOpacity onPress={onBack}>
              <ArrowLeft size={20} color="#134074" />
            </TouchableOpacity>
          )}
          <Text className="text-xl font-bold text-[#134074]">Secured Chats</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setShowCreateGroup(true)}
          className="bg-[#134074] p-1.5 rounded-full"
        >
          <Plus size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Segmented Switcher */}
      <View className="flex-row bg-slate-50 border-b border-slate-200">
        <TouchableOpacity
          onPress={() => setActiveSegment('dms')}
          className={`flex-1 py-3 items-center border-b-2 ${activeSegment === 'dms' ? 'border-[#134074]' : 'border-transparent'}`}
        >
          <Text className={`font-semibold text-sm ${activeSegment === 'dms' ? 'text-[#134074]' : 'text-slate-400'}`}>
            Direct Messages
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveSegment('groups')}
          className={`flex-1 py-3 items-center border-b-2 ${activeSegment === 'groups' ? 'border-[#134074]' : 'border-transparent'}`}
        >
          <Text className={`font-semibold text-sm ${activeSegment === 'groups' ? 'text-[#134074]' : 'text-slate-400'}`}>
            Community Groups
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 bg-[#F8FAFC]" showsVerticalScrollIndicator={true}>
        {/* Search Input */}
        <View className="bg-white border border-slate-200 rounded-lg m-3 px-3 py-2 flex-row items-center">
          <Search size={18} color="#94a3b8" className="mr-2" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={activeSegment === 'dms' ? "Search contacts..." : "Search committees & groups..."}
            placeholderTextColor="#94a3b8"
            className="flex-1 text-slate-800 text-[14px] p-0"
          />
        </View>

        {activeSegment === 'dms' ? (
          <View className="divide-y divide-slate-100 bg-white border-y border-slate-100">
            {dms.map((dm) => (
              <TouchableOpacity 
                key={dm.id} 
                onPress={() => Alert.alert('Chat Session', `Initiating encrypted chat with ${dm.name}`)}
                className="flex-row items-center p-4 active:bg-slate-50"
              >
                <View className="relative">
                  <Image source={dm.avatar} className="w-12 h-12 rounded-full" />
                  <View className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white" />
                </View>
                <View className="ml-3.5 flex-1">
                  <View className="flex-row justify-between items-center">
                    <Text className={`font-bold text-slate-800 text-[15px] ${dm.unread ? 'text-[#134074]' : ''}`}>{dm.name}</Text>
                    <Text className="text-[11px] text-slate-400 font-semibold">{dm.time}</Text>
                  </View>
                  <Text className={`text-[13px] mt-1 ${dm.unread ? 'font-bold text-slate-800' : 'text-slate-500'}`} numberOfLines={1}>
                    {dm.text}
                  </Text>
                </View>
                {dm.unread && <View className="w-2.5 h-2.5 bg-[#70B62C] rounded-full ml-3" />}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="px-3">
            {groups.map((group) => (
              <View key={group.id} className="bg-white border border-slate-150 rounded-2xl p-4 mb-3 shadow-sm">
                <View className="flex-row justify-between items-center mb-2.5">
                  <View className="bg-blue-50 px-2 py-0.5 rounded">
                    <Text className="text-[10px] font-bold text-[#134074] uppercase tracking-wide">{group.category}</Text>
                  </View>
                  <View className="flex-row items-center space-x-1">
                    {group.is_private ? <Lock size={12} color="#94a3b8" /> : <Globe size={12} color="#94a3b8" />}
                    <Text className="text-[10px] text-slate-400 font-semibold uppercase">{group.is_private ? 'Private' : 'Public'}</Text>
                  </View>
                </View>
                <Text className="text-base font-extrabold text-[#134074] mb-1">{group.name}</Text>
                <Text className="text-xs text-slate-500 mb-3">{group.description}</Text>
                
                <View className="flex-row justify-between items-center border-t border-slate-50 pt-2.5">
                  <Text className="text-[11px] text-slate-400 font-bold">{group.member_count} Members Active</Text>
                  <TouchableOpacity 
                    onPress={() => Alert.alert('Enter Channel', `Opening channel: #${group.name}`)}
                    className="bg-[#134074] px-4 py-1.5 rounded-lg"
                  >
                    <Text className="text-white font-extrabold text-[11px]">ENTER CHANNEL</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create Group Wizard Modal / Overlay */}
      {showCreateGroup && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center p-4 z-50">
          <View className="bg-white w-full max-w-[340px] rounded-3xl p-5 shadow-2xl border border-slate-200">
            <View className="flex-row justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <Text className="text-lg font-bold text-[#134074]">Create New Group</Text>
              <TouchableOpacity onPress={() => setShowCreateGroup(false)}>
                <Plus size={20} color="#64748b" style={{ transform: [{ rotate: '45deg' }] }} />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Group Name</Text>
                <TextInput
                  value={groupName}
                  onChangeText={setGroupName}
                  placeholder="e.g. Tax Ethics Committee"
                  placeholderTextColor="#94a3b8"
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-[13px]"
                />
              </View>

              <View>
                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Category</Text>
                <TextInput
                  value={groupCategory}
                  onChangeText={setGroupCategory}
                  placeholder="e.g. Audit, Ethics, Regional"
                  placeholderTextColor="#94a3b8"
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-[13px]"
                />
              </View>

              <TouchableOpacity 
                onPress={() => setIsPrivateGroup(!isPrivateGroup)}
                className="flex-row items-center space-x-2 py-1"
              >
                <View className={`w-4 h-4 rounded border ${isPrivateGroup ? 'bg-[#134074] border-[#134074] justify-center items-center' : 'border-slate-300'}`}>
                  {isPrivateGroup && <Text className="text-white text-[9px] font-bold">✓</Text>}
                </View>
                <Text className="text-xs font-semibold text-slate-700">Set Group as Private</Text>
              </TouchableOpacity>

              <View>
                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Description</Text>
                <TextInput
                  value={groupDescription}
                  onChangeText={setGroupDescription}
                  placeholder="Provide description..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={3}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-[13px] h-16"
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                onPress={handleCreateGroup}
                className="bg-[#134074] rounded-lg py-2.5 items-center justify-center shadow-md active:bg-[#0f325c]"
              >
                <Text className="text-white font-bold text-sm">Create Group</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Bottom spacing wrapper if displayed inline */}
      <View style={{ height: 60 }} />
    </SafeAreaView>
  );
};

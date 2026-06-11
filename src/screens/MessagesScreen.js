import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Search,
  Plus,
  Lock,
  Globe,
  ArrowLeft,
  MessageSquare,
  Users as UsersIcon,
  BarChart3,
  Newspaper,
  ChevronRight,
  Send,
  MoreVertical,
  Home as HomeIcon,
} from 'lucide-react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { supabase } from '../config/supabase';

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

export const MessagesScreen = ({ onBack, onTabPress, navigation }) => {
  const [activeSegment, setActiveSegment] = useState('dms');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  
  // Create group form states
  const [groupName, setGroupName] = useState('');
  const [groupCategory, setGroupCategory] = useState('Taxation');
  const [isPrivateGroup, setIsPrivateGroup] = useState(false);
  const [groupDescription, setGroupDescription] = useState('');

  // Selected chat details
  const [selectedChat, setSelectedChat] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');
  const scrollViewRef = useRef(null);

  // Local data fallback
  const [groups, setGroups] = useState([
    { id: '1', name: 'Tax Ethics Committee', category: 'Ethics', is_private: true, description: 'National administrative committee.', member_count: 24 },
    { id: '2', name: 'Southern Region Auditors', category: 'Audit', is_private: false, description: 'Auditing discussions for Southern region.', member_count: 156 },
    { id: '3', name: 'Public Finance Board', category: 'Finance', is_private: true, description: 'Policy and treasury discussions.', member_count: 12 },
  ]);

  const [dms, setDms] = useState([
    { id: 'sarah', name: 'Sarah Jenkins', text: "OMG", time: '10:30 AM', avatar: require('../../assets/elena_profile.png'), unread: false },
    { id: '1', name: 'Elena Rodriguez, CPA', text: "Let's verify the audit findings before submitting...", time: '10:45 AM', avatar: require('../../assets/elena_profile.png'), unread: true },
    { id: '2', name: 'Dr. Alistair Vance', text: 'Secure database backup has been verified.', time: 'Yesterday', avatar: require('../../assets/admin_profile.png'), unread: false },
  ]);

  const [chatMessages, setChatMessages] = useState({
    'sarah': [
      { id: '1', sender: 'them', text: "Hi Marcus, I've just uploaded the Q3 Compliance Audit. Could you take a quick look?", time: '10:24 AM' },
      { id: '2', sender: 'me', text: "Thanks Sarah. I'll review it right away. Is there anything specific you're concerned about?", time: '10:26 AM', status: 'READ' },
      { id: '3', sender: 'them', text: "OMG", time: '10:30 AM' }
    ],
    '1': [
      { id: '1', sender: 'them', text: "Let's verify the audit findings before submitting...", time: '10:45 AM' }
    ],
    '2': [
      { id: '1', sender: 'them', text: "Secure database backup has been verified.", time: 'Yesterday' }
    ]
  });

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

  // Scroll to bottom of chat list on open
  useEffect(() => {
    if (selectedChat) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [selectedChat, chatMessages]);

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
      setGroups([newGroup, ...groups]);
      Alert.alert('Success (Offline)', `Group "${groupName}" has been successfully created.`);
    }

    setGroupName('');
    setGroupDescription('');
    setShowCreateGroup(false);
  };

  const handleSendMessage = () => {
    if (!typedMessage.trim() || !selectedChat) return;

    const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: Date.now().toString(),
      sender: 'me',
      text: typedMessage.trim(),
      time: newTime,
      status: 'SENT'
    };

    // Update messages for current chat
    const chatId = selectedChat.id;
    setChatMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg]
    }));

    // Update DMs preview text and time
    setDms(prevDms => 
      prevDms.map(dm => 
        dm.id === chatId 
          ? { ...dm, text: typedMessage.trim(), time: newTime }
          : dm
      )
    );

    setTypedMessage('');
  };

  const handleTabPress = (tabName) => {
    if (navigation) {
      navigation.navigate('MainTabs', { screen: tabName });
    } else if (onTabPress) {
      onTabPress(tabName);
    }
  };

  // Helper to filter items based on search query
  const filteredDMs = dms.filter(dm => 
    dm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dm.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentChatMsgs = selectedChat ? (chatMessages[selectedChat.id] || []) : [];

  return (
    <SafeAreaView style={styles.container}>
      {selectedChat ? (
        /* Chat Details View */
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelectedChat(null)} style={styles.backButton}>
              <ArrowLeft size={22} color="#134074" />
            </TouchableOpacity>

            <View style={styles.chatHeaderProfile}>
              <View style={styles.avatarContainer}>
                <Image source={selectedChat.avatar} style={styles.chatAvatar} />
                <View style={styles.onlineDot} />
              </View>
              <View style={styles.chatHeaderInfo}>
                <Text style={styles.chatName}>{selectedChat.name}</Text>
                <Text style={styles.chatStatus}>ONLINE</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.moreButton}>
              <MoreVertical size={22} color="#134074" />
            </TouchableOpacity>
          </View>

          {/* Timeline and Messages Area */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesArea}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Today Date Separator */}
            <View style={styles.dateSeparatorRow}>
              <Text style={styles.dateSeparatorText}>Today</Text>
            </View>

            {currentChatMsgs.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <View 
                  key={msg.id} 
                  style={[
                    styles.messageRow,
                    isMe ? styles.messageRowRight : styles.messageRowLeft
                  ]}
                >
                  {/* Left Avatar for them */}
                  {!isMe && (
                    <Image source={selectedChat.avatar} style={styles.messageAvatar} />
                  )}

                  <View 
                    style={[
                      styles.messageBubble,
                      isMe ? styles.bubbleRight : styles.bubbleLeft
                    ]}
                  >
                    <Text style={[styles.messageText, isMe ? styles.textRight : styles.textLeft]}>
                      {msg.text}
                    </Text>
                    <View style={styles.bubbleFooter}>
                      <Text style={[styles.messageTime, isMe ? styles.timeRight : styles.timeLeft]}>
                        {msg.time}
                      </Text>
                      {isMe && (
                        <Text style={styles.readIndicator}>
                          {msg.status === 'READ' ? ' • READ' : ' • SENT'}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Message Input Row */}
          <View style={styles.inputToolbar}>
            <TouchableOpacity style={styles.plusButton}>
              <Plus size={22} color="#134074" />
            </TouchableOpacity>

            <TextInput 
              placeholder="Type a message..."
              placeholderTextColor="#94A3B8"
              value={typedMessage}
              onChangeText={setTypedMessage}
              style={styles.textInputBox}
              onSubmitEditing={handleSendMessage}
            />

            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <Send size={18} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        /* Chat List View */
        <View style={{ flex: 1 }}>
          {/* Top Header */}
          <View className="flex-row items-center justify-between px-4 py-4 bg-[#EBF3FC] border-b border-blue-100/50 z-20">
            <View className="flex-row items-center">
              {onBack && (
                <TouchableOpacity onPress={onBack} className="p-1.5 -ml-1 mr-3 rounded-full bg-white shadow-sm border border-slate-100">
                  <ArrowLeft size={18} color="#134074" />
                </TouchableOpacity>
              )}
              <Text className="text-[20px] font-bold text-[#134074]">Secured Chats</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setShowCreateGroup(true)}
              className="bg-[#134074] p-1.5 rounded-full"
            >
              <Plus size={18} color="white" />
            </TouchableOpacity>
          </View>

          {/* Segmented Switcher */}
          <View className="flex-row bg-white border-b border-slate-200/60 shadow-sm z-10">
            <TouchableOpacity
              onPress={() => setActiveSegment('dms')}
              className={`flex-1 py-3.5 items-center border-b-2 ${activeSegment === 'dms' ? 'border-[#134074]' : 'border-transparent'}`}
            >
              <Text className={`font-bold text-sm ${activeSegment === 'dms' ? 'text-[#134074]' : 'text-slate-400'}`}>
                Direct Messages
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveSegment('groups')}
              className={`flex-1 py-3.5 items-center border-b-2 ${activeSegment === 'groups' ? 'border-[#134074]' : 'border-transparent'}`}
            >
              <Text className={`font-bold text-sm ${activeSegment === 'groups' ? 'text-[#134074]' : 'text-slate-400'}`}>
                Community Groups
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            className="flex-1 no-scrollbar" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {/* Search Input */}
            <View className="bg-white border border-slate-200 rounded-xl mx-4 mt-4 mb-4 px-3.5 py-2.5 flex-row items-center shadow-sm">
              <Search size={18} color="#64748b" className="mr-2.5" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={activeSegment === 'dms' ? "Search contacts..." : "Search committees & groups..."}
                placeholderTextColor="#94a3b8"
                className="flex-1 text-slate-800 text-[14px] p-0 font-medium"
              />
            </View>

            {activeSegment === 'dms' ? (
              <View className="mx-4 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm mb-4">
                <View className="divide-y divide-slate-100">
                  {filteredDMs.map((dm) => (
                    <TouchableOpacity 
                      key={dm.id} 
                      onPress={() => setSelectedChat(dm)}
                      className="flex-row items-center p-4 active:bg-slate-50"
                    >
                      <View className="relative">
                        <Image source={dm.avatar} className="w-12 h-12 rounded-full" />
                        <View className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white" />
                      </View>
                      <View className="ml-3.5 flex-1">
                        <View className="flex-row justify-between items-center">
                          <Text className={`font-bold text-[#134074] text-[15px] ${dm.unread ? 'text-[#134074]' : 'text-slate-800'}`}>{dm.name}</Text>
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
              </View>
            ) : (
              <View className="mt-1">
                {filteredGroups.map((group) => (
                  <View key={group.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 mx-4 mb-4 shadow-sm">
                    <View className="flex-row justify-between items-center mb-2.5">
                      <View className="bg-blue-50 px-2 py-0.5 rounded border border-blue-100/30">
                        <Text className="text-[10px] font-bold text-[#134074] uppercase tracking-wide">{group.category}</Text>
                      </View>
                      <View className="flex-row items-center">
                        {group.is_private ? (
                          <>
                            <Lock size={12} color="#94a3b8" />
                            <Text className="text-[10px] text-slate-400 font-semibold uppercase ml-1">Private</Text>
                          </>
                        ) : (
                          <>
                            <Globe size={12} color="#94a3b8" />
                            <Text className="text-[10px] text-slate-400 font-semibold uppercase ml-1">Public</Text>
                          </>
                        )}
                      </View>
                    </View>
                    <Text className="text-base font-extrabold text-[#134074] mb-1">{group.name}</Text>
                    <Text className="text-xs text-slate-500 mb-3">{group.description}</Text>
                    
                    <View className="flex-row justify-between items-center border-t border-slate-100 pt-2.5">
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
        </View>
      )}

      {/* Fallback Bottom Navigation Bar */}
      <View style={styles.footerContainer}>
        <View style={styles.footerTabBar}>
          <TouchableOpacity style={styles.footerTabItem} onPress={() => handleTabPress('Home')}>
            <HomeIcon size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerTabItem} onPress={() => handleTabPress('Analytics')}>
            <BarChart3 size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerTabItem} onPress={() => handleTabPress('Posts')}>
            <Newspaper size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerTabItem} onPress={() => handleTabPress('Connect')}>
            <UsersIcon size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.footerTabItem, styles.footerTabItemActive]} onPress={() => handleTabPress('Directory')}>
            <DirectoryBookIcon color="#70B62C" />
            <Text style={styles.footerTabLabel}>Directory</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  chatHeader: {
    height: 64,
    backgroundColor: '#E9F0FA',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  chatHeaderProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  avatarContainer: {
    position: 'relative',
    width: 40,
    height: 40,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#E9F0FA',
  },
  chatHeaderInfo: {
    marginLeft: 12,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D3866',
  },
  chatStatus: {
    fontSize: 10,
    fontWeight: '800',
    color: '#70B62C',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  moreButton: {
    padding: 8,
    marginRight: -8,
  },
  messagesArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 32,
  },
  dateSeparatorRow: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateSeparatorText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  messageRowLeft: {
    alignSelf: 'flex-start',
    alignItems: 'flex-end',
  },
  messageRowRight: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  bubbleLeft: {
    backgroundColor: '#EBF3FC',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderBottomLeftRadius: 4,
  },
  bubbleRight: {
    backgroundColor: '#103B6B',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 13.5,
    lineHeight: 18,
  },
  textLeft: {
    color: '#334D6E',
  },
  textRight: {
    color: '#FFFFFF',
  },
  bubbleFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 6,
  },
  messageTime: {
    fontSize: 9,
    fontWeight: '600',
  },
  timeLeft: {
    color: '#94A3B8',
  },
  timeRight: {
    color: '#93C5FD',
  },
  readIndicator: {
    fontSize: 9,
    fontWeight: '800',
    color: '#BEF264',
  },
  inputToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputBox: {
    flex: 1,
    height: 38,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 19,
    paddingHorizontal: 16,
    marginHorizontal: 10,
    fontSize: 14,
    color: '#334D6E',
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#103B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    zIndex: 100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  footerTabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  footerTabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  footerTabItemActive: {
    backgroundColor: '#f0fdf4',
  },
  footerTabLabel: {
    color: '#70B62C',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
});

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Modal,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  Image as ImageIcon,
  FileText,
  Link,
  AtSign,
  X,
  Shield,
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCw,
  Camera,
  ThumbsUp,
  Share2,
  Bookmark,
  Info,
  MapPin,
  MessageCircle,
  Mail,
  Megaphone,
  Trash2,
  Settings,
  ArrowUp,
} from 'lucide-react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { dbStore } from '../config/dbStore';

// Svg Icons
const GavelSvg = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14.5 2.5L21.5 9.5M17 12L9 4M7 9l-4 4a2.828 2.828 0 104 4l4-4M19 14.5l-6 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DoubleBubbleSvg = ({ color = '#134074', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 4h-8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h2l3 3v-3h3c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2z" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18 8h2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2h-3l-3 3v-3h-1" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

export const CommunityScreen = ({ onBack, onTabPress, navigation }) => {
  const [activeSegment, setActiveSegment] = useState('communities'); // 'communities', 'reports', 'directory'
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainScrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 300);
  };

  const scrollToTop = () => {
    mainScrollViewRef.current?.scrollTo({
      y: 0,
      animated: true
    });
  };

  // States from dbStore
  const [groups, setGroups] = useState(dbStore.getGroups());
  const [members, setMembers] = useState(dbStore.getMembers());
  const [reports, setReports] = useState([
    {
      id: 'rep_1',
      reporterName: 'Sanjay Ramasamy',
      reportedUser: 'Elena Rodriguez',
      reason: 'Spamming unrelated financial links',
      content: 'Check out this external crypto advisory website: crypto-tax-avoidance.com for tax credits!',
      communityName: 'Announcements (Tax Compliance)',
      communityId: 'tc_announcements',
      reportedUserId: 'elena',
      status: 'Pending',
      date: 'Today, 10:15 AM'
    },
    {
      id: 'rep_2',
      reporterName: 'Ram Kumar',
      reportedUser: 'Sanjeev Senthil',
      reason: 'Inappropriate language & arguments',
      content: 'Your tax calculations are completely stupid and invalid. You have no idea what you are doing.',
      communityName: 'Corporate Tax Auditing',
      communityId: 'tc_corporate',
      reportedUserId: 'sanjeev_s',
      status: 'Pending',
      date: 'Yesterday, 4:20 PM'
    }
  ]);

  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [typedMessage, setTypedMessage] = useState('');
  const [newDiscussionText, setNewDiscussionText] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef(null);

  // Create group form states
  const [groupName, setGroupName] = useState('');
  const [groupCategory, setGroupCategory] = useState('Specialized');
  const [groupDescription, setGroupDescription] = useState('');

  // Admin and management states
  const [detailTab, setDetailTab] = useState('channels'); // 'channels', 'manage'
  const [showAddChannelModal, setShowAddChannelModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelIcon, setNewChannelIcon] = useState('users');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [communityEditName, setCommunityEditName] = useState('');

  // Sync groups & messages from dbStore
  useEffect(() => {
    const updateGroupsAndMembers = () => {
      const allGroups = dbStore.getGroups();
      setGroups([...allGroups]);
      setMembers([...dbStore.getMembers()]);
      
      if (selectedChat) {
        setChatMessages(prev => ({
          ...prev,
          [selectedChat.id]: dbStore.getMessages(selectedChat.id)
        }));
      }

      if (selectedCommunity) {
        const updatedChannels = allGroups.filter(g => g.category === selectedCommunity.name);
        const currentMembers = dbStore.getCommunityMembers ? dbStore.getCommunityMembers(selectedCommunity.name) : [];
        setSelectedCommunity(prev => {
          if (!prev) return null;
          return {
            ...prev,
            channels: updatedChannels,
            membersCount: currentMembers.length > 0 ? `${currentMembers.length} Members` : prev.membersCount
          };
        });
      }
    };
    updateGroupsAndMembers();
    const unsubscribe = dbStore.subscribe(updateGroupsAndMembers);
    return unsubscribe;
  }, [selectedChat, selectedCommunity ? selectedCommunity.name : null]);

  // Keyboard listeners
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 150);
      }
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Filter lists based on search query
  const filteredGroups = groups.filter(group => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return group.name.toLowerCase().includes(query) ||
           group.category.toLowerCase().includes(query) ||
           (group.text && group.text.toLowerCase().includes(query));
  });

  const filteredMembers = members.filter(member => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return member.name.toLowerCase().includes(query) ||
           member.designation.toLowerCase().includes(query) ||
           member.memberId.toLowerCase().includes(query);
  });

  // Handle sending message inside community channels
  const handleSendMessage = () => {
    if (!typedMessage.trim() && !attachedImage) return;

    const textToSend = typedMessage.trim();
    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: 'admin',
      senderName: 'Admin TAS',
      text: textToSend,
      time: 'JUST NOW',
      avatar: require('../../assets/admin_profile.png')
    };

    dbStore.addMessage(selectedChat.id, newMessage);
    setTypedMessage('');
    Keyboard.dismiss();
  };

  // View member profile from directory
  const handleViewMemberProfile = (member) => {
    if (navigation) {
      navigation.navigate('MemberProfile', {
        name: member.name,
        role: member.designation,
        branch: (member.tier === 'Premium' || member.tier === 'Lifetime') ? 'Main Office' : 'Regional Branch',
        tierLabel: member.tierLabel,
        tier: member.tier,
        memberId: member.memberId,
        joinDate: 'Joined: Jan 2021',
        email: `${member.name.toLowerCase().replace(' ', '.').replace('dr.', '')}@tas-governance.org`,
        fullIdCode: `${member.memberId}-SJ-TAS`,
        joinDateFull: 'January 14, 2021',
        firm: member.company,
        avatar: member.avatar
      });
    } else {
      Alert.alert('Profile', `Opening profile of ${member.name}`);
    }
  };

  // Render Category List for Communities
  const renderCategories = () => {
    const categoriesMap = {};
    filteredGroups.forEach(group => {
      const cat = group.category || 'General';
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = [];
      }
      categoriesMap[cat].push(group);
    });

    return Object.keys(categoriesMap).map((catName) => {
      const catGroups = categoriesMap[catName];
      const firstGroup = catGroups[0];
      const categoryBg = firstGroup?.categoryBg || '#E8EAF6';
      const isITC = catName.includes('INTERNATIONAL');
      const avatarBgColor = isITC ? '#E8F5E9' : '#E8EAF6';
      const avatarIconColor = isITC ? '#1B5E20' : '#134074';
      const membersCount = firstGroup?.categoryMembers || '4 Members';

      return (
        <View key={catName} style={styles.networkCategoryContainer}>
          {/* Category Header Row */}
          <TouchableOpacity
            onPress={() => {
              setSelectedCommunity({
                name: catName,
                membersCount: membersCount,
                avatarBg: avatarBgColor,
                avatarColor: avatarIconColor,
                channels: catGroups
              });
              setCommunityEditName(catName);
              setDetailTab('channels');
            }}
            style={styles.networkHeaderRow}
            activeOpacity={0.7}
          >
            <View style={[styles.networkAvatarSquare, { backgroundColor: avatarBgColor }]}>
              <UsersIcon size={18} color={avatarIconColor} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.networkHeaderTitle}>{catName}</Text>
              <Text style={styles.networkHeaderMembers}>{membersCount}</Text>
            </View>
            <ChevronRight size={18} color="#64748B" style={{ marginRight: 4 }} />
          </TouchableOpacity>

          {/* Group Channels List */}
          <View style={styles.channelsCardFrame}>
            {catGroups.map((channel, idx) => (
              <View key={channel.id}>
                <TouchableOpacity
                  onPress={() => setSelectedChat(channel)}
                  style={styles.channelListItemRow}
                >
                  <View style={[styles.channelIconCircle, { backgroundColor: channel.iconBg || '#E8F5E9' }]}>
                    {channel.icon === 'megaphone' ? (
                      <Megaphone size={16} color={channel.iconColor || '#4CAF50'} />
                    ) : (
                      <UsersIcon size={16} color={channel.iconColor || '#FFB300'} />
                    )}
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={[styles.channelItemName, channel.unreadCount > 0 && { fontWeight: '800', color: '#1E293B' }]}>
                        {channel.name}
                      </Text>
                      <Text style={styles.channelItemTime}>{channel.time}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                      <Text style={[styles.channelItemText, channel.unreadCount > 0 && { fontWeight: '600', color: '#0F172A' }]} numberOfLines={1}>
                        {channel.text}
                      </Text>
                      {channel.unreadCount > 0 && (
                        <View style={styles.channelUnreadCountBadge}>
                          <Text style={styles.channelUnreadCountText}>{channel.unreadCount}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
                {idx < catGroups.length - 1 && <View style={styles.channelItemSeparator} />}
              </View>
            ))}
          </View>
        </View>
      );
    });
  };

  const handleRenameCommunity = () => {
    if (!communityEditName.trim()) {
      Alert.alert('Error', 'Please enter a community name.');
      return;
    }
    const oldName = selectedCommunity.name;
    const newName = communityEditName.trim();
    if (oldName === newName) return;

    dbStore.updateGroupCategory(oldName, newName);
    
    if (dbStore.communityMembers && dbStore.communityMembers[oldName]) {
      dbStore.communityMembers[newName] = dbStore.communityMembers[oldName];
      delete dbStore.communityMembers[oldName];
    }

    setSelectedCommunity(prev => ({
      ...prev,
      name: newName
    }));
    Alert.alert('Success', 'Community renamed successfully.');
  };

  const handleAddChannel = () => {
    if (!newChannelName.trim()) {
      Alert.alert('Error', 'Please enter a channel name.');
      return;
    }

    const channelId = selectedCommunity.name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + newChannelName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    const allGroups = dbStore.getGroups();
    if (allGroups.some(g => g.id === channelId)) {
      Alert.alert('Error', 'A channel with this name already exists.');
      return;
    }

    const currentMembersCount = dbStore.getCommunityMembers ? dbStore.getCommunityMembers(selectedCommunity.name).length : 4;

    const newChannel = {
      id: channelId,
      name: newChannelName.trim(),
      category: selectedCommunity.name,
      categoryMembers: `${currentMembersCount} Members`,
      categoryBg: selectedCommunity.avatarBg || '#E8EAF6',
      icon: newChannelIcon,
      iconBg: newChannelIcon === 'megaphone' ? '#E8F5E9' : '#FFF8E1',
      iconColor: newChannelIcon === 'megaphone' ? '#4CAF50' : '#FFB300',
      lastUser: 'System',
      text: `Welcome to the new channel: ${newChannelName.trim()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unreadCount: 0,
    };

    dbStore.addGroupChannel(newChannel);
    
    setNewChannelName('');
    setNewChannelDesc('');
    setShowAddChannelModal(false);
    Alert.alert('Success', 'New channel created successfully.');
  };

  const handleDeleteChannel = (channelId, name) => {
    Alert.alert(
      'Delete Channel',
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            dbStore.deleteGroupChannel(channelId);
            Alert.alert('Deleted', 'Channel has been deleted.');
          }
        }
      ]
    );
  };

  const handleAddMember = (memberId) => {
    dbStore.addMemberToCommunity(selectedCommunity.name, memberId);
    Alert.alert('Success', 'Member added to community.');
  };

  const handleRemoveMember = (memberId, name) => {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${name} from this community?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            dbStore.removeMemberFromCommunity(selectedCommunity.name, memberId);
            Alert.alert('Removed', 'Member removed.');
          }
        }
      ]
    );
  };

  const handleDeleteCommunity = () => {
    Alert.alert(
      'Delete Community',
      `Are you sure you want to delete the entire community "${selectedCommunity.name}"? This will delete all its channels.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dbStore.deleteGroupCategory(selectedCommunity.name);
            if (dbStore.communityMembers) {
              delete dbStore.communityMembers[selectedCommunity.name];
            }
            setSelectedCommunity(null);
            Alert.alert('Deleted', 'Community and all its channels have been deleted.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {selectedChat ? (
        /* Chat Feed Detail View */
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelectedChat(null)} style={styles.backButton}>
              <ArrowLeft size={22} color="#134074" />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.chatHeaderName}>{selectedChat.name}</Text>
              <Text style={styles.chatHeaderStatus}>Community Channel</Text>
            </View>
          </View>

          {/* Messages List */}
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1, backgroundColor: '#F8FAFC' }}
            contentContainerStyle={{ padding: 16 }}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {/* System Info Banner */}
            <View style={styles.systemInfoBanner}>
              <Lock size={12} color="#64748B" style={{ marginRight: 6 }} />
              <Text style={styles.systemInfoText}>This is a secure society channel. Communication is archived.</Text>
            </View>

            {/* Moderation Warning if viewing via reports */}
            {selectedReport && selectedChat.id === selectedReport.communityId && (
              <View style={styles.moderationWarningBox}>
                <Shield size={16} color="#DC2626" style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.moderationWarningTitle}>Report Review Mode</Text>
                  <Text style={styles.moderationWarningText}>
                    Reported by <Text style={{ fontWeight: 'bold' }}>{selectedReport.reporterName}</Text> for: "{selectedReport.reason}"
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedReport(null);
                    Alert.alert('Moderated', 'Report has been reviewed and closed.');
                  }}
                  style={styles.resolveReportBtn}
                >
                  <Text style={styles.resolveReportBtnText}>CLOSE</Text>
                </TouchableOpacity>
              </View>
            )}

            {(chatMessages[selectedChat.id] || selectedChat.messages || []).map((msg) => {
              const isAdmin = msg.sender === 'admin';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageRow,
                    isAdmin ? styles.messageRowRight : styles.messageRowLeft
                  ]}
                >
                  {!isAdmin && <Image source={msg.avatar || require('../../assets/elena_profile.png')} style={styles.messageAvatar} />}
                  <View style={{ maxWidth: '75%' }}>
                    {!isAdmin && <Text style={styles.senderNameLabel}>{msg.senderName}</Text>}
                    <View
                      style={[
                        styles.messageBubble,
                        isAdmin ? styles.bubbleRight : styles.bubbleLeft
                      ]}
                    >
                      <Text style={[styles.messageText, isAdmin ? styles.textRight : styles.textLeft]}>
                        {msg.text}
                      </Text>
                      <Text style={[styles.messageTime, isAdmin ? styles.timeRight : styles.timeLeft]}>
                        {msg.time}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Chat Input */}
          <View
            style={[
              styles.chatInputContainer,
              {
                marginBottom: isKeyboardVisible
                  ? 10
                  : (Platform.OS === 'ios' ? 120 : 138)
              }
            ]}
          >
            <TextInput
              value={typedMessage}
              onChangeText={setTypedMessage}
              placeholder="Broadcast to channel..."
              placeholderTextColor="#94A3B8"
              style={styles.chatInputBox}
              multiline
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <Send size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : selectedCommunity ? (
        /* Category/Community Details View */
        <View style={{ flex: 1 }}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelectedCommunity(null)} style={styles.backButton}>
              <ArrowLeft size={22} color="#134074" />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.chatHeaderName}>{selectedCommunity.name}</Text>
              <Text style={styles.chatHeaderStatus}>{selectedCommunity.membersCount}</Text>
            </View>
          </View>

          {/* Segmented Control */}
          <View style={styles.communitySegmentContainer}>
            <TouchableOpacity
              style={[styles.communitySegmentTab, detailTab === 'channels' && styles.communitySegmentTabActive]}
              onPress={() => setDetailTab('channels')}
            >
              <Text style={[styles.communitySegmentText, detailTab === 'channels' && styles.communitySegmentTextActive]}>
                CHANNELS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.communitySegmentTab, detailTab === 'manage' && styles.communitySegmentTabActive]}
              onPress={() => setDetailTab('manage')}
            >
              <Text style={[styles.communitySegmentText, detailTab === 'manage' && styles.communitySegmentTextActive]}>
                MANAGE COMMUNITY
              </Text>
            </TouchableOpacity>
          </View>
 
          <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC' }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
            {detailTab === 'channels' ? (
              <>
                <Text style={styles.sectionHeaderTitle}>COMMUNITY CHANNELS</Text>
                <View style={styles.channelsCardFrame}>
                  {selectedCommunity.channels.map((channel, idx) => (
                    <View key={channel.id}>
                      <TouchableOpacity
                        onPress={() => setSelectedChat(channel)}
                        style={styles.channelListItemRow}
                      >
                        <View style={[styles.channelIconCircle, { backgroundColor: channel.iconBg || '#E8F5E9' }]}>
                          {channel.icon === 'megaphone' ? (
                            <Megaphone size={16} color={channel.iconColor || '#4CAF50'} />
                          ) : (
                            <UsersIcon size={16} color={channel.iconColor || '#FFB300'} />
                          )}
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={styles.channelItemName}>{channel.name}</Text>
                          <Text style={styles.channelItemText} numberOfLines={1}>{channel.text}</Text>
                        </View>
                        <ChevronRight size={18} color="#64748B" />
                      </TouchableOpacity>
                      {idx < selectedCommunity.channels.length - 1 && <View style={styles.channelItemSeparator} />}
                    </View>
                  ))}
                </View>
              </>
            ) : (
              /* Manage Tab */
              <>
                {/* Rename Section */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 8, gap: 6 }}>
                  <Settings size={14} color="#64748B" />
                  <Text style={[styles.sectionHeaderTitle, { marginHorizontal: 0, marginTop: 0, marginBottom: 0 }]}>COMMUNITY SETTINGS</Text>
                </View>
                <View style={styles.adminCard}>
                  <Text style={styles.adminLabel}>Community Category Name</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                    <TextInput
                      style={styles.adminInput}
                      value={communityEditName}
                      onChangeText={setCommunityEditName}
                      placeholder="Enter community name"
                      placeholderTextColor="#94A3B8"
                    />
                    <TouchableOpacity onPress={handleRenameCommunity} style={styles.adminSaveBtn}>
                      <Text style={styles.adminSaveBtnText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Manage Channels */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <MessageCircle size={14} color="#64748B" />
                    <Text style={[styles.sectionHeaderTitle, { marginHorizontal: 0, marginTop: 0, marginBottom: 0 }]}>MANAGE CHANNELS</Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowAddChannelModal(true)} style={styles.adminActionLink}>
                    <Text style={styles.adminActionLinkText}>+ Add Channel</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.channelsCardFrame}>
                  {selectedCommunity.channels.map((channel, idx) => (
                    <View key={channel.id}>
                      <View style={[styles.channelListItemRow, { justifyContent: 'space-between' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                          <View style={[styles.channelIconCircle, { backgroundColor: channel.iconBg || '#E8F5E9' }]}>
                            {channel.icon === 'megaphone' ? (
                              <Megaphone size={16} color={channel.iconColor || '#4CAF50'} />
                            ) : (
                              <UsersIcon size={16} color={channel.iconColor || '#FFB300'} />
                            )}
                          </View>
                          <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.channelItemName}>{channel.name}</Text>
                          </View>
                        </View>
                        <TouchableOpacity 
                          onPress={() => handleDeleteChannel(channel.id, channel.name)}
                          style={{ padding: 8 }}
                        >
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                      {idx < selectedCommunity.channels.length - 1 && <View style={styles.channelItemSeparator} />}
                    </View>
                  ))}
                </View>

                {/* Manage Members */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <UsersIcon size={14} color="#64748B" />
                    <Text style={[styles.sectionHeaderTitle, { marginHorizontal: 0, marginTop: 0, marginBottom: 0 }]}>MANAGE MEMBERS</Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowAddMemberModal(true)} style={styles.adminActionLink}>
                    <Text style={styles.adminActionLinkText}>+ Add Member</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.channelsCardFrame}>
                  {(() => {
                    const currentMembers = dbStore.getCommunityMembers ? dbStore.getCommunityMembers(selectedCommunity.name) : [];
                    if (currentMembers.length === 0) {
                      return (
                        <View style={{ padding: 16, alignItems: 'center' }}>
                          <Text style={{ color: '#64748B', fontSize: 13 }}>No members in this community.</Text>
                        </View>
                      );
                    }
                    return currentMembers.map((member, idx) => (
                      <View key={member.id}>
                        <View style={[styles.channelListItemRow, { justifyContent: 'space-between' }]}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <Image source={member.avatar || require('../../assets/admin_profile.png')} style={{ width: 32, height: 32, borderRadius: 16 }} />
                            <View style={{ marginLeft: 12 }}>
                              <Text style={[styles.channelItemName, { fontSize: 14 }]}>{member.name}</Text>
                              <Text style={{ color: '#64748B', fontSize: 11 }}>{member.designation}</Text>
                            </View>
                          </View>
                          <TouchableOpacity 
                            onPress={() => handleRemoveMember(member.id, member.name)}
                            style={{ padding: 8 }}
                          >
                            <Trash2 size={16} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                        {idx < currentMembers.length - 1 && <View style={styles.channelItemSeparator} />}
                      </View>
                    ));
                  })()}
                </View>

                {/* Danger Zone */}
                <Text style={[styles.sectionHeaderTitle, { color: '#EF4444', marginTop: 24 }]}>DANGER ZONE</Text>
                <View style={[styles.adminCard, { borderColor: '#FCA5A5', borderWidth: 1 }]}>
                  <Text style={{ color: '#991B1B', fontSize: 13, fontWeight: 'bold' }}>Delete this Community</Text>
                  <Text style={{ color: '#7F1D1D', fontSize: 11, marginTop: 2 }}>This will permanently remove the community category and all its channels.</Text>
                  <TouchableOpacity onPress={handleDeleteCommunity} style={styles.adminDeleteBtn}>
                    <Text style={styles.adminDeleteBtnText}>Delete Community</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      ) : (
        /* Default Switcher Lists */
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.messagesHeaderContainer}>
            {onBack && (
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <ArrowLeft size={22} color="#134074" />
              </TouchableOpacity>
            )}
            <Text style={styles.messagesHeaderTitle}>Community Hub</Text>
          </View>

          {/* Switcher (Segmented Control) */}
          <View style={styles.switcherWrapper}>
            <View style={styles.switcherCapsule}>
              <TouchableOpacity
                onPress={() => { setActiveSegment('communities'); setSearchQuery(''); }}
                style={[styles.switcherTab, activeSegment === 'communities' && styles.switcherTabActive]}
              >
                <Text style={[styles.switcherTabText, activeSegment === 'communities' && styles.switcherTabTextActive]}>
                  Communities
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setActiveSegment('reports'); setSearchQuery(''); }}
                style={[styles.switcherTab, activeSegment === 'reports' && styles.switcherTabActive]}
              >
                <Text style={[styles.switcherTabText, activeSegment === 'reports' && styles.switcherTabTextActive]}>
                  Reports
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Row */}
          <View style={styles.communitySearchRow}>
            <View style={styles.communitySearchContainer}>
              <Search size={18} color="#64748B" style={{ marginRight: 10 }} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={activeSegment === 'communities' ? 'Search communities...' : 'Search reports...'}
                placeholderTextColor="#94A3B8"
                style={{ flex: 1, color: '#1E293B', fontSize: 14, padding: 0 }}
              />
            </View>
          </View>

          <ScrollView ref={mainScrollViewRef} onScroll={handleScroll} scrollEventThrottle={16} style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}>
            {activeSegment === 'communities' ? (
              /* All Communities Tab */
              <View>{renderCategories()}</View>
            ) : (
              /* User Flagged Reports Tab */
              <View style={{ paddingHorizontal: 16 }}>
                <Text style={styles.listTitleText}>User Flagged Reports</Text>
                {reports.length === 0 ? (
                  <View style={styles.emptyFeedCard}>
                    <Text style={styles.emptyFeedText}>No active user reports.</Text>
                  </View>
                ) : (
                  reports.map((report) => (
                    <View key={report.id} style={styles.reportCard}>
                      <View style={styles.reportHeader}>
                        <View style={styles.reportBadge}>
                          <Text style={styles.reportBadgeText}>{report.reason.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.reportDate}>{report.date}</Text>
                      </View>
                      <Text style={styles.reportSubTitle}>
                        <Text style={{ fontWeight: 'bold', color: '#1E293B' }}>{report.reporterName}</Text> reported <Text style={{ fontWeight: 'bold', color: '#1E293B' }}>{report.reportedUser}</Text>
                      </Text>
                      <Text style={styles.reportChannelText}>
                        Channel: <Text style={{ fontWeight: '700', color: '#134074' }}>{report.communityName}</Text>
                      </Text>
                      <View style={styles.reportedContentBox}>
                        <Text style={styles.reportedContentText}>"{report.content}"</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.viewReportBtn}
                        onPress={() => {
                          const catGroups = groups;
                          const channel = catGroups.find(g => g.id === report.communityId);
                          if (channel) {
                            setSelectedChat(channel);
                            setSelectedReport(report);
                          } else {
                            Alert.alert('Error', 'Reported channel could not be found.');
                          }
                        }}
                      >
                        <Text style={styles.viewReportBtnText}>View & Moderate Channel</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            )}
          </ScrollView>

          {/* Floating Action Button (FAB) to Create Community */}
          {activeSegment === 'communities' && (
            <TouchableOpacity
              onPress={() => setShowCreateGroup(true)}
              style={styles.floatingActionButton}
            >
              <Plus size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          {/* Floating Scroll to Top */}
          {showScrollTop && (
            <TouchableOpacity onPress={scrollToTop} style={styles.scrollTopButton} activeOpacity={0.85}>
              <ArrowUp size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Create Group Modal */}
      <Modal
        visible={showCreateGroup}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCreateGroup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Community</Text>
              <TouchableOpacity onPress={() => setShowCreateGroup(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <Text style={styles.inputLabel}>COMMUNITY NAME</Text>
              <TextInput
                value={groupName}
                onChangeText={setGroupName}
                placeholder="e.g. GST Compliance & Filings"
                placeholderTextColor="#94A3B8"
                style={styles.textInput}
              />

              <Text style={styles.inputLabel}>CATEGORY</Text>
              <View style={styles.categoryRow}>
                {['Specialized', 'Regional', 'Ethics'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setGroupCategory(cat)}
                    style={[
                      styles.categoryPill,
                      groupCategory === cat && styles.categoryPillActive
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        groupCategory === cat && styles.categoryPillTextActive
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>DESCRIPTION</Text>
              <TextInput
                value={groupDescription}
                onChangeText={setGroupDescription}
                placeholder="Briefly describe the purpose of this community..."
                placeholderTextColor="#94A3B8"
                style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
                multiline
              />

              <TouchableOpacity
                onPress={() => {
                  if (!groupName.trim()) {
                    Alert.alert('Error', 'Please enter a community name.');
                    return;
                  }
                  dbStore.addGroup({
                    name: groupName.trim(),
                    category: groupCategory,
                    description: groupDescription.trim()
                  });
                  setGroupName('');
                  setGroupDescription('');
                  setShowCreateGroup(false);
                  Alert.alert('Success', 'Community channel has been created.');
                }}
                style={styles.submitBtn}
              >
                <Text style={styles.submitBtnText}>Create Community</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Channel Modal */}
      <Modal
        visible={showAddChannelModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddChannelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Add Channel</Text>
              <TouchableOpacity onPress={() => setShowAddChannelModal(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Channel Name</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="e.g. Tax Audit Standards"
              placeholderTextColor="#94A3B8"
              value={newChannelName}
              onChangeText={setNewChannelName}
            />

            <Text style={styles.inputLabel}>Channel Icon Type</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 6, marginBottom: 12 }}>
              <TouchableOpacity 
                onPress={() => setNewChannelIcon('users')}
                style={[
                  { flex: 1, padding: 12, borderWidth: 1, borderRadius: 8, alignItems: 'center' },
                  newChannelIcon === 'users' ? { borderColor: '#134074', backgroundColor: '#EFF6FF' } : { borderColor: '#CBD5E1' }
                ]}
              >
                <UsersIcon size={20} color={newChannelIcon === 'users' ? '#134074' : '#64748B'} />
                <Text style={{ fontSize: 12, fontWeight: '700', marginTop: 4, color: newChannelIcon === 'users' ? '#134074' : '#64748B' }}>Group Discussion</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setNewChannelIcon('megaphone')}
                style={[
                  { flex: 1, padding: 12, borderWidth: 1, borderRadius: 8, alignItems: 'center' },
                  newChannelIcon === 'megaphone' ? { borderColor: '#134074', backgroundColor: '#EFF6FF' } : { borderColor: '#CBD5E1' }
                ]}
              >
                <Megaphone size={20} color={newChannelIcon === 'megaphone' ? '#134074' : '#64748B'} />
                <Text style={{ fontSize: 12, fontWeight: '700', marginTop: 4, color: newChannelIcon === 'megaphone' ? '#134074' : '#64748B' }}>Announcements</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleAddChannel}
              style={styles.modalSubmitButton}
            >
              <Text style={styles.modalSubmitButtonText}>Add Channel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        visible={showAddMemberModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddMemberModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentCard, { maxHeight: '80%' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Add Member</Text>
              <TouchableOpacity onPress={() => setShowAddMemberModal(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              {(() => {
                const currentMemberIds = dbStore.communityMembers && selectedCommunity ? dbStore.communityMembers[selectedCommunity.name] || [] : [];
                const availableMembers = members.filter(m => !currentMemberIds.includes(m.id) && !currentMemberIds.includes(m.memberId));
                
                if (availableMembers.length === 0) {
                  return (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ color: '#64748B', textAlign: 'center' }}>All available members are already in this community.</Text>
                    </View>
                  );
                }

                return availableMembers.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    onPress={() => {
                      handleAddMember(member.id);
                      setShowAddMemberModal(false);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: '#F1F5F9'
                    }}
                  >
                    <Image source={member.avatar || require('../../assets/admin_profile.png')} style={{ width: 36, height: 36, borderRadius: 18 }} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>{member.name}</Text>
                      <Text style={{ fontSize: 11, color: '#64748B' }}>{member.designation} • {member.company}</Text>
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#134074' }}>+ ADD</Text>
                  </TouchableOpacity>
                ));
              })()}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  messagesHeaderContainer: {
    height: 56,
    backgroundColor: '#EBF3FC',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 20
  },
  backButton: {
    padding: 6,
    marginRight: 6
  },
  messagesHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#134074'
  },
  switcherWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#EBF3FC',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE'
  },
  switcherCapsule: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 3
  },
  switcherTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12
  },
  switcherTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  switcherTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B'
  },
  switcherTabTextActive: {
    color: '#134074'
  },
  communitySearchRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  communitySearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  listTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#134074',
    marginVertical: 16
  },
  networkCategoryContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    // Premium shadow instead of top/bottom borders
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  networkHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  networkAvatarSquare: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  networkHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#134074'
  },
  networkHeaderMembers: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600'
  },
  channelsCardFrame: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  channelListItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14
  },
  channelIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  channelItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B'
  },
  channelItemTime: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600'
  },
  channelItemText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    flex: 1
  },
  channelUnreadCountBadge: {
    backgroundColor: '#70B62C',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8
  },
  channelUnreadCountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800'
  },
  channelItemSeparator: {
    height: 1,
    backgroundColor: '#F1F5F9'
  },
  floatingActionButton: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#70B62C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 10
  },
  chatHeader: {
    height: 56,
    backgroundColor: '#EBF3FC',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#134074'
  },
  chatHeaderStatus: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '600'
  },
  systemInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    justifyContent: 'center'
  },
  systemInfoText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600'
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end'
  },
  messageRowLeft: {
    justifyContent: 'flex-start'
  },
  messageRowRight: {
    justifyContent: 'flex-end'
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 2
  },
  senderNameLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 4,
    marginBottom: 4
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  bubbleLeft: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  bubbleRight: {
    backgroundColor: '#134074',
    borderBottomRightRadius: 4
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20
  },
  textLeft: {
    color: '#334155'
  },
  textRight: {
    color: '#FFFFFF'
  },
  messageTime: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
    fontWeight: '600'
  },
  timeLeft: {
    color: '#94A3B8'
  },
  timeRight: {
    color: '#93C5FD'
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0'
  },
  chatInputBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 14,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#134074',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  emptyFeedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10
  },
  emptyFeedText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600'
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  reportBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6
  },
  reportBadgeText: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '800'
  },
  reportDate: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600'
  },
  reportSubTitle: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8
  },
  reportChannelText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12
  },
  reportedContentBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
    marginBottom: 16
  },
  reportedContentText: {
    fontStyle: 'italic',
    color: '#475569',
    fontSize: 13,
    lineHeight: 18
  },
  viewReportBtn: {
    backgroundColor: '#134074',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  viewReportBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  moderationWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },
  moderationWarningTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#991B1B'
  },
  moderationWarningText: {
    fontSize: 11,
    color: '#991B1B',
    marginTop: 2
  },
  resolveReportBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10
  },
  resolveReportBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  conversationsCardFrame: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden'
  },
  dmListItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14
  },
  squareRoundedAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  dmItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B'
  },
  dmItemText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4
  },
  tierPill: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  tierPillText: {
    color: '#1E40AF',
    fontSize: 9,
    fontWeight: '800'
  },
  itemSeparatorLine: {
    height: 1,
    backgroundColor: '#F1F5F9'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#134074'
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1E293B'
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 10
  },
  categoryPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  categoryPillActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#22C55E'
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B'
  },
  categoryPillTextActive: {
    color: '#22C55E'
  },
  submitBtn: {
    backgroundColor: '#70B62C',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  communitySegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  communitySegmentTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  communitySegmentTabActive: {
    borderBottomColor: '#70B62C',
  },
  communitySegmentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  communitySegmentTextActive: {
    color: '#70B62C',
  },
  adminCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  adminLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#134074',
  },
  adminInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1E293B',
  },
  adminSaveBtn: {
    backgroundColor: '#134074',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  adminActionLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  adminActionLinkText: {
    color: '#134074',
    fontSize: 13,
    fontWeight: '800',
  },
  adminDeleteBtn: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  adminDeleteBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 86,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0D3866',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 99
  },
});

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
  User,
  Calendar,
  ArrowUp,
} from 'lucide-react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { supabase } from '../config/supabase';
import { dbStore } from '../config/dbStore';
import * as ImagePicker from 'expo-image-picker';

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

// Keypad 3x3 Dots Grid Icon
const KeypadIcon = ({ color = '#0A345C' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="5" cy="5" r="2.2" fill={color} />
    <Circle cx="12" cy="5" r="2.2" fill={color} />
    <Circle cx="19" cy="5" r="2.2" fill={color} />
    <Circle cx="5" cy="12" r="2.2" fill={color} />
    <Circle cx="12" cy="12" r="2.2" fill={color} />
    <Circle cx="19" cy="12" r="2.2" fill={color} />
    <Circle cx="5" cy="19" r="2.2" fill={color} />
    <Circle cx="12" cy="19" r="2.2" fill={color} />
    <Circle cx="19" cy="19" r="2.2" fill={color} />
  </Svg>
);

// Gavel / Scales Icon
const GavelSvg = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14.5 2.5L21.5 9.5M17 12L9 4M7 9l-4 4a2.828 2.828 0 104 4l4-4M19 14.5l-6 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Landmark / classical building icon
const LandmarkSvg = ({ color = '#134074', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 22h18M5 10v10M19 10v10M12 10v10M9 10v10M15 10v10M3 10l9-7 9 7M2 22h20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Custom overlapping double bubble icon
const DoubleBubbleSvg = ({ color = '#134074', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 4h-8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h2l3 3v-3h3c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2z" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18 8h2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2h-3l-3 3v-3h-1" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

export const MessagesScreen = ({ onBack, onTabPress, route, navigation }) => {
  const [activeSegment, setActiveSegment] = useState(route?.params?.activeSegment || 'dms'); // Default to Direct Messages (Message)
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);

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

  // Create group form states
  const [groupName, setGroupName] = useState('');
  const [groupCategory, setGroupCategory] = useState('Specialized');
  const [groupDescription, setGroupDescription] = useState('');

  // Selected chat details
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupFilter, setGroupFilter] = useState('All Groups');
  const [newDiscussionText, setNewDiscussionText] = useState('');

  const [showNewMessage, setShowNewMessage] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState(['Elena Rodriguez']);
  const [typedMessage, setTypedMessage] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedDocument, setAttachedDocument] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const listScrollViewRef = useRef(null);

  const handleScrollList = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 300);
  };
  const scrollToTopList = () => {
    listScrollViewRef.current?.scrollTo({
      y: 0,
      animated: true
    });
  };

  // Secure Calling Session States
  const [activeCall, setActiveCall] = useState(null);
  const [callType, setCallType] = useState('voice'); // 'voice' or 'video'
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  // Automatic Call Timer Effect
  useEffect(() => {
    let timerInterval = null;
    if (activeCall === 'audio' || activeCall === 'video') {
      setCallDuration(0);
      timerInterval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
      setIsMuted(false);
      setIsSpeakerOn(false);
      setIsVideoMuted(false);
      setIsFrontCamera(true);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [activeCall]);

  const formatCallTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  // Sync state from dbStore
  const [groups, setGroups] = useState(dbStore.getGroups());
  const [dms, setDms] = useState(dbStore.getDms());
  const [chatMessages, setChatMessages] = useState({});

  useEffect(() => {
    const updateChatAndDms = () => {
      setDms([...dbStore.getDms()]);
      setGroups([...dbStore.getGroups()]);
      if (selectedChat) {
        setChatMessages(prev => ({
          ...prev,
          [selectedChat.id]: dbStore.getMessages(selectedChat.id)
        }));
      }
    };
    updateChatAndDms();
    const unsubscribe = dbStore.subscribe(updateChatAndDms);
    return unsubscribe;
  }, [selectedChat]);

  // Mark selected chat as read when opened
  useEffect(() => {
    if (selectedChat) {
      dbStore.markDmAsRead(selectedChat.id);
    }
  }, [selectedChat]);

  // Scroll to bottom of chat list on open
  useEffect(() => {
    if (selectedChat) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [selectedChat, chatMessages]);

  // Handle resetting screen state when screen receives focus
  useEffect(() => {
    if (navigation) {
      const unsubscribe = navigation.addListener('focus', () => {
        const params = route?.params;
        if (params?.activeSegment) {
          setSelectedChat(null);
          setSelectedGroup(null);
          setShowNewMessage(false);
          setActiveSegment(params.activeSegment);
          setSelectedCommunity(null);
          navigation.setParams({ activeSegment: null });
          return;
        }
        if (params?.groupId) {
          const grp = dbStore.getGroups().find(g => g.id === params.groupId);
          if (grp) {
            setSelectedGroup(grp);
            setSelectedChat(null);
            setShowNewMessage(false);
            setActiveSegment('groups');
            navigation.setParams({ groupId: null });
            return;
          }
        }
        if (params?.chatId) {
          const chat = dbStore.getDms().find(d => d.id === params.chatId);
          if (chat) {
            setSelectedChat(chat);
            setSelectedGroup(null);
            setShowNewMessage(false);
            setActiveSegment('dms');
            navigation.setParams({ chatId: null });
            return;
          }
        }
        setSelectedChat(null);
        setSelectedGroup(null);
        setShowNewMessage(false);
        setActiveSegment('dms');
        setSelectedCommunity(null);
      });
      return unsubscribe;
    }
  }, [navigation, route]);

  const handleCreateGroup = () => {
    if (!groupName || !groupDescription) {
      Alert.alert('Incomplete Fields', 'Please fill in the group name and description.');
      return;
    }

    const newGroup = {
      id: `group_${Date.now()}`,
      name: groupName,
      category: groupCategory,
      badge: groupCategory.toUpperCase(),
      description: groupDescription,
      member_count: 1,
      icon: 'chat'
    };

    // Add to store
    dbStore.groups = [newGroup, ...dbStore.groups];
    dbStore.groupPosts[newGroup.id] = [];
    dbStore.notify();

    setGroupName('');
    setGroupDescription('');
    setShowCreateGroup(false);
    Alert.alert('Success', `Group "${groupName}" created successfully!`);
  };

  const handlePhotoPress = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need gallery permissions to attach photos!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAttachedImage(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick image from device.');
    }
  };

  const handleDocPress = () => {
    Alert.alert('Select Document', 'Choose a file to attach:', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Q3 Financial Guidelines.pdf', onPress: () => setAttachedDocument('Q3 Financial Guidelines.pdf') },
      { text: 'Annual Audit Report.pdf', onPress: () => setAttachedDocument('Annual Audit Report.pdf') }
    ]);
  };

  const handleLinkPress = () => {
    Alert.alert('Attach Link', 'You can type or paste links directly into the text input box.');
  };

  const handleMentionPress = () => {
    if (selectedChat) {
      setTypedMessage(prev => `${prev} @${selectedChat.name} `.trim());
    }
  };

  const handleSendMessage = () => {
    if ((!typedMessage.trim() && !attachedImage && !attachedDocument) || !selectedChat) return;

    const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'me',
      text: typedMessage.trim(),
      time: newTime,
      status: 'SENT',
      image: attachedImage || undefined,
      document: attachedDocument || undefined
    };

    dbStore.addMessage(selectedChat.id, newMsg);

    setTypedMessage('');
    setAttachedImage(null);
    setAttachedDocument(null);
    setShowAttachmentMenu(false);
  };

  const handleTabPress = (tabName) => {
    if (navigation) {
      navigation.navigate('MainTabs', { screen: tabName });
    } else if (onTabPress) {
      onTabPress(tabName);
    }
  };

  // Contact Search and Selection compiling
  const staticContacts = [
    { id: 'elena', name: 'Elena Rodriguez', designation: 'Senior Tax Consultant', avatar: require('../../assets/elena_profile.png') },
    { id: 'marcus_c', name: 'Marcus Chen', designation: 'Regional Audit Director', avatar: require('../../assets/admin_profile.png') },
    { id: 'sarah_h', name: 'Sarah Henderson', designation: 'Compliance Officer', initials: 'SH', initialsBg: '#134074', initialsColor: '#FFFFFF' },
    { id: 'sanjay_r', name: 'Sanjay Ramasamy', designation: 'Senior Tax Consultant', avatar: require('../../assets/admin_profile.png') },
    { id: 'ram_k', name: 'Ram Kumar', designation: 'Audit Director', avatar: require('../../assets/admin_profile.png') },
    { id: 'sanjeev_s', name: 'Sanjeev Senthil', designation: 'Forensic Accountant', avatar: require('../../assets/admin_profile.png') },
    { id: 'janice_l', name: 'Janice L.', designation: 'Recent Member', avatar: require('../../assets/elena_profile.png') },
    { id: 'robert_d', name: 'Robert D.', designation: 'Recent Member', avatar: require('../../assets/admin_profile.png') },
    { id: 'emily_k', name: 'Emily K.', designation: 'Recent Member', avatar: require('../../assets/elena_profile.png') },
    { id: 'saja', name: 'Saja', designation: 'Recent Member', avatar: require('../../assets/elena_profile.png') },
  ];

  const memberContacts = (groups && dbStore.getMembers() || []).map(m => ({
    id: m.id || m.memberId,
    name: m.name,
    designation: m.designation || m.company,
    avatar: m.avatar
  }));

  const approvedContacts = (groups && dbStore.getApprovedList() || []).map(a => ({
    id: a.id,
    name: a.user_name,
    designation: a.designation,
    avatar: a.avatar
  }));

  const allContactsMap = new Map();
  [...staticContacts, ...memberContacts, ...approvedContacts].forEach(c => {
    if (c && c.name) {
      allContactsMap.set(c.name.toLowerCase(), c);
    }
  });
  const allContacts = Array.from(allContactsMap.values());

  const filteredContacts = allContacts.filter(c => 
    c.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) || 
    (c.designation && c.designation.toLowerCase().includes(contactSearchQuery.toLowerCase()))
  );

  const handleContactPress = async (contact) => {
    const dm = await dbStore.getOrCreateDm(contact.id, contact.name, contact.avatar);
    setSelectedChat(dm);
    setShowNewMessage(false);
    setContactSearchQuery('');
  };

  // Filters
  const filteredDMs = dms.filter(dm =>
    dm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dm.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentChatMsgs = selectedChat ? (chatMessages[selectedChat.id] || []) : [];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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

            <TouchableOpacity
              onPress={() => {
                if (navigation && !selectedChat.category) {
                  const isElena = selectedChat.name.includes('Elena');
                  const isAlistair = selectedChat.name.includes('Alistair');
                  navigation.navigate('MemberProfile', {
                    name: selectedChat.name,
                    role: isElena ? 'Partner' : isAlistair ? 'Chief Auditor' : 'Senior Auditor',
                    branch: (isAlistair || isElena) ? 'Main Office' : 'Regional Branch',
                    tierLabel: isAlistair || isElena ? 'Lifetime Fellow' : 'Premium Member',
                    tier: isAlistair || isElena ? 'Lifetime' : 'Premium',
                    memberId: isAlistair ? 'TAS-9920-PL' : isElena ? 'TAS-4412-SR' : 'TAS-2024-8842',
                    joinDate: 'Joined: Jan 2021',
                    email: isAlistair ? 'a.vance@tas-governance.org' : isElena ? 'elena.rodriguez@tas-governance.org' : 's.jenkins@pkf-international.com',
                    avatar: selectedChat.avatar
                  });
                } else if (selectedChat.category) {
                  Alert.alert('Group Info', `${selectedChat.name}\nCategory: ${selectedChat.category}`);
                }
              }}
              style={styles.chatHeaderProfile}
            >
              <View style={styles.avatarContainer}>
                {selectedChat.avatar ? (
                  <Image source={selectedChat.avatar} style={styles.chatAvatar} />
                ) : selectedChat.initials ? (
                  <View style={[styles.chatAvatar, { backgroundColor: selectedChat.initialsBg || '#E2FBE8', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: selectedChat.initialsColor || '#0D3866', fontWeight: 'bold', fontSize: 14 }}>{selectedChat.initials}</Text>
                  </View>
                ) : (
                  <View style={[styles.chatAvatar, { backgroundColor: selectedChat.iconBg || '#E8F5E9', justifyContent: 'center', alignItems: 'center' }]}>
                    {selectedChat.icon === 'megaphone' ? (
                      <Megaphone size={16} color={selectedChat.iconColor || '#4CAF50'} />
                    ) : (
                      <UsersIcon size={16} color={selectedChat.iconColor || '#FFB300'} />
                    )}
                  </View>
                )}
                <View style={[styles.onlineDot, { backgroundColor: selectedChat.online ? '#22C55E' : '#94A3B8' }]} />
              </View>
              <View style={styles.chatHeaderInfo}>
                <Text style={styles.chatName}>{selectedChat.name}</Text>
                <Text style={[
                  styles.chatStatus,
                  dbStore.getTypingStatus(selectedChat.id) === 'typing...' && { color: '#00A884', fontWeight: '900', fontStyle: 'italic' }
                ]}>
                  {selectedChat.category ? `${selectedChat.category}` : dbStore.getTypingStatus(selectedChat.id)}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {!selectedChat.category && (
                <>
                  <TouchableOpacity
                    style={styles.callHeaderButton}
                    onPress={() => {
                      setCallType('video');
                      setActiveCall('video');
                    }}
                    activeOpacity={0.7}
                  >
                    <Video size={22} color="#134074" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.callHeaderButton}
                    onPress={() => {
                      setCallType('voice');
                      setActiveCall('audio');
                    }}
                    activeOpacity={0.7}
                  >
                    <Phone size={22} color="#134074" />
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity 
                style={styles.moreButton} 
                onPress={() => {
                  if (selectedChat.category) {
                    Alert.alert(
                      'Options', 
                      'Select options:',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Edit Details', 
                          onPress: () => {
                            navigation.navigate('EditDetails', { 
                              type: 'community',
                              communityData: {
                                id: selectedChat.id,
                                name: selectedChat.name,
                                description: selectedChat.text || 'Tax and auditing collaboration channel.',
                                category: selectedChat.category,
                                membersCount: '4 Members'
                              }
                            });
                          } 
                        }
                      ]
                    );
                  } else {
                    Alert.alert('Options', 'Direct message options.');
                  }
                }}
              >
                <MoreVertical size={22} color="#134074" />
              </TouchableOpacity>
            </View>
          </View>

          {selectedReport && selectedChat && selectedChat.id === selectedReport.communityId && (
            <View style={styles.moderationBanner}>
              <View style={styles.moderationBannerHeader}>
                <Shield size={16} color="#DC2626" style={{ marginRight: 6 }} />
                <Text style={styles.moderationBannerTitle}>Active Report: {selectedReport.reason}</Text>
                <TouchableOpacity onPress={() => setSelectedReport(null)} style={styles.moderationCloseBtn}>
                  <X size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
              <Text style={styles.moderationReportedText}>
                <Text style={{ fontWeight: 'bold' }}>Reported User: </Text>{selectedReport.reportedUser}
              </Text>
              <Text style={styles.moderationContentText} numberOfLines={2}>
                "{selectedReport.content}"
              </Text>
              <View style={styles.moderationActionsRow}>
                <TouchableOpacity 
                  style={[styles.moderationActionBtn, { backgroundColor: '#F59E0B' }]} 
                  onPress={() => {
                    Alert.alert(
                      'Close Channel', 
                      `Are you sure you want to close the channel "${selectedChat.name}"?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Close Channel', 
                          onPress: () => {
                            selectedChat.text = "🔒 Channel closed by administrator.";
                            selectedChat.unreadCount = 0;
                            dbStore.notify();
                            setSelectedReport(null);
                            setSelectedChat(null);
                            Alert.alert('Success', 'The channel has been closed.');
                          } 
                        }
                      ]
                    );
                  }}
                >
                  <Text style={styles.moderationActionBtnText}>Close Channel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.moderationActionBtn, { backgroundColor: '#EF4444' }]} 
                  onPress={() => {
                    Alert.alert(
                      'Delete Channel', 
                      `Are you sure you want to delete the channel "${selectedChat.name}"?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Delete', 
                          style: 'destructive',
                          onPress: () => {
                            dbStore.groups = dbStore.groups.filter(g => g.id !== selectedChat.id);
                            dbStore.notify();
                            setSelectedReport(null);
                            setSelectedChat(null);
                            Alert.alert('Success', 'The channel has been deleted.');
                          } 
                        }
                      ]
                    );
                  }}
                >
                  <Text style={styles.moderationActionBtnText}>Delete Channel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.moderationActionBtn, { backgroundColor: '#3B82F6' }]} 
                  onPress={() => {
                    const userDm = dms.find(d => d.id === selectedReport.reportedUserId);
                    if (userDm) {
                      setSelectedChat(userDm);
                      setSelectedReport(null);
                      setTypedMessage(`WARNING: You have been reported in "${selectedReport.communityName}" for: "${selectedReport.reason}". Please adhere to the community guidelines.`);
                    } else {
                      const newDm = {
                        id: selectedReport.reportedUserId,
                        name: selectedReport.reportedUser,
                        text: 'Active warning',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        unread: false,
                        viewed: true,
                        online: true,
                        initials: selectedReport.reportedUser.split(' ').map(n => n[0]).join(''),
                        initialsBg: '#FEE2E2',
                        initialsColor: '#991B1B',
                        avatar: null
                      };
                      dbStore.dms = [newDm, ...dbStore.dms];
                      dbStore.notify();
                      setSelectedChat(newDm);
                      setSelectedReport(null);
                      setTypedMessage(`WARNING: You have been reported in "${selectedReport.communityName}" for: "${selectedReport.reason}". Please adhere to the community guidelines.`);
                    }
                  }}
                >
                  <Text style={styles.moderationActionBtnText}>Send Warning</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Messages Timeline */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesArea}
            contentContainerStyle={[
              styles.messagesContent,
              { paddingBottom: isKeyboardVisible ? 20 : 120 }
            ]}
            showsVerticalScrollIndicator={false}
          >
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
                  {!isMe && (
                    selectedChat.avatar ? (
                      <Image source={selectedChat.avatar} style={styles.messageAvatar} />
                    ) : selectedChat.initials ? (
                      <View style={[styles.messageAvatar, { backgroundColor: selectedChat.initialsBg || '#E9F0FA', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ color: selectedChat.initialsColor || '#134074', fontWeight: 'bold', fontSize: 10 }}>{selectedChat.initials}</Text>
                      </View>
                    ) : (
                      <View style={[styles.messageAvatar, { backgroundColor: selectedChat.iconBg || '#E8F5E9', justifyContent: 'center', alignItems: 'center' }]}>
                        {selectedChat.icon === 'megaphone' ? (
                          <Megaphone size={12} color={selectedChat.iconColor || '#4CAF50'} />
                        ) : (
                          <UsersIcon size={12} color={selectedChat.iconColor || '#FFB300'} />
                        )}
                      </View>
                    )
                  )}

                  <View style={{ flex: 1, alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    {!isMe && msg.senderName && (
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', marginLeft: 8, marginBottom: 2 }}>{msg.senderName}</Text>
                    )}
                    <View
                      style={[
                        styles.messageBubble,
                        isMe ? styles.bubbleRight : styles.bubbleLeft
                      ]}
                    >
                      {msg.image && (
                        <Image
                          source={{ uri: msg.image }}
                          style={{ width: 200, height: 150, borderRadius: 8, marginBottom: 6 }}
                          resizeMode="cover"
                        />
                      )}

                      {msg.document && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isMe ? '#0f325c' : '#dbeafe', borderRadius: 8, padding: 8, marginBottom: 6 }}>
                          <FileText size={18} color={isMe ? '#FFFFFF' : '#134074'} style={{ marginRight: 6 }} />
                          <Text style={{ fontSize: 13, color: isMe ? '#FFFFFF' : '#134074', fontWeight: 'bold' }}>
                            {msg.document}
                          </Text>
                        </View>
                      )}

                      {msg.text ? (
                        <Text style={[styles.messageText, isMe ? styles.textRight : styles.textLeft]}>
                          {msg.text}
                        </Text>
                      ) : null}

                      <View style={styles.bubbleFooter}>
                        <Text style={[styles.messageTime, isMe ? styles.timeRight : styles.timeLeft]}>
                          {msg.time}
                        </Text>
                        {isMe && (
                          <View style={{ marginLeft: 4, alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                            {msg.status === 'READ' ? (
                              <Svg width="14" height="10" viewBox="0 0 16 12" fill="none">
                                <Path d="M1.5 5.5l3.5 3.5 9.5-9" stroke="#53BDEB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <Path d="M5.5 5.5l3.5 3.5 5.5-5" stroke="#53BDEB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                              </Svg>
                            ) : (
                              <Svg width="14" height="10" viewBox="0 0 16 12" fill="none">
                                <Path d="M1.5 5.5l3.5 3.5 9.5-9" stroke="#8696A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <Path d="M5.5 5.5l3.5 3.5 5.5-5" stroke="#8696A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                              </Svg>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Chat Input Toolbar */}
          <View
            style={[
              styles.inputToolbarContainer,
              {
                marginBottom: isKeyboardVisible
                  ? 10
                  : (Platform.OS === 'ios' ? 90 : 76)
              }
            ]}
          >
            {showAttachmentMenu && (
              <View style={styles.attachmentOptionsRow}>
                <TouchableOpacity onPress={handlePhotoPress} style={styles.attachmentOptionItem}>
                  <View style={styles.attachmentIconCircle}>
                    <ImageIcon size={18} color="#134074" />
                  </View>
                  <Text style={styles.attachmentOptionText}>Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleDocPress} style={styles.attachmentOptionItem}>
                  <View style={styles.attachmentIconCircle}>
                    <FileText size={18} color="#134074" />
                  </View>
                  <Text style={styles.attachmentOptionText}>Document</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleLinkPress} style={styles.attachmentOptionItem}>
                  <View style={styles.attachmentIconCircle}>
                    <Link size={18} color="#134074" />
                  </View>
                  <Text style={styles.attachmentOptionText}>Link</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleMentionPress} style={styles.attachmentOptionItem}>
                  <View style={styles.attachmentIconCircle}>
                    <AtSign size={18} color="#134074" />
                  </View>
                  <Text style={styles.attachmentOptionText}>Mention</Text>
                </TouchableOpacity>
              </View>
            )}

            {(attachedImage || attachedDocument) && (
              <View style={styles.attachmentPreviewsContainer}>
                {attachedImage && (
                  <View style={styles.previewTag}>
                    <ImageIcon size={14} color="#103B6B" style={{ marginRight: 4 }} />
                    <Text numberOfLines={1} style={styles.previewTagText}>Photo attached</Text>
                    <TouchableOpacity onPress={() => setAttachedImage(null)} style={styles.removePreviewBtn}>
                      <X size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                )}
                {attachedDocument && (
                  <View style={styles.previewTag}>
                    <FileText size={14} color="#103B6B" style={{ marginRight: 4 }} />
                    <Text numberOfLines={1} style={styles.previewTagText}>{attachedDocument}</Text>
                    <TouchableOpacity onPress={() => setAttachedDocument(null)} style={styles.removePreviewBtn}>
                      <X size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            <View style={styles.inputControlsRow}>
              <TouchableOpacity
                onPress={() => setShowAttachmentMenu(!showAttachmentMenu)}
                style={styles.plusButton}
              >
                {showAttachmentMenu ? <X size={22} color="#134074" /> : <Plus size={22} color="#134074" />}
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
          </View>
        </KeyboardAvoidingView>
      ) : selectedCommunity ? (
        /* WhatsApp-style Community Detail View */
        <View style={{ flex: 1, backgroundColor: '#F4F7FC' }}>
          {/* Header */}
          <View style={styles.whatsappHeader}>
            <TouchableOpacity onPress={() => setSelectedCommunity(null)} style={styles.whatsappBackBtn}>
              <ArrowLeft size={22} color="#134074" />
            </TouchableOpacity>
            <Text style={styles.whatsappHeaderTitle} numberOfLines={1}>
              {selectedCommunity.name}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                Alert.alert(
                  'Community Options',
                  'Select action:',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Edit Details', 
                      onPress: () => {
                        navigation.navigate('EditDetails', { 
                          type: 'community',
                          communityData: {
                            id: selectedCommunity.name,
                            name: selectedCommunity.name,
                            description: 'Tax and auditing collaboration network for registered professionals.',
                            category: selectedCommunity.name,
                            membersCount: selectedCommunity.membersCount
                          }
                        });
                      } 
                    }
                  ]
                );
              }}
              style={styles.whatsappOptionsBtn}
            >
              <MoreVertical size={22} color="#134074" />
            </TouchableOpacity>
          </View>
 
          <ScrollView style={{ flex: 1, backgroundColor: '#F4F7FC' }} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Announcements Card */}
            <View style={styles.whatsappAnnouncementCard}>
              <TouchableOpacity 
                onPress={() => {
                  const annChannel = selectedCommunity.channels.find(c => c.name.toLowerCase().includes('announce'));
                  if (annChannel) {
                    setSelectedChat(annChannel);
                  } else if (selectedCommunity.channels.length > 0) {
                    setSelectedChat(selectedCommunity.channels[0]);
                  }
                }}
                style={styles.whatsappAnnRow}
              >
                <View style={[styles.whatsappAnnIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <Megaphone size={20} color="#134074" />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.whatsappAnnTitle}>Announcements</Text>
                    <Text style={styles.whatsappAnnDate}>06/06/2026</Text>
                  </View>
                  <Text style={styles.whatsappAnnSubtitle} numberOfLines={1}>
                    ~Admin TAS: 📄 Resources are updated...
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Groups you're in Section */}
            <View style={styles.whatsappSectionHeader}>
              <Text style={styles.whatsappSectionHeaderText}>Groups you're in</Text>
            </View>

            {/* Add Group Row */}
            <TouchableOpacity 
              onPress={() => setShowCreateGroup(true)}
              style={styles.whatsappAddGroupRow}
            >
              <View style={styles.whatsappAddGroupIconCircle}>
                <Plus size={20} color="#134074" />
              </View>
              <Text style={styles.whatsappAddGroupText}>Add group</Text>
            </TouchableOpacity>

            {/* Joined Channels List */}
            {selectedCommunity.channels.map((channel) => (
              <TouchableOpacity 
                key={channel.id} 
                onPress={() => {
                  setSelectedChat(channel);
                }}
                style={styles.whatsappChannelRow}
              >
                <View style={[styles.whatsappChannelIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <UsersIcon size={18} color="#134074" />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.whatsappChannelTitle}>{channel.name}</Text>
                    <Text style={styles.whatsappChannelTime}>{channel.time}</Text>
                  </View>
                  <Text style={styles.whatsappChannelSubtitle} numberOfLines={1}>
                    {channel.text}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Groups you can join Section */}
            <View style={styles.whatsappSectionHeader}>
              <Text style={styles.whatsappSectionHeaderText}>Groups you can join</Text>
            </View>

            {/* Mock Groups you can join */}
            <TouchableOpacity 
              onPress={() => Alert.alert('Request Sent', 'Your request to join JUNIORS #2 has been sent.')}
              style={styles.whatsappChannelRow}
            >
              <View style={[styles.whatsappChannelIconCircle, { backgroundColor: '#EFF6FF' }]}>
                <UsersIcon size={18} color="#134074" />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.whatsappChannelTitle}>JUNIORS #2</Text>
                <Text style={styles.whatsappChannelSubtitle}>173 members</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => Alert.alert('Request Sent', 'Your request to join Seniors has been sent.')}
              style={styles.whatsappChannelRow}
            >
              <View style={[styles.whatsappChannelIconCircle, { backgroundColor: '#EFF6FF' }]}>
                <UsersIcon size={18} color="#134074" />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.whatsappChannelTitle}>{selectedCommunity.name.split(' ')[0]} - Seniors (3rd & Final Year)</Text>
                <Text style={styles.whatsappChannelSubtitle}>Request to join</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : selectedGroup ? (
        /* Community Group Feed View (Image 1) */
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.groupFeedHeader}>
            <TouchableOpacity onPress={() => setSelectedGroup(null)} style={styles.backButton}>
              <ArrowLeft size={22} color="#134074" />
            </TouchableOpacity>
            <Text style={styles.groupFeedHeaderTitle}>Community</Text>
            <TouchableOpacity style={styles.infoButton} onPress={() => Alert.alert('Info', `About ${selectedGroup.name}`)}>
              <Info size={22} color="#134074" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1, backgroundColor: '#F4F7FB' }}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Group Profile/Info Block Card */}
            <View style={styles.groupInfoCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View style={styles.groupLogoLargeSquare}>
                  {selectedGroup.icon === 'gavel' ? (
                    <GavelSvg color="#FFFFFF" size={32} />
                  ) : selectedGroup.icon === 'location' ? (
                    <MapPin color="#FFFFFF" size={32} />
                  ) : selectedGroup.icon === 'chat' ? (
                    <MessageCircle color="#FFFFFF" size={32} />
                  ) : (
                    <Shield color="#FFFFFF" size={32} fill="#FFFFFF" />
                  )}
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={styles.groupTitleText}>
                    {selectedGroup.id === 'tax_ethics' ? 'Tax Ethics & Compliance' : selectedGroup.name}
                  </Text>
                  <Text style={styles.groupDescriptionText}>
                    {selectedGroup.description || 'Discussing the latest regulatory changes and ethical standards.'}
                  </Text>
                </View>
              </View>

              <View style={styles.groupMetaRow}>
                <Text style={styles.groupMetaText}>{(selectedGroup.member_count ?? 1).toLocaleString()} Members</Text>
                <View style={styles.verifiedSocietyBadge}>
                  <Shield size={12} color="#15803D" style={{ marginRight: 4 }} />
                  <Text style={styles.verifiedSocietyBadgeText}>Verified Society</Text>
                </View>
              </View>
            </View>

            {/* Start a discussion Card */}
            <View style={styles.startDiscussionCard}>
              <View style={styles.discussionUserIconWrapper}>
                <UsersIcon size={18} color="#134074" />
              </View>
              <TextInput
                placeholder="Start a discussion in this group..."
                placeholderTextColor="#64748B"
                style={styles.startDiscussionInput}
                value={newDiscussionText}
                onChangeText={setNewDiscussionText}
                onSubmitEditing={() => {
                  if (!newDiscussionText.trim()) return;
                  const newPost = {
                    id: `gp_${Date.now()}`,
                    authorName: 'Admin TAS',
                    authorRole: 'COMMUNITY MODERATOR',
                    time: 'JUST NOW',
                    avatar: require('../../assets/admin_profile.png'),
                    title: 'New Discussion Thread',
                    body: newDiscussionText.trim(),
                    likes: 0,
                    comments: 0,
                    shares: 0,
                    bookmarked: false
                  };
                  dbStore.addGroupPost(selectedGroup.id, newPost);
                  setNewDiscussionText('');
                  Alert.alert('Discussion Posted', 'Your discussion post has been uploaded to the group.');
                }}
              />
              <TouchableOpacity style={{ padding: 4 }} onPress={() => Alert.alert('Attach Photo', 'Select a photo to attach to your discussion.')}>
                <ImageIcon size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Posts List */}
            <View style={{ paddingHorizontal: 16 }}>
              {dbStore.getGroupPosts(selectedGroup.id).length === 0 ? (
                <View style={styles.emptyFeedCard}>
                  <Text style={styles.emptyFeedText}>No discussions started yet. Be the first to start a discussion!</Text>
                </View>
              ) : (
                dbStore.getGroupPosts(selectedGroup.id).map((post) => (
                  <View key={post.id} style={styles.postCard}>
                    {/* Post Author Header */}
                    <View style={styles.postHeaderRow}>
                      {post.authorName === 'Marcus Thorne' ? (
                        <View style={styles.postLandmarkAvatarWrapper}>
                          <LandmarkSvg color="#134074" size={20} />
                        </View>
                      ) : (
                        <Image source={post.avatar || require('../../assets/admin_profile.png')} style={styles.postAuthorAvatar} />
                      )}
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.postAuthorName}>{post.authorName}</Text>
                        <Text style={styles.postAuthorRole}>{post.authorRole} • {post.time}</Text>
                      </View>
                    </View>

                    {/* Post Content */}
                    <Text style={styles.postTitleText}>{post.title}</Text>
                    <Text style={styles.postBodyText}>{post.body}</Text>

                    {/* Elena Rodriguez Post: Impact Analysis Callout Card */}
                    {post.impactAnalysis && (
                      <View style={styles.impactAnalysisCard}>
                        <Text style={styles.impactAnalysisHeader}>IMPACT ANALYSIS</Text>
                        <Text style={styles.impactAnalysisText}>{post.impactAnalysis.text}</Text>
                      </View>
                    )}

                    {/* Marcus Thorne Post: Blue Tags pills */}
                    {post.tags && (
                      <View style={styles.tagsContainer}>
                        {post.tags.map((tag) => (
                          <View key={tag} style={styles.tagPill}>
                            <Text style={styles.tagPillText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Footer divider */}
                    <View style={styles.postCardDivider} />

                    {/* Post Card Footer Actions */}
                    <View style={styles.postFooterActionsRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                          onPress={() => dbStore.likeGroupPost(selectedGroup.id, post.id)}
                          style={styles.postFooterActionItem}
                        >
                          <ThumbsUp size={16} color="#64748B" />
                          <Text style={styles.postFooterActionText}>{post.likes}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => Alert.alert('Comments', 'Opening comments section')}
                          style={[styles.postFooterActionItem, { marginLeft: 16 }]}
                        >
                          <MessageSquare size={16} color="#64748B" />
                          <Text style={styles.postFooterActionText}>{post.comments}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => Alert.alert('Share', 'Post shared to external channels')}
                          style={[styles.postFooterActionItem, { marginLeft: 16 }]}
                        >
                          <Share2 size={16} color="#64748B" />
                          <Text style={styles.postFooterActionText}>{post.shares}</Text>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        onPress={() => dbStore.bookmarkGroupPost(selectedGroup.id, post.id)}
                        style={{ padding: 4 }}
                      >
                        <Bookmark
                          size={18}
                          color={post.bookmarked ? '#103B6B' : '#64748B'}
                          fill={post.bookmarked ? '#103B6B' : 'none'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>

          {/* Group Feed Footer bottom tabs bar */}
          {!isKeyboardVisible && (
            <View style={styles.footerContainer}>
              <View style={styles.footerTabBar}>
                <TouchableOpacity style={styles.footerTabItem} onPress={() => handleTabPress('Home')}>
                  <HomeIcon size={24} color="#134074" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.footerTabItem} onPress={() => handleTabPress('Analytics')}>
                  <BarChart3 size={24} color="#134074" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.footerTabItem} onPress={() => handleTabPress('Posts')}>
                  <Newspaper size={24} color="#134074" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.footerTabItem} onPress={() => handleTabPress('Connect')}>
                  <UsersIcon size={24} color="#134074" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : showNewMessage ? (
        /* New Message Screen */
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.messagesHeaderContainer}>
            <TouchableOpacity onPress={() => { setShowNewMessage(false); setContactSearchQuery(''); }} style={styles.backButton}>
              <ArrowLeft size={22} color="#134074" />
            </TouchableOpacity>
            <Text style={styles.messagesHeaderTitle}>New Message</Text>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            {/* To: Search Card */}
            <View style={styles.searchCardContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
                <Text style={styles.searchCardToLabel}>To:</Text>

                <TextInput
                  placeholder="Search members..."
                  placeholderTextColor="#94A3B8"
                  style={styles.searchCardInput}
                  value={contactSearchQuery}
                  onChangeText={setContactSearchQuery}
                />
              </View>

              <View style={styles.searchCardWarningRow}>
                <Shield size={14} color="#64748B" style={{ marginRight: 6 }} />
                <Text style={styles.searchCardWarningText}>Messages will be end-to-end encrypted.</Text>
              </View>
            </View>

            {/* Suggested Contacts Section */}
            <Text style={styles.sectionHeaderTitle}>
              {contactSearchQuery ? 'SEARCH RESULTS' : 'SUGGESTED CONTACTS'}
            </Text>

            <View style={styles.suggestedListContainer}>
              {filteredContacts.length === 0 ? (
                <View style={{ padding: 16, alignItems: 'center' }}>
                  <Text style={{ color: '#64748B', fontSize: 14 }}>No contacts found matching search.</Text>
                </View>
              ) : (
                filteredContacts.map(contact => (
                  <TouchableOpacity
                    key={contact.id}
                    onPress={() => handleContactPress(contact)}
                    style={styles.suggestedItemRow}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <View style={styles.avatarWrapper}>
                        {contact.avatar ? (
                          <Image source={contact.avatar} style={styles.suggestedAvatar} />
                        ) : (
                          <View style={[styles.suggestedAvatar, { backgroundColor: contact.initialsBg || '#134074', justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={{ color: contact.initialsColor || '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>
                              {contact.initials || contact.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </Text>
                          </View>
                        )}
                        <View style={[styles.statusDot, { backgroundColor: '#22C55E' }]} />
                      </View>
                      <View style={{ marginLeft: 12 }}>
                        <Text style={styles.suggestedName}>{contact.name}</Text>
                        <Text style={styles.suggestedRole}>{contact.designation || 'TAS Member'}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </ScrollView>
        </View>
      ) : (
        /* Chat List View */
        <View style={{ flex: 1 }}>
          {/* Top Header */}
          <View style={styles.messagesHeaderContainer}>
            {onBack && (
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <ArrowLeft size={22} color="#134074" />
              </TouchableOpacity>
            )}
            <Text style={styles.messagesHeaderTitle}>Messages</Text>
          </View>

          <ScrollView
            ref={listScrollViewRef}
            onScroll={handleScrollList}
            scrollEventThrottle={16}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View>
              {/* Search Row with Requests */}
              <View style={styles.searchRowWithRequests}>
                <View style={styles.listSearchInputBoxContainer}>
                  <Search size={18} color="#64748B" style={{ marginRight: 10 }} />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search..."
                    placeholderTextColor="#94A3B8"
                    style={{ flex: 1, color: '#1E293B', fontSize: 14, padding: 0 }}
                  />
                </View>
              </View>

              <View style={{ paddingHorizontal: 16 }}>
                {/* Recent Conversations Row */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={styles.listTitleText}>Recent Conversations</Text>

                  {/* UNREAD badge */}
                  {dms.filter(d => d.unread).length > 0 ? (
                    <View style={styles.unreadCountBadge}>
                      <Text style={styles.unreadCountBadgeText}>
                        {dms.filter(d => d.unread).length} UNREAD
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Conversations card */}
                <View style={styles.conversationsCardFrame}>
                  {filteredDMs.map((dm, index) => (
                    <View key={dm.id}>
                      <TouchableOpacity
                        onPress={() => setSelectedChat(dm)}
                        style={styles.dmListItemRow}
                      >
                        <View style={styles.avatarWrapper}>
                          {dm.avatar ? (
                            <Image source={dm.avatar} style={styles.squareRoundedAvatar} />
                          ) : (
                            <View style={[styles.squareRoundedAvatar, { backgroundColor: dm.initialsBg || '#E2FBE8' }]}>
                              <Text style={[styles.avatarInitialsText, { color: dm.initialsColor || '#0D3866' }]}>
                                {dm.initials}
                              </Text>
                            </View>
                          )}
                          <View style={[styles.statusDot, { backgroundColor: dm.online ? '#22C55E' : '#94A3B8' }]} />
                        </View>

                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={[styles.dmItemName, dm.unread && { fontWeight: '800', color: '#1E293B' }]}>{dm.name}</Text>
                            <Text style={styles.dmItemTime}>{dm.time}</Text>
                          </View>
                          <Text style={[styles.dmItemText, dm.unread && { fontWeight: '600', color: '#0F172A' }]} numberOfLines={1}>
                            {dm.text}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {index < filteredDMs.length - 1 && <View style={styles.itemSeparatorLine} />}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Floating Action Button (FAB) */}
          <TouchableOpacity
            onPress={() => {
              setShowNewMessage(true);
            }}
            style={styles.floatingActionButton}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Floating Scroll to Top */}
          {showScrollTop && (
            <TouchableOpacity onPress={scrollToTopList} style={styles.scrollTopButton} activeOpacity={0.85}>
              <ArrowUp size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Create Group Modal */}
      <Modal
        visible={showCreateGroup}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateGroup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Create New Group</Text>
              <TouchableOpacity onPress={() => setShowCreateGroup(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.inputLabel}>Group Name</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Enter group name"
                placeholderTextColor="#94A3B8"
                value={groupName}
                onChangeText={setGroupName}
              />

              <Text style={styles.inputLabel}>Category</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Specialized, Regional Chapters, Public, etc."
                placeholderTextColor="#94A3B8"
                value={groupCategory}
                onChangeText={setGroupCategory}
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.modalTextInput, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Describe the group's purpose"
                placeholderTextColor="#94A3B8"
                value={groupDescription}
                onChangeText={setGroupDescription}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity
                onPress={handleCreateGroup}
                style={styles.modalSubmitButton}
              >
                <Text style={styles.modalSubmitButtonText}>Create Group</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Calling Modals */}
      <Modal
        visible={activeCall === 'incoming'}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setActiveCall(null)}
      >
        <SafeAreaView style={styles.incomingCallContainer}>
          <View style={styles.gradientTopWash} />
          <View style={styles.gradientBottomWash} />

          <View style={styles.incomingHeader}>
            <View style={styles.greenLiveDot} />
            <Text style={styles.incomingHeaderText}>Incoming Call</Text>
          </View>

          <View style={styles.incomingAvatarSection}>
            <View style={styles.doubleBorderOuter}>
              <View style={styles.doubleBorderInner}>
                {selectedChat && selectedChat.avatar ? (
                  <Image source={selectedChat.avatar} style={styles.doubleBorderImage} />
                ) : (
                  <View style={[styles.doubleBorderImage, { backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' }]}>
                    <UsersIcon size={48} color="#94A3B8" />
                  </View>
                )}
              </View>
            </View>

            <Text style={styles.incomingCallerName}>{selectedChat ? selectedChat.name : 'Sarah oenkins'}</Text>
            <Text style={styles.incomingCallerRole}>Senior Auditor • Fiscal Dept</Text>
          </View>

          <View style={styles.incomingActionsSection}>
            <View style={styles.actionButtonColumn}>
              <TouchableOpacity
                onPress={() => {
                  if (callType === 'voice') {
                    setActiveCall('audio');
                  } else {
                    setActiveCall('video');
                  }
                }}
                style={styles.acceptButtonCircle}
              >
                <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="#FFFFFF" />
                </Svg>
              </TouchableOpacity>
              <Text style={styles.actionButtonLabel}>ACCEPT</Text>
            </View>

            <View style={styles.actionButtonColumn}>
              <TouchableOpacity
                onPress={() => setActiveCall(null)}
                style={styles.declineButtonCircle}
              >
                <Svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: '135deg' }] }}>
                  <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="#FFFFFF" />
                </Svg>
              </TouchableOpacity>
              <Text style={styles.actionButtonLabel}>DECLINE</Text>
            </View>
          </View>

          <View style={styles.quickMessageContainer}>
            <View style={styles.quickMessageDivider} />
            <TouchableOpacity
              onPress={() => {
                setActiveCall(null);
                Alert.alert('Quick Message', 'Choose a message to reply:', [
                  { text: 'In a meeting, call you back.', onPress: () => Alert.alert('Reply Sent', '"In a meeting..." sent.') },
                  { text: 'Can I call you later?', onPress: () => Alert.alert('Reply Sent', '"Can I call you later?" sent.') },
                  { text: 'Cancel', style: 'cancel' }
                ]);
              }}
              style={styles.quickMessageButton}
            >
              <MessageSquare size={18} color="#3A5666" style={{ marginRight: 8 }} />
              <Text style={styles.quickMessageText}>Quick Message</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={activeCall === 'audio'}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setActiveCall(null)}
      >
        <SafeAreaView style={styles.premiumCallWrapper}>
          <View style={styles.premiumCallContent}>
            {/* Top Security Banner */}
            <View style={styles.topEncryptBadge}>
              <Lock size={12} color="#F59E0B" style={{ marginRight: 6 }} />
              <Text style={styles.topEncryptText}>END-TO-END ENCRYPTED</Text>
            </View>

            {/* Caller Name */}
            <Text style={styles.callCallerName}>
              {selectedChat ? selectedChat.name : 'Jameson Thorne'}
            </Text>

            {/* Call Status / Duration */}
            <Text style={styles.callStatusText}>
              {callDuration === 0 ? 'Ringing...' : formatCallTime(callDuration)}
            </Text>

            {/* Circular Avatar Initials */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.centerInitialsCircle}>
                <Text style={styles.centerInitialsText}>
                  {(selectedChat ? selectedChat.name : 'Jameson Thorne')
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Translucent Controls Card Capsule */}
            <View style={styles.bottomControlsCapsule}>
              {/* Speaker Button */}
              <TouchableOpacity
                onPress={() => setIsSpeakerOn(!isSpeakerOn)}
                style={[
                  styles.callControlRoundBtn,
                  isSpeakerOn ? styles.callControlRoundBtnActive : styles.callControlRoundBtnInactive
                ]}
              >
                {isSpeakerOn ? (
                  <Volume2 size={22} color="#0B0F19" />
                ) : (
                  <VolumeX size={22} color="#FFFFFF" />
                )}
              </TouchableOpacity>

              {/* Video Toggle */}
              <TouchableOpacity
                onPress={() => setIsVideoMuted(!isVideoMuted)}
                style={[
                  styles.callControlRoundBtn,
                  !isVideoMuted ? styles.callControlRoundBtnActive : styles.callControlRoundBtnInactive
                ]}
              >
                {!isVideoMuted ? (
                  <Video size={22} color="#0B0F19" />
                ) : (
                  <VideoOff size={22} color="#FFFFFF" />
                )}
              </TouchableOpacity>

              {/* Microphone Button */}
              <TouchableOpacity
                onPress={() => setIsMuted(!isMuted)}
                style={[
                  styles.callControlRoundBtn,
                  isMuted ? styles.callControlRoundBtnActive : styles.callControlRoundBtnInactive
                ]}
              >
                {isMuted ? (
                  <MicOff size={22} color="#0B0F19" />
                ) : (
                  <Mic size={22} color="#FFFFFF" />
                )}
              </TouchableOpacity>

              {/* Red Hangup Button */}
              <TouchableOpacity
                onPress={() => setActiveCall(null)}
                style={styles.callHangUpBtn}
              >
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: '135deg' }] }}>
                  <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="#FFFFFF" />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Mock Tab Bar */}
          <View style={styles.mockTabBarContainer}>
            <TouchableOpacity style={styles.mockTabItem}>
              <HomeIcon size={22} color="#134074" />
            </TouchableOpacity>
            <View style={styles.mockTabItemActive}>
              <MessageCircle size={20} color="#70B62C" />
              <Text style={styles.mockTabActiveText}>Chat</Text>
            </View>
            <TouchableOpacity style={styles.mockTabItem}>
              <UsersIcon size={22} color="#134074" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mockTabItem}>
              <Calendar size={22} color="#134074" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mockTabItem}>
              <User size={22} color="#134074" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={activeCall === 'video'}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setActiveCall(null)}
      >
        {callDuration === 0 ? (
          <SafeAreaView style={styles.premiumCallWrapper}>
            <View style={styles.premiumCallContent}>
              {/* Top Security Banner */}
              <View style={styles.topEncryptBadge}>
                <Lock size={12} color="#F59E0B" style={{ marginRight: 6 }} />
                <Text style={styles.topEncryptText}>END-TO-END ENCRYPTED</Text>
              </View>

              {/* Caller Name */}
              <Text style={styles.callCallerName}>
                {selectedChat ? selectedChat.name : 'Jameson Thorne'}
              </Text>

              {/* Call Status / Duration */}
              <Text style={styles.callStatusText}>Ringing...</Text>

              {/* Circular Avatar Initials */}
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.centerInitialsCircle}>
                  <Text style={styles.centerInitialsText}>
                    {(selectedChat ? selectedChat.name : 'Jameson Thorne')
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Translucent Controls Card Capsule */}
              <View style={styles.bottomControlsCapsule}>
                {/* Speaker Button */}
                <TouchableOpacity
                  onPress={() => setIsSpeakerOn(!isSpeakerOn)}
                  style={[
                    styles.callControlRoundBtn,
                    isSpeakerOn ? styles.callControlRoundBtnActive : styles.callControlRoundBtnInactive
                  ]}
                >
                  {isSpeakerOn ? (
                    <Volume2 size={22} color="#0B0F19" />
                  ) : (
                    <VolumeX size={22} color="#FFFFFF" />
                  )}
                </TouchableOpacity>

                {/* Video Toggle */}
                <TouchableOpacity
                  onPress={() => setIsVideoMuted(!isVideoMuted)}
                  style={[
                    styles.callControlRoundBtn,
                    !isVideoMuted ? styles.callControlRoundBtnActive : styles.callControlRoundBtnInactive
                  ]}
                >
                  {!isVideoMuted ? (
                    <Video size={22} color="#0B0F19" />
                  ) : (
                    <VideoOff size={22} color="#FFFFFF" />
                  )}
                </TouchableOpacity>

                {/* Microphone Button */}
                <TouchableOpacity
                  onPress={() => setIsMuted(!isMuted)}
                  style={[
                    styles.callControlRoundBtn,
                    isMuted ? styles.callControlRoundBtnActive : styles.callControlRoundBtnInactive
                  ]}
                >
                  {isMuted ? (
                    <MicOff size={22} color="#0B0F19" />
                  ) : (
                    <Mic size={22} color="#FFFFFF" />
                  )}
                </TouchableOpacity>

                {/* Red Hangup Button */}
                <TouchableOpacity
                  onPress={() => setActiveCall(null)}
                  style={styles.callHangUpBtn}
                >
                  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: '135deg' }] }}>
                    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="#FFFFFF" />
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom Mock Tab Bar */}
            <View style={styles.mockTabBarContainer}>
              <TouchableOpacity style={styles.mockTabItem}>
                <HomeIcon size={22} color="#134074" />
              </TouchableOpacity>
              <View style={styles.mockTabItemActive}>
                <MessageCircle size={20} color="#70B62C" />
                <Text style={styles.mockTabActiveText}>Chat</Text>
              </View>
              <TouchableOpacity style={styles.mockTabItem}>
                <UsersIcon size={22} color="#134074" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mockTabItem}>
                <Calendar size={22} color="#134074" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mockTabItem}>
                <User size={22} color="#134074" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        ) : (
          <View style={styles.videoBackground}>
            {selectedChat && selectedChat.avatar ? (
              <Image source={selectedChat.avatar} style={styles.videoBgImage} resizeMode="cover" />
            ) : (
              <View style={[styles.videoBgImage, { backgroundColor: '#0F172A' }]} />
            )}
            <View style={styles.videoOverlayDark} />

            <View style={styles.videoPipWindow}>
              {isVideoMuted ? (
                <View style={styles.videoPipMutedOverlay}>
                  <VideoOff size={24} color="#64748B" />
                </View>
              ) : (
                <>
                  <Image
                    source={require('../../assets/logo_icon.png')}
                    style={styles.videoPipImage}
                    resizeMode="cover"
                  />
                  <View style={styles.videoPipLabel}>
                    <Text style={styles.videoPipLabelText}>You</Text>
                  </View>
                </>
              )}
            </View>

            <SafeAreaView style={[StyleSheet.absoluteFillObject, { justifyContent: 'space-between', paddingBottom: 0 }]}>
              <View style={[styles.premiumCallContent, { flex: 1, paddingBottom: 0 }]}>
                {/* Top Security Banner */}
                <View style={[styles.topEncryptBadge, { marginTop: Platform.OS === 'android' ? 40 : 20 }]}>
                  <Lock size={12} color="#F59E0B" style={{ marginRight: 6 }} />
                  <Text style={styles.topEncryptText}>END-TO-END ENCRYPTED</Text>
                </View>

                {/* Caller Name */}
                <Text style={styles.callCallerName}>
                  {selectedChat ? selectedChat.name : 'Jameson Thorne'}
                </Text>

                {/* Call Status / Duration */}
                <Text style={styles.callStatusText}>
                  {formatCallTime(callDuration)}
                </Text>

                {/* Spacer */}
                <View style={{ flex: 1 }} />

                {/* Translucent Controls Card Capsule */}
                <View style={[styles.bottomControlsCapsule, { marginBottom: 20 }]}>
                  {/* Speaker Button */}
                  <TouchableOpacity
                    onPress={() => setIsSpeakerOn(!isSpeakerOn)}
                    style={[
                      styles.callControlRoundBtn,
                      isSpeakerOn ? styles.callControlRoundBtnActive : styles.callControlRoundBtnInactive
                    ]}
                  >
                    {isSpeakerOn ? (
                      <Volume2 size={22} color="#0B0F19" />
                    ) : (
                      <VolumeX size={22} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>

                  {/* Video Toggle */}
                  <TouchableOpacity
                    onPress={() => setIsVideoMuted(!isVideoMuted)}
                    style={[
                      styles.callControlRoundBtn,
                      !isVideoMuted ? styles.callControlRoundBtnActive : styles.callControlRoundBtnInactive
                    ]}
                  >
                    {!isVideoMuted ? (
                      <Video size={22} color="#0B0F19" />
                    ) : (
                      <VideoOff size={22} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>

                  {/* Microphone Button */}
                  <TouchableOpacity
                    onPress={() => setIsMuted(!isMuted)}
                    style={[
                      styles.callControlRoundBtn,
                      isMuted ? styles.callControlRoundBtnActive : styles.callControlRoundBtnInactive
                    ]}
                  >
                    {isMuted ? (
                      <MicOff size={22} color="#0B0F19" />
                    ) : (
                      <Mic size={22} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>

                  {/* Red Hangup Button */}
                  <TouchableOpacity
                    onPress={() => setActiveCall(null)}
                    style={styles.callHangUpBtn}
                  >
                    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: '135deg' }] }}>
                      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="#FFFFFF" />
                    </Svg>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bottom Mock Tab Bar */}
              <View style={styles.mockTabBarContainer}>
                <TouchableOpacity style={styles.mockTabItem}>
                  <HomeIcon size={22} color="#134074" />
                </TouchableOpacity>
                <View style={styles.mockTabItemActive}>
                  <MessageCircle size={20} color="#70B62C" />
                  <Text style={styles.mockTabActiveText}>Chat</Text>
                </View>
                <TouchableOpacity style={styles.mockTabItem}>
                  <UsersIcon size={22} color="#134074" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.mockTabItem}>
                  <Calendar size={22} color="#134074" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.mockTabItem}>
                  <User size={22} color="#134074" />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC'
  },
  chatHeader: {
    height: 64,
    backgroundColor: '#EBF3FC',
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
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  callHeaderButton: {
    padding: 8,
    marginRight: 10,
  },
  moreButton: {
    padding: 8,
    marginRight: -8,
  },
  messagesArea: {
    flex: 1,
    backgroundColor: '#efeae2',
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 120,
  },
  dateSeparatorRow: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateSeparatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  messageRowLeft: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 2,
  },
  bubbleRight: {
    backgroundColor: '#D9FDD3',
    borderWidth: 0.5,
    borderColor: '#C1E9BA',
    borderBottomRightRadius: 2,
  },
  messageText: {
    fontSize: 13.5,
    lineHeight: 18,
  },
  textLeft: {
    color: '#1F2937',
  },
  textRight: {
    color: '#1F2937',
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
    color: '#8696A0',
  },
  timeRight: {
    color: '#8696A0',
  },
  inputToolbarContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: Platform.OS === 'ios' ? 90 : 76,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  attachmentOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
    marginBottom: 8,
    width: '100%',
  },
  attachmentOptionItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  attachmentIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  attachmentOptionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  attachmentPreviewsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  previewTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  previewTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#103B6B',
    maxWidth: 150,
  },
  removePreviewBtn: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#64748B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  plusButton: {
    padding: 8,
  },
  textInputBox: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    fontSize: 14,
    color: '#1E293B',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
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
  incomingCallContainer: {
    flex: 1,
    backgroundColor: '#EBF5EB',
    justifyContent: 'space-between',
    paddingVertical: 40,
    alignItems: 'center',
    position: 'relative',
  },
  gradientTopWash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
    backgroundColor: '#CADBD0',
    opacity: 0.5,
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 180,
  },
  gradientBottomWash: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: '#B8C7D2',
    opacity: 0.4,
  },
  incomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    zIndex: 5,
  },
  greenLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#70B62C',
    marginRight: 8,
  },
  incomingHeaderText: {
    color: '#0A345C',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  incomingAvatarSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    zIndex: 5,
  },
  doubleBorderOuter: {
    width: 200,
    height: 200,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: '#D0DFD0',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  doubleBorderInner: {
    width: 174,
    height: 174,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#C0D5C0',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doubleBorderImage: {
    width: 156,
    height: 156,
    borderRadius: 16,
  },
  incomingCallerName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0A345C',
    marginBottom: 6,
  },
  incomingCallerRole: {
    fontSize: 14,
    color: '#5C746A',
    fontWeight: '600',
  },
  incomingActionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
    marginVertical: 20,
    zIndex: 5,
  },
  actionButtonColumn: {
    alignItems: 'center',
  },
  acceptButtonCircle: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#70B62C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#70B62C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  declineButtonCircle: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#B51B14',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#B51B14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  actionButtonLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5C746A',
    letterSpacing: 1,
  },
  quickMessageContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 5,
    paddingBottom: 20,
  },
  quickMessageDivider: {
    width: '85%',
    height: 1,
    backgroundColor: '#D0DDD2',
    marginBottom: 20,
  },
  quickMessageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  quickMessageText: {
    color: '#3A5666',
    fontSize: 13,
    fontWeight: '700',
  },
  ongoingBadgeContainer: {
    backgroundColor: '#C6F4B7',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 5,
    marginTop: 15,
  },
  ongoingBadgeText: {
    color: '#276C12',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ongoingTimerText: {
    color: '#0A345C',
    fontSize: 44,
    fontWeight: '900',
    zIndex: 5,
    marginTop: 15,
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    marginVertical: 14,
  },
  waveBar: {
    backgroundColor: '#43603F',
    width: 4,
    borderRadius: 2,
    marginHorizontal: 3,
  },
  ongoingControlsContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 5,
    paddingBottom: 20,
  },
  ongoingControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  ongoingControlButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A3BCA2',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  ongoingControlButtonActive: {
    backgroundColor: '#3A5666',
    borderColor: '#3A5666',
  },
  ongoingControlText: {
    color: '#5C746A',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 8,
  },
  controlItem: {
    alignItems: 'center',
  },
  hangUpButtonRoundedSquare: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#B51B14',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#B51B14',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  videoBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
  },
  videoBgImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  videoOverlayDark: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.1)',
  },
  videoPipWindow: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    width: 100,
    height: 150,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  videoPipImage: {
    width: '100%',
    height: '100%',
  },
  videoPipMutedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPipLabel: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoPipLabelText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  videoBottomControlsCard: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(23, 49, 84, 0.95)',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  videoControlsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-around',
    marginRight: 15,
  },
  videoOverlayButton: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoOverlayButtonActive: {
    backgroundColor: '#EF4444',
  },
  videoControlsDivider: {
    width: 1,
    height: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 15,
  },
  videoHangupButton: {
    width: 56,
    height: 46,
    borderRadius: 10,
    backgroundColor: '#B51B14',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesHeaderContainer: {
    height: 64,
    backgroundColor: '#EBF3FC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#CFDFE9',
  },
  messagesHeaderTitle: {
    color: '#134074',
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 12,
  },
  searchCardContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchCardToLabel: {
    color: '#134074',
    fontSize: 15,
    fontWeight: '800',
    marginRight: 10,
  },
  selectedToken: {
    backgroundColor: '#1E3E6C',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 6,
  },
  selectedTokenText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  searchCardInput: {
    flex: 1,
    minWidth: 100,
    fontSize: 14,
    color: '#1E293B',
    padding: 0,
  },
  searchCardWarningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    marginTop: 4,
  },
  searchCardWarningText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.5,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  suggestedListContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  suggestedItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
  },
  avatarWrapper: {
    position: 'relative',
    width: 44,
    height: 44,
  },
  suggestedAvatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  statusDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  suggestedName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  suggestedRole: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  plusCircleButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusCircleText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentMemberColumn: {
    alignItems: 'center',
    width: 68,
  },
  recentAvatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
    marginBottom: 6,
  },
  recentMemberName: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    textAlign: 'center',
  },
  startChatLargeButton: {
    backgroundColor: '#0E3866',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    marginTop: 30,
    shadowColor: '#0E3866',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  startChatLargeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  switcherWrapper: {
    backgroundColor: '#DCE8FC',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  switcherCapsule: {
    backgroundColor: '#AEC9F8',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 3,
  },
  switcherTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  switcherTabActive: {
    backgroundColor: '#134074',
  },
  switcherTabText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#134074',
  },
  switcherTabTextActive: {
    color: '#FFFFFF',
  },
  listSearchInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 16,
  },
  listTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#134074',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  unreadCountBadge: {
    backgroundColor: '#70B62C',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  unreadCountBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  conversationsCardFrame: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  dmListItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  dmItemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  dmItemTime: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  dmItemText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  itemSeparatorLine: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
  },
  floatingActionButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 86,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0E3866',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0E3866',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },

  /* Community Group List Styles */
  filterPillsScrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
  },
  filterPillBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillBtnActive: {
    backgroundColor: '#0D3866',
    borderColor: '#0D3866',
  },
  filterPillBtnInactive: {
    backgroundColor: '#E9F0FA',
    borderColor: '#DBEAFE',
  },
  filterPillBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  filterPillBtnTextActive: {
    color: '#FFFFFF',
  },
  filterPillBtnTextInactive: {
    color: '#134074',
  },
  groupCardItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  groupCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupIconWrapperSquare: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupCategoryBadge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  groupCategoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  groupCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#134074',
    marginBottom: 6,
  },
  groupCardDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  groupCardSeparator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  groupCardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupCardMembersText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  groupViewButton: {
    backgroundColor: '#70B62C',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  groupViewButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  /* Group Feed Detailed View Styles */
  groupFeedHeader: {
    height: 64,
    backgroundColor: '#E9F0FA',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  groupFeedHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#134074',
    flex: 1,
    marginLeft: 12,
  },
  infoButton: {
    padding: 8,
  },
  groupInfoCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  groupLogoLargeSquare: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#103B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupTitleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#134074',
    marginBottom: 4,
  },
  groupDescriptionText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  groupMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    marginTop: 4,
  },
  groupMetaText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#134074',
  },
  verifiedSocietyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedSocietyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  startDiscussionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  discussionUserIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E9F0FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  startDiscussionInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    paddingVertical: 6,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 2,
  },
  postHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAuthorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  postLandmarkAvatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF3FC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  postAuthorName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#134074',
  },
  postAuthorRole: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 2,
  },
  postTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    lineHeight: 22,
  },
  postBodyText: {
    fontSize: 13.5,
    color: '#475569',
    lineHeight: 19,
    marginBottom: 12,
  },
  impactAnalysisCard: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#70B62C',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },
  impactAnalysisHeader: {
    fontSize: 10,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  impactAnalysisText: {
    fontSize: 12.5,
    color: '#1E3A8A',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  tagPill: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  postCardDivider: {
    height: 0.5,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  postFooterActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postFooterActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  postFooterActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 6,
  },
  emptyFeedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyFeedText: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  /* Group Creation Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#134074',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#134074',
    marginBottom: 6,
    marginTop: 12,
  },
  modalTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1E293B',
  },
  modalSubmitButton: {
    backgroundColor: '#70B62C',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  modalSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  searchRowWithRequests: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    gap: 12,
  },
  listSearchInputBoxContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  requestsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  requestsButtonText: {
    color: '#0369A1',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 6,
    marginRight: 6,
  },
  requestsBadge: {
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestsBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  squareRoundedAvatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitialsText: {
    fontWeight: '800',
    fontSize: 16,
  },
  communitySearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    gap: 12,
  },
  communitySearchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  joinCommunityBtn: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinCommunityBtnText: {
    color: '#0369A1',
    fontSize: 12,
    fontWeight: '800',
  },
  networkCategoryContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  networkHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  networkAvatarSquare: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  networkHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  networkHeaderMembers: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  channelsCardFrame: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    overflow: 'hidden',
  },
  channelListItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  channelIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelItemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  channelItemTime: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  channelItemText: {
    fontSize: 13,
    color: '#64748B',
    flex: 1,
    marginRight: 10,
  },
  channelUnreadCountBadge: {
    backgroundColor: '#22C55E',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelUnreadCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  channelItemSeparator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
  },

  /* WhatsApp-style Community Details View Styles */
  whatsappHeader: {
    height: 60,
    backgroundColor: '#EBF3FC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CFDFE9',
  },
  whatsappBackBtn: {
    padding: 8,
    marginRight: 8,
  },
  whatsappHeaderTitle: {
    color: '#134074',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  whatsappOptionsBtn: {
    padding: 8,
  },
  whatsappAnnouncementCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  whatsappAnnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whatsappAnnIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whatsappAnnTitle: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '700',
  },
  whatsappAnnDate: {
    color: '#64748B',
    fontSize: 12,
  },
  whatsappAnnSubtitle: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 4,
  },
  whatsappSectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
  },
  whatsappSectionHeaderText: {
    color: '#134074',
    fontSize: 13,
    fontWeight: '700',
  },
  whatsappAddGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  whatsappAddGroupIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whatsappAddGroupText: {
    color: '#134074',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 14,
  },
  whatsappChannelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  whatsappChannelIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whatsappChannelTitle: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '700',
  },
  whatsappChannelTime: {
    color: '#64748B',
    fontSize: 12,
  },
  whatsappChannelSubtitle: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 4,
  },

  /* Reports Moderation Styles */
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
    shadowRadius: 4,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reportBadgeText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800',
  },
  reportDate: {
    fontSize: 11,
    color: '#64748B',
  },
  reportSubTitle: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 6,
  },
  reportChannelText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  reportedContentBox: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
    padding: 10,
    borderRadius: 6,
    marginBottom: 14,
  },
  reportedContentText: {
    fontSize: 13,
    color: '#334155',
    fontStyle: 'italic',
  },
  viewReportBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewReportBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  moderationBanner: {
    backgroundColor: '#FFF1F2',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4E6',
    padding: 14,
  },
  moderationBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  moderationBannerTitle: {
    color: '#9F1239',
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
  },
  moderationCloseBtn: {
    padding: 2,
  },
  moderationReportedText: {
    fontSize: 13,
    color: '#4C0519',
    marginBottom: 4,
  },
  moderationContentText: {
    fontSize: 12.5,
    color: '#881337',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  moderationActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  moderationActionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moderationActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  /* Premium Calling Styles */
  premiumCallWrapper: {
    flex: 1,
    backgroundColor: '#0A0E17', // Deep dark premium blue/black background
  },
  premiumCallContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 60,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  topEncryptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  topEncryptText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  callCallerName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  callStatusText: {
    color: '#70B62C', // Ringing green color
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  centerInitialsCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FEF9E7', // Cream/off-white background
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  centerInitialsText: {
    color: '#0A0E17', // Dark navy/black initials text
    fontSize: 44,
    fontWeight: '800',
  },
  bottomControlsCapsule: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#111A24', // Dark grey/blue container background
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 40, // offset above mock bottom navigation
  },
  callControlRoundBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callControlRoundBtnInactive: {
    backgroundColor: '#202B37', // Solid premium dark grey/blue
  },
  callControlRoundBtnActive: {
    backgroundColor: '#FFFFFF', // White background when active
  },
  callHangUpBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EF4444', // Red hangup
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  mockTabBarContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  mockTabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  mockTabItemActive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0fdf4', // Soft green background active
  },
  mockTabActiveText: {
    color: '#70B62C',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
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

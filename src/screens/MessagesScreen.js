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
  Keyboard,
  Modal,
  StatusBar,
  Switch,
  PanResponder,
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
  Trash2,
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

// Custom CameraPlusIcon SVG
const CameraPlusIcon = ({ color = '#0E3866', size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14.5 4h-5L8 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2v-6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="13" r="3" stroke={color} strokeWidth="2" />
    <Path
      d="M19 2v6M16 5h6"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </Svg>
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

export const MessagesScreen = ({ onBack, onTabPress, navigation }) => {
  const [activeSegment, setActiveSegment] = useState('dms'); // Default to Direct Messages
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  
  // Create group form states
  const [groupName, setGroupName] = useState('');
  const [groupCategory, setGroupCategory] = useState('Specialized');
  const [groupDescription, setGroupDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [memberLimit, setMemberLimit] = useState(500);
  const [coverImage, setCoverImage] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(300);

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

  // Handle resetting screen state or opening specific chat when screen receives focus
  useEffect(() => {
    if (navigation) {
      const unsubscribe = navigation.addListener('focus', () => {
        // Check if we navigated with a specific chat target
        const params = navigation.getState()?.routes?.find(r => r.name === 'Messages')?.params;
        const targetChatName = params?.chatName;
        
        if (targetChatName) {
          let matchingChat = dms.find(d => 
            d.name.toLowerCase().includes(targetChatName.toLowerCase()) || 
            targetChatName.toLowerCase().includes(d.name.toLowerCase())
          );
          
          if (!matchingChat) {
            // Create a new DM dynamically in store
            const newDmId = `dm_${Date.now()}`;
            const newDm = {
              id: newDmId,
              name: targetChatName,
              text: 'Start of secured channel...',
              time: 'Just now',
              avatar: params?.chatAvatar || require('../../assets/admin_profile.png'),
              unread: false,
              viewed: true
            };
            dbStore.dms = [...dbStore.dms, newDm];
            dbStore.messages[newDmId] = [];
            dbStore.notify();
            matchingChat = newDm;
          }
          
          setSelectedChat(matchingChat);
          setActiveSegment('dms');
          // Clear the params so they don't persist next time we focus Messages
          navigation.setParams({ chatName: undefined, chatAvatar: undefined });
          return;
        }

        setSelectedChat(null);
        setSelectedGroup(null);
        setShowNewMessage(false);
        setActiveSegment('dms');
      });
      return unsubscribe;
    }
  }, [navigation, dms]);

  const handleCoverImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need gallery permissions to upload a cover image!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCoverImage(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick image from device.');
    }
  };

  const handleSliderPress = (event) => {
    const x = event.nativeEvent.locationX;
    const pct = Math.max(0, Math.min(1, x / sliderWidth));
    const val = Math.max(50, Math.min(1000, Math.round((50 + pct * 950) / 50) * 50));
    setMemberLimit(val);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 3;
      },
      onPanResponderGrant: (evt, gestureState) => {
        const x = evt.nativeEvent.locationX;
        const pct = Math.max(0, Math.min(1, x / sliderWidth));
        const val = Math.max(50, Math.min(1000, Math.round((50 + pct * 950) / 50) * 50));
        setMemberLimit(val);
      },
      onPanResponderMove: (evt, gestureState) => {
        const x = evt.nativeEvent.locationX;
        const pct = Math.max(0, Math.min(1, x / sliderWidth));
        const val = Math.max(50, Math.min(1000, Math.round((50 + pct * 950) / 50) * 50));
        setMemberLimit(val);
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: () => {},
    })
  ).current;

  const handleCreateGroup = () => {
    if (!groupName || !groupDescription) {
      Alert.alert('Incomplete Fields', 'Please fill in the group name and description.');
      return;
    }

    let groupIcon = 'chat';
    if (groupCategory === 'Specialized') groupIcon = 'gavel';
    else if (groupCategory === 'Regional Chapters') groupIcon = 'location';
    else if (groupCategory === 'Confidential') groupIcon = 'shield';

    const newGroup = {
      id: `group_${Date.now()}`,
      name: groupName,
      category: groupCategory,
      badge: groupCategory.toUpperCase(),
      description: groupDescription,
      member_count: 1,
      icon: groupIcon,
      isPublic: isPublic,
      memberLimit: memberLimit,
      coverImage: coverImage,
    };

    // Add to store
    dbStore.groups = [newGroup, ...dbStore.groups];
    dbStore.groupPosts[newGroup.id] = [];
    dbStore.notify();

    setGroupName('');
    setGroupDescription('');
    setGroupCategory('Specialized');
    setIsPublic(false);
    setMemberLimit(500);
    setCoverImage(null);
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

  // Filters
  const filteredDMs = dms.filter(dm => 
    dm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dm.text.toLowerCase().includes(searchQuery.toLowerCase())
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

            <TouchableOpacity 
              onPress={() => {
                if (navigation) {
                  const isElena = selectedChat.name.includes('Elena');
                  const isAlistair = selectedChat.name.includes('Alistair');
                  navigation.navigate('MemberProfile', {
                    name: selectedChat.name,
                    role: isElena ? 'Partner' : isAlistair ? 'Chief Auditor' : 'Senior Auditor',
                    branch: isAlistair ? 'London Branch' : 'Regional Branch',
                    tierLabel: isAlistair || isElena ? 'Senior Fellow' : 'Platinum Member',
                    memberId: isAlistair ? 'TAS-9920-PL' : isElena ? 'TAS-4412-SR' : 'TAS-2024-8842',
                    joinDate: 'Joined: Jan 2021',
                    email: isAlistair ? 'a.vance@tas-governance.org' : isElena ? 'elena.rodriguez@tas-governance.org' : 's.jenkins@pkf-international.com',
                    avatar: selectedChat.avatar
                  });
                }
              }}
              style={styles.chatHeaderProfile}
            >
              <View style={styles.avatarContainer}>
                <Image source={selectedChat.avatar} style={styles.chatAvatar} />
                <View style={styles.onlineDot} />
              </View>
              <View style={styles.chatHeaderInfo}>
                <Text style={styles.chatName}>{selectedChat.name}</Text>
                <Text style={[
                  styles.chatStatus,
                  dbStore.getTypingStatus(selectedChat.id) === 'typing...' && { color: '#00A884', fontWeight: '900', fontStyle: 'italic' }
                ]}>
                  {dbStore.getTypingStatus(selectedChat.id)}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => { setActiveCall('incoming'); setCallType('voice'); }} style={{ padding: 8, marginRight: 4 }}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#134074" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => { setActiveCall('incoming'); setCallType('video'); }} style={{ padding: 8, marginRight: 4 }}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <Path d="M23 7l-7 5 7 5V7z" stroke="#134074" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <Rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="#134074" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>

              <TouchableOpacity style={styles.moreButton} onPress={() => Alert.alert('Options', 'Select options:')}>
                <MoreVertical size={22} color="#134074" />
              </TouchableOpacity>
            </View>
          </View>

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
                    <Image source={selectedChat.avatar} style={styles.messageAvatar} />
                  )}

                  {isMe && (
                    <TouchableOpacity 
                      onPress={() => {
                        Alert.alert(
                          'Delete Message',
                          'Are you sure you want to delete this message?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { 
                              text: 'Delete', 
                              style: 'destructive',
                              onPress: () => dbStore.deleteMessage(selectedChat.id, msg.id)
                            }
                          ]
                        );
                      }}
                      style={{
                        marginRight: 6,
                        alignSelf: 'center',
                        padding: 6,
                      }}
                      activeOpacity={0.7}
                    >
                      <Trash2 size={15} color="#EF4444" />
                    </TouchableOpacity>
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
                    {selectedGroup.name}
                  </Text>
                  <Text style={styles.groupDescriptionText}>
                    {selectedGroup.description || 'Discussing the latest regulatory changes and ethical standards.'}
                  </Text>
                </View>
              </View>

              <View style={styles.groupMetaRow}>
                <Text style={styles.groupMetaText}>{selectedGroup.member_count.toLocaleString()} Members</Text>
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

                <TouchableOpacity style={styles.footerTabItem} onPress={() => handleTabPress('Directory')}>
                  <DirectoryBookIcon color="#134074" />
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
            <TouchableOpacity onPress={() => setShowNewMessage(false)} style={styles.backButton}>
              <ArrowLeft size={22} color="#134074" />
            </TouchableOpacity>
            <Text style={styles.messagesHeaderTitle}>New Message</Text>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            {/* To: Search Card */}
            <View style={styles.searchCardContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
                <Text style={styles.searchCardToLabel}>To:</Text>
                
                {selectedSuggestions.map(item => (
                  <View key={item} style={styles.selectedToken}>
                    <Text style={styles.selectedTokenText}>{item}</Text>
                    <TouchableOpacity 
                      onPress={() => setSelectedSuggestions(prev => prev.filter(t => t !== item))}
                      style={{ marginLeft: 6 }}
                    >
                      <X size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}

                <TextInput
                  placeholder="Search members..."
                  placeholderTextColor="#94A3B8"
                  style={styles.searchCardInput}
                />
              </View>

              <View style={styles.searchCardWarningRow}>
                <Shield size={14} color="#64748B" style={{ marginRight: 6 }} />
                <Text style={styles.searchCardWarningText}>Messages will be end-to-end encrypted.</Text>
              </View>
            </View>

            {/* Suggested Contacts Section */}
            <Text style={styles.sectionHeaderTitle}>SUGGESTED CONTACTS</Text>
            
            <View style={styles.suggestedListContainer}>
              {/* Elena Rodriguez */}
              <View style={styles.suggestedItemRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={styles.avatarWrapper}>
                    <Image source={require('../../assets/elena_profile.png')} style={styles.suggestedAvatar} />
                    <View style={[styles.statusDot, { backgroundColor: '#22C55E' }]} />
                  </View>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.suggestedName}>Elena Rodriguez</Text>
                    <Text style={styles.suggestedRole}>Senior Tax Consultant</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    if (selectedSuggestions.includes('Elena Rodriguez')) {
                      setSelectedSuggestions(prev => prev.filter(item => item !== 'Elena Rodriguez'));
                    } else {
                      setSelectedSuggestions(prev => [...prev, 'Elena Rodriguez']);
                    }
                  }}
                  style={styles.plusCircleButton}
                >
                  <Text style={styles.plusCircleText}>
                    {selectedSuggestions.includes('Elena Rodriguez') ? '✓' : '+'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Marcus Chen */}
              <View style={styles.suggestedItemRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={styles.avatarWrapper}>
                    <Image source={require('../../assets/admin_profile.png')} style={styles.suggestedAvatar} />
                    <View style={[styles.statusDot, { backgroundColor: '#94A3B8' }]} />
                  </View>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.suggestedName}>Marcus Chen</Text>
                    <Text style={styles.suggestedRole}>Regional Audit Director</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    if (selectedSuggestions.includes('Marcus Chen')) {
                      setSelectedSuggestions(prev => prev.filter(item => item !== 'Marcus Chen'));
                    } else {
                      setSelectedSuggestions(prev => [...prev, 'Marcus Chen']);
                    }
                  }}
                  style={styles.plusCircleButton}
                >
                  <Text style={styles.plusCircleText}>
                    {selectedSuggestions.includes('Marcus Chen') ? '✓' : '+'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Sarah Henderson */}
              <View style={styles.suggestedItemRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={styles.avatarWrapper}>
                    <View style={[styles.suggestedAvatar, { backgroundColor: '#134074', justifyContent: 'center', alignItems: 'center' }]}>
                      <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>SH</Text>
                    </View>
                    <View style={[styles.statusDot, { backgroundColor: '#22C55E' }]} />
                  </View>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.suggestedName}>Sarah Henderson</Text>
                    <Text style={styles.suggestedRole}>Compliance Officer</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    if (selectedSuggestions.includes('Sarah Henderson')) {
                      setSelectedSuggestions(prev => prev.filter(item => item !== 'Sarah Henderson'));
                    } else {
                      setSelectedSuggestions(prev => [...prev, 'Sarah Henderson']);
                    }
                  }}
                  style={styles.plusCircleButton}
                >
                  <Text style={styles.plusCircleText}>
                    {selectedSuggestions.includes('Sarah Henderson') ? '✓' : '+'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Members Section */}
            <Text style={styles.sectionHeaderTitle}>RECENT MEMBERS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16, marginTop: 10 }}>
              <View style={styles.recentMemberColumn}>
                <Image source={require('../../assets/elena_profile.png')} style={styles.recentAvatar} />
                <Text style={styles.recentMemberName}>Janice L.</Text>
              </View>
              <View style={styles.recentMemberColumn}>
                <Image source={require('../../assets/admin_profile.png')} style={styles.recentAvatar} />
                <Text style={styles.recentMemberName}>Robert D.</Text>
              </View>
              <View style={styles.recentMemberColumn}>
                <Image source={require('../../assets/elena_profile.png')} style={styles.recentAvatar} />
                <Text style={styles.recentMemberName}>Emily K.</Text>
              </View>
              <View style={styles.recentMemberColumn}>
                <Image source={require('../../assets/elena_profile.png')} style={styles.recentAvatar} />
                <Text style={styles.recentMemberName}>Saja</Text>
              </View>
            </ScrollView>

            {/* Start Chat Button */}
            <TouchableOpacity 
              onPress={() => {
                if (selectedSuggestions.includes('Elena Rodriguez')) {
                  const elenaDm = dms.find(d => d.id === 'elena');
                  if (elenaDm) setSelectedChat(elenaDm);
                } else if (selectedSuggestions.includes('Marcus Chen') || selectedSuggestions.includes('Marcus Thornton')) {
                  const marcusDm = dms.find(d => d.id === 'marcus_t');
                  if (marcusDm) setSelectedChat(marcusDm);
                } else {
                  const elenaDm = dms.find(d => d.id === 'elena');
                  if (elenaDm) setSelectedChat(elenaDm);
                }
                setShowNewMessage(false);
              }}
              style={styles.startChatLargeButton}
            >
              <Send size={18} color="#FFFFFF" style={{ marginRight: 8, transform: [{ rotate: '-30deg' }] }} />
              <Text style={styles.startChatLargeButtonText}>Start Chat</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : showCreateGroup ? (
        /* New Community Screen */
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
          {/* Header */}
          <View style={[
            styles.messagesHeaderContainer, 
            { 
              backgroundColor: '#E3EEFF', 
              borderBottomWidth: 1, 
              borderBottomColor: '#CBD5E1', 
              justifyContent: 'flex-start',
              paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
              height: Platform.OS === 'android' ? 64 + StatusBar.currentHeight : 64
            }
          ]}>
            <TouchableOpacity onPress={() => setShowCreateGroup(false)} style={styles.backButton}>
              <ArrowLeft size={22} color="#134074" />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center', marginRight: 40 }}>
              <Text style={[styles.messagesHeaderTitle, { marginLeft: 0 }]}>New Community</Text>
            </View>
          </View>

          <ScrollView 
            style={{ flex: 1 }} 
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Create New Group Title & Subtitle */}
            <Text style={styles.newCommunityTitle}>Create New Group</Text>
            <Text style={styles.newCommunitySubtitle}>
              Establish a new professional subnetwork for the society members. All groups are monitored for professional compliance.
            </Text>

            {/* Inner Card */}
            <View style={styles.newCommunityCard}>
              {/* Community Name */}
              <Text style={styles.newCommunityLabel}>Community Name</Text>
              <TextInput
                style={styles.newCommunityInput}
                placeholder="e.g. Senior Audit Specialists"
                placeholderTextColor="#94A3B8"
                value={groupName}
                onChangeText={setGroupName}
              />

              {/* Description */}
              <Text style={styles.newCommunityLabel}>Description</Text>
              <TextInput
                style={[styles.newCommunityInput, { height: 100, textAlignVertical: 'top' }]}
                placeholder="Brief overview of the community's purpose and focus areas..."
                placeholderTextColor="#94A3B8"
                value={groupDescription}
                onChangeText={setGroupDescription}
                multiline
                numberOfLines={4}
              />

              {/* Group Category */}
              <Text style={styles.newCommunityLabel}>Group Category</Text>
              <TouchableOpacity 
                style={styles.categoryDropdownTrigger}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryDropdownText}>{groupCategory}</Text>
                <ChevronRight 
                  size={20} 
                  color="#134074" 
                  style={{ transform: [{ rotate: showCategoryDropdown ? '90deg' : '0deg' }] }} 
                />
              </TouchableOpacity>

              {/* Dropdown Options */}
              {showCategoryDropdown && (
                <View style={styles.categoryDropdownOptions}>
                  {['Specialized', 'Regional Chapters', 'Public', 'Confidential'].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={styles.categoryDropdownOptionItem}
                      onPress={() => {
                        setGroupCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.categoryDropdownOptionText,
                        groupCategory === cat && { fontWeight: '800', color: '#134074' }
                      ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Privacy Settings */}
              <Text style={styles.newCommunityLabel}>Privacy Settings</Text>
              <View style={styles.privacySettingRow}>
                <Text style={styles.privacySettingText}>Publicly Visible</Text>
                <Switch
                  value={isPublic}
                  onValueChange={setIsPublic}
                  trackColor={{ false: '#D1D5DB', true: '#70B62C' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Member Limit */}
              <View style={styles.memberLimitHeaderRow}>
                <Text style={styles.newCommunityLabel}>Member Limit</Text>
                <View style={styles.memberLimitBadge}>
                  <Text style={styles.memberLimitBadgeText}>{memberLimit} Members</Text>
                </View>
              </View>

              {/* Custom Slider Component */}
              <View style={{ marginVertical: 12 }}>
                <View 
                  style={styles.sliderTrackBackground}
                  onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
                  {...panResponder.panHandlers}
                >
                  <View 
                    style={[
                      styles.sliderTrackFill, 
                      { width: `${((memberLimit - 50) / 950) * 100}%` }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.sliderThumb, 
                      { left: `${((memberLimit - 50) / 950) * 100}%` }
                    ]} 
                  />
                </View>
              </View>

              {/* Cover Image */}
              <Text style={styles.newCommunityLabel}>Cover Image</Text>
              <TouchableOpacity 
                style={styles.coverImageUploadZone}
                onPress={handleCoverImagePick}
                activeOpacity={0.8}
              >
                {coverImage ? (
                  <View style={{ width: '100%', height: 120, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                    <Image source={{ uri: coverImage }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    <TouchableOpacity 
                      style={styles.removeCoverImageButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        setCoverImage(null);
                      }}
                    >
                      <X size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
                    <CameraPlusIcon color="#134074" size={32} />
                    <Text style={styles.coverImageUploadTitle}>Click to upload brand cover image</Text>
                    <Text style={styles.coverImageUploadSubtitle}>Recommended: 1200 x 400px (PNG, JPG)</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.newCommunityDivider} />

              {/* Establish Community Button */}
              <TouchableOpacity 
                style={styles.establishCommunityButton}
                onPress={handleCreateGroup}
                activeOpacity={0.8}
              >
                <View style={styles.checkmarkCircleWrapper}>
                  <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <Path 
                      d="M20 6L9 17L4 12" 
                      stroke="#3D6A05" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  </Svg>
                </View>
                <Text style={styles.establishCommunityButtonText}>Establish Community</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Bottom Tabs navigation bar */}
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

              <TouchableOpacity style={styles.footerTabItem} onPress={() => handleTabPress('Directory')}>
                <DirectoryBookIcon color="#134074" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        /* Chat List / Group List View */
        <View style={{ flex: 1 }}>
          {/* Top Header */}
          <View style={styles.messagesHeaderContainer}>
            {onBack && (
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <ArrowLeft size={22} color="#134074" />
              </TouchableOpacity>
            )}
            <Text style={styles.messagesHeaderTitle}>Community</Text>
          </View>

          {/* Switcher (Segmented Control) */}
          <View style={styles.switcherWrapper}>
            <View style={styles.switcherCapsule}>
              <TouchableOpacity
                onPress={() => setActiveSegment('dms')}
                style={[styles.switcherTab, activeSegment === 'dms' && styles.switcherTabActive]}
              >
                <Text style={[styles.switcherTabText, activeSegment === 'dms' && styles.switcherTabTextActive]}>
                  Direct Messages
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveSegment('groups')}
                style={[styles.switcherTab, activeSegment === 'groups' && styles.switcherTabActive]}
              >
                <Text style={[styles.switcherTabText, activeSegment === 'groups' && styles.switcherTabTextActive]}>
                  Community Broadcast
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView 
            style={{ flex: 1 }} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Search Input */}
            <View style={styles.listSearchInputBox}>
              <Search size={18} color="#64748B" style={{ marginRight: 10 }} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={activeSegment === 'dms' ? "Search contacts or society members..." : "Search Community"}
                placeholderTextColor="#94A3B8"
                style={{ flex: 1, color: '#1E293B', fontSize: 14, padding: 0 }}
              />
            </View>

            {/* Category Filter Pills (Community groups tab only) */}
            {activeSegment === 'groups' && (
              <View>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  contentContainerStyle={styles.filterPillsScrollContainer}
                >
                  {['All Groups', 'Regional Chapters', 'Specialized', 'Public', 'Confidential'].map((pill) => {
                    const isActive = groupFilter === pill;
                    return (
                      <TouchableOpacity
                        key={pill}
                        onPress={() => setGroupFilter(pill)}
                        style={[
                          styles.filterPillBtn,
                          isActive ? styles.filterPillBtnActive : styles.filterPillBtnInactive
                        ]}
                      >
                        <Text style={[
                          styles.filterPillBtnText,
                          isActive ? styles.filterPillBtnTextActive : styles.filterPillBtnTextInactive
                        ]}>
                          {pill}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                <Text style={styles.listTitleText}>Community Groups</Text>
              </View>
            )}

            {activeSegment === 'dms' ? (
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
                          <Image source={dm.avatar} style={styles.suggestedAvatar} />
                          <View style={[styles.statusDot, { backgroundColor: (dm.id === 'julian' || dm.id === 'david') ? '#94A3B8' : '#22C55E' }]} />
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
            ) : (
              <View style={{ paddingHorizontal: 16 }}>
                {groups
                  .filter(group => {
                    // Filter groups by groupFilter pill and search query
                    if (groupFilter !== 'All Groups' && group.category !== groupFilter) {
                      return false;
                    }
                    if (searchQuery.trim()) {
                      return group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             group.description.toLowerCase().includes(searchQuery.toLowerCase());
                    }
                    return true;
                  })
                  .map((group) => (
                    <View key={group.id} style={styles.groupCardItem}>
                      <View style={styles.groupCardHeaderRow}>
                        {/* Icon Wrapper */}
                        <View style={[
                          styles.groupIconWrapperSquare,
                          (group.icon === 'gavel' || group.icon === 'shield') ? { backgroundColor: '#103B6B' } : { backgroundColor: '#E9F0FA' }
                        ]}>
                          {group.icon === 'gavel' ? (
                            <GavelSvg color="#FFFFFF" size={20} />
                          ) : group.icon === 'location' ? (
                            <MapPin color="#134074" size={20} />
                          ) : group.icon === 'chat' ? (
                            <MessageCircle color="#134074" size={20} />
                          ) : (
                            <Shield color="#FFFFFF" size={20} fill="#FFFFFF" />
                          )}
                        </View>

                        {/* Category Badge */}
                        <View style={[
                          styles.groupCategoryBadge,
                          group.badge === 'SPECIALIZED' && { backgroundColor: '#E2FBE8', borderColor: '#BBF7D0' },
                          group.badge === 'REGIONAL' && { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' },
                          group.badge === 'PUBLIC' && { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
                          group.badge === 'CONFIDENTIAL' && { backgroundColor: '#FEF08A', borderColor: '#FDE047' }
                        ]}>
                          <Text style={[
                            styles.groupCategoryBadgeText,
                            group.badge === 'SPECIALIZED' && { color: '#15803D' },
                            group.badge === 'REGIONAL' && { color: '#1D4ED8' },
                            group.badge === 'PUBLIC' && { color: '#475569' },
                            group.badge === 'CONFIDENTIAL' && { color: '#A16207' }
                          ]}>
                            {group.badge}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.groupCardTitle}>{group.name}</Text>
                      <Text style={styles.groupCardDescription}>{group.description}</Text>

                      <View style={styles.groupCardSeparator} />

                      <View style={styles.groupCardFooterRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <UsersIcon size={14} color="#64748B" style={{ marginRight: 6 }} />
                          <Text style={styles.groupCardMembersText}>
                            {group.member_count.toLocaleString()} Members
                          </Text>
                        </View>

                        <TouchableOpacity 
                          onPress={() => setSelectedGroup(group)}
                          style={styles.groupViewButton}
                        >
                          <Text style={styles.groupViewButtonText}>View</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                }
              </View>
            )}
          </ScrollView>

          {/* Floating Action Button (FAB) */}
          <TouchableOpacity 
            onPress={() => {
              if (activeSegment === 'dms') {
                setShowNewMessage(true);
              } else {
                setShowCreateGroup(true);
              }
            }}
            style={[
              styles.floatingActionButton, 
              activeSegment === 'groups' && { backgroundColor: '#70B62C' }
            ]}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}



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
        <SafeAreaView style={styles.incomingCallContainer}>
          <View style={styles.gradientTopWash} />
          <View style={styles.gradientBottomWash} />

          <View style={styles.ongoingBadgeContainer}>
            <View style={styles.greenLiveDot} />
            <Text style={styles.ongoingBadgeText}>ONGOING SECURE CALL</Text>
          </View>

          <Text style={styles.ongoingTimerText}>{formatCallTime(callDuration)}</Text>

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

            <View style={styles.waveformRow}>
              <View style={[styles.waveBar, { height: 16 }]} />
              <View style={[styles.waveBar, { height: 28 }]} />
              <View style={[styles.waveBar, { height: 22 }]} />
              <View style={[styles.waveBar, { height: 12 }]} />
              <View style={[styles.waveBar, { height: 20 }]} />
            </View>
            
            <Text style={styles.incomingCallerName}>{selectedChat ? selectedChat.name : 'Sarah oenkins'}</Text>
            <Text style={styles.incomingCallerRole}>Senior Auditor • Fiscal Dept</Text>
          </View>

          <View style={styles.ongoingControlsContainer}>
            <View style={styles.ongoingControlsRow}>
              <View style={styles.controlItem}>
                <TouchableOpacity
                  onPress={() => setIsMuted(!isMuted)}
                  style={[styles.ongoingControlButton, isMuted && styles.ongoingControlButtonActive]}
                >
                  {isMuted ? <MicOff size={22} color="#FFFFFF" /> : <Mic size={22} color="#3A5666" />}
                </TouchableOpacity>
                <Text style={styles.ongoingControlText}>Mute</Text>
              </View>

              <View style={styles.controlItem}>
                <TouchableOpacity style={styles.ongoingControlButton}>
                  <KeypadIcon color="#3A5666" />
                </TouchableOpacity>
                <Text style={styles.ongoingControlText}>Keypad</Text>
              </View>

              <View style={styles.controlItem}>
                <TouchableOpacity
                  onPress={() => setIsSpeakerOn(!isSpeakerOn)}
                  style={[styles.ongoingControlButton, isSpeakerOn && styles.ongoingControlButtonActive]}
                >
                  {isSpeakerOn ? <Volume2 size={22} color="#FFFFFF" /> : <VolumeX size={22} color="#3A5666" />}
                </TouchableOpacity>
                <Text style={styles.ongoingControlText}>Speaker</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setActiveCall(null)}
              style={styles.hangUpButtonRoundedSquare}
            >
              <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: '135deg' }] }}>
                <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="#FFFFFF" />
              </Svg>
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

          <View style={styles.videoBottomControlsCard}>
            <View style={styles.videoControlsRowLeft}>
              <TouchableOpacity
                onPress={() => setIsMuted(!isMuted)}
                style={[styles.videoOverlayButton, isMuted && styles.videoOverlayButtonActive]}
              >
                {isMuted ? <MicOff size={22} color="#FFFFFF" style={{ opacity: 0.9 }} /> : <Mic size={22} color="#FFFFFF" style={{ opacity: 0.9 }} />}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsVideoMuted(!isVideoMuted)}
                style={[styles.videoOverlayButton, isVideoMuted && styles.videoOverlayButtonActive]}
              >
                {isVideoMuted ? <VideoOff size={22} color="#FFFFFF" style={{ opacity: 0.9 }} /> : <Video size={22} color="#FFFFFF" style={{ opacity: 0.9 }} />}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsFrontCamera(!isFrontCamera)}
                style={styles.videoOverlayButton}
              >
                <RotateCw size={22} color="#FFFFFF" style={{ opacity: 0.9 }} />
              </TouchableOpacity>
            </View>

            <View style={styles.videoControlsDivider} />

            <TouchableOpacity
              onPress={() => setActiveCall(null)}
              style={styles.videoHangupButton}
            >
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: '135deg' }] }}>
                <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="#FFFFFF" />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
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
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 1,
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
    backgroundColor: '#DCE8FC',
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

  /* New Community Styles */
  newCommunityTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0E3866',
    marginBottom: 8,
  },
  newCommunitySubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 20,
  },
  newCommunityCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  newCommunityLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0E3866',
    marginBottom: 8,
  },
  newCommunityInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 16,
  },
  categoryDropdownTrigger: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryDropdownText: {
    fontSize: 14,
    color: '#1E293B',
  },
  categoryDropdownOptions: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginTop: -12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  categoryDropdownOptionItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoryDropdownOptionText: {
    fontSize: 13.5,
    color: '#475569',
  },
  privacySettingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  privacySettingText: {
    fontSize: 14,
    color: '#475569',
  },
  memberLimitHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  memberLimitBadge: {
    backgroundColor: '#E3EEFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  memberLimitBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#134074',
  },
  sliderTrackBackground: {
    height: 6,
    backgroundColor: '#E3EEFF',
    borderRadius: 3,
    position: 'relative',
    marginBottom: 20,
  },
  sliderTrackFill: {
    height: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    marginLeft: -8,
  },
  coverImageUploadZone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  coverImageUploadTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  coverImageUploadSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  removeCoverImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newCommunityDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },
  establishCommunityButton: {
    backgroundColor: '#3D6A05',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  establishCommunityButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  checkmarkCircleWrapper: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
});

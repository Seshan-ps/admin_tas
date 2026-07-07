import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  StatusBar,
  TextInput,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Check,
  Mail,
  Calendar,
  Lock,
  Edit2,
  Trash2,
  Home,
  BarChart3,
  Newspaper,
  Users,
  User,
  Phone,
  HelpCircle,
  MapPin,
  FileText,
  Briefcase,
  ArrowUp
} from 'lucide-react-native';
import Svg, { Rect, Circle, Path } from 'react-native-svg';
import { dbStore } from '../config/dbStore';

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

export const MemberProfileScreen = ({
  route,
  navigation,
  onBack
}) => {
  const initialParams = route?.params || {};
  const isPendingApproval = route?.params?.isPendingApproval || initialParams.isPendingApproval || false;
  const queueId = route?.params?.queueId || initialParams.queueId || null;
  const fullName = route?.params?.fullName || initialParams.fullName || '';
  const phone = route?.params?.phone || initialParams.phone || '';
  const dob = route?.params?.dob || initialParams.dob || '';
  const gender = route?.params?.gender || initialParams.gender || '';
  const membershipPlan = route?.params?.membershipPlan || initialParams.membershipPlan || '';

  const [memberData, setMemberData] = useState({
    name: initialParams.name || 'Sarah Jenkins',
    role: initialParams.role || 'Senior Auditor',
    branch: initialParams.branch || 'Regional Branch',
    tierLabel: initialParams.tierLabel || 'Premium Member',
    tier: initialParams.tier || 'Premium',
    memberId: initialParams.memberId || 'TAS-2024-8842',
    joinDate: initialParams.joinDate || 'Joined: Jan 2021',
    email: initialParams.email || 's.jenkins@pkf-international.com',
    fullIdCode: initialParams.fullIdCode || '8842-SJ-TAS',
    joinDateFull: initialParams.joinDateFull || 'January 14, 2021',
    firm: initialParams.firm || 'PKF International Ltd.',
    avatar: initialParams.avatar || require('../../assets/elena_profile.png')
  });

  // State for member's about text
  const [aboutText, setAboutText] = useState('');
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [tempAbout, setTempAbout] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = React.useRef(null);
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 300);
  };
  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true
    });
  };

  // Sync state from dbStore and route params
  useEffect(() => {
    const syncMember = () => {
      const idToSearch = route?.params?.memberId || initialParams?.memberId || memberData.memberId;
      const storeMember = dbStore.getMembers().find(m => m.id === idToSearch || m.memberId === idToSearch);
      
      if (storeMember) {
        setMemberData({
          name: storeMember.name,
          role: storeMember.designation,
          branch: (storeMember.tier === 'Premium' || storeMember.tier === 'Lifetime') ? 'Main Office' : 'Regional Branch',
          tierLabel: storeMember.tierLabel,
          tier: storeMember.tier,
          memberId: storeMember.memberId,
          joinDate: 'Joined: Jan 2021',
          email: route?.params?.email || `${storeMember.name.toLowerCase().replace(' ', '.').replace('dr.', '')}@tas-governance.org`,
          fullIdCode: `${storeMember.memberId}-SJ-TAS`,
          joinDateFull: 'January 14, 2021',
          firm: storeMember.company,
          avatar: storeMember.avatar
        });
      } else if (route?.params) {
        setMemberData({
          name: route.params.name || memberData.name,
          role: route.params.role || memberData.role,
          branch: route.params.branch || memberData.branch,
          tierLabel: route.params.tierLabel || memberData.tierLabel,
          tier: route.params.tier || memberData.tier,
          memberId: route.params.memberId || memberData.memberId,
          joinDate: route.params.joinDate || memberData.joinDate,
          email: route.params.email || memberData.email,
          fullIdCode: route.params.fullIdCode || memberData.fullIdCode,
          joinDateFull: route.params.joinDateFull || memberData.joinDateFull,
          firm: route.params.firm || memberData.firm,
          avatar: route.params.avatar || memberData.avatar
        });
      }
    };

    syncMember();
    const unsubscribe = dbStore.subscribe(syncMember);
    return unsubscribe;
  }, [route?.params]);

  // Set default about text once member details are loaded
  useEffect(() => {
    if (memberData.name.toLowerCase().includes('sarah')) {
      setAboutText(
        'Experienced accounting professional specializing in taxation, auditing, compliance management, and business advisory services. Committed to delivering precision-driven financial solutions for local enterprises.'
      );
    } else {
      setAboutText(
        `Experienced professional specializing in ${memberData.role.toLowerCase()} at ${memberData.firm || 'TAS Global Network'}. Dedicated to compliance, financial optimization, and professional excellence.`
      );
    }
  }, [memberData.name, memberData.role, memberData.firm]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  const navigateToTab = tabName => {
    if (navigation) {
      if (tabName === 'Messages') {
        navigation.navigate('Messages');
      } else {
        navigation.navigate('MainTabs', {
          screen: tabName
        });
      }
    }
  };

  // Helper functions for dynamic profile details
  const getMemberLocation = () => {
    const text = (memberData.role + ' ' + memberData.branch + ' ' + memberData.firm + ' ' + memberData.email).toLowerCase();
    if (text.includes('chennai') || text.includes('ch01')) return 'Chennai, Tamil Nadu';
    if (text.includes('bengaluru') || text.includes('bangalore') || text.includes('bl02')) return 'Bengaluru, Karnataka';
    if (text.includes('madurai') || text.includes('md03')) return 'Madurai, Tamil Nadu';
    if (text.includes('london')) return 'London, UK';
    return 'Coimbatore, Tamil Nadu'; // Default matching the user screenshot
  };

  const getMemberPhone = () => {
    if (phone) return phone;
    // Generate a consistent phone number based on member name
    let hash = 0;
    const nameStr = memberData.name;
    for (let i = 0; i < nameStr.length; i++) {
      hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const suffix = Math.abs(hash % 900000) + 100000;
    return `+91 98765 ${suffix}`;
  };

  const getConnectionsCount = () => {
    if (memberData.name.toLowerCase().includes('sarah')) return '98 connections';
    let hash = 0;
    const nameStr = memberData.name;
    for (let i = 0; i < nameStr.length; i++) {
      hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const count = Math.abs(hash % 80) + 15;
    return `${count} connections`;
  };

  const getMemberUsername = () => {
    return memberData.name.toLowerCase().replace(/,/g, '').replace(/\s+/g, '_').replace('.cpa', '');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={22} color="#0D3866" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isPendingApproval ? 'Review Profile' : 'Members Profile'}
        </Text>
        {!isPendingApproval ? (
          <TouchableOpacity 
            style={styles.headerDeleteButton}
            onPress={() => {
              Alert.alert(
                'Delete Member',
                `Are you sure you want to delete ${memberData.name}? This action is irreversible.`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Delete', 
                    style: 'destructive', 
                    onPress: () => {
                      dbStore.deleteMember(memberData.memberId);
                      Alert.alert('Member Deleted', `${memberData.name} has been successfully deleted from the society records.`, [
                        { text: 'OK', onPress: () => handleBack() }
                      ]);
                    } 
                  }
                ]
              );
            }}
            activeOpacity={0.7}
          >
            <Trash2 size={22} color="#EF4444" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      <ScrollView 
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false} 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* CARD 1: TOP PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.topCardRow}>
            {/* Avatar */}
            <Image source={memberData.avatar} style={styles.avatarLarge} />
            
            {/* Right Column details */}
            <View style={styles.topCardDetails}>
              <Text style={styles.usernameText}>{getMemberUsername()}</Text>
              <Text style={styles.subtitleText}>{memberData.role} • {memberData.branch}</Text>
              <Text style={styles.connectionsText}>{getConnectionsCount()}</Text>
              
              {/* Member Pill */}
              <View style={[
                styles.tierPill,
                isPendingApproval && { backgroundColor: '#DC2626' }
              ]}>
                <Text style={styles.tierPillText}>
                  {isPendingApproval ? '✓ Awaiting Approval' : `✓ ${memberData.tierLabel || 'Premium Member'}`}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Member ID */}
          <Text style={styles.memberIdText}>ID: {memberData.memberId}</Text>
          
          {/* Divider */}
          <View style={styles.cardDivider} />
          
          {/* About Section */}
          <Text style={styles.aboutHeader}>ABOUT</Text>
          <Text style={styles.aboutBodyText}>{aboutText}</Text>
          
          <TouchableOpacity 
            onPress={() => {
              setTempAbout(aboutText);
              setIsEditingAbout(true);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.editAboutLink}>[Edit About]</Text>
          </TouchableOpacity>
        </View>

        {/* ACTIONS ROW */}
        {isPendingApproval ? (
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={styles.declineBtnSquare} 
              onPress={() => {
                Alert.alert(
                  'Decline Registration',
                  `Are you sure you want to decline ${fullName || memberData.name}'s registration?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Decline', 
                      style: 'destructive', 
                      onPress: async () => {
                        await dbStore.declineConnection(queueId);
                        Alert.alert('Declined', 'Registration has been declined.', [
                          { text: 'OK', onPress: () => handleBack() }
                        ]);
                      } 
                    }
                  ]
                );
              }} 
              activeOpacity={0.8}
            >
              <Trash2 size={20} color="#FFFFFF" style={{ marginBottom: 6 }} />
              <Text style={styles.declineBtnTextSquare}>Decline Request</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.approveBtnSquare} 
              onPress={async () => {
                await dbStore.approveConnection(queueId);
                Alert.alert('Approved', 'User entry has been successfully verified and approved!', [
                  { text: 'OK', onPress: () => handleBack() }
                ]);
              }} 
              activeOpacity={0.8}
            >
              <Check size={20} color="#FFFFFF" style={{ marginBottom: 6 }} />
              <Text style={styles.approveBtnTextSquare}>Approve Entry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={styles.messageBtnSquare} 
              onPress={() => {
                if (navigation) {
                  navigation.navigate('Messages', { 
                    chatName: memberData.name,
                    chatAvatar: memberData.avatar
                  });
                } else {
                  Alert.alert('Secure Message', `Opening direct message with ${memberData.name}`);
                }
              }} 
              activeOpacity={0.8}
            >
              <Mail size={20} color="#FFFFFF" style={{ marginBottom: 6 }} />
              <Text style={styles.messageBtnTextSquare}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.editBtnSquare} 
              onPress={() => {
                if (navigation) {
                  navigation.navigate('EditDetails', { memberData });
                }
              }} 
              activeOpacity={0.8}
            >
              <Edit2 size={20} color="#0D3866" style={{ marginBottom: 6 }} />
              <Text style={styles.editBtnTextSquare}>Edit Details</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* CARD 2: PERSONAL INFORMATION CARD */}
        <View style={styles.profileCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <User size={18} color="#0D3866" style={{ marginRight: 8 }} />
              <Text style={styles.sectionHeaderText}>PERSONAL INFORMATION</Text>
            </View>
          </View>
          
          {/* Full Name Item */}
          <View style={styles.listItem}>
            <View style={styles.listIconCircle}>
              <FileText size={16} color="#0D3866" />
            </View>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemLabel}>Full Name</Text>
              <Text style={styles.listItemValue}>{isPendingApproval ? (fullName || memberData.name) : memberData.name}</Text>
            </View>
          </View>
          
          {/* Mobile Number Item */}
          <View style={styles.listItem}>
            <View style={styles.listIconCircle}>
              <Phone size={16} color="#0D3866" />
            </View>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemLabel}>Mobile Number</Text>
              <Text style={styles.listItemValue}>{getMemberPhone()}</Text>
            </View>
          </View>
          
          {/* Email Address Item */}
          <View style={styles.listItem}>
            <View style={styles.listIconCircle}>
              <Mail size={16} color="#0D3866" />
            </View>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemLabel}>Email Address</Text>
              <Text style={styles.listItemValue}>{memberData.email}</Text>
            </View>
          </View>
          
          {/* City, State Item */}
          <View style={[styles.listItem, { marginBottom: 0 }]}>
            <View style={styles.listIconCircle}>
              <MapPin size={16} color="#0D3866" />
            </View>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemLabel}>City, State</Text>
              <Text style={styles.listItemValue}>{getMemberLocation()}</Text>
            </View>
          </View>

          {/* Pending Approval Details */}
          {isPendingApproval && (
            <View style={styles.pendingDetailsContainer}>
              <Text style={styles.listItemLabel}>Date of Birth: <Text style={{ color: '#0D3866', fontWeight: '750' }}>{dob || 'N/A'}</Text></Text>
              <Text style={[styles.listItemLabel, { marginTop: 4 }]}>Gender: <Text style={{ color: '#0D3866', fontWeight: '750' }}>{gender || 'N/A'}</Text></Text>
              <Text style={[styles.listItemLabel, { marginTop: 4 }]}>Membership Plan: <Text style={{ color: '#70B62C', fontWeight: '800' }}>{membershipPlan || 'Premium Access'}</Text></Text>
            </View>
          )}
        </View>

        {/* CARD 3: PROFESSIONAL PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Briefcase size={18} color="#0D3866" style={{ marginRight: 8 }} />
              <Text style={styles.sectionHeaderText}>PROFESSIONAL PROFILE</Text>
            </View>
          </View>
          
          <View style={styles.professionalContent}>
            <Text style={styles.listItemLabel}>Current Role</Text>
            <Text style={[styles.listItemValue, { marginTop: 4 }]}>
              {memberData.name} at {memberData.firm || 'Texcity Financial Service'}
            </Text>
          </View>
        </View>

        {/* Bottom Security Row */}
        <View style={styles.securityRow}>
          <Text style={styles.securityText}>SECURE DATA ENCRYPTION ENABLED</Text>
          <View style={styles.verifiedBadgeContainer}>
            <Lock size={14} color="#70B62C" style={{ marginRight: 6, marginTop: 2 }} />
            <View>
              <Text style={styles.verifiedTextLine}>
                {isPendingApproval ? 'Pending Verification' : 'Verified Institutional'}
              </Text>
              <Text style={styles.verifiedTextLine}>Member</Text>
            </View>
          </View>
        </View>

        {/* Bottom Scroll spacer */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Scroll to Top */}
      {showScrollTop && (
        <TouchableOpacity onPress={scrollToTop} style={styles.scrollTopButton} activeOpacity={0.85}>
          <ArrowUp size={20} color="white" />
        </TouchableOpacity>
      )}

      {/* Floating Bottom Nav Bar Mock */}
      <View style={navStyles.tabContainer}>
        <View style={navStyles.tabBar}>
          <TouchableOpacity onPress={() => navigateToTab('Home')} style={navStyles.tabItem}>
            <Home size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigateToTab('Analytics')} style={navStyles.tabItem}>
            <BarChart3 size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigateToTab('Post')} style={navStyles.tabItem}>
            <Newspaper size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigateToTab('Connection')} style={navStyles.tabItem}>
            <Users size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigateToTab('Events')} style={navStyles.tabItem}>
            <Calendar size={22} color="#134074" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ABOUT MODAL EDITOR */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isEditingAbout}
        onRequestClose={() => setIsEditingAbout(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit About</Text>
            <TextInput
              multiline
              numberOfLines={5}
              style={[styles.textInput, { height: 120, textAlignVertical: 'top' }]}
              value={tempAbout}
              onChangeText={setTempAbout}
              placeholder="Tell us about yourself..."
              placeholderTextColor="#94A3B8"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalBtn} 
                onPress={() => setIsEditingAbout(false)}
              >
                <Text style={[styles.btnText, { color: '#64748B' }]}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalBtn} 
                onPress={() => {
                  setAboutText(tempAbout);
                  setIsEditingAbout(false);
                  Alert.alert('Success', 'About section updated successfully.');
                }}
              >
                <Text style={[styles.btnText, { color: '#0D3866' }]}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
    backgroundColor: '#F4F7FC'
  },
  header: {
    height: 56,
    backgroundColor: '#EBF3FC',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  backButton: {
    padding: 8,
    marginLeft: -8
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D3866'
  },
  headerDeleteButton: {
    padding: 8,
    marginRight: -8
  },
  scrollContainer: {
    flex: 1
  },
  scrollContent: {
    padding: 16
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1
  },
  topCardRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarLarge: {
    width: 90,
    height: 90,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1'
  },
  topCardDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center'
  },
  usernameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0D3866'
  },
  subtitleText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2
  },
  connectionsText: {
    fontSize: 13,
    color: '#70B62C',
    fontWeight: '600',
    marginTop: 2
  },
  tierPill: {
    backgroundColor: '#5B7083',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center'
  },
  tierPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  memberIdText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 12
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14
  },
  aboutHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0D3866',
    marginBottom: 6
  },
  aboutBodyText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    fontWeight: '500'
  },
  editAboutLink: {
    color: '#0D3866',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 8
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D3866',
    letterSpacing: 0.5
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  listIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5FC',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12
  },
  listItemLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600'
  },
  listItemValue: {
    fontSize: 14,
    color: '#0D3866',
    fontWeight: '700',
    marginTop: 2
  },
  professionalContent: {
    paddingLeft: 4
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12
  },
  declineBtnSquare: {
    flex: 1,
    backgroundColor: '#DC2626',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DC2626'
  },
  declineBtnTextSquare: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  approveBtnSquare: {
    flex: 1,
    backgroundColor: '#70B62C',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#70B62C'
  },
  approveBtnTextSquare: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  messageBtnSquare: {
    flex: 1,
    backgroundColor: '#0D3866',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  messageBtnTextSquare: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  editBtnSquare: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#0D3866'
  },
  editBtnTextSquare: {
    color: '#0D3866',
    fontSize: 12,
    fontWeight: '800'
  },
  pendingDetailsContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2'
  },
  securityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16
  },
  securityText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D3866',
    flex: 1
  },
  verifiedBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  verifiedTextLine: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    textAlign: 'right'
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 12,
    marginTop: 4
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12
  },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 12
  },
  btnText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5
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

const navStyles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 100,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20
  },
  tabItemActive: {
    backgroundColor: '#f0fdf4'
  },
  tabLabel: {
    color: '#70B62C',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6
  }
});

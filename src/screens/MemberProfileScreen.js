import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Alert, StyleSheet, Platform, StatusBar } from 'react-native';
import { ArrowLeft, Check, Mail, Calendar, Key, Lock, Edit2, Trash2, History, Home, BarChart3, FileText, Users, Building2 } from 'lucide-react-native';
import Svg, { Rect, Circle, Path } from 'react-native-svg';
import { dbStore } from '../config/dbStore';
// Custom premium Directory Icon (Book with lens)
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
export const MemberProfileScreen = ({
  route,
  navigation,
  onBack
}) => {
  const initialParams = route?.params || {};
  const [memberData, setMemberData] = useState({
    name: initialParams.name || 'Sarah Jenkins',
    role: initialParams.role || 'Senior Auditor',
    branch: initialParams.branch || 'London Branch',
    tierLabel: initialParams.tierLabel || 'Platinum Member',
    memberId: initialParams.memberId || 'TAS-2024-8842',
    joinDate: initialParams.joinDate || 'Joined: Jan 2021',
    email: initialParams.email || 's.jenkins@pkf-international.com',
    fullIdCode: initialParams.fullIdCode || '8842-SJ-TAS',
    joinDateFull: initialParams.joinDateFull || 'January 14, 2021',
    firm: initialParams.firm || 'PKF International Ltd.',
    avatar: initialParams.avatar || require('../../assets/elena_profile.png')
  });

  // Sync state from dbStore and route params
  useEffect(() => {
    const syncMember = () => {
      // Find matching member in the store
      const idToSearch = route?.params?.memberId || initialParams?.memberId || memberData.memberId;
      const storeMember = dbStore.getMembers().find(m => m.id === idToSearch || m.memberId === idToSearch);
      
      if (storeMember) {
        setMemberData({
          name: storeMember.name,
          role: storeMember.designation,
          branch: storeMember.tier === 'PLATINUM' ? 'London Branch' : 'Regional Branch',
          tierLabel: storeMember.tierLabel,
          memberId: storeMember.memberId,
          joinDate: 'Joined: Jan 2021',
          email: route?.params?.email || `${storeMember.name.toLowerCase().replace(' ', '.').replace('dr.', '')}@tas-governance.org`,
          fullIdCode: `${storeMember.memberId}-SJ-TAS`,
          joinDateFull: 'January 14, 2021',
          firm: storeMember.company,
          avatar: storeMember.avatar
        });
      } else if (route?.params) {
        // Fallback to route parameters if not in global store yet
        setMemberData({
          name: route.params.name || memberData.name,
          role: route.params.role || memberData.role,
          branch: route.params.branch || memberData.branch,
          tierLabel: route.params.tierLabel || memberData.tierLabel,
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
  return <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#134074" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Members Profile</Text>
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
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* CARD 1: HERO SECTION */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 8, width: '100%' }}>
            <View style={styles.platinumBadge}>
              <View style={styles.checkCircle}>
                <Check size={9} color="#FFFFFF" strokeWidth={3.5} />
              </View>
              <Text style={styles.badgeText}>{memberData.tierLabel || 'Platinum Member'}</Text>
            </View>
          </View>

          <View style={styles.avatarContainer}>
            <Image source={memberData.avatar} style={styles.avatar} />
          </View>

          <Text style={styles.memberName}>{memberData.name}</Text>
          <Text style={styles.memberSubtitle}>
            {memberData.role} • {memberData.branch}
          </Text>

          {/* Badges Row */}
          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#134074" strokeWidth="2" style={{ marginRight: 6 }}>
                <Rect x="3" y="4" width="18" height="16" rx="2" />
                <Path d="M7 8h10M7 12h10M7 16h6" />
              </Svg>
              <Text style={styles.metaBadgeText}>ID: {memberData.memberId}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Calendar size={14} color="#134074" style={{ marginRight: 6 }} />
              <Text style={styles.metaBadgeText}>{memberData.joinDate}</Text>
            </View>
          </View>
        </View>

        {/* ACTIONS ROW */}
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
            <Mail size={22} color="#FFFFFF" style={{ marginBottom: 8 }} />
            <Text style={styles.messageBtnTextSquare}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.editBtnSquare} 
            onPress={() => {
              if (navigation) {
                navigation.navigate('EditDetails', { memberData });
              } else {
                Alert.alert('Edit Details', 'Details editing mode active.');
              }
            }} 
            activeOpacity={0.8}
          >
            <Edit2 size={20} color="#0F2C59" style={{ marginBottom: 8 }} />
            <Text style={styles.editBtnTextSquare}>Edit Details</Text>
          </TouchableOpacity>
        </View>

        {/* CARD 3: MEMBER INFORMATION */}
        <View style={styles.card}>
          <View style={styles.memberInfoTitleRow}>
            <Text style={styles.infoTitle}>Member Information</Text>
          </View>

          {/* Email field */}
          <View style={styles.infoField}>
            <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
            <View style={styles.fieldValueContainer}>
              <View style={styles.fieldIconContainer}>
                <Text style={styles.fieldIconAt}>@</Text>
              </View>
              <Text style={styles.fieldValue}>{memberData.email}</Text>
            </View>
          </View>

          {/* Member ID field */}
          <View style={styles.infoField}>
            <Text style={styles.fieldLabel}>MEMBER ID</Text>
            <View style={styles.fieldValueContainer}>
              <Key size={16} color="#64748B" style={{ marginRight: 8, transform: [{ rotate: '-45deg' }] }} />
              <Text style={styles.fieldValue}>{memberData.fullIdCode || '8842-SJ-TAS'}</Text>
            </View>
          </View>

          {/* Join Date field */}
          <View style={styles.infoField}>
            <Text style={styles.fieldLabel}>JOIN DATE</Text>
            <View style={styles.fieldValueContainer}>
              <Calendar size={16} color="#64748B" style={{ marginRight: 8 }} />
              <Text style={styles.fieldValue}>{memberData.joinDateFull || 'January 14, 2021'}</Text>
            </View>
          </View>

          {/* Primary Firm field */}
          <View style={styles.infoField}>
            <Text style={styles.fieldLabel}>PRIMARY FIRM</Text>
            <View style={styles.fieldValueContainer}>
              <Building2 size={16} color="#64748B" style={{ marginRight: 8 }} />
              <Text style={styles.fieldValue}>{memberData.firm || 'PKF International Ltd.'}</Text>
            </View>
          </View>

          {/* Bottom Security Row */}
          <View style={styles.securityRow}>
            <Text style={styles.securityText}>SECURE DATA ENCRYPTION ENABLED</Text>
            <View style={styles.verifiedBadgeContainer}>
              <Lock size={14} color="#4E8D15" style={{ marginRight: 6, marginTop: 2 }} />
              <View>
                <Text style={styles.verifiedTextLine}>Verified Institutional</Text>
                <Text style={styles.verifiedTextLine}>Member</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Scroll spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Bottom Nav Bar Mock */}
      <View style={navStyles.tabContainer}>
        <View style={navStyles.tabBar}>
          <TouchableOpacity onPress={() => navigateToTab('Home')} style={navStyles.tabItem}>
            <Home size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigateToTab('Analytics')} style={navStyles.tabItem}>
            <BarChart3 size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigateToTab('Posts')} style={navStyles.tabItem}>
            <FileText size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigateToTab('Messages')} style={navStyles.tabItem}>
            <Users size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBack} style={[navStyles.tabItem, navStyles.tabItemActive]}>
            <DirectoryBookIcon color="#70B62C" />
            <Text style={navStyles.tabLabel}>Directory</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>;
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
    backgroundColor: '#F4F7FB'
  },
  header: {
    height: Platform.OS === 'android' ? 56 + StatusBar.currentHeight : 56,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#E3EEFF', // Light blue wash
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F2C59',
    textAlign: 'center',
  },
  headerDeleteButton: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
    padding: 8
  },
  scrollContainer: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 140
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1
  },
  badgeContainer: {
    alignSelf: 'flex-end',
    marginBottom: 8
  },
  platinumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D2F4B3', // Soft green pill background
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12
  },
  checkCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4E8D15', // Green badge circle
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6
  },
  badgeText: {
    color: '#4E8D15',
    fontSize: 11,
    fontWeight: '800'
  },
  avatarContainer: {
    alignSelf: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  memberName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0E3866',
    textAlign: 'center',
    marginTop: 16,
  },
  memberSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3EEFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  metaBadgeText: {
    color: '#134074',
    fontSize: 12.5,
    fontWeight: '700'
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16
  },
  messageBtnSquare: {
    flex: 1,
    backgroundColor: '#0F2C59',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    shadowColor: '#0F2C59',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  messageBtnTextSquare: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  editBtnSquare: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  editBtnTextSquare: {
    color: '#0F2C59',
    fontSize: 13,
    fontWeight: '700',
  },
  memberInfoTitleRow: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F2C59'
  },
  infoField: {
    marginBottom: 20
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 6
  },
  fieldValueContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  fieldIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#64748B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  fieldIconAt: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B'
  },
  securityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
    marginTop: 8
  },
  securityText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.3
  },
  verifiedBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  verifiedTextLine: {
    color: '#4E8D15',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'left',
    lineHeight: 14,
  }
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
    backgroundColor: '#f0fdf4' // Soft green background tint for active
  },
  tabLabel: {
    color: '#70B62C',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6
  }
});

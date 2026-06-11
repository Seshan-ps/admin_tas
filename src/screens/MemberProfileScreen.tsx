import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  Check,
  Mail,
  Calendar,
  Key,
  Lock,
  Edit2,
  History,
  Shield,
  Home,
  BarChart3,
  FileText,
  Users,
  Building2,
} from 'lucide-react-native';
import Svg, { Rect, Circle, Path } from 'react-native-svg';

interface MemberProfileProps {
  route?: any;
  navigation?: any;
  onBack?: () => void;
}

// Custom premium Directory Icon (Book with lens)
const DirectoryBookIcon = ({ color }: { color: string }) => (
  <View style={{ width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="2" width="16" height="20" rx="3" fill="none" stroke={color} strokeWidth="2.5" />
      <Path d="M8 2v20" stroke={color} strokeWidth="1.5" />
      <Circle cx="14" cy="10" r="3" stroke={color} strokeWidth="2" fill="white" />
      <Path d="M16.5 12.5l2.5 2.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  </View>
);

export const MemberProfileScreen: React.FC<MemberProfileProps> = ({
  route,
  navigation,
  onBack,
}) => {
  // Use route params if available, otherwise default to Sarah Jenkins
  const memberData = route?.params || {
    name: 'Sarah Jenkins',
    role: 'Senior Auditor',
    branch: 'London Branch',
    tierLabel: 'Platinum Member',
    memberId: 'TAS-2024-8842',
    joinDate: 'Joined: Jan 2021',
    email: 's.jenkins@pkf-international.com',
    fullIdCode: '8842-SJ-TAS',
    joinDateFull: 'January 14, 2021',
    firm: 'PKF International Ltd.',
    avatar: require('../../assets/elena_profile.png'), // Default to the female profile avatar
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  const navigateToTab = (tabName: string) => {
    if (navigation) {
      navigation.navigate('MainTabs', { screen: tabName });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E3A8A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Members Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {/* CARD 1: HERO SECTION */}
        <View style={styles.card}>
          <View style={styles.badgeContainer}>
            <View style={styles.platinumBadge}>
              <View style={styles.checkCircle}>
                <Check size={10} color="#FFFFFF" strokeWidth={3} />
              </View>
              <Text style={styles.badgeText}>{memberData.tierLabel}</Text>
            </View>
          </View>

          <View style={styles.avatarContainer}>
            <Image
              source={memberData.avatar}
              style={styles.avatar}
            />
          </View>

          <Text style={styles.memberName}>{memberData.name}</Text>
          <Text style={styles.memberSubtitle}>
            {memberData.role} • {memberData.branch}
          </Text>

          {/* Badges Row */}
          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" style={{ marginRight: 6 }}>
                <Rect x="3" y="4" width="18" height="16" rx="2" />
                <Path d="M7 8h10M7 12h10M7 16h6" />
              </Svg>
              <Text style={styles.metaBadgeText}>ID: {memberData.memberId}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Calendar size={14} color="#60A5FA" style={{ marginRight: 6 }} />
              <Text style={styles.metaBadgeText}>{memberData.joinDate}</Text>
            </View>
          </View>
        </View>

        {/* CARD 2: VIEW AUDIT LOG */}
        <TouchableOpacity 
          style={styles.auditLogBtn}
          onPress={() => Alert.alert('Audit Log', `Viewing security audit logs for ${memberData.name}`)}
          activeOpacity={0.7}
        >
          <History size={24} color="#1E3A8A" style={{ marginBottom: 6 }} />
          <Text style={styles.auditLogText}>View Audit Log</Text>
        </TouchableOpacity>

        {/* ACTIONS ROW */}
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.messageBtn}
            onPress={() => Alert.alert('Secure Message', `Opening direct message with ${memberData.name}`)}
            activeOpacity={0.8}
          >
            <Mail size={18} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.messageBtnText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.permissionsBtn}
            onPress={() => Alert.alert('Edit Permissions', `Modifying administrative ACLs for ${memberData.name}`)}
            activeOpacity={0.8}
          >
            <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" strokeWidth="2" style={{ marginRight: 8 }}>
              <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <Circle cx="12" cy="11" r="2" />
              <Path d="M12 13v3" />
            </Svg>
            <Text style={styles.permissionsBtnText}>Edit Permissions</Text>
          </TouchableOpacity>
        </View>

        {/* CARD 3: MEMBER INFORMATION */}
        <View style={styles.card}>
          <View style={styles.memberInfoTitleRow}>
            <Text style={styles.infoTitle}>Member Information</Text>
            <TouchableOpacity 
              style={styles.editBtn}
              onPress={() => Alert.alert('Edit Details', 'Details editing mode active.')}
            >
              <Edit2 size={14} color="#1E3A8A" style={{ marginRight: 4 }} />
              <Text style={styles.editBtnText}>Edit Details</Text>
            </TouchableOpacity>
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
              <Key size={16} color="#64748B" style={{ marginRight: 8 }} />
              <Text style={styles.fieldValue}>{memberData.fullIdCode}</Text>
            </View>
          </View>

          {/* Join Date field */}
          <View style={styles.infoField}>
            <Text style={styles.fieldLabel}>JOIN DATE</Text>
            <View style={styles.fieldValueContainer}>
              <Calendar size={16} color="#64748B" style={{ marginRight: 8 }} />
              <Text style={styles.fieldValue}>{memberData.joinDateFull}</Text>
            </View>
          </View>

          {/* Primary Firm field */}
          <View style={styles.infoField}>
            <Text style={styles.fieldLabel}>PRIMARY FIRM</Text>
            <View style={styles.fieldValueContainer}>
              <Building2 size={16} color="#64748B" style={{ marginRight: 8 }} />
              <Text style={styles.fieldValue}>{memberData.firm}</Text>
            </View>
          </View>

          {/* Bottom Security Row */}
          <View style={styles.securityRow}>
            <Text style={styles.securityText}>SECURE DATA ENCRYPTION ENABLED</Text>
            <View style={styles.verifiedBadge}>
              <Lock size={12} color="#4D7C0F" style={{ marginRight: 4 }} />
              <Text style={styles.verifiedText}>Verified Institutional Member</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  header: {
    height: 56,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F2C59',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  badgeContainer: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  platinumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BEF264',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
  },
  checkCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4D7C0F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  badgeText: {
    color: '#3F6212',
    fontSize: 11,
    fontWeight: '700',
  },
  avatarContainer: {
    alignSelf: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  memberName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F2C59',
    textAlign: 'center',
  },
  memberSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  metaBadgeText: {
    color: '#1E40AF',
    fontSize: 12,
    fontWeight: '700',
  },
  auditLogBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  auditLogText: {
    color: '#1E3A8A',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  messageBtn: {
    flex: 1,
    backgroundColor: '#0F2C59',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  messageBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  permissionsBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  permissionsBtnText: {
    color: '#1E3A8A',
    fontSize: 13,
    fontWeight: '700',
  },
  memberInfoTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F2C59',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBtnText: {
    color: '#1E3A8A',
    fontSize: 13,
    fontWeight: '700',
  },
  infoField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  fieldValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldIconContainer: {
    marginRight: 8,
    width: 16,
    alignItems: 'center',
  },
  fieldIconAt: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  securityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
    marginTop: 8,
  },
  securityText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.3,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    color: '#4D7C0F',
    fontSize: 10,
    fontWeight: '700',
  },
});

const navStyles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 35,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tabItemActive: {
    backgroundColor: '#f0fdf4', // Soft green background tint for active
  },
  tabLabel: {
    color: '#70B62C',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
});

import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Alert, StyleSheet } from 'react-native';
import { ArrowLeft, User, Briefcase, Shield, Calendar, CheckCircle, AlertTriangle, LogOut, ArrowUp } from 'lucide-react-native';
import { supabase } from '../config/supabase';
export const ProfileScreen = ({
  onBack,
  onSignOut,
  navigation
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollViewRef = useRef(null);
  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 200);
  };
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true
    });
  };
  const handleSignOut = async () => {
    try {
      const {
        error
      } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Sign Out Error', error.message);
      } else {
        Alert.alert('Signed Out', 'You have been signed out securely.');
        onSignOut();
      }
    } catch (err) {
      Alert.alert('Signed Out', 'Session cleared successfully.');
      onSignOut();
    }
  };
  return <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={22} color="#0D3866" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{
        width: 44
      }} />
      </View>

      <ScrollView ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          {/* Avatar Container */}
          <View style={styles.avatarContainer}>
            <Image source={require('../../assets/admin_profile.png')} style={styles.avatar} />
            {/* Green active status dot */}
            <View style={styles.statusDot} />
          </View>

          {/* User Details */}
          <Text style={styles.username}>VGM_admin</Text>
          
          <View style={styles.activePill}>
            <Text style={styles.activeText}>• Active</Text>
          </View>
          
          <Text style={styles.roleTitle}>Senior Administrator</Text>
          
          <View style={styles.memberSinceRow}>
            <Calendar size={14} color="#64748b" style={{
            marginRight: 6
          }} />
            <Text style={styles.memberSinceText}>Member since January 2019</Text>
          </View>
        </View>

        {/* SECTION 1: PERSONAL INFORMATION */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrapper}>
              <User size={18} color="#0D3866" />
            </View>
            <Text style={styles.cardHeaderTitle}>Personal Information</Text>
          </View>

          <View style={styles.fieldList}>
            {/* Full Name */}
            <View style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>FULL NAME</Text>
              <Text style={styles.fieldValue}>Marcus Thornton</Text>
            </View>

            {/* Employee ID */}
            <View style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>EMPLOYEE ID</Text>
              <Text style={styles.fieldValue}>TAS-992-04X</Text>
            </View>

            {/* Email Address */}
            <View style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
              <Text style={styles.fieldValue}>m.thornton@tas-governance.org</Text>
            </View>

            {/* Phone */}
            <View style={[styles.fieldItem, {
            borderBottomWidth: 0,
            paddingBottom: 0
          }]}>
              <Text style={styles.fieldLabel}>PHONE</Text>
              <Text style={styles.fieldValue}>+1 (555) 012-3456</Text>
            </View>
          </View>
        </View>

        {/* SECTION 2: PROFESSIONAL ROLE */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrapper}>
              <Briefcase size={18} color="#0D3866" />
            </View>
            <Text style={styles.cardHeaderTitle}>Professional Role</Text>
          </View>

          {/* Department */}
          <View style={[styles.roleSubCard, styles.blueLeftBorder]}>
            <Text style={styles.roleSubCardLabel}>DEPARTMENT</Text>
            <Text style={styles.roleSubCardValue}>Governance & Oversight</Text>
          </View>

          {/* Access Level */}
          <View style={[styles.roleSubCard, styles.greenLeftBorder]}>
            <Text style={styles.roleSubCardLabel}>ACCESS LEVEL</Text>
            <Text style={styles.roleSubCardValue}>Super Admin</Text>
          </View>

          {/* Core Permissions */}
          <Text style={styles.permissionsTitle}>CORE PERMISSIONS</Text>
          <View style={styles.badgeRow}>
            <View style={styles.permissionBadge}>
              <Text style={styles.badgeText}>SYSTEM_WRITE</Text>
            </View>
            <View style={styles.permissionBadge}>
              <Text style={styles.badgeText}>USER_AUDIT</Text>
            </View>
            <View style={styles.permissionBadge}>
              <Text style={styles.badgeText}>FISCAL_VIEW</Text>
            </View>
          </View>
        </View>

        {/* SECTION 3: SECURITY SETTINGS */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrapper}>
              <Shield size={18} color="#0D3866" />
            </View>
            <Text style={styles.cardHeaderTitle}>Security Settings</Text>
          </View>

          {/* 2FA Status */}
          <View style={styles.securityItem}>
            <CheckCircle size={20} color="#467A18" style={{
            marginTop: 2,
            marginRight: 10
          }} />
            <View style={{
            flex: 1
          }}>
              <Text style={styles.securityItemTitle}>2FA Status: Enabled</Text>
              <Text style={styles.securityItemDesc}>
                Authenticated via Hardware Token (YubiKey 5C).
              </Text>
            </View>
          </View>

          {/* Password Age Warning */}
          <View style={[styles.securityItem, styles.warningItem]}>
            <AlertTriangle size={20} color="#B91C1C" style={{
            marginTop: 2,
            marginRight: 10
          }} />
            <View style={{
            flex: 1
          }}>
              <Text style={[styles.securityItemTitle, {
              color: '#991B1B'
            }]}>Last Password Change</Text>
              <Text style={[styles.securityItemDesc, {
              color: '#B91C1C'
            }]}>
                45 days ago. Recommended change in 15 days.
              </Text>
            </View>
          </View>
        </View>

        {/* SIGN OUT BUTTON */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.8}>
          <LogOut size={16} color="#DC2626" style={{
          marginRight: 8
        }} />
          <Text style={styles.signOutButtonText}>Sign Out Securely</Text>
        </TouchableOpacity>

        {/* Bottom spacer for tabs */}
        <View style={{
        height: 100
      }} />
      </ScrollView>

      {/* Floating Scroll to Top */}
      {showScrollTop && <TouchableOpacity onPress={scrollToTop} activeOpacity={0.85} style={styles.scrollTopButton}>
          <ArrowUp size={20} color="white" />
        </TouchableOpacity>}
    </SafeAreaView>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  header: {
    height: 56,
    backgroundColor: '#E9F0FA',
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
  scrollContainer: {
    flex: 1
  },
  scrollContent: {
    padding: 16
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8
  },
  avatarContainer: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#467A18',
    borderWidth: 3,
    borderColor: '#FFFFFF'
  },
  username: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0D3866',
    marginTop: 14
  },
  activePill: {
    backgroundColor: '#AEE874',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2.5,
    marginTop: 6
  },
  activeText: {
    color: '#2B5713',
    fontSize: 11,
    fontWeight: '800'
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginTop: 8
  },
  memberSinceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6
  },
  memberSinceText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  iconWrapper: {
    backgroundColor: '#E9F0FA',
    padding: 8,
    borderRadius: 8,
    marginRight: 10
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D3866'
  },
  fieldList: {
    flexDirection: 'column'
  },
  fieldItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
    marginBottom: 10
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  fieldValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334D6E'
  },
  roleSubCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10
  },
  blueLeftBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#0D3866'
  },
  greenLeftBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#467A18'
  },
  roleSubCardLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  roleSubCardValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D3866'
  },
  permissionsTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 8
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8
  },
  permissionBadge: {
    backgroundColor: '#E9F0FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DBEAFE'
  },
  badgeText: {
    color: '#0D3866',
    fontSize: 9,
    fontWeight: '700'
  },
  securityItem: {
    backgroundColor: '#F0F5FC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 10
  },
  warningItem: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5'
  },
  securityItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334D6E',
    marginBottom: 2
  },
  securityItemDesc: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15
  },
  signOutButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  signOutButtonText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700'
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 30,
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
  }
});

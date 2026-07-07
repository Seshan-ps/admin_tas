import React, { useState } from 'react';
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
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, Info, Lock } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import { dbStore } from '../config/dbStore';

export const EditDetailsScreen = ({ route, navigation }) => {
  const isCommunity = route?.params?.type === 'community';

  const memberData = route?.params?.memberData || {
    name: 'Sarah Jenkins',
    role: 'Senior Auditor',
    branch: 'Regional Branch',
    tierLabel: 'Premium Member',
    tier: 'Premium',
    memberId: 'TAS-2024-8842',
    joinDate: 'Joined: Jan 2021',
    email: 's.jenkins@pkf-international.com',
    fullIdCode: '8842-SJ-TAS',
    joinDateFull: 'January 14, 2021',
    firm: 'PKF International Ltd.',
    avatar: require('../../assets/elena_profile.png')
  };

  const communityData = route?.params?.communityData || {
    id: '',
    name: 'TAX COMPLIANCE & AUDIT NETWORK',
    description: 'Tax and auditing collaboration network for registered professionals.',
    category: 'TAX COMPLIANCE & AUDIT NETWORK',
    membersCount: '4 Members'
  };

  // State hooks for Member
  const [fullName, setFullName] = useState(memberData.name);
  const [email, setEmail] = useState(memberData.email);
  const [memberId, setMemberId] = useState(memberData.fullIdCode);
  const [firm, setFirm] = useState(memberData.firm);
  const [avatar, setAvatar] = useState(memberData.avatar);
  const [roleType, setRoleType] = useState('Member');

  // State hooks for Community
  const [commName, setCommName] = useState(communityData.name);
  const [commDesc, setCommDesc] = useState(communityData.description);
  const [commCategory, setCommCategory] = useState(communityData.category);
  const [commMembers, setCommMembers] = useState(communityData.membersCount);

  const handlePickPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need gallery permissions to change the photo!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatar({ uri: result.assets[0].uri });
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const handleSave = () => {
    if (isCommunity) {
      if (!commName.trim() || !commDesc.trim() || !commCategory.trim()) {
        Alert.alert('Incomplete Fields', 'Please fill in all community information fields.');
        return;
      }

      // Update in dbStore
      dbStore.groups = dbStore.groups.map(g => {
        if (g.category === communityData.category) {
          return {
            ...g,
            category: commCategory.trim(),
            name: g.category === g.name ? commName.trim() : g.name
          };
        }
        return g;
      });
      dbStore.notify();

      Alert.alert('Changes Saved', 'Community details updated successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          }
        }
      ]);
      return;
    }

    if (!fullName.trim() || !email.trim() || !memberId.trim() || !firm.trim()) {
      Alert.alert('Incomplete Fields', 'Please fill in all general information fields.');
      return;
    }

    // Persist changes globally in dbStore
    dbStore.updateMember(memberData.memberId, {
      name: fullName.trim(),
      company: firm.trim(),
      memberId: memberId.trim(),
      avatar: avatar,
      designation: roleType === 'Admin' ? 'Admin' : 'Senior Auditor'
    });

    const updatedMember = {
      ...memberData,
      name: fullName.trim(),
      email: email.trim(),
      fullIdCode: memberId.trim(),
      memberId: memberId.trim(),
      firm: firm.trim(),
      avatar: avatar,
      role: roleType === 'Admin' ? 'Admin' : 'Senior Auditor'
    };

    Alert.alert('Changes Saved', 'Member details updated successfully!', [
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('MemberProfile', updatedMember);
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={22} color="#0D3866" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isCommunity ? 'Edit Community' : 'Edit Details'}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isCommunity ? (
          /* COMMUNITY EDIT FIELDS */
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Community Information</Text>
            <View style={styles.titleDivider} />

            <Text style={styles.inputLabel}>Community Name</Text>
            <TextInput
              style={styles.textInput}
              value={commName}
              onChangeText={setCommName}
              placeholder="Enter community name"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
              value={commDesc}
              onChangeText={setCommDesc}
              placeholder="Enter description"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
            />

            <Text style={styles.inputLabel}>Category</Text>
            <TextInput
              style={styles.textInput}
              value={commCategory}
              onChangeText={setCommCategory}
              placeholder="Enter category"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.inputLabel}>Members Count</Text>
            <TextInput
              style={styles.textInput}
              value={commMembers}
              onChangeText={setCommMembers}
              placeholder="e.g. 4 Members"
              placeholderTextColor="#94A3B8"
            />
          </View>
        ) : (
          /* MEMBER EDIT FIELDS */
          <>
            {/* CARD 1: PHOTO SECTION */}
            <View style={styles.card}>
              <View style={styles.avatarWrapperContainer}>
                <View style={styles.avatarWrapper}>
                  <Image source={typeof avatar === 'string' ? { uri: avatar } : avatar} style={styles.avatar} />
                  <TouchableOpacity style={styles.cameraIconButton} onPress={handlePickPhoto} activeOpacity={0.8}>
                    <Camera size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.memberName}>{fullName}</Text>
              <TouchableOpacity onPress={handlePickPhoto} activeOpacity={0.7}>
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            </View>

            {/* CARD 2: GENERAL INFORMATION */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>General Information</Text>
              <View style={styles.titleDivider} />

              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Member ID</Text>
              <TextInput
                style={styles.textInput}
                value={memberId}
                onChangeText={setMemberId}
                placeholder="Enter member ID"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.inputLabel}>Primary Firm</Text>
              <TextInput
                style={styles.textInput}
                value={firm}
                onChangeText={setFirm}
                placeholder="Enter primary firm"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* CARD 3: ROLE & ACCESSIBILITY */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Role & Accessibility</Text>
              <View style={styles.titleDivider} />

              {/* Segmented control */}
              <View style={styles.segmentedControl}>
                <TouchableOpacity 
                  style={[styles.segmentTab, roleType === 'Member' && styles.segmentTabActive]}
                  onPress={() => setRoleType('Member')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.segmentTabText, roleType === 'Member' && styles.segmentTabTextActive]}>
                    Member
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.segmentTab, roleType === 'Admin' && styles.segmentTabActive]}
                  onPress={() => setRoleType('Admin')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.segmentTabText, roleType === 'Admin' && styles.segmentTabTextActive]}>
                    Admin
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Info Box */}
              <View style={styles.infoBox}>
                <Info size={18} color="#0F2C59" style={{ marginRight: 10, marginTop: 2 }} />
                <Text style={styles.infoBoxText}>
                  {roleType === 'Member' 
                    ? "As a Member, the user has read-only access to society directories and can participate in community forums and member events."
                    : "As an Admin, the user has read-write access to society directories, can edit members, and has administrative access to settings and reporting tools."}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Save / Cancel Buttons */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        {/* Encryption Badge */}
        <View style={styles.encryptionBadgeContainer}>
          <View style={styles.encryptionBadge}>
            <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <Path 
                d="M20 6L9 17L4 12" 
                stroke="#15803D" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none"
              />
            </Svg>
            <Text style={styles.encryptionBadgeText}>SECURE DATA ENCRYPTION ENABLED</Text>
          </View>
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1
  },
  avatarWrapperContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8
  },
  avatarWrapper: {
    position: 'relative'
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1'
  },
  cameraIconButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#0E3866',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  memberName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0E3866',
    textAlign: 'center',
    marginTop: 12
  },
  changePhotoText: {
    fontSize: 14,
    color: '#3D6A05',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0E3866',
    marginBottom: 12
  },
  titleDivider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0E3866',
    marginBottom: 8
  },
  textInput: {
    backgroundColor: '#E3EEFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 16
  },
  segmentedControl: {
    backgroundColor: '#E3EEFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 3,
    marginBottom: 16
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6
  },
  segmentTabActive: {
    backgroundColor: '#0F2C59'
  },
  segmentTabText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F2C59'
  },
  segmentTabTextActive: {
    color: '#FFFFFF'
  },
  infoBox: {
    backgroundColor: '#E3EEFF',
    borderLeftWidth: 4,
    borderLeftColor: '#0F2C59',
    borderRadius: 6,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  infoBoxText: {
    flex: 1,
    color: '#0F2C59',
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '600'
  },
  saveButton: {
    backgroundColor: '#3D6A05',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 8
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  cancelButtonText: {
    color: '#0F2C59',
    fontSize: 15,
    fontWeight: '800'
  },
  encryptionBadgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  encryptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3EEFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  encryptionBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1E3A8A',
    marginLeft: 6
  }
});

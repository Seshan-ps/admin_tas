import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  Lock,
  Plus,
  Home,
  BarChart3,
  FileText,
  Users,
  Check,
} from 'lucide-react-native';
import Svg, { Rect, Circle, Path } from 'react-native-svg';
import { dbStore } from '../config/dbStore';

interface CreateEventScreenProps {
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

export const CreateEventScreen: React.FC<CreateEventScreenProps> = ({
  route,
  navigation,
  onBack,
}) => {
  const isEditing = !!route?.params?.isEditing;
  const eventData = route?.params || {};

  const [title, setTitle] = useState(eventData.title || '');
  const [date, setDate] = useState(eventData.date || '');
  const [startTime, setStartTime] = useState(eventData.startTime || '09:00 AM');
  const [location, setLocation] = useState(eventData.location || '');
  const [capacity, setCapacity] = useState(eventData.capacity ? String(eventData.capacity) : '300');
  const [privacy, setPrivacy] = useState(eventData.privacy || 'Members Only');
  const [deadline, setDeadline] = useState(eventData.deadline || '');
  const [description, setDescription] = useState(
    eventData.description ||
    'The 2024 Annual Tax Summit is the premier gathering for accounting professionals, providing deep insights into new legislative changes, international compliance standards, and digital transformation in fiscal reporting.'
  );

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  const handleSaveChanges = () => {
    if (!title || !date) {
      Alert.alert('Incomplete Form', 'Please enter at least the Event Title and Date.');
      return;
    }
    if (!isEditing) {
      dbStore.addEvent({
        id: `e_${Date.now()}`,
        title,
        date,
        location,
        attendees: parseInt(capacity) || 0,
      });
    }
    Alert.alert('Success', isEditing ? 'Event changes have been securely saved.' : 'Event draft has been securely created and saved.', [
      { text: 'OK', onPress: () => handleBack() }
    ]);
  };

  const handleDiscard = () => {
    Alert.alert(
      isEditing ? 'Discard Changes' : 'Discard Draft',
      isEditing ? 'Are you sure you want to discard your changes?' : 'Are you sure you want to discard this event draft?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => handleBack() },
      ]
    );
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
          <ArrowLeft size={24} color="#0D3866" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Events</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Segmented Switcher (Members vs Events) */}
      <View style={styles.switcherContainer}>
        <View style={styles.switcherTrack}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.switcherButton}
            activeOpacity={0.8}
          >
            <Text style={styles.switcherText}>Members</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.switcherButton, styles.switcherButtonActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.switcherText, styles.switcherTextActive]}>Events</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title & Status Block */}
        <View style={styles.titleBlock}>
          <Text style={styles.pageTitle}>
            {isEditing ? 'Edit Event' : 'Event'}
          </Text>
          <Text style={styles.pageSubtitle}>
            {isEditing 
              ? 'Update the details for the upcoming taxation summit.' 
              : 'Create a new event'}
          </Text>
          <View style={styles.statusBadge}>
            <View style={styles.checkCircle}>
              <Check size={9} color="#FFFFFF" strokeWidth={3} />
            </View>
            <Text style={styles.statusBadgeText}>SECURE DRAFT</Text>
          </View>
        </View>

        {/* FORM CARD */}
        <View style={styles.card}>
          {/* SECTION 1: GENERAL INFORMATION */}
          <Text style={styles.sectionTitle}>General Information</Text>
          
          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Event Title</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Title"
              placeholderTextColor="#94a3b8"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Date</Text>
            <View style={styles.inputIconContainer}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="dd/mm/yyyy"
                placeholderTextColor="#94a3b8"
                value={date}
                onChangeText={setDate}
              />
              <Calendar size={18} color="#94a3b8" style={styles.inputIcon} />
            </View>
          </View>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Start Time</Text>
            <View style={styles.inputIconContainer}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="00:00 AM"
                placeholderTextColor="#94a3b8"
                value={startTime}
                onChangeText={setStartTime}
              />
              <Clock size={18} color="#94a3b8" style={styles.inputIcon} />
            </View>
          </View>

          {/* SECTION 2: LOGISTICS & CAPACITY */}
          <View style={styles.sectionDivider} />
          <Text style={styles.sectionTitle}>Logistics & Capacity</Text>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Location</Text>
            <View style={styles.inputIconContainer}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="venue"
                placeholderTextColor="#94a3b8"
                value={location}
                onChangeText={setLocation}
              />
              <MapPin size={18} color="#94a3b8" style={styles.inputIcon} />
            </View>
          </View>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Capacity</Text>
            <TextInput
              style={styles.textInput}
              placeholder="300"
              placeholderTextColor="#94a3b8"
              value={capacity}
              onChangeText={setCapacity}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Privacy</Text>
            <TouchableOpacity 
              style={styles.dropdownTrigger}
              onPress={() => {
                Alert.alert('Select Privacy', 'Choose event visibility level', [
                  { text: 'Members Only', onPress: () => setPrivacy('Members Only') },
                  { text: 'Public Access', onPress: () => setPrivacy('Public Access') },
                  { text: 'Invite Only', onPress: () => setPrivacy('Invite Only') },
                ]);
              }}
            >
              <Text style={styles.dropdownText}>{privacy}</Text>
              <ChevronDown size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Registration Deadline</Text>
            <View style={styles.inputIconContainer}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="dd/mm/yyyy"
                placeholderTextColor="#94a3b8"
                value={deadline}
                onChangeText={setDeadline}
              />
              <Calendar size={18} color="#94a3b8" style={styles.inputIcon} />
            </View>
          </View>

          {/* SECTION 3: EVENT CONTENT */}
          <View style={styles.sectionDivider} />
          <Text style={styles.sectionTitle}>Event Content</Text>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Enter event details..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={6}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* ACTION BUTTONS */}
          <View style={{ marginTop: 24, gap: 12 }}>
            <TouchableOpacity 
              style={styles.discardBtn} 
              onPress={handleDiscard}
              activeOpacity={0.8}
            >
              <Text style={styles.discardBtnText}>Discard Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.saveBtn} 
              onPress={handleSaveChanges}
              activeOpacity={0.8}
            >
              <View style={styles.checkCircleWhite}>
                <Check size={10} color="#3F6212" strokeWidth={3} />
              </View>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scroll spacer */}
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
    color: '#0D3866',
  },
  switcherContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  switcherTrack: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 3,
  },
  switcherButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  switcherButtonActive: {
    backgroundColor: '#0D3866',
  },
  switcherText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  switcherTextActive: {
    color: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  titleBlock: {
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0D3866',
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  checkCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4D7C0F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  statusBadgeText: {
    color: '#1E40AF',
    fontSize: 10,
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D3866',
    marginBottom: 16,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 20,
  },
  fieldItem: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D3866',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1E293B',
  },
  inputIconContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  textInputWithIcon: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingLeft: 12,
    paddingRight: 40,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1E293B',
  },
  inputIcon: {
    position: 'absolute',
    right: 12,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: '#1E293B',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  discardBtn: {
    borderWidth: 1,
    borderColor: '#0D3866',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  discardBtnText: {
    color: '#0D3866',
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: '#3F6212',
    borderRadius: 6,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleWhite: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
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
    backgroundColor: '#f0fdf4',
  },
  tabLabel: {
    color: '#70B62C',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
});

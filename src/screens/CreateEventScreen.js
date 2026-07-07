import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, StyleSheet, Platform, StatusBar, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Clock, MapPin, ChevronDown, Home, BarChart3, Newspaper, Users, Check, Trash2, Plus, Search } from 'lucide-react-native';
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


export const CreateEventScreen = ({
  route,
  navigation,
  onBack
}) => {
  const isEditing = !!route?.params?.isEditing;
  const eventData = route?.params || {};
  
  const [title, setTitle] = useState(eventData.title || '');
  const [date, setDate] = useState(eventData.date || '');
  const [startTime, setStartTime] = useState(eventData.startTime || '09:00 AM');
  const [endTime, setEndTime] = useState(eventData.endTime || '11:00 AM');
  const [location, setLocation] = useState(eventData.location || '');
  const [capacity, setCapacity] = useState(eventData.capacity ? String(eventData.capacity) : '300');
  
  const [privacyType, setPrivacyType] = useState(() => {
    if (!eventData.privacy) return 'everyone';
    if (eventData.privacy === 'Open for Everyone' || eventData.privacy === 'Public Access') return 'everyone';
    return 'restricted';
  });
  
  const [selectedTiers, setSelectedTiers] = useState(() => {
    if (!eventData.privacy) return [];
    if (Array.isArray(eventData.privacy)) return eventData.privacy;
    if (eventData.privacy.includes(',')) {
      return eventData.privacy.split(',').map(s => s.trim());
    }
    if (eventData.privacy === 'Open for Everyone' || eventData.privacy === 'Public Access' || eventData.privacy === 'Members Only' || eventData.privacy === 'Invite Only') return [];
    return [eventData.privacy];
  });

  const [deadline, setDeadline] = useState(eventData.deadline || '');
  const [description, setDescription] = useState(eventData.description || 'The 2024 Annual Tax Summit is the premier gathering for accounting professionals, providing deep insights into new legislative changes, international compliance standards, and digital transformation in fiscal reporting.');
  const [speakers, setSpeakers] = useState(() => {
    if (eventData.speakers && eventData.speakers.length > 0) {
      return eventData.speakers.map((s, idx) => ({
        id: idx + 1,
        name: s.name || '',
        role: s.role || '',
        isManual: !s.memberId,
        isSelectedFromTas: !!s.memberId,
        memberId: s.memberId || null,
        avatar: s.image || null,
        searchQuery: s.name || ''
      }));
    } else if (eventData.speakersInput && eventData.speakersInput.trim() !== '') {
      return eventData.speakersInput.split('\n').filter(line => line.trim()).map((line, idx) => {
        const match = line.match(/(.*?)\((.*?)\)/);
        let nameVal = line.trim();
        let roleVal = 'Guest Speaker';
        if (match) {
          nameVal = match[1].trim();
          roleVal = match[2].trim();
        }
        return {
          id: idx + 1,
          name: nameVal,
          role: roleVal,
          isManual: true,
          isSelectedFromTas: false,
          memberId: null,
          avatar: null,
          searchQuery: nameVal
        };
      });
    }
    return [{
      id: 1,
      name: '',
      role: '',
      isManual: false,
      isSelectedFromTas: false,
      memberId: null,
      avatar: null,
      searchQuery: ''
    }];
  });
  const [agendaItems, setAgendaItems] = useState(() => {
    if (eventData.agenda && eventData.agenda.length > 0) {
      return eventData.agenda.map((a, idx) => {
        let sTime = '09:00 AM';
        let eTime = '10:30 AM';
        if (a.time && a.time.includes('-')) {
          const parts = a.time.split('-');
          sTime = parts[0].trim();
          eTime = parts[1].trim();
        } else if (a.time) {
          sTime = a.time.trim();
        }
        return {
          id: a.id || idx + 1,
          startTime: sTime,
          endTime: eTime,
          title: a.title || '',
          desc: a.desc || 'Scheduled session part of the official event program.'
        };
      });
    } else if (eventData.agendaInput && eventData.agendaInput.trim() !== '') {
      return eventData.agendaInput.split('\n').filter(line => line.trim()).map((line, idx) => {
        const firstColon = line.indexOf(':');
        let timeStr = '09:00 AM - 10:30 AM';
        let titleStr = line;
        if (firstColon !== -1) {
          timeStr = line.substring(0, firstColon).trim();
          titleStr = line.substring(firstColon + 1).trim();
        }
        let sTime = '09:00 AM';
        let eTime = '10:30 AM';
        if (timeStr.includes('-')) {
          const parts = timeStr.split('-');
          sTime = parts[0].trim();
          eTime = parts[1].trim();
        } else {
          sTime = timeStr.trim();
        }
        return {
          id: idx + 1,
          startTime: sTime,
          endTime: eTime,
          title: titleStr,
          desc: 'Scheduled session part of the official event program.'
        };
      });
    }
    return [
      { id: 1, startTime: '09:00 AM', endTime: '10:30 AM', title: 'Opening Remarks & Keynote', desc: 'Scheduled session part of the official event program.' }
    ];
  });

  const addSpeaker = () => {
    const newId = speakers.length > 0 ? Math.max(...speakers.map(s => s.id)) + 1 : 1;
    setSpeakers([...speakers, {
      id: newId,
      name: '',
      role: '',
      isManual: false,
      isSelectedFromTas: false,
      memberId: null,
      avatar: null,
      searchQuery: ''
    }]);
  };

  const removeSpeaker = (id) => {
    if (speakers.length > 1) {
      setSpeakers(speakers.filter(s => s.id !== id));
    }
  };

  const updateSpeaker = (id, updatedFields) => {
    setSpeakers(speakers.map(s => s.id === id ? { ...s, ...updatedFields } : s));
  };

  const addAgendaItem = () => {
    const newId = agendaItems.length > 0 ? Math.max(...agendaItems.map(a => a.id)) + 1 : 1;
    let defaultStart = '09:00 AM';
    let defaultEnd = '10:30 AM';
    if (agendaItems.length > 0) {
      defaultStart = agendaItems[agendaItems.length - 1].endTime;
      const match = defaultStart.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        let hr = parseInt(match[1]);
        let min = parseInt(match[2]);
        let ampm = match[3].toUpperCase();
        hr = hr + 1;
        if (hr > 12) {
          hr = hr - 12;
          ampm = ampm === 'AM' ? 'PM' : 'AM';
        }
        defaultEnd = `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')} ${ampm}`;
      }
    }
    setAgendaItems([...agendaItems, {
      id: newId,
      startTime: defaultStart,
      endTime: defaultEnd,
      title: '',
      desc: 'Scheduled session part of the official event program.'
    }]);
  };

  const removeAgendaItem = (id) => {
    if (agendaItems.length > 1) {
      setAgendaItems(agendaItems.filter(a => a.id !== id));
    }
  };

  const updateAgendaItem = (id, updatedFields) => {
    setAgendaItems(agendaItems.map(a => a.id === id ? { ...a, ...updatedFields } : a));
  };

  // Custom picker modal states
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);
  const [timePickerTarget, setTimePickerTarget] = useState(null); // null | 'start' | 'end' | { type: 'agenda_start'|'agenda_end', id: number }
  const [tempHour, setTempHour] = useState('09');
  const [tempMinute, setTempMinute] = useState('00');
  const [tempAmPm, setTempAmPm] = useState('AM');
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  const openTimePicker = (target) => {
    setTimePickerTarget(target);
    let timeVal = '09:00 AM';
    if (typeof target === 'string') {
      timeVal = target === 'start' ? startTime : endTime;
    } else if (target && typeof target === 'object') {
      const item = agendaItems.find(a => a.id === target.id);
      if (item) {
        timeVal = target.type === 'agenda_start' ? item.startTime : item.endTime;
      }
    }
    const match = timeVal.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      setTempHour(match[1]);
      setTempMinute(match[2]);
      setTempAmPm(match[3].toUpperCase());
    } else {
      setTempHour('09');
      setTempMinute('00');
      setTempAmPm('AM');
    }
    setShowTimePickerModal(true);
  };

  const handlePrivacyTypeChange = (type) => {
    setPrivacyType(type);
    if (type === 'everyone') {
      setSelectedTiers([]);
    } else if (selectedTiers.length === 0) {
      setSelectedTiers(['Premium', 'Lifetime']);
    }
  };

  const toggleTier = (tier) => {
    if (selectedTiers.includes(tier)) {
      setSelectedTiers(selectedTiers.filter(t => t !== tier));
    } else {
      setSelectedTiers([...selectedTiers, tier]);
    }
  };

  const handleSaveChanges = () => {
    if (!title || !date) {
      Alert.alert('Incomplete Form', 'Please enter at least the Event Title and Date.');
      return;
    }

    if (privacyType === 'restricted' && selectedTiers.length === 0) {
      Alert.alert('Restricted Tiers Missing', 'Please select at least one membership tier for access restriction.');
      return;
    }

    // Filter out completely empty speakers
    const validSpeakers = speakers.filter(s => s.name.trim() !== '');
    if (validSpeakers.length === 0) {
      Alert.alert('Speaker Required', 'Please add at least one speaker with a name.');
      return;
    }

    const parsedSpeakers = validSpeakers.map((s, idx) => ({
      id: idx + 1,
      name: s.name.trim(),
      role: s.role.trim() || 'Guest Speaker',
      image: s.avatar || require('../../assets/admin_profile.png'),
      memberId: s.memberId || null
    }));

    const validAgenda = agendaItems.filter(item => item.title.trim() !== '');
    if (validAgenda.length === 0) {
      Alert.alert('Agenda Required', 'Please add at least one session with a title.');
      return;
    }

    const parsedAgenda = validAgenda.map((item, idx) => ({
      id: idx + 1,
      time: `${item.startTime} - ${item.endTime}`,
      title: item.title.trim(),
      desc: item.desc || 'Scheduled session part of the official event program.',
      active: idx === 0
    }));

    const privacyValue = privacyType === 'everyone' ? 'Open for Everyone' : selectedTiers;
    const speakersInputText = validSpeakers.map(s => `${s.name} (${s.role})`).join('\n');
    const agendaInputText = parsedAgenda.map(a => `${a.time}: ${a.title}`).join('\n');

    const eventObj = {
      id: isEditing ? eventData.eventId : `e_${Date.now()}`,
      title,
      date,
      startTime,
      endTime,
      location,
      capacity: parseInt(capacity) || 300,
      attendees: eventData.attendees || 0,
      privacy: privacyValue,
      description,
      speakers: parsedSpeakers,
      agenda: parsedAgenda,
      speakersInput: speakersInputText,
      agendaInput: agendaInputText
    };

    if (isEditing) {
      dbStore.updateEvent(eventObj);
    } else {
      dbStore.addEvent(eventObj);
    }

    Alert.alert('Success', isEditing ? 'Event changes have been securely saved.' : 'Event has been successfully created and saved.', [{
      text: 'OK',
      onPress: () => handleBack()
    }]);
  };

  const handleDiscard = () => {
    Alert.alert(isEditing ? 'Discard Changes' : 'Discard Draft', isEditing ? 'Are you sure you want to discard your changes?' : 'Are you sure you want to discard this event draft?', [{
      text: 'Cancel',
      style: 'cancel'
    }, {
      text: 'Discard',
      style: 'destructive',
      onPress: () => handleBack()
    }]);
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
  const [calendarTarget, setCalendarTarget] = useState('date'); // 'date' | 'deadline'
  return <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={22} color="#0D3866" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Events</Text>
        <View style={{
        width: 44
      }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Title & Status Block */}
        <View style={styles.titleBlock}>
          <Text style={styles.pageTitle}>
            {isEditing ? 'Edit Event' : 'Event'}
          </Text>
          <Text style={styles.pageSubtitle}>
            {isEditing ? 'Update the details for the upcoming taxation summit.' : 'Create a new event'}
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
            <TextInput style={styles.textInput} placeholder="Title" placeholderTextColor="#94a3b8" value={title} onChangeText={setTitle} />
          </View>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Date</Text>
            <TouchableOpacity 
              style={styles.inputIconContainer} 
              onPress={() => setShowCalendarModal(true)}
              activeOpacity={0.8}
            >
              <TextInput 
                style={styles.textInputWithIcon} 
                placeholder="Select Date" 
                placeholderTextColor="#94a3b8" 
                value={date} 
                editable={false} 
              />
              <Calendar size={18} color="#0D3866" style={styles.inputIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Start Time</Text>
            <TouchableOpacity 
              style={styles.inputIconContainer} 
              onPress={() => openTimePicker('start')}
              activeOpacity={0.8}
            >
              <TextInput 
                style={styles.textInputWithIcon} 
                placeholder="Select Start Time" 
                placeholderTextColor="#94a3b8" 
                value={startTime} 
                editable={false} 
              />
              <Clock size={18} color="#0D3866" style={styles.inputIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>End Time</Text>
            <TouchableOpacity 
              style={styles.inputIconContainer} 
              onPress={() => openTimePicker('end')}
              activeOpacity={0.8}
            >
              <TextInput 
                style={styles.textInputWithIcon} 
                placeholder="Select End Time" 
                placeholderTextColor="#94a3b8" 
                value={endTime} 
                editable={false} 
              />
              <Clock size={18} color="#0D3866" style={styles.inputIcon} />
            </TouchableOpacity>
          </View>

          {/* SECTION 2: LOGISTICS & CAPACITY */}
          <View style={styles.sectionDivider} />
          <Text style={styles.sectionTitle}>Logistics & Capacity</Text>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Location</Text>
            <View style={styles.inputIconContainer}>
              <TextInput style={styles.textInputWithIcon} placeholder="venue" placeholderTextColor="#94a3b8" value={location} onChangeText={setLocation} />
              <MapPin size={18} color="#94a3b8" style={styles.inputIcon} />
            </View>
          </View>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Capacity</Text>
            <TextInput style={styles.textInput} placeholder="300" placeholderTextColor="#94a3b8" value={capacity} onChangeText={setCapacity} keyboardType="numeric" />
          </View>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Event Privacy & Access Control</Text>
            <View style={{ gap: 10, marginTop: 4 }}>
              {/* Option 1: Open for Everyone */}
              <TouchableOpacity 
                style={[
                  styles.privacySelectBtn, 
                  privacyType === 'everyone' && styles.privacySelectBtnActive
                ]}
                onPress={() => handlePrivacyTypeChange('everyone')}
                activeOpacity={0.8}
              >
                <View style={[styles.radioButton, privacyType === 'everyone' && styles.radioButtonActive]}>
                  {privacyType === 'everyone' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={[styles.privacyBtnText, privacyType === 'everyone' && styles.privacyBtnTextActive]}>
                  Open for Everyone (Public Access)
                </Text>
              </TouchableOpacity>

              {/* Option 2: Restrict by Membership Tier */}
              <TouchableOpacity 
                style={[
                  styles.privacySelectBtn, 
                  privacyType === 'restricted' && styles.privacySelectBtnActive
                ]}
                onPress={() => handlePrivacyTypeChange('restricted')}
                activeOpacity={0.8}
              >
                <View style={[styles.radioButton, privacyType === 'restricted' && styles.radioButtonActive]}>
                  {privacyType === 'restricted' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={[styles.privacyBtnText, privacyType === 'restricted' && styles.privacyBtnTextActive]}>
                  Restrict by Membership Tier
                </Text>
              </TouchableOpacity>

              {/* Tiers Multiselect Checklist (Visible when Restricted is selected) */}
              {privacyType === 'restricted' && (
                <View style={styles.tiersContainer}>
                  <Text style={styles.tiersHeading}>Select Allowed Membership Tiers:</Text>
                  <View style={styles.tiersGrid}>
                    {['Basic', 'Professional', 'Premium', 'Lifetime'].map(tier => {
                      const isSelected = selectedTiers.includes(tier);
                      return (
                        <TouchableOpacity 
                          key={tier}
                          style={[styles.tierChip, isSelected && styles.tierChipActive]}
                          onPress={() => toggleTier(tier)}
                          activeOpacity={0.8}
                        >
                          <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                            {isSelected && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
                          </View>
                          <Text style={[styles.tierChipText, isSelected && styles.tierChipTextActive]}>
                            {tier}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          </View>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Registration Deadline</Text>
            <TouchableOpacity 
              style={styles.inputIconContainer} 
              onPress={() => {
                setCalendarTarget('deadline');
                setShowCalendarModal(true);
              }}
              activeOpacity={0.8}
            >
              <TextInput 
                style={styles.textInputWithIcon} 
                placeholder="Select Registration Deadline" 
                placeholderTextColor="#94a3b8" 
                value={deadline} 
                editable={false} 
              />
              <Calendar size={18} color="#0D3866" style={styles.inputIcon} />
            </TouchableOpacity>
          </View>

          {/* SECTION 3: EVENT CONTENT */}
          <View style={styles.sectionDivider} />
          <Text style={styles.sectionTitle}>Event Content</Text>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput style={[styles.textInput, styles.textArea]} placeholder="Enter event details..." placeholderTextColor="#94a3b8" multiline numberOfLines={6} value={description} onChangeText={setDescription} />
          </View>

          {/* DYNAMIC SPEAKERS SECTION */}
          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Speakers Profile</Text>
            <View style={{ gap: 12, marginTop: 4 }}>
              {speakers.map((speaker, index) => {
                const allMembers = dbStore.getMembers();
                const searchQuery = speaker.searchQuery || '';
                const searchResults = searchQuery.trim() !== '' && !speaker.isSelectedFromTas
                  ? allMembers.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
                  : [];

                return (
                  <View key={speaker.id} style={styles.speakerContainer}>
                    <View style={styles.speakerHeaderRow}>
                      <Text style={styles.speakerIndexText}>Speaker #{index + 1}</Text>
                      {speakers.length > 1 && (
                        <TouchableOpacity onPress={() => removeSpeaker(speaker.id)} style={styles.deleteSpeakerBtn}>
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Mode Toggle Selection Chips */}
                    <View style={styles.modeToggleRow}>
                      <TouchableOpacity 
                        style={[styles.modeToggleChip, !speaker.isManual && styles.modeToggleChipActive]}
                        onPress={() => updateSpeaker(speaker.id, { isManual: false, name: '', role: '', isSelectedFromTas: false, memberId: null, avatar: null, searchQuery: '' })}
                      >
                        <Text style={[styles.modeToggleChipText, !speaker.isManual && styles.modeToggleChipTextActive]}>TAS Account</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.modeToggleChip, speaker.isManual && styles.modeToggleChipActive]}
                        onPress={() => updateSpeaker(speaker.id, { isManual: true, name: '', role: '', isSelectedFromTas: false, memberId: null, avatar: null, searchQuery: '' })}
                      >
                        <Text style={[styles.modeToggleChipText, speaker.isManual && styles.modeToggleChipTextActive]}>Manual Entry</Text>
                      </TouchableOpacity>
                    </View>

                    {!speaker.isManual ? (
                      // TAS Account selection UI
                      <View style={{ marginTop: 8 }}>
                        {speaker.isSelectedFromTas ? (
                          // Render Selected Member profile card
                          <View style={styles.selectedSpeakerCard}>
                            <View style={styles.selectedSpeakerInfo}>
                              {speaker.avatar ? (
                                <Image source={speaker.avatar} style={styles.selectedSpeakerAvatar} />
                              ) : (
                                <View style={styles.selectedSpeakerAvatarPlaceholder}>
                                  <Text style={styles.selectedSpeakerAvatarText}>{speaker.name.charAt(0)}</Text>
                                </View>
                              )}
                              <View style={{ flex: 1 }}>
                                <Text style={styles.selectedSpeakerName}>{speaker.name}</Text>
                                <Text style={styles.selectedSpeakerRole}>{speaker.role}</Text>
                              </View>
                            </View>
                            <TouchableOpacity 
                              onPress={() => updateSpeaker(speaker.id, { isSelectedFromTas: false, name: '', role: '', memberId: null, avatar: null, searchQuery: '' })}
                              style={styles.changeSpeakerBtn}
                            >
                              <Text style={styles.changeSpeakerBtnText}>Change</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          // Render Search Input & list
                          <View>
                            <View style={styles.searchContainer}>
                              <Search size={16} color="#94A3B8" style={styles.searchIcon} />
                              <TextInput 
                                style={styles.searchInput}
                                placeholder="Search TAS member by name..."
                                placeholderTextColor="#94a3b8"
                                value={speaker.searchQuery}
                                onChangeText={(text) => updateSpeaker(speaker.id, { searchQuery: text })}
                              />
                            </View>
                            
                            {searchResults.length > 0 && (
                              <View style={styles.suggestionsContainer}>
                                {searchResults.map(member => (
                                  <TouchableOpacity 
                                    key={member.id || member.memberId}
                                    style={styles.suggestionItem}
                                    onPress={() => updateSpeaker(speaker.id, {
                                      name: member.name,
                                      role: member.designation || member.tierLabel || 'TAS Member',
                                      memberId: member.memberId,
                                      avatar: member.avatar,
                                      isSelectedFromTas: true,
                                      searchQuery: member.name
                                    })}
                                  >
                                    <Image source={member.avatar} style={styles.suggestionAvatar} />
                                    <View>
                                      <Text style={styles.suggestionName}>{member.name}</Text>
                                      <Text style={styles.suggestionRole}>{member.designation || member.tierLabel}</Text>
                                    </View>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            )}
                            {searchQuery.trim() !== '' && searchResults.length === 0 && (
                              <Text style={styles.noResultsText}>No TAS members match "{searchQuery}"</Text>
                            )}
                          </View>
                        )}
                      </View>
                    ) : (
                      // Manual Input UI
                      <View style={{ gap: 10, marginTop: 8 }}>
                        <TextInput 
                          style={styles.manualInput} 
                          placeholder="Speaker Name" 
                          placeholderTextColor="#94a3b8" 
                          value={speaker.name}
                          onChangeText={(text) => updateSpeaker(speaker.id, { name: text })}
                        />
                        <TextInput 
                          style={styles.manualInput} 
                          placeholder="Role / Title (e.g. GST Expert)" 
                          placeholderTextColor="#94a3b8" 
                          value={speaker.role}
                          onChangeText={(text) => updateSpeaker(speaker.id, { role: text })}
                        />
                      </View>
                    )}
                  </View>
                );
              })}

              <TouchableOpacity onPress={addSpeaker} style={styles.addSpeakerBtn} activeOpacity={0.8}>
                <Plus size={16} color="#0D3866" />
                <Text style={styles.addSpeakerBtnText}>Add Speaker</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* DYNAMIC AGENDA SECTION */}
          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Event Agenda</Text>
            <View style={{ gap: 12, marginTop: 4 }}>
              {agendaItems.map((item, index) => (
                <View key={item.id} style={styles.agendaItemContainer}>
                  <View style={styles.agendaHeaderRow}>
                    <Text style={styles.agendaIndexText}>Session #{index + 1}</Text>
                    {agendaItems.length > 1 && (
                      <TouchableOpacity onPress={() => removeAgendaItem(item.id)} style={styles.deleteAgendaBtn}>
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <TextInput
                    style={styles.agendaTitleInput}
                    placeholder="Session Title (e.g. Panel Discussion)"
                    placeholderTextColor="#94a3b8"
                    value={item.title}
                    onChangeText={(text) => updateAgendaItem(item.id, { title: text })}
                  />

                  {/* Duration Time Bar Selection */}
                  <View style={styles.timeBarContainer}>
                    <TouchableOpacity
                      style={styles.timeSelectBox}
                      onPress={() => openTimePicker({ type: 'agenda_start', id: item.id })}
                      activeOpacity={0.8}
                    >
                      <Clock size={14} color="#0D3866" />
                      <Text style={styles.timeSelectBoxText}>{item.startTime}</Text>
                    </TouchableOpacity>

                    <View style={styles.timeBarConnector}>
                      <View style={styles.timeBarLine} />
                      <Text style={styles.durationIndicatorText}>to</Text>
                      <View style={styles.timeBarLine} />
                    </View>

                    <TouchableOpacity
                      style={styles.timeSelectBox}
                      onPress={() => openTimePicker({ type: 'agenda_end', id: item.id })}
                      activeOpacity={0.8}
                    >
                      <Clock size={14} color="#0D3866" />
                      <Text style={styles.timeSelectBoxText}>{item.endTime}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <TouchableOpacity onPress={addAgendaItem} style={styles.addAgendaBtn} activeOpacity={0.8}>
                <Plus size={16} color="#0D3866" />
                <Text style={styles.addAgendaBtnText}>Add Session</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ACTION BUTTONS */}
          <View style={{
          marginTop: 24,
          gap: 12
        }}>
            <TouchableOpacity style={styles.discardBtn} onPress={handleDiscard} activeOpacity={0.8}>
              <Text style={styles.discardBtnText}>Discard Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveChanges} activeOpacity={0.8}>
              <View style={styles.checkCircleWhite}>
                <Check size={10} color="#3F6212" strokeWidth={3} />
              </View>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scroll spacer */}
        <View style={{
        height: 100
      }} />
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

          <TouchableOpacity onPress={() => navigateToTab('Post')} style={navStyles.tabItem}>
            <Newspaper size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigateToTab('Connection')} style={navStyles.tabItem}>
            <Users size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBack} style={[navStyles.tabItem, navStyles.tabItemActive]}>
            <Calendar size={22} color="#70B62C" />
            <Text style={navStyles.tabLabel}>Events</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar Modal */}
      <Modal 
        visible={showCalendarModal} 
        transparent={true} 
        animationType="slide" 
        onRequestClose={() => setShowCalendarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModalContent}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity 
                onPress={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1))} 
                style={styles.calendarHeaderBtn}
              >
                <Text style={styles.calendarHeaderBtnText}>◀</Text>
              </TouchableOpacity>
              <Text style={styles.calendarMonthTitle}>
                {currentCalendarDate.toLocaleDateString([], { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity 
                onPress={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1))} 
                style={styles.calendarHeaderBtn}
              >
                <Text style={styles.calendarHeaderBtnText}>▶</Text>
              </TouchableOpacity>
            </View>

            {/* Week Days Label Row */}
            <View style={styles.weekLabelsRow}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => (
                <Text key={w} style={styles.weekLabelText}>{w}</Text>
              ))}
            </View>

            {/* Days Grid */}
            <View style={styles.daysGrid}>
              {(() => {
                const year = currentCalendarDate.getFullYear();
                const month = currentCalendarDate.getMonth();
                const totalDays = new Date(year, month + 1, 0).getDate();
                const firstDay = new Date(year, month, 1).getDay();

                const grid = [];
                for (let i = 0; i < firstDay; i++) {
                  grid.push(null);
                }
                for (let d = 1; d <= totalDays; d++) {
                  grid.push(new Date(year, month, d));
                }

                return grid.map((dayDate, idx) => {
                  if (!dayDate) {
                    return <View key={`empty-${idx}`} style={styles.dayCellEmpty} />;
                  }
                  const dayNum = dayDate.getDate();
                  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                  const formatted = `${months[dayDate.getMonth()]} ${String(dayDate.getDate()).padStart(2, '0')}, ${dayDate.getFullYear()}`;
                  const isSelected = (calendarTarget === 'date' ? date : deadline) === formatted;

                  return (
                    <TouchableOpacity 
                      key={`day-${dayNum}`} 
                      style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                      onPress={() => {
                        if (calendarTarget === 'date') {
                          setDate(formatted);
                        } else {
                          setDeadline(formatted);
                        }
                        setShowCalendarModal(false);
                      }}
                    >
                      <Text style={[styles.dayCellText, isSelected && styles.dayCellTextSelected]}>{dayNum}</Text>
                    </TouchableOpacity>
                  );
                });
              })()}
            </View>

            <TouchableOpacity onPress={() => setShowCalendarModal(false)} style={styles.closeModalBtn}>
              <Text style={styles.closeModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal 
        visible={showTimePickerModal} 
        transparent={true} 
        animationType="slide" 
        onRequestClose={() => setShowTimePickerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.timePickerContent}>
            <Text style={styles.pickerTitle}>Select {timePickerTarget === 'start' ? 'Start Time' : 'End Time'}</Text>
            
            <View style={styles.pickerColumnsRow}>
              {/* Hours Column */}
              <View style={styles.pickerColumn}>
                <Text style={styles.columnHeader}>Hour</Text>
                <ScrollView style={styles.columnScroll} showsVerticalScrollIndicator={false}>
                  {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(h => (
                    <TouchableOpacity 
                      key={h} 
                      style={[styles.pickerItem, tempHour === h && styles.pickerItemActive]}
                      onPress={() => setTempHour(h)}
                    >
                      <Text style={[styles.pickerItemText, tempHour === h && styles.pickerItemTextActive]}>{h}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Minutes Column */}
              <View style={styles.pickerColumn}>
                <Text style={styles.columnHeader}>Minute</Text>
                <ScrollView style={styles.columnScroll} showsVerticalScrollIndicator={false}>
                  {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => (
                    <TouchableOpacity 
                      key={m} 
                      style={[styles.pickerItem, tempMinute === m && styles.pickerItemActive]}
                      onPress={() => setTempMinute(m)}
                    >
                      <Text style={[styles.pickerItemText, tempMinute === m && styles.pickerItemTextActive]}>{m}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* AM/PM Column */}
              <View style={styles.pickerColumn}>
                <Text style={styles.columnHeader}>AM/PM</Text>
                <View style={{ gap: 8, justifyContent: 'center', height: 160 }}>
                  {['AM', 'PM'].map(ampm => (
                    <TouchableOpacity 
                      key={ampm} 
                      style={[styles.pickerItem, tempAmPm === ampm && styles.pickerItemActive, { height: 44, justifyContent: 'center' }]}
                      onPress={() => setTempAmPm(ampm)}
                    >
                      <Text style={[styles.pickerItemText, tempAmPm === ampm && styles.pickerItemTextActive]}>{ampm}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.pickerActionsRow}>
              <TouchableOpacity onPress={() => setShowTimePickerModal(false)} style={[styles.pickerActionBtn, styles.pickerActionBtnCancel]}>
                <Text style={styles.pickerActionCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  const formattedTime = `${tempHour}:${tempMinute} ${tempAmPm}`;
                  if (timePickerTarget === 'start') {
                    setStartTime(formattedTime);
                  } else if (timePickerTarget === 'end') {
                    setEndTime(formattedTime);
                  } else if (timePickerTarget && typeof timePickerTarget === 'object') {
                    if (timePickerTarget.type === 'agenda_start') {
                      updateAgendaItem(timePickerTarget.id, { startTime: formattedTime });
                    } else if (timePickerTarget.type === 'agenda_end') {
                      updateAgendaItem(timePickerTarget.id, { endTime: formattedTime });
                    }
                  }
                  setShowTimePickerModal(false);
                }} 
                style={[styles.pickerActionBtn, styles.pickerActionBtnConfirm]}
              >
                <Text style={styles.pickerActionConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>;
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
  switcherContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  switcherTrack: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 3
  },
  switcherButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6
  },
  switcherButtonActive: {
    backgroundColor: '#0D3866'
  },
  switcherText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b'
  },
  switcherTextActive: {
    color: '#FFFFFF'
  },
  scrollContainer: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120
  },
  titleBlock: {
    marginBottom: 16
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0D3866'
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 8
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
    borderColor: '#DBEAFE'
  },
  checkCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4D7C0F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6
  },
  statusBadgeText: {
    color: '#1E40AF',
    fontSize: 10,
    fontWeight: '800'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D3866',
    marginBottom: 16
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 20
  },
  fieldItem: {
    marginBottom: 16
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D3866',
    marginBottom: 6
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1E293B'
  },
  inputIconContainer: {
    position: 'relative',
    justifyContent: 'center'
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
    color: '#1E293B'
  },
  inputIcon: {
    position: 'absolute',
    right: 12
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
    paddingVertical: 8
  },
  dropdownText: {
    fontSize: 14,
    color: '#1E293B'
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top'
  },
  discardBtn: {
    borderWidth: 1,
    borderColor: '#0D3866',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  discardBtnText: {
    color: '#0D3866',
    fontSize: 14,
    fontWeight: '700'
  },
  saveBtn: {
    backgroundColor: '#3F6212',
    borderRadius: 6,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkCircleWhite: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },
  privacySelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  privacySelectBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#0D3866',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioButtonActive: {
    borderColor: '#0D3866',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0D3866',
  },
  privacyBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  privacyBtnTextActive: {
    color: '#0D3866',
    fontWeight: '700',
  },
  tiersContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginTop: 4,
  },
  tiersHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 10,
  },
  tiersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tierChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tierChipActive: {
    backgroundColor: '#E6EEFF',
    borderColor: '#0D3866',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  checkboxActive: {
    backgroundColor: '#0D3866',
    borderColor: '#0D3866',
  },
  tierChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tierChipTextActive: {
    color: '#0D3866',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  calendarHeaderBtn: {
    padding: 8,
  },
  calendarHeaderBtnText: {
    fontSize: 16,
    color: '#0D3866',
    fontWeight: '700',
  },
  calendarMonthTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D3866',
  },
  weekLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    width: 36,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCell: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    borderRadius: 18,
  },
  dayCellSelected: {
    backgroundColor: '#0D3866',
  },
  dayCellEmpty: {
    width: 36,
    height: 36,
    marginVertical: 4,
  },
  dayCellText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  dayCellTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  closeModalBtn: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeModalBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  timePickerContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D3866',
    marginBottom: 20,
  },
  pickerColumnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 180,
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  columnHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  columnScroll: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 10,
  },
  pickerItem: {
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  pickerItemActive: {
    backgroundColor: '#EFF6FF',
  },
  pickerItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  pickerItemTextActive: {
    color: '#0D3866',
    fontWeight: '800',
  },
  pickerActionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  pickerActionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  pickerActionBtnCancel: {
    backgroundColor: '#F1F5F9',
  },
  pickerActionBtnConfirm: {
    backgroundColor: '#0D3866',
  },
  pickerActionCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  pickerActionConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  speakerContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 8,
  },
  speakerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  speakerIndexText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D3866',
  },
  deleteSpeakerBtn: {
    padding: 4,
  },
  modeToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  modeToggleChip: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modeToggleChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  modeToggleChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  modeToggleChipTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  selectedSpeakerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 10,
  },
  selectedSpeakerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  selectedSpeakerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  selectedSpeakerAvatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSpeakerAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  selectedSpeakerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D3866',
  },
  selectedSpeakerRole: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  changeSpeakerBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  changeSpeakerBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#334D6E',
    paddingVertical: 0,
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginTop: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  suggestionName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0D3866',
  },
  suggestionRole: {
    fontSize: 10.5,
    color: '#64748B',
  },
  noResultsText: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: 4,
    paddingLeft: 4,
  },
  manualInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    fontSize: 12.5,
    color: '#334D6E',
  },
  addSpeakerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#0D3866',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 4,
  },
  addSpeakerBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0D3866',
  },
  agendaItemContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 8,
  },
  agendaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  agendaIndexText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D3866',
  },
  deleteAgendaBtn: {
    padding: 4,
  },
  agendaTitleInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 13.5,
    color: '#1E293B',
    marginBottom: 10,
  },
  timeBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 8,
  },
  timeSelectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    minWidth: 100,
    justifyContent: 'center',
  },
  timeSelectBoxText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D3866',
  },
  timeBarConnector: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  timeBarLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#CBD5E1',
  },
  durationIndicatorText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginHorizontal: 8,
  },
  addAgendaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#0D3866',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 4,
  },
  addAgendaBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0D3866',
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
    zIndex: 100
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
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8
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

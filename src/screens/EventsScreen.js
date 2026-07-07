import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  ActivityIndicator,
  StatusBar as RNStatusBar,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line, Polyline, Rect } from 'react-native-svg';
import { ArrowLeft, ArrowUp } from 'lucide-react-native';
import { dbStore } from '../config/dbStore';

// Custom SVG Icons matching the Premium Light Blue Theme
const BackArrowIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const ClockIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

const MapPinIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
);

const SearchIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

const LocationPinIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
);

const CheckmarkCircleIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" fill="#64748B" />
    <Path d="M9 12l2 2 4-4" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CalendarEmptyIcon = () => (
  <Svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

const CloseIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);

const PlusIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="12" y1="5" x2="12" y2="19" />
    <Line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
);

export const EventsScreen = ({ onBack, onTabPress, navigation }) => {
  const [events, setEvents] = useState(dbStore.getEvents());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegisteredModal, setShowRegisteredModal] = useState(false);
  const [filterCompleted, setFilterCompleted] = useState(false);
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const feedScrollRef = useRef(null);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 300);
  };

  const scrollToTop = () => {
    feedScrollRef.current?.scrollTo({
      y: 0,
      animated: true
    });
  };

  useEffect(() => {
    const syncEvents = () => {
      setEvents([...dbStore.getEvents()]);
      if (selectedEvent) {
        const updated = dbStore.getEvents().find(e => e.id === selectedEvent.id);
        if (updated) {
          setSelectedEvent(updated);
        }
      }
    };
    syncEvents();
    const unsubscribe = dbStore.subscribe(syncEvents);
    return unsubscribe;
  }, [selectedEvent]);

  // Parse helper: turns database event object into enriched model for premium screen
  const parseDbEvent = (event) => {
    let day = '15';
    let month = 'NOV';
    let formattedDate = event.date || 'Nov 15, 2026';
    let dayOfWeek = 'Wednesday';

    try {
      if (event.date) {
        const parts = event.date.trim().split(/[\s,]+/);
        if (parts.length >= 3) {
          month = parts[0].toUpperCase().substring(0, 3);
          day = parts[1].padStart(2, '0');
          const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
          const mIdx = months.indexOf(month);
          const yNum = parseInt(parts[2], 10);
          const dNum = parseInt(day, 10);
          if (mIdx !== -1 && !isNaN(yNum) && !isNaN(dNum)) {
            const dObj = new Date(yNum, mIdx, dNum);
            if (!isNaN(dObj.getTime())) {
              const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              dayOfWeek = days[dObj.getDay()];
              formattedDate = dObj.toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' });
            }
          }
        } else {
          const dObj = new Date(event.date);
          if (!isNaN(dObj.getTime())) {
            day = String(dObj.getDate()).padStart(2, '0');
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            month = months[dObj.getMonth()];
            formattedDate = dObj.toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' });
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            dayOfWeek = days[dObj.getDay()];
          }
        }
      }
    } catch (e) {}

    const isFlagship = event.title?.toLowerCase().includes('annual') || event.title?.toLowerCase().includes('gala');
    const type = isFlagship ? 'Conference' : (event.location?.toLowerCase().includes('virtual') ? 'Webinar' : 'Workshop');

    return {
      id: event.id,
      date: day,
      month: month,
      title: event.title || 'Untitled Event',
      type: type,
      time: event.startTime || '09:00 AM IST',
      endTime: event.endTime || '',
      privacy: event.privacy || 'Open for Everyone',
      location: event.location || 'Virtual Session',
      image: isFlagship 
        ? require('../../assets/annual_conference.png') 
        : require('../../assets/server_room_update.png'),
      bookedCount: event.attendees || 0,
      maxCapacity: event.capacity || 300,
      formattedDate: formattedDate,
      formattedTime: event.startTime || '09:00 AM IST',
      dayOfWeek: dayOfWeek,
      description: event.description || 'This event brings together taxation professionals, regulators, and industry leaders to discuss regulatory policies and audit automation trends.',
      speakers: event.speakers || [
        { id: 1, name: 'Dr. Amit Shah', role: 'GST Expert', image: require('../../assets/admin_profile.png') },
        { id: 2, name: 'Sarah Jenkins', role: 'Tax Attorney', image: require('../../assets/elena_profile.png') },
        { id: 3, name: 'Ramesh B.', role: 'Senior Treasurer', image: require('../../assets/admin_profile.png') }
      ],
      agenda: event.agenda || [
        { 
          id: 1, 
          time: '09:00 AM - 10:30 AM', 
          title: 'Opening Remarks & Keynote', 
          desc: 'Opening session highlighting key issues, regulatory expectations, and industry updates.',
          active: true
        },
        { 
          id: 2, 
          time: '10:30 AM - 12:00 PM', 
          title: 'Panel Discussion', 
          desc: 'Interactive panel featuring policy makers and leading tax compliance experts.',
          active: false
        },
        { 
          id: 3, 
          time: '12:00 PM - 01:00 PM', 
          title: 'Q&A and Networking Session', 
          desc: 'Open floor for questions followed by one-on-one networking opportunities.',
          active: false
        }
      ],
      speakersInput: event.speakersInput,
      agendaInput: event.agendaInput
    };
  };

  const handleCancelEvent = (eventId, eventTitle) => {
    Alert.alert(
      'Cancel Event',
      `Are you sure you want to cancel and delete "${eventTitle}"?`,
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => {
            dbStore.deleteEvent(eventId);
            setSelectedEvent(null);
            Alert.alert('Event Cancelled', `"${eventTitle}" has been cancelled successfully.`);
          }
        }
      ]
    );
  };

  const handleEditEvent = (event) => {
    if (navigation) {
      navigation.navigate('CreateEvent', {
        isEditing: true,
        eventId: event.id,
        title: event.title,
        date: event.formattedDate,
        startTime: event.time,
        endTime: event.endTime || '11:00 AM',
        privacy: event.privacy || 'Open for Everyone',
        location: event.location,
        capacity: String(event.maxCapacity),
        description: event.description,
        attendees: event.bookedCount,
        speakers: event.speakers,
        agenda: event.agenda,
        speakersInput: event.speakersInput,
        agendaInput: event.agendaInput
      });
    } else {
      Alert.alert('Edit Event', `Editing details for ${event.title}`);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  // Directory members list
  const registeredMembers = dbStore.getMembers();

  const renderEventDetails = (parsedEvent) => {
    return (
      <SafeAreaView style={styles.screenWrapper} edges={['top', 'left', 'right']}>
        {/* Detail Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedEvent(null)}>
            <ArrowLeft size={22} color="#0D3866" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Event</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
          {/* Cover Image & Title Overlay */}
          <View style={styles.detailsImageContainer}>
            <Image source={parsedEvent.image} style={styles.detailsImage} />
            <View style={styles.imageOverlayContainer}>
              <View style={styles.detailsCategoryBadge}>
                <Text style={styles.detailsCategoryText}>{parsedEvent.type.toUpperCase()}</Text>
              </View>
              <Text style={styles.detailsEventTitle}>{parsedEvent.title}</Text>
            </View>
          </View>

          {/* Info Card Overlapping the Image */}
          <View style={styles.infoCard}>
            {/* Date Row */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <CalendarIcon />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoTextBold}>{parsedEvent.formattedDate}</Text>
                <Text style={styles.infoTextRegular}>
                  {parsedEvent.dayOfWeek}, {parsedEvent.time}{parsedEvent.endTime ? ` - ${parsedEvent.endTime}` : ''}
                </Text>
              </View>
            </View>

            {/* Location Row */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <LocationPinIcon />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoTextBold}>{parsedEvent.location.split(',')[0]}</Text>
                <Text style={styles.infoTextRegular}>{parsedEvent.location}</Text>
              </View>
            </View>

            {/* Privacy / Access Control Row */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </Svg>
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoTextBold}>Access Control</Text>
                <Text style={styles.infoTextRegular}>
                  {Array.isArray(parsedEvent.privacy)
                    ? `Restricted to: ${parsedEvent.privacy.join(', ')}`
                    : (parsedEvent.privacy || 'Open for Everyone')}
                </Text>
              </View>
            </View>

            {/* Registered Directory Trigger Row */}
            <View style={styles.cardSeparator} />
            <TouchableOpacity 
              style={styles.directoryTriggerRow}
              onPress={() => setShowRegisteredModal(true)}
              activeOpacity={0.8}
            >
              <View style={styles.rsvpStatusCol}>
                <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A52C5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <Circle cx="9" cy="7" r="4" />
                  <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </Svg>
                <Text style={styles.directoryTriggerText}>Registered Members Directory</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.registeredCountText}>
                  {parsedEvent.bookedCount}/{parsedEvent.maxCapacity}
                </Text>
                <Text style={{ fontSize: 12, color: '#64748B', marginLeft: 4 }}>▶</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Speakers Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Speakers Profile</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.speakersScrollContent}>
              {parsedEvent.speakers.map(speaker => (
                <View key={speaker.id} style={styles.speakerCard}>
                  <Image source={speaker.image} style={styles.speakerAvatar} />
                  <Text style={styles.speakerName} numberOfLines={1}>{speaker.name}</Text>
                  <Text style={styles.speakerRole} numberOfLines={1}>{speaker.role}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Agenda Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Event Agenda</Text>
            
            <View style={styles.agendaTimelineContainer}>
              {parsedEvent.agenda.map((item, index) => (
                <View key={item.id} style={styles.agendaRow}>
                  {/* Timeline Line & Dot */}
                  <View style={styles.timelineCol}>
                    <View style={[styles.timelineDot, item.active ? styles.timelineDotActive : styles.timelineDotInactive]} />
                    {index < parsedEvent.agenda.length - 1 && <View style={styles.timelineLine} />}
                  </View>

                  {/* Agenda Details Box */}
                  <View style={styles.agendaBox}>
                    <Text style={[styles.agendaTimeText, item.active && styles.agendaTimeTextActive]}>{item.time}</Text>
                    <Text style={styles.agendaTitleText}>{item.title}</Text>
                    <Text style={styles.agendaDescText}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Bottom Management Button Bar */}
        <View style={styles.bottomButtonContainer}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity 
              style={[styles.bottomRegisterBtn, { flex: 1, backgroundColor: '#FFFFFF', borderColor: '#EF4444', borderWidth: 1.5, shadowColor: 'transparent' }]} 
              onPress={() => handleCancelEvent(parsedEvent.id, parsedEvent.title)}
            >
              <Text style={[styles.bottomRegisterBtnText, { color: '#EF4444' }]}>Cancel Event</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.bottomRegisterBtn, { flex: 1, backgroundColor: '#0D3866' }]} 
              onPress={() => handleEditEvent(parsedEvent)}
            >
              <Text style={styles.bottomRegisterBtnText}>Edit Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Registered Directory Modal */}
        <Modal
          visible={showRegisteredModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowRegisteredModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContentCard, { width: '92%', maxHeight: '75%', padding: 20 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 12 }}>
                <Text style={[styles.modalTitleText, { textAlign: 'left' }]}>Registered Directory</Text>
                <TouchableOpacity onPress={() => setShowRegisteredModal(false)} style={{ padding: 4 }}>
                  <CloseIcon />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalDivider} />
              
              <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                {registeredMembers
                  .filter(member => {
                    if (!parsedEvent.privacy || parsedEvent.privacy === 'Open for Everyone') {
                      return true;
                    }
                    if (Array.isArray(parsedEvent.privacy)) {
                      return parsedEvent.privacy.includes(member.tier);
                    }
                    if (typeof parsedEvent.privacy === 'string') {
                      return parsedEvent.privacy.split(',').map(s => s.trim()).includes(member.tier);
                    }
                    return true;
                  })
                  .map((member, idx) => (
                    <View key={member.id || idx} style={styles.memberListItem}>
                      <Image source={member.avatar || require('../../assets/admin_profile.png')} style={styles.memberAvatar} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.memberName}>{member.name}</Text>
                        <Text style={styles.memberRole}>{member.designation} • {member.company} ({member.tier})</Text>
                      </View>
                    </View>
                  ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  };

  // Check if an event date is in the past (before June 20, 2026)
  const isEventCompleted = (event) => {
    if (!event.date) return false;
    let dateObj = new Date(event.date);
    if (isNaN(dateObj.getTime())) {
      try {
        const parts = event.date.trim().split(/[\s,]+/);
        if (parts.length >= 3) {
          const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
          const mIdx = months.indexOf(parts[0].toUpperCase().substring(0, 3));
          const yNum = parseInt(parts[2], 10);
          const dNum = parseInt(parts[1], 10);
          if (mIdx !== -1 && !isNaN(yNum) && !isNaN(dNum)) {
            dateObj = new Date(yNum, mIdx, dNum);
          }
        }
      } catch (e) {}
    }
    if (isNaN(dateObj.getTime())) return false;
    const today = new Date('2026-06-20');
    return dateObj < today;
  };

  // Filter events: if filterCompleted is active, show only completed events. Otherwise, show upcoming events.
  const filteredEvents = events.filter(event => {
    const completed = isEventCompleted(event);
    if (filterCompleted) {
      if (!completed) return false;
    } else {
      if (completed) return false;
    }

    if (eventSearchQuery.trim()) {
      const query = eventSearchQuery.toLowerCase();
      const title = event.title || '';
      const location = event.location || '';
      const desc = event.description || '';
      return title.toLowerCase().includes(query) || 
             location.toLowerCase().includes(query) || 
             desc.toLowerCase().includes(query);
    }
    return true;
  });

  if (selectedEvent) {
    const enriched = parseDbEvent(selectedEvent);
    return renderEventDetails(enriched);
  }

  return (
    <SafeAreaView style={styles.screenWrapper} edges={['top', 'left', 'right']}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        {onBack ? (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={22} color="#0D3866" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}
        <Text style={styles.headerTitle}>Events Management</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Static Search Bar */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, backgroundColor: '#F4F7FC' }}>
        <View style={[styles.searchBarWrapper, { marginBottom: 0 }]}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events by title or location..."
            placeholderTextColor="#94A3B8"
            value={eventSearchQuery}
            onChangeText={setEventSearchQuery}
          />
          {eventSearchQuery !== '' && (
            <TouchableOpacity onPress={() => setEventSearchQuery('')} style={styles.clearSearchBtn}>
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Events Feed Scroll */}
      <ScrollView
        ref={feedScrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={[styles.feedContainer, { paddingTop: 10 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.feedHeaderRow}>
          <Text style={styles.sectionHeading}>
            {filterCompleted ? 'Completed Events' : 'Upcoming Events'}
          </Text>
          <TouchableOpacity 
            style={[
              styles.filterTabBtn, 
              filterCompleted ? styles.filterTabBtnActive : styles.filterTabBtnInactive
            ]} 
            onPress={() => setFilterCompleted(!filterCompleted)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.filterTabBtnText, 
              filterCompleted ? styles.filterTabBtnTextActive : styles.filterTabBtnTextInactive
            ]}>
              Completed Events
            </Text>
          </TouchableOpacity>
        </View>
        
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => {
            const parsed = parseDbEvent(event);
            return (
              <TouchableOpacity 
                key={event.id} 
                style={styles.eventCard} 
                activeOpacity={0.9}
                onPress={() => setSelectedEvent(event)}
              >
                {/* Event Image & Badges */}
                <View style={styles.cardImageContainer}>
                  <Image source={parsed.image} style={styles.cardImage} resizeMode="cover" />
                  
                  {/* Date Badge */}
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateMonth}>{parsed.month}</Text>
                    <Text style={styles.dateDay}>{parsed.date}</Text>
                  </View>

                  {/* Event Type Badge */}
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>{parsed.type}</Text>
                  </View>
                </View>

                {/* Event Details */}
                <View style={styles.cardDetails}>
                  {/* Time Row */}
                  <View style={styles.metaRow}>
                    <ClockIcon />
                    <Text style={styles.metaText}>{parsed.time}</Text>
                  </View>

                  {/* Title */}
                  <Text style={styles.eventTitle}>{parsed.title}</Text>

                  {/* Location Row */}
                  <View style={styles.metaRow}>
                    <MapPinIcon />
                    <Text style={styles.metaText} numberOfLines={1}>{parsed.location}</Text>
                  </View>

                  {/* Manage Details Button */}
                  <View style={[styles.registerBtn, styles.registerBtnActive]}>
                    <Text style={styles.registerBtnText}>View & Manage</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.noBookingsContainer}>
            <View style={styles.noBookingsIconCircle}>
              <CalendarEmptyIcon />
            </View>
            <Text style={styles.noBookingsText}>
              {eventSearchQuery !== '' 
                ? 'No events match your search query' 
                : (filterCompleted ? 'No completed events available' : 'No upcoming events available')}
            </Text>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity 
        style={styles.fabButton} 
        onPress={() => navigation?.navigate('CreateEvent')} 
        activeOpacity={0.85}
      >
        <PlusIcon />
      </TouchableOpacity>

      {/* Floating Scroll to Top */}
      {showScrollTop && (
        <TouchableOpacity onPress={scrollToTop} style={styles.scrollTopButton} activeOpacity={0.85}>
          <ArrowUp size={20} color="white" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  headerBar: {
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
    color: '#0D3866',
  },
  feedContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 20,
    shadowColor: '#0A52C5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#03254C',
    padding: 0,
  },
  clearSearchBtn: {
    padding: 6,
  },
  clearSearchText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '800',
  },
  sectionHeading: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#1E293B',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 4,
    shadowColor: '#0A52C5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  cardImageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  dateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 46,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#0A52C5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  dateDay: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: -2,
  },
  typeBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0A52C5',
  },
  cardDetails: {
    padding: 16,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
  },
  registerBtn: {
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    borderWidth: 1.5,
  },
  registerBtnActive: {
    backgroundColor: '#0A52C5',
    borderColor: '#0A52C5',
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },

  // Event Details Styles
  detailScroll: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  detailsImageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
  },
  detailsImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'rgba(3, 37, 76, 0.45)',
  },
  detailsCategoryBadge: {
    backgroundColor: '#0A52C5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  detailsCategoryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  detailsEventTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  infoCard: {
    marginTop: -20,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    gap: 14,
    shadowColor: '#0A52C5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E6EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextCol: {
    flex: 1,
    gap: 2,
  },
  infoTextBold: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#03254C',
  },
  infoTextRegular: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  cardSeparator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  rsvpStatusCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  registeredCountText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '800',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#03254C',
  },
  speakersScrollContent: {
    paddingRight: 20,
  },
  speakerCard: {
    width: 124,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
  },
  speakerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  speakerName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
  },
  speakerRole: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  agendaTimelineContainer: {
    marginTop: 12,
  },
  agendaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineCol: {
    alignItems: 'center',
    width: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2.5,
    marginTop: 6,
  },
  timelineDotActive: {
    backgroundColor: '#0A52C5',
    borderColor: '#0A52C5',
  },
  timelineDotInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
  },
  timelineLine: {
    flex: 1,
    width: 2.5,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  agendaBox: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  agendaTimeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  agendaTimeTextActive: {
    color: '#0A52C5',
  },
  agendaTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#03254C',
    marginTop: 4,
  },
  agendaDescText: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    marginTop: 6,
    fontWeight: '500',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1.2,
    borderTopColor: '#E2E8F0',
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
  },
  bottomRegisterBtn: {
    flexDirection: 'row',
    backgroundColor: '#0A52C5',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    shadowColor: '#0A52C5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  bottomRegisterBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 37, 76, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    shadowColor: '#0A52C5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  modalTitleText: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#03254C',
    textAlign: 'center',
  },
  modalDivider: {
    height: 1.2,
    backgroundColor: '#F1F5F9',
    width: '100%',
    marginVertical: 12,
  },
  noBookingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  noBookingsIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  noBookingsText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
  filterTabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.2,
  },
  filterTabBtnActive: {
    backgroundColor: '#E6EEFF',
    borderColor: '#0A52C5',
  },
  filterTabBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  filterTabBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  filterTabBtnTextActive: {
    color: '#0A52C5',
  },
  filterTabBtnTextInactive: {
    color: '#64748B',
  },
  fabButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#70B62C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 99,
  },
  directoryTriggerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#0A52C5',
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
  },
  directoryTriggerText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0A52C5',
    marginLeft: 8,
  },
  memberListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    width: '100%',
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  memberName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#03254C',
  },
  memberRole: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  feedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 170,
    right: 26,
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

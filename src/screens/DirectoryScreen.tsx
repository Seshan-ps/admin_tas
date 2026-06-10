import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  ArrowLeft,
  Search,
  Lock,
  Globe,
  Edit2,
  Trash2,
  Info,
  Plus,
  X,
  ChevronDown,
  Mail,
  Download,
  Calendar,
  MapPin,
  Clock,
  User,
  Users,
  Building,
  CheckCircle,
  FileText,
  BarChart3,
  Home,
} from 'lucide-react-native';
import { supabase } from '../config/supabase';

const { width } = Dimensions.get('window');

interface Member {
  id: string;
  name: string;
  designation: string;
  company: string;
  memberId: string;
  tier: 'PLATINUM' | 'SENIOR' | 'ASSOCIATE' | 'STUDENT';
  tierLabel: string;
  avatar: any;
}

interface SocietyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  venueName: string;
  venueAddress: string;
  capacity: number;
  registered: number;
  privacy: string;
  registrationDeadline: string;
  description: string;
  badge: 'FLAGSHIP' | 'SEMINAR' | 'NETWORKING' | 'UPCOMING';
  status: 'CONFIRMED' | 'OPEN' | 'PLANNING';
  iconType: 'computer' | 'users' | 'flagship';
}

interface DirectoryScreenProps {
  onBack: () => void;
  onTabPress?: (tab: string) => void;
  initialSubTab?: 'members' | 'events';
  navigation?: any;
}

export const DirectoryScreen: React.FC<DirectoryScreenProps> = ({
  onBack,
  onTabPress,
  initialSubTab = 'members',
  navigation,
}) => {
  const [subTab, setSubTab] = useState<'members' | 'events'>(initialSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  
  // Navigation State inside screen
  // 'list' | 'event_detail' | 'edit_event' | 'create_event'
  const [viewState, setViewState] = useState<'list' | 'event_detail' | 'edit_event' | 'create_event'>('list');
  const [selectedEvent, setSelectedEvent] = useState<SocietyEvent | null>(null);

  // Mock Members Data
  const [members] = useState<Member[]>([
    {
      id: '1',
      name: 'Dr. Alistair Vance',
      designation: 'Chief Financial Auditor',
      company: 'Global Trust',
      memberId: 'TAS-9920-PL',
      tier: 'PLATINUM',
      tierLabel: 'PLATINUM ELITE',
      avatar: require('../../assets/admin_profile.png'),
    },
    {
      id: '2',
      name: 'Elena Rodriguez',
      designation: 'Partner',
      company: 'Rodriguez & Assoc.',
      memberId: 'TAS-4412-SR',
      tier: 'SENIOR',
      tierLabel: 'SENIOR FELLOW',
      avatar: require('../../assets/elena_profile.png'),
    },
    {
      id: '3',
      name: 'Jameson Thorne',
      designation: 'Forensic Accountant',
      company: 'Thorne Consulting',
      memberId: 'TAS-8801-AS',
      tier: 'ASSOCIATE',
      tierLabel: 'ASSOCIATE',
      avatar: require('../../assets/admin_profile.png'),
    },
  ]);

  // Mock Events Data
  const [events, setEvents] = useState<SocietyEvent[]>([
    {
      id: '1',
      title: 'Annual Tax Summit 2024',
      date: 'Oct 24-26, 2024',
      time: '09:00 AM',
      location: 'Grand Plaza, London',
      venueName: 'Grand Plaza Hotel & Suites',
      venueAddress: '122 Park Lane, Mayfair, London W1K 7AA, United Kingdom',
      capacity: 300,
      registered: 245,
      privacy: 'Members Only',
      registrationDeadline: '11/01/2024',
      description: 'The 2024 Annual Tax Summit is the premier gathering for accounting professionals, providing deep insights into new legislative changes, international compliance standards, and digital transformation in financial reporting.',
      badge: 'UPCOMING',
      status: 'CONFIRMED',
      iconType: 'flagship',
    },
    {
      id: '2',
      title: 'Annual Tax Conference 2024',
      date: 'Aug 15-17, 2024',
      time: '09:00 AM',
      location: 'Grand Hyatt, Texcity',
      venueName: 'Grand Hyatt Convention Center',
      venueAddress: '400 Main Street, Texcity, TX 75001',
      capacity: 500,
      registered: 450,
      privacy: 'Members Only',
      registrationDeadline: '08/01/2024',
      description: 'Flagship annual taxation conference focusing on regional governance, policy updates, and panel sessions with state accounting leaders.',
      badge: 'FLAGSHIP',
      status: 'CONFIRMED',
      iconType: 'flagship',
    },
    {
      id: '3',
      title: 'Ethics & Compliance Seminar',
      date: 'Sep 05, 2024',
      time: '02:00 PM',
      location: 'TAS Connect Platform',
      venueName: 'Online Portal',
      venueAddress: 'https://connect.tas.org/webinar/live',
      capacity: 1000,
      registered: 780,
      privacy: 'All Members',
      registrationDeadline: '09/04/2024',
      description: 'Mandatory training for all society members regarding updated 2024 ethics frameworks and regulatory standards compliance procedures.',
      badge: 'SEMINAR',
      status: 'OPEN',
      iconType: 'computer',
    },
    {
      id: '4',
      title: 'Local Chapter Networking',
      date: 'Oct 12, 2024',
      time: '06:30 PM',
      location: 'Riverside Executive Lounge',
      venueName: 'Riverside Lounge & Gardens',
      venueAddress: '88 River Rd, Downtown Austin, TX 78701',
      capacity: 100,
      registered: 65,
      privacy: 'Members & Invitees',
      registrationDeadline: '10/10/2024',
      description: 'Regional mixer for senior partners and upcoming associates to connect, share opportunities, and build local networks.',
      badge: 'NETWORKING',
      status: 'PLANNING',
      iconType: 'users',
    },
  ]);

  // Form Fields State (for Creating/Editing events)
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formCapacity, setFormCapacity] = useState('300');
  const [formPrivacy, setFormPrivacy] = useState('Members Only');
  const [formDeadline, setFormDeadline] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase.from('events').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          const formatted = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            date: new Date(item.date).toLocaleDateString(),
            time: item.start_time,
            location: item.location,
            venueName: item.location,
            venueAddress: 'TBD',
            capacity: item.capacity || 300,
            registered: item.registered_count || 0,
            privacy: item.privacy || 'Members Only',
            registrationDeadline: item.date,
            description: item.description || '',
            badge: 'UPCOMING',
            status: 'OPEN',
            iconType: 'users',
          }));
          setEvents(formatted);
        }
      } catch (e) {}
    };
    fetchEvents();
  }, []);

  const handleOpenEventDetail = (event: SocietyEvent) => {
    setSelectedEvent(event);
    setViewState('event_detail');
  };

  const handleEditEventPress = (event: SocietyEvent) => {
    setSelectedEvent(event);
    setFormTitle(event.title);
    setFormDate(event.date);
    setFormTime(event.time);
    setFormLocation(event.location);
    setFormCapacity(event.capacity.toString());
    setFormPrivacy(event.privacy);
    setFormDeadline(event.registrationDeadline);
    setFormDescription(event.description);
    setViewState('edit_event');
  };

  const handleCreateEventPress = () => {
    setSelectedEvent(null);
    setFormTitle('');
    setFormDate('');
    setFormTime('');
    setFormLocation('');
    setFormCapacity('300');
    setFormPrivacy('Members Only');
    setFormDeadline('');
    setFormDescription('');
    setViewState('create_event');
  };

  const handleSaveChanges = async () => {
    if (!formTitle || !formDate || !formLocation) {
      Alert.alert('Incomplete Fields', 'Please fill in Title, Date, and Location.');
      return;
    }

    const eventPayload = {
      title: formTitle,
      date: new Date(formDate).toISOString(),
      start_time: formTime,
      location: formLocation,
      capacity: parseInt(formCapacity) || 300,
      privacy: formPrivacy,
      description: formDescription,
    };

    if (viewState === 'edit_event' && selectedEvent) {
      // Edit existing
      try {
        const { error } = await supabase.from('events').update(eventPayload).eq('id', selectedEvent.id);
        if (error) throw error;
      } catch (e) {}

      setEvents(
        events.map((e) =>
          e.id === selectedEvent.id
            ? {
                ...e,
                title: formTitle,
                date: formDate,
                time: formTime,
                location: formLocation,
                capacity: parseInt(formCapacity) || 300,
                privacy: formPrivacy,
                registrationDeadline: formDeadline,
                description: formDescription,
              }
            : e
        )
      );
      Alert.alert('Changes Saved', 'The event has been updated successfully.');
    } else {
      // Create new
      let newId = Date.now().toString();
      try {
        const { data, error } = await supabase.from('events').insert([eventPayload]).select();
        if (error) throw error;
        if (data && data[0]) newId = data[0].id;
      } catch (e) {}

      const newEvent: SocietyEvent = {
        id: newId,
        title: formTitle,
        date: formDate,
        time: formTime,
        location: formLocation,
        venueName: formLocation,
        venueAddress: 'TBD',
        capacity: parseInt(formCapacity) || 300,
        registered: 0,
        privacy: formPrivacy,
        registrationDeadline: formDeadline,
        description: formDescription,
        badge: 'UPCOMING',
        status: 'OPEN',
        iconType: 'users',
      };
      setEvents([newEvent, ...events]);
      Alert.alert('Success', 'A new event draft has been created.');
    }
    setViewState('list');
  };

  const handleCancelEvent = (id: string) => {
    Alert.alert(
      'Cancel Event',
      'Are you sure you want to cancel this event? This action will notify all registered members.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel Event',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.from('events').delete().eq('id', id);
              if (error) throw error;
            } catch (e) {}
            setEvents(events.filter((e) => e.id !== id));
            setViewState('list');
          },
        },
      ]
    );
  };

  // Filter Members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.designation.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTier === 'ALL') return matchesSearch;
    return matchesSearch && m.tier === selectedTier;
  });

  // Filter Events
  const filteredEvents = events.filter((e) => {
    return (
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // RENDER 1: MEMBERS DIRECTORY VIEW
  const renderMembersList = () => {
    const tiers: { key: string; label: string }[] = [
      { key: 'ALL', label: 'ALL' },
      { key: 'PLATINUM', label: 'PLATINUM' },
      { key: 'SENIOR', label: 'SENIOR' },
      { key: 'ASSOCIATE', label: 'ASSOCIATE' },
      { key: 'STUDENT', label: 'STUDENT' },
    ];

    return (
      <ScrollView className="flex-1 bg-[#F8FAFC]" contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Members Header Panel */}
        <View className="px-4 pt-4 pb-2">
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-[26px] font-extrabold text-[#134074]">Members</Text>
            <View className="bg-[#A4E06E] px-2.5 py-1 rounded-full">
              <Text className="text-[#2B5713] text-[10px] font-bold uppercase tracking-wider">Active Database</Text>
            </View>
          </View>
          <View className="items-end mb-4">
            <Text className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Society Members</Text>
            <Text className="text-3xl font-black text-[#134074] mt-0.5">1,284</Text>
          </View>

          {/* Search Registry */}
          <View className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm mb-4">
            <Text className="text-[11px] font-extrabold text-[#134074] uppercase tracking-wider mb-2">Search Registry</Text>
            <View className="flex-row items-center border border-slate-200 rounded-lg px-3 py-2 bg-[#FCFDFE]">
              <Search size={16} color="#94a3b8" className="mr-2" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Filter by Name, ID, or Professional Designation..."
                placeholderTextColor="#94a3b8"
                className="flex-1 text-[13px] text-slate-800 p-0"
              />
            </View>

            {/* Membership Tier Filter Pills */}
            <Text className="text-[11px] font-extrabold text-[#134074] uppercase tracking-wider mt-4 mb-2">Membership Tier</Text>
            <View className="flex-row flex-wrap gap-2">
              {tiers.map((tier) => {
                const isActive = selectedTier === tier.key;
                return (
                  <TouchableOpacity
                    key={tier.key}
                    onPress={() => setSelectedTier(tier.key)}
                    className={`rounded-full px-4 py-1.5 border ${
                      isActive 
                        ? 'bg-[#134074] border-[#134074]' 
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <Text className={`text-[10px] font-extrabold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                      {tier.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Member Cards */}
        <View className="px-4">
          {filteredMembers.map((member) => {
            // Colors based on Tier
            let badgeBg = 'bg-slate-100';
            let badgeText = 'text-slate-600';
            if (member.tier === 'PLATINUM') {
              badgeBg = 'bg-[#A4E06E]';
              badgeText = 'text-[#2B5713]';
            } else if (member.tier === 'SENIOR') {
              badgeBg = 'bg-[#134074]';
              badgeText = 'text-white';
            } else if (member.tier === 'ASSOCIATE') {
              badgeBg = 'bg-blue-100';
              badgeText = 'text-blue-700';
            }

            return (
              <View key={member.id} className="bg-white border border-slate-200 rounded-2xl p-4 mb-3 shadow-sm">
                <View className="flex-row mb-4">
                  {/* Left avatar with green border for status */}
                  <View className="relative">
                    <Image
                      source={member.avatar}
                      className="w-14 h-14 rounded-lg border border-slate-100"
                    />
                    <View className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                  </View>

                  {/* Member metadata */}
                  <View className="ml-3.5 flex-1">
                    <View className="flex-row justify-between items-start">
                      <Text className="text-[16px] font-extrabold text-[#134074]">{member.name}</Text>
                      <View className={`rounded px-2.5 py-0.5 ${badgeBg}`}>
                        <Text className={`text-[9px] font-extrabold uppercase tracking-wide ${badgeText}`}>
                          {member.tierLabel}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-[12px] text-slate-500 font-semibold mt-0.5">
                      {member.designation}, {member.company}
                    </Text>
                    <View className="flex-row items-center mt-2.5">
                      <View style={{ width: 14, height: 14, borderRadius: 7, borderStyle: 'dashed', borderWidth: 1, borderColor: '#94a3b8', justifyContent: 'center', alignItems: 'center', marginRight: 4 }}>
                        <Text className="text-[8px] font-extrabold text-slate-400">⚙</Text>
                      </View>
                      <Text className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                        ID: {member.memberId}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Divider */}
                <View className="h-[1px] bg-slate-100 mb-3" />

                {/* Buttons Row */}
                <View className="flex-row items-center space-x-2">
                  <TouchableOpacity 
                    onPress={() => Alert.alert('View Profile', `Opening profile of ${member.name}`)}
                    className="flex-1 bg-[#134074] rounded-lg py-2 items-center"
                  >
                    <Text className="text-white font-extrabold text-xs">VIEW PROFILE</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => Alert.alert('Download Certificate', `Downloading credentials sheet for ID: ${member.memberId}`)}
                    className="flex-row items-center bg-white border border-slate-200 rounded-lg px-4 py-2"
                  >
                    <Download size={13} color="#134074" className="mr-1.5" />
                    <Text className="text-[#134074] font-extrabold text-xs">Download</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => Alert.alert('Compose Mail', `Sending message to: ${member.memberId}@tas.org`)}
                    className="bg-white border border-slate-200 rounded-lg p-2 items-center justify-center"
                  >
                    <Mail size={15} color="#134074" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Pagination Section */}
        <View className="items-center mt-4">
          <Text className="text-[11px] text-slate-400 font-semibold mb-3">Showing 1-6 of 1,284 results</Text>
          <View className="flex-row items-center space-x-1.5">
            <TouchableOpacity className="w-8 h-8 rounded-lg border border-slate-200 items-center justify-center bg-white">
              <Text className="text-slate-400 font-bold">‹</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-8 h-8 rounded-lg bg-[#134074] items-center justify-center">
              <Text className="text-white font-bold text-xs">1</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-8 h-8 rounded-lg border border-slate-200 items-center justify-center bg-white">
              <Text className="text-slate-600 font-bold text-xs">2</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-8 h-8 rounded-lg border border-slate-200 items-center justify-center bg-white">
              <Text className="text-slate-600 font-bold text-xs">3</Text>
            </TouchableOpacity>

            <Text className="text-slate-400 text-xs px-1 font-bold">...</Text>

            <TouchableOpacity className="w-10 h-10 rounded-lg border border-slate-200 items-center justify-center bg-white">
              <Text className="text-slate-600 font-bold text-xs">214</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-8 h-8 rounded-lg border border-slate-200 items-center justify-center bg-white">
              <Text className="text-slate-600 font-bold">›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  // RENDER 2: EVENTS MAIN LIST VIEW
  const renderEventsList = () => {
    return (
      <ScrollView className="flex-1 bg-[#F8FAFC]" contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Events Subtitle Panel */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-2xl font-extrabold text-[#134074] mb-1.5">Upcoming Events</Text>
          <Text className="text-[12px] text-slate-500 font-medium mb-4">
            Manage society activities and administrative conferences.
          </Text>
        </View>

        {/* Dynamic Events Cards */}
        <View className="px-4">
          {filteredEvents.map((event) => {
            // Determine icons and tags based on event type
            const isFlagship = event.badge === 'FLAGSHIP';
            const isSeminar = event.badge === 'SEMINAR';
            const isNetworking = event.badge === 'NETWORKING';

            return (
              <View key={event.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-4 shadow-sm">
                {/* Event header picture/icon block */}
                {isFlagship ? (
                  <View className="relative">
                    <Image
                      source={require('../../assets/server_room_update.png')}
                      className="w-full h-44"
                      resizeMode="cover"
                    />
                    <View className="absolute top-3 left-3 bg-[#134074] px-2.5 py-0.5 rounded">
                      <Text className="text-white text-[9px] font-extrabold tracking-wider">FLAGSHIP</Text>
                    </View>
                  </View>
                ) : (
                  <View className="px-4 pt-4 pb-1 flex-row justify-between items-center">
                    <View className={`p-2.5 rounded-xl ${isSeminar ? 'bg-[#D2E4F9]/60' : 'bg-blue-50'}`}>
                      {isSeminar ? (
                        <View className="w-5 h-5 bg-[#70B62C] rounded items-center justify-center">
                          <Text className="text-white text-[9px] font-bold">💻</Text>
                        </View>
                      ) : (
                        <Users size={18} color="#134074" />
                      )}
                    </View>
                    <View className="bg-slate-100 px-2 py-0.5 rounded">
                      <Text className="text-slate-500 text-[9px] font-bold uppercase tracking-wider">{event.badge}</Text>
                    </View>
                  </View>
                )}

                {/* Event details */}
                <View className="p-4">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-[11px] font-bold text-[#70B62C] uppercase tracking-wider">{event.date}</Text>
                    <View className="bg-emerald-50 border border-emerald-100 rounded px-2 py-0.5">
                      <Text className="text-emerald-700 text-[9px] font-extrabold uppercase tracking-wide">{event.status}</Text>
                    </View>
                  </View>

                  <TouchableOpacity onPress={() => handleOpenEventDetail(event)}>
                    <Text className="text-[17px] font-extrabold text-[#134074] mb-2 active:text-blue-800">
                      {event.title}
                    </Text>
                  </TouchableOpacity>

                  {/* Optional short description */}
                  {event.description && !isFlagship && (
                    <Text className="text-slate-500 text-[12px] leading-relaxed mb-3" numberOfLines={2}>
                      {event.description}
                    </Text>
                  )}

                  <View className="flex-row items-center space-x-3.5 mb-4">
                    <View className="flex-row items-center">
                      <MapPin size={13} color="#94a3b8" />
                      <Text className="text-[11px] text-slate-500 ml-1 font-semibold">{event.location}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Users size={13} color="#94a3b8" />
                      <Text className="text-[11px] text-slate-500 ml-1 font-semibold">
                        {event.registered} Registered
                      </Text>
                    </View>
                  </View>

                  {/* Buttons Row */}
                  <View className="flex-row items-center space-x-3 border-t border-slate-100 pt-3">
                    <TouchableOpacity 
                      onPress={() => handleCancelEvent(event.id)}
                      className="flex-1 bg-white border border-slate-200 rounded-lg py-2.5 items-center"
                    >
                      <Text className="text-slate-500 font-extrabold text-xs">
                        {isNetworking ? 'Cancel Event' : 'Cancel Event'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={() => handleEditEventPress(event)}
                      className="flex-1 bg-[#134074] rounded-lg py-2.5 flex-row justify-center items-center"
                    >
                      <Edit2 size={13} color="white" className="mr-1.5" />
                      <Text className="text-white font-extrabold text-xs">
                        {isNetworking ? 'Manage Planning' : 'Edit Event'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Annual Participation Goal Box */}
        <View className="bg-[#134074] m-4 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <Text className="text-white font-bold text-base mb-1">Annual Participation Goal</Text>
          <Text className="text-blue-100/80 text-[13px] leading-relaxed mb-4">
            You're at 82% of the targeted annual event engagement. Reaching 90% unlocks the Regional Chapter Grant.
          </Text>
          <View className="flex-row space-x-8">
            <View>
              <Text className="text-[#A4E06E] font-extrabold text-xl">1.2k</Text>
              <Text className="text-blue-100/60 text-[9px] font-bold uppercase mt-0.5">Total Attendees</Text>
            </View>
            <View>
              <Text className="text-[#A4E06E] font-extrabold text-xl">14</Text>
              <Text className="text-blue-100/60 text-[9px] font-bold uppercase mt-0.5">Events YTD</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  // RENDER 3: EVENT DETAIL VIEW
  const renderEventDetail = () => {
    if (!selectedEvent) return null;
    const progressPercent = Math.min(
      Math.round((selectedEvent.registered / selectedEvent.capacity) * 100),
      100
    );

    return (
      <ScrollView className="flex-1 bg-[#F8FAFC]" contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Back navigation */}
        <TouchableOpacity 
          onPress={() => setViewState('list')}
          className="flex-row items-center px-4 py-3 bg-white border-b border-slate-100"
        >
          <ArrowLeft size={18} color="#134074" className="mr-2" />
          <Text className="text-[#134074] font-extrabold text-sm">Back to Directory</Text>
        </TouchableOpacity>

        {/* Core Event Information Card */}
        <View className="bg-white border border-slate-200 rounded-2xl m-4 p-5 shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <View className="bg-[#A4E06E] px-2.5 py-0.5 rounded">
              <Text className="text-[#2B5713] text-[10px] font-extrabold uppercase tracking-wide">UPCOMING</Text>
            </View>
            <Text className="text-slate-400 text-xs font-bold">ID: #AS-2024-001</Text>
          </View>

          <Text className="text-2xl font-extrabold text-[#134074] mb-4">{selectedEvent.title}</Text>

          <View className="space-y-3 mb-6">
            <View className="flex-row items-center">
              <Calendar size={16} color="#134074" className="mr-3" />
              <Text className="text-slate-700 font-extrabold text-sm">{selectedEvent.date}</Text>
            </View>
            <View className="flex-row items-center">
              <MapPin size={16} color="#134074" className="mr-3" />
              <Text className="text-slate-700 font-extrabold text-sm">{selectedEvent.location}</Text>
            </View>
          </View>

          <View className="flex-row items-center space-x-3.5 pt-4 border-t border-slate-100">
            <TouchableOpacity 
              onPress={() => handleEditEventPress(selectedEvent)}
              className="flex-1 bg-[#134074] rounded-lg py-2.5 flex-row justify-center items-center"
            >
              <Edit2 size={13} color="white" className="mr-1.5" />
              <Text className="text-white font-extrabold text-xs">Edit Event</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleCancelEvent(selectedEvent.id)}
              className="flex-1 bg-white border border-slate-200 rounded-lg py-2.5 items-center"
            >
              <Text className="text-slate-500 font-extrabold text-xs">Cancel Event</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Capacity / Registration Progress Bar Card */}
        <View className="bg-white border border-slate-200 rounded-2xl m-4 p-5 shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-extrabold text-[#134074]">Registration</Text>
            <Users size={16} color="#94a3b8" />
          </View>

          <View className="flex-row items-baseline mb-3">
            <Text className="text-3xl font-extrabold text-[#134074]">{selectedEvent.registered}</Text>
            <Text className="text-slate-400 text-sm font-semibold ml-2">/ {selectedEvent.capacity} Capacity</Text>
          </View>

          {/* Progress track */}
          <View className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
            <View 
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-green-600 rounded-full" 
            />
          </View>

          <Text className="text-slate-500 text-[12px] leading-relaxed mb-4">
            {progressPercent}% capacity filled. {selectedEvent.capacity - selectedEvent.registered} slots remaining for general admission.
          </Text>

          <TouchableOpacity 
            onPress={() => Alert.alert('Export Complete', 'The attendee list has been compiled and downloaded as CSV.')}
            className="w-full bg-blue-50 border border-blue-100 rounded-lg py-2.5 flex-row justify-center items-center"
          >
            <Download size={14} color="#134074" className="mr-2" />
            <Text className="text-[#134074] font-extrabold text-xs">Export Attendee List</Text>
          </TouchableOpacity>
        </View>

        {/* Venue Details Card */}
        <View className="bg-white border border-slate-200 rounded-2xl m-4 p-5 shadow-sm">
          <Text className="text-base font-extrabold text-[#134074] mb-3.5">Venue Details</Text>
          
          <View className="flex-row mb-4">
            <Building size={16} color="#134074" className="mr-3.5 mt-0.5" />
            <View className="flex-1">
              <Text className="font-extrabold text-slate-800 text-sm">{selectedEvent.venueName}</Text>
              <Text className="text-[12px] text-slate-400 font-semibold mt-0.5">The Ballroom, Level 3</Text>
            </View>
          </View>

          <View className="flex-row">
            <MapPin size={16} color="#134074" className="mr-3.5 mt-0.5" />
            <Text className="flex-1 text-slate-500 text-sm leading-relaxed">
              {selectedEvent.venueAddress}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  // RENDER 4: CREATE / EDIT EVENT FORM VIEW
  const renderEventForm = () => {
    const isCreate = viewState === 'create_event';

    return (
      <ScrollView className="flex-1 bg-[#F8FAFC]" contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Back navigation */}
        <TouchableOpacity 
          onPress={() => setViewState('list')}
          className="flex-row items-center px-4 py-3 bg-white border-b border-slate-100"
        >
          <ArrowLeft size={18} color="#134074" className="mr-2" />
          <Text className="text-[#134074] font-extrabold text-sm">Back to list</Text>
        </TouchableOpacity>

        {/* Form Title banner */}
        <View className="px-4 py-4">
          <Text className="text-2xl font-black text-[#134074]">
            {isCreate ? 'Event' : 'Edit Event'}
          </Text>
          <Text className="text-[12px] text-slate-500 font-medium mt-1">
            {isCreate ? 'Create a new event' : 'Update the details for the upcoming taxation summit.'}
          </Text>
          <View className="flex-row mt-2.5">
            <View className="bg-blue-100 px-3 py-0.5 rounded-full flex-row items-center space-x-1 border border-blue-200">
              <CheckCircle size={10} color="#134074" />
              <Text className="text-[#134074] text-[9px] font-extrabold uppercase tracking-wider">Secure Draft</Text>
            </View>
          </View>
        </View>

        {/* Input container card */}
        <View className="bg-white border border-slate-200 rounded-2xl m-4 p-5 shadow-sm">
          {/* Section 1: General Info */}
          <Text className="text-sm font-extrabold text-[#134074] uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">
            General Information
          </Text>

          <Text className="text-xs font-extrabold text-slate-600 mb-1.5">Event Title</Text>
          <TextInput
            value={formTitle}
            onChangeText={setFormTitle}
            placeholder="e.g. Annual Tax Summit 2024"
            placeholderTextColor="#cbd5e1"
            className="border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 mb-4 bg-[#FCFDFE]"
          />

          <Text className="text-xs font-extrabold text-slate-600 mb-1.5">Date</Text>
          <TextInput
            value={formDate}
            onChangeText={setFormDate}
            placeholder="dd/mm/yyyy"
            placeholderTextColor="#cbd5e1"
            className="border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 mb-4 bg-[#FCFDFE]"
          />

          <Text className="text-xs font-extrabold text-slate-600 mb-1.5">Start Time</Text>
          <TextInput
            value={formTime}
            onChangeText={setFormTime}
            placeholder="00:00 AM"
            placeholderTextColor="#cbd5e1"
            className="border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 mb-6 bg-[#FCFDFE]"
          />

          {/* Section 2: Logistics */}
          <Text className="text-sm font-extrabold text-[#134074] uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">
            Logistics & Capacity
          </Text>

          <Text className="text-xs font-extrabold text-slate-600 mb-1.5">Location</Text>
          <TextInput
            value={formLocation}
            onChangeText={setFormLocation}
            placeholder="venue"
            placeholderTextColor="#cbd5e1"
            className="border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 mb-4 bg-[#FCFDFE]"
          />

          <Text className="text-xs font-extrabold text-slate-600 mb-1.5">Capacity</Text>
          <TextInput
            value={formCapacity}
            onChangeText={setFormCapacity}
            placeholder="300"
            placeholderTextColor="#cbd5e1"
            keyboardType="number-pad"
            className="border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 mb-4 bg-[#FCFDFE]"
          />

          <Text className="text-xs font-extrabold text-slate-600 mb-1.5">Privacy</Text>
          <TouchableOpacity 
            onPress={() => setFormPrivacy(formPrivacy === 'Members Only' ? 'All Members' : 'Members Only')}
            className="border border-slate-200 rounded-lg px-3.5 py-2.5 flex-row justify-between items-center mb-4 bg-[#FCFDFE]"
          >
            <Text className="text-sm text-slate-800">{formPrivacy}</Text>
            <ChevronDown size={14} color="#64748b" />
          </TouchableOpacity>

          <Text className="text-xs font-extrabold text-slate-600 mb-1.5">Registration Deadline</Text>
          <TextInput
            value={formDeadline}
            onChangeText={setFormDeadline}
            placeholder="dd/mm/yyyy"
            placeholderTextColor="#cbd5e1"
            className="border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 mb-6 bg-[#FCFDFE]"
          />

          {/* Section 3: Content */}
          <Text className="text-sm font-extrabold text-[#134074] uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">
            Event Content
          </Text>

          <Text className="text-xs font-extrabold text-slate-600 mb-1.5">Description</Text>
          <TextInput
            value={formDescription}
            onChangeText={setFormDescription}
            placeholder="Enter event description and guidelines..."
            placeholderTextColor="#cbd5e1"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className="border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 min-h-[120px] mb-6 bg-[#FCFDFE]"
          />

          {/* Form Action Buttons */}
          <View className="space-y-3">
            <TouchableOpacity 
              onPress={handleSaveChanges}
              className="w-full bg-[#3F7E1F] rounded-lg py-3 flex-row justify-center items-center"
            >
              <Text className="text-white font-extrabold text-sm">Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setViewState('list')}
              className="w-full bg-white border border-slate-200 rounded-lg py-3 items-center"
            >
              <Text className="text-slate-500 font-extrabold text-sm">Discard Draft</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderActiveSubView = () => {
    if (viewState === 'event_detail') {
      return renderEventDetail();
    }
    if (viewState === 'edit_event' || viewState === 'create_event') {
      return renderEventForm();
    }

    return subTab === 'members' ? renderMembersList() : renderEventsList();
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      {/* Top Header */}
      {viewState === 'list' && (
        <View className="flex-row items-center px-4 py-3 bg-[#E9F0FA] border-b border-blue-100 z-20">
          <TouchableOpacity onPress={onBack} className="p-1.5 -ml-1 mr-3">
            <ArrowLeft size={22} color="#134074" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-[#134074]">Directory</Text>
        </View>
      )}

      {/* Sub tabs navigation (Members vs Events switcher) */}
      {viewState === 'list' && (
        <View className="px-4 py-3 bg-[#F8FAFC]">
          <View className="flex-row bg-[#E2E8F0] p-1 rounded-xl">
            <TouchableOpacity
              onPress={() => {
                setSubTab('members');
                setSearchQuery('');
              }}
              className={`flex-1 py-2 rounded-lg items-center ${
                subTab === 'members' ? 'bg-[#134074] shadow-sm' : 'bg-transparent'
              }`}
            >
              <Text className={`text-xs font-bold uppercase tracking-wider ${subTab === 'members' ? 'text-white' : 'text-slate-500'}`}>
                Members
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSubTab('events');
                setSearchQuery('');
              }}
              className={`flex-1 py-2 rounded-lg items-center ${
                subTab === 'events' ? 'bg-[#134074] shadow-sm' : 'bg-transparent'
              }`}
            >
              <Text className={`text-xs font-bold uppercase tracking-wider ${subTab === 'events' ? 'text-white' : 'text-slate-500'}`}>
                Events
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Render Main Content */}
      {renderActiveSubView()}

      {/* Floating Add Event Button (Only in list view under Events tab) */}
      {viewState === 'list' && subTab === 'events' && (
        <TouchableOpacity
          onPress={handleCreateEventPress}
          activeOpacity={0.85}
          style={styles.fabButton}
          className="bg-[#70B62C] rounded-full justify-center items-center shadow-lg"
        >
          <Plus size={26} color="white" />
        </TouchableOpacity>
      )}

      {/* Bottom Navigation */}
      {viewState === 'list' && !navigation && (
        <View className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center bg-white border-t border-slate-200 py-2.5 z-20">
          <TouchableOpacity className="items-center" onPress={() => onTabPress?.('feed')}>
            <Home size={24} color="#94a3b8" />
            <Text className="text-[10px] mt-0.5 font-medium text-slate-400">Home</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center" onPress={() => onTabPress?.('analytics')}>
            <BarChart3 size={24} color="#94a3b8" />
            <Text className="text-[10px] mt-0.5 font-medium text-slate-400">Analytics</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center" onPress={() => onTabPress?.('posts_all')}>
            <FileText size={24} color="#94a3b8" />
            <Text className="text-[10px] mt-0.5 font-medium text-slate-400">Post</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center" onPress={() => {}}>
            <Users size={24} color="#94a3b8" />
            <Text className="text-[10px] mt-0.5 font-medium text-slate-400">Directory</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center" onPress={() => {}}>
            <View style={{ width: 22, height: 22, backgroundColor: '#70B62C', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
              <Text className="text-white text-[10px] font-bold">🔍</Text>
            </View>
            <Text className="text-[10px] mt-0.5 font-bold text-[#70B62C]">Directory</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fabButton: {
    position: 'absolute',
    bottom: 85,
    right: 20,
    width: 54,
    height: 54,
    zIndex: 99,
  },
});

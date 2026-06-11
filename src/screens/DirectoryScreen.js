import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, SafeAreaView, Alert, StyleSheet } from 'react-native';
import { ArrowLeft, Search, MessageSquare, Plus, MapPin, IdCard, ArrowUp, Laptop, Link, Users, Edit2 } from 'lucide-react-native';
export const DirectoryScreen = ({
  onBack,
  onTabPress,
  initialSubTab = 'members',
  navigation
}) => {
  const [subTab, setSubTab] = useState(initialSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollViewRef = useRef(null);
  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 300);
  };
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true
    });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const eventMatches = (title, date, desc, location) => {
    if (!eventSearchQuery) return true;
    const query = eventSearchQuery.toLowerCase();
    return title.toLowerCase().includes(query) || date.toLowerCase().includes(query) || desc.toLowerCase().includes(query) || location.toLowerCase().includes(query);
  };

  // Members data
  const [members] = useState([{
    id: '1',
    name: 'Dr. Alistair Vance',
    designation: 'Chief Financial Auditor',
    company: 'Global Trust',
    memberId: 'TAS-9920-PL',
    tier: 'PLATINUM',
    tierLabel: 'PLATINUM ELITE',
    avatar: require('../../assets/admin_profile.png'),
    hasGreenBorder: true
  }, {
    id: '2',
    name: 'Elena Rodriguez',
    designation: 'Partner',
    company: 'Rodriguez & Assoc.',
    memberId: 'TAS-4412-SR',
    tier: 'SENIOR',
    tierLabel: 'SENIOR FELLOW',
    avatar: require('../../assets/elena_profile.png'),
    hasGreenBorder: false
  }, {
    id: '3',
    name: 'Jameson Thorne',
    designation: 'Forensic Accountant',
    company: 'TAS Governance',
    memberId: 'TAS-8801-AS',
    tier: 'ASSOCIATE',
    tierLabel: 'ASSOCIATE',
    avatar: require('../../assets/admin_profile.png'),
    hasGreenBorder: false
  }, {
    id: '4',
    name: 'Sarah Jenkins',
    designation: 'Senior Auditor',
    company: 'PKF International Ltd.',
    memberId: 'TAS-2024-8842',
    tier: 'PLATINUM',
    tierLabel: 'Platinum Member',
    avatar: require('../../assets/elena_profile.png'),
    hasGreenBorder: true
  }, {
    id: '5',
    name: 'Marcus Vance',
    designation: 'Tax Strategist',
    company: 'Vance Partners',
    memberId: 'TAS-5521-SR',
    tier: 'SENIOR',
    tierLabel: 'SENIOR FELLOW',
    avatar: require('../../assets/admin_profile.png'),
    hasGreenBorder: false
  }, {
    id: '6',
    name: 'Clara Oswald',
    designation: 'Compliance Lead',
    company: 'Clara Audits Ltd.',
    memberId: 'TAS-1209-AS',
    tier: 'ASSOCIATE',
    tierLabel: 'ASSOCIATE',
    avatar: require('../../assets/elena_profile.png'),
    hasGreenBorder: false
  }, {
    id: '7',
    name: 'Rupert Thorne',
    designation: 'Junior Researcher',
    company: 'City University',
    memberId: 'TAS-3041-ST',
    tier: 'STUDENT',
    tierLabel: 'STUDENT MEMBER',
    avatar: require('../../assets/admin_profile.png'),
    hasGreenBorder: false
  }, {
    id: '8',
    name: 'Liam Neeson',
    designation: 'Security Director',
    company: 'United Group',
    memberId: 'TAS-9988-SR',
    tier: 'SENIOR',
    tierLabel: 'SENIOR FELLOW',
    avatar: require('../../assets/admin_profile.png'),
    hasGreenBorder: false
  }]);

  // Events data
  const [events] = useState([{
    id: 'e1',
    title: 'Tax Ethics Round-Table',
    date: 'OCT 14, 2026',
    location: 'Virtual Session',
    attendees: 148
  }, {
    id: 'e2',
    title: 'Annual Society Gala',
    date: 'OCT 22, 2026',
    location: 'Grand Ballroom, City Center',
    attendees: 320
  }]);

  // Wrapper for search state changes to reset page
  const handleSearchChange = text => {
    setSearchQuery(text);
    setCurrentPage(1);
  };
  const handleTierChange = tier => {
    setSelectedTier(tier);
    setCurrentPage(1);
  };

  // Filters members based on search and tier
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || member.designation.toLowerCase().includes(searchQuery.toLowerCase()) || member.memberId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTier === 'ALL' || member.tier === selectedTier;
    return matchesSearch && matchesTier;
  });
  const totalCount = filteredMembers.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);
  const handleViewProfile = member => {
    if (navigation) {
      navigation.navigate('MemberProfile', {
        name: member.name,
        role: member.designation,
        branch: member.tier === 'PLATINUM' ? 'London Branch' : 'Regional Branch',
        tierLabel: member.tierLabel,
        memberId: member.memberId,
        joinDate: 'Joined: Jan 2021',
        email: `${member.name.toLowerCase().replace(' ', '.').replace('dr.', '')}@tas-governance.org`,
        fullIdCode: `${member.memberId}-SJ-TAS`,
        joinDateFull: 'January 14, 2021',
        firm: member.company,
        avatar: member.avatar
      });
    } else {
      Alert.alert('Member Profile', `Opening profile of ${member.name}`);
    }
  };
  const handleMessageRedirect = member => {
    if (navigation) {
      navigation.navigate('Messages');
    } else if (onTabPress) {
      onTabPress('Messages');
    } else {
      Alert.alert('Secure Message', `Initiating secured channel to ${member.name}`);
    }
  };
  return <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={22} color="#0D3866" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Directory</Text>
        <View style={{
        width: 44
      }} />
      </View>

      {/* Segmented Switcher (Members vs Events) */}
      <View style={styles.switcherContainer}>
        <View style={styles.switcherTrack}>
          <TouchableOpacity onPress={() => setSubTab('members')} style={[styles.switcherButton, subTab === 'members' && styles.switcherButtonActive]} activeOpacity={0.8}>
            <Text style={[styles.switcherText, subTab === 'members' && styles.switcherTextActive]}>
              Members
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSubTab('events')} style={[styles.switcherButton, subTab === 'events' && styles.switcherButtonActive]} activeOpacity={0.8}>
            <Text style={[styles.switcherText, subTab === 'events' && styles.switcherTextActive]}>
              Events
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Scroll Content */}
      <ScrollView ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {subTab === 'members' ? <>
            {/* Header Titles Row */}
            <View style={styles.sectionHeaderRow}>
              <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
                <Text style={styles.sectionTitle}>Members</Text>
                <View style={styles.activeDbPill}>
                  <Text style={styles.activeDbText}>Active Database</Text>
                </View>
              </View>

              <View style={styles.totalMembersContainer}>
                <Text style={styles.totalMembersLabel}>TOTAL SOCIETY MEMBERS</Text>
                <Text style={styles.totalMembersValue}>{totalCount}</Text>
              </View>
            </View>

            {/* SEARCH REGISTRY CARD */}
            <View style={styles.searchCard}>
              <Text style={styles.searchCardLabel}>Search Registry</Text>
              <View style={styles.searchInputContainer}>
                <Search size={18} color="#94a3b8" style={{
              marginRight: 8
            }} />
                <TextInput placeholder="Filter by Name, ID, or Professional Designation..." placeholderTextColor="#94a3b8" value={searchQuery} onChangeText={handleSearchChange} style={styles.searchInput} />
              </View>

              <Text style={styles.searchCardLabel}>Membership Tier</Text>
              <View style={styles.tierPillsRow}>
                {['ALL', 'PLATINUM', 'SENIOR', 'ASSOCIATE', 'STUDENT'].map(tier => <TouchableOpacity key={tier} onPress={() => handleTierChange(tier)} style={[styles.tierPill, selectedTier === tier && styles.tierPillActive]}>
                    <Text style={[styles.tierPillText, selectedTier === tier && styles.tierPillTextActive]}>
                      {tier}
                    </Text>
                  </TouchableOpacity>)}
              </View>
            </View>

            {/* MEMBERS LIST */}
            {paginatedMembers.map(member => <View key={member.id} style={styles.memberCard}>
                {/* Profile Header Block */}
                <View style={styles.memberHeader}>
                  <TouchableOpacity onPress={() => handleViewProfile(member)} activeOpacity={0.8}>
                    <Image source={member.avatar} style={[styles.memberAvatar, member.hasGreenBorder && {
                borderColor: '#AEE874',
                borderWidth: 2
              }]} />
                  </TouchableOpacity>
                  <View style={styles.memberInfo}>
                    {/* Tier Tag */}
                    <View style={[styles.tierTag, member.tier === 'PLATINUM' && styles.platinumBadge, member.tier === 'SENIOR' && styles.seniorBadge, member.tier === 'ASSOCIATE' && styles.associateBadge]}>
                      <Text style={[styles.tierTagText, member.tier === 'PLATINUM' && {
                  color: '#2B5713'
                }, member.tier === 'SENIOR' && {
                  color: '#FFFFFF'
                }, member.tier === 'ASSOCIATE' && {
                  color: '#0D3866'
                }]}>
                        {member.tierLabel}
                      </Text>
                    </View>
                    
                    <TouchableOpacity onPress={() => handleViewProfile(member)}>
                      <Text style={styles.memberName}>{member.name}</Text>
                    </TouchableOpacity>
                    <Text style={styles.memberRole}>{member.designation}, {member.company}</Text>
                    
                    <View style={styles.memberIdRow}>
                      <IdCard size={14} color="#94a3b8" style={{
                  marginRight: 6
                }} />
                      <Text style={styles.memberIdText}>ID: {member.memberId}</Text>
                    </View>
                  </View>
                </View>

                {/* Actions row */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.viewProfileBtn} onPress={() => handleViewProfile(member)}>
                    <Text style={styles.viewProfileBtnText}>VIEW PROFILE</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.messageBtn} onPress={() => handleMessageRedirect(member)}>
                    <MessageSquare size={14} color="#0D3866" style={{
                marginRight: 6
              }} />
                    <Text style={styles.messageBtnText}>MESSAGE</Text>
                  </TouchableOpacity>
                </View>
              </View>)}

            {/* PAGINATION PANEL */}
            <View style={styles.paginationPanel}>
              <Text style={styles.paginationInfo}>
                Showing {totalCount > 0 ? startIndex + 1 : 0}-{endIndex} of {totalCount} results
              </Text>
              <View style={styles.pageNumbersRow}>
                <TouchableOpacity style={styles.arrowPageBtn} onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                  <Text style={[styles.pageArrow, currentPage === 1 && {
                color: '#cbd5e1'
              }]}>‹</Text>
                </TouchableOpacity>
                
                {Array.from({
              length: totalPages
            }, (_, i) => i + 1).map(pageNum => <TouchableOpacity key={pageNum} style={[styles.pageNumberBtn, currentPage === pageNum && styles.pageNumberBtnActive]} onPress={() => setCurrentPage(pageNum)}>
                    <Text style={currentPage === pageNum ? styles.pageNumberTextActive : styles.pageNumberText}>
                      {pageNum}
                    </Text>
                  </TouchableOpacity>)}

                <TouchableOpacity style={styles.arrowPageBtn} onPress={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  <Text style={[styles.pageArrow, currentPage === totalPages && {
                color: '#cbd5e1'
              }]}>›</Text>
                </TouchableOpacity>
              </View>
            </View>
          </> : <View style={styles.eventsContainer}>
            {/* Header Title */}
            <Text style={styles.eventsPageTitle}>Upcoming Events</Text>
            <Text style={styles.eventsPageSubtitle}>
              Manage society activities and administrative conferences.
            </Text>

            {/* SEARCH EVENTS CARD */}
            <View style={styles.searchCard}>
              <Text style={styles.searchCardLabel}>Search Events</Text>
              <View style={styles.searchInputContainer}>
                <Search size={18} color="#94a3b8" style={{
              marginRight: 8
            }} />
                <TextInput placeholder="Filter by Event Name, Date, or Location..." placeholderTextColor="#94a3b8" value={eventSearchQuery} onChangeText={setEventSearchQuery} style={styles.searchInput} />
              </View>
            </View>

            {/* EVENT 1: FLAGSHIP */}
            {eventMatches('Annual Tax Conference 2024', 'AUG 15-17, 2024', 'flagship', 'Grand Hyatt, Texcity') && <View style={styles.eventCardPremium}>
                <View style={styles.eventImageContainer}>
                  <Image source={require('../../assets/annual_conference.png')} style={styles.eventHeroImage} resizeMode="cover" />
                  <View style={styles.flagshipTag}>
                    <Text style={styles.flagshipTagText}>FLAGSHIP</Text>
                  </View>
                </View>

                <View style={styles.eventPremiumBody}>
                  <View style={styles.eventRowJustified}>
                    <Text style={styles.eventPremiumDate}>AUG 15-17, 2024</Text>
                    <View style={styles.confirmedPill}>
                      <Text style={styles.confirmedText}>CONFIRMED</Text>
                    </View>
                  </View>

                  <Text style={styles.eventPremiumTitle}>Annual Tax Conference 2024</Text>

                  <View style={styles.eventDetailRow}>
                    <MapPin size={14} color="#64748b" style={{
                marginRight: 6
              }} />
                    <Text style={styles.eventDetailText}>Grand Hyatt, Texcity</Text>
                  </View>

                  <View style={styles.eventDetailRow}>
                    <Users size={14} color="#64748b" style={{
                marginRight: 6
              }} />
                    <Text style={styles.eventDetailText}>450 Registered</Text>
                  </View>

                  {/* Event Actions */}
                  <View style={styles.eventActionsRow}>
                    <TouchableOpacity style={styles.cancelEventBtn} onPress={() => Alert.alert('Cancel Event', 'Are you sure you want to cancel this event?')}>
                      <Text style={styles.cancelEventText}>Cancel Event</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.editEventBtn} onPress={() => {
                if (navigation) {
                  navigation.navigate('CreateEvent', {
                    isEditing: true,
                    title: 'Annual Tax Conference 2024',
                    date: '15/08/2024',
                    startTime: '09:00 AM',
                    location: 'Grand Hyatt, Texcity',
                    capacity: '450',
                    privacy: 'Members Only',
                    deadline: '10/08/2024',
                    description: 'The 2024 Annual Tax Summit is the premier gathering for accounting professionals, providing deep insights into new legislative changes, international compliance standards, and digital transformation in fiscal reporting.'
                  });
                }
              }}>
                      <Edit2 size={14} color="white" style={{
                  marginRight: 6
                }} />
                      <Text style={styles.editEventText}>Edit Event</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>}

            {/* EVENT 2: ETHICS & COMPLIANCE */}
            {eventMatches('Ethics & Compliance Seminar', 'SEP 05, 2024', 'Mandatory training for all society members regarding updated 2024 frameworks.', 'TAS Connect Platform') && <View style={styles.eventCardPremium}>
                <View style={styles.eventPremiumBody}>
                  <View style={styles.eventHeaderRow}>
                    <View style={[styles.eventIconBox, {
                backgroundColor: '#BEF264'
              }]}>
                      <Laptop size={18} color="#4D7C0F" />
                    </View>
                    <View style={styles.confirmedPillBlue}>
                      <Text style={styles.confirmedTextBlue}>OPEN</Text>
                    </View>
                  </View>

                  <Text style={[styles.eventPremiumDate, {
              marginTop: 10
            }]}>SEP 05, 2024</Text>
                  <Text style={styles.eventPremiumTitle}>Ethics & Compliance Seminar</Text>
                  <Text style={styles.eventPremiumDesc}>
                    Mandatory training for all society members regarding updated 2024 frameworks.
                  </Text>

                  <View style={[styles.eventDetailRow, {
              marginBottom: 14
            }]}>
                    <Link size={14} color="#64748b" style={{
                marginRight: 6
              }} />
                    <Text style={styles.eventLinkText}>TAS Connect Platform</Text>
                  </View>

                  <TouchableOpacity style={styles.editDetailsBtn} onPress={() => {
              if (navigation) {
                navigation.navigate('CreateEvent', {
                  isEditing: true,
                  title: 'Ethics & Compliance Seminar',
                  date: '05/09/2024',
                  startTime: '10:00 AM',
                  location: 'TAS Connect Platform',
                  capacity: '300',
                  privacy: 'Members Only',
                  deadline: '01/09/2024',
                  description: 'Mandatory training for all society members regarding updated 2024 frameworks.'
                });
              }
            }}>
                    <Edit2 size={14} color="#0D3866" style={{
                marginRight: 6
              }} />
                    <Text style={styles.editDetailsText}>Edit Details</Text>
                  </TouchableOpacity>
                </View>
              </View>}

            {/* EVENT 3: LOCAL CHAPTER NETWORKING */}
            {eventMatches('Local Chapter Networking', 'OCT 12, 2024', 'Regional mixer for senior partners and upcoming associates.', 'Riverside Executive Lounge') && <View style={styles.eventCardPremium}>
                <View style={styles.eventPremiumBody}>
                  <View style={styles.eventHeaderRow}>
                    <View style={[styles.eventIconBox, {
                backgroundColor: '#EFF6FF'
              }]}>
                      <Users size={18} color="#1E40AF" />
                    </View>
                    <View style={styles.confirmedPillGray}>
                      <Text style={styles.confirmedTextGray}>PLANNING</Text>
                    </View>
                  </View>

                  <Text style={[styles.eventPremiumDate, {
              marginTop: 10
            }]}>OCT 12, 2024</Text>
                  <Text style={styles.eventPremiumTitle}>Local Chapter Networking</Text>
                  <Text style={styles.eventPremiumDesc}>
                    Regional mixer for senior partners and upcoming associates.
                  </Text>

                  <View style={[styles.eventDetailRow, {
              marginBottom: 14
            }]}>
                    <MapPin size={14} color="#64748b" style={{
                marginRight: 6
              }} />
                    <Text style={styles.eventDetailText}>Riverside Executive Lounge</Text>
                  </View>

                  <TouchableOpacity style={styles.editDetailsBtn} onPress={() => {
              if (navigation) {
                navigation.navigate('CreateEvent', {
                  isEditing: true,
                  title: 'Local Chapter Networking',
                  date: '12/10/2024',
                  startTime: '06:00 PM',
                  location: 'Riverside Executive Lounge',
                  capacity: '150',
                  privacy: 'Members Only',
                  deadline: '05/10/2024',
                  description: 'Regional mixer for senior partners and upcoming associates.'
                });
              }
            }}>
                    <Edit2 size={14} color="#0D3866" style={{
                marginRight: 6
              }} />
                    <Text style={styles.editDetailsText}>Manage Planning</Text>
                  </TouchableOpacity>
                </View>
              </View>}

            {/* EVENT 4: PARTICIPATION GOAL */}
            <View style={styles.goalCard}>
              <Text style={styles.goalTitle}>Annual Participation Goal</Text>
              <Text style={styles.goalText}>
                You're at 82% of the targeted annual event engagement. Reaching 90% unlocks the Regional Chapter Grant.
              </Text>
              <View style={styles.goalStatsRow}>
                <View style={styles.goalStatBox}>
                  <Text style={styles.goalStatValue}>1.2k</Text>
                  <Text style={styles.goalStatLabel}>TOTAL ATTENDEES</Text>
                </View>
                <View style={styles.goalStatBox}>
                  <Text style={styles.goalStatValue}>14</Text>
                  <Text style={styles.goalStatLabel}>EVENTS YTD</Text>
                </View>
              </View>
            </View>
          </View>}

        {/* Bottom Navigation space */}
        <View style={{
        height: 100
      }} />
      </ScrollView>

      {/* Floating Scroll to Top */}
      {showScrollTop && <TouchableOpacity onPress={scrollToTop} activeOpacity={0.85} style={[styles.scrollTopButton, subTab === 'members' ? {
      bottom: 90
    } : {
      bottom: 156
    }]}>
          <ArrowUp size={20} color="white" />
        </TouchableOpacity>}

      {/* Floating Action Button (FAB) */}
      {subTab === 'events' && <TouchableOpacity style={styles.fabButton} onPress={() => {
      if (navigation) {
        navigation.navigate('CreateEvent');
      } else {
        Alert.alert('Create Event', 'Opening form to create a new event...');
      }
    }} activeOpacity={0.85}>
          <Plus size={24} color="white" />
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'nowrap'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0D3866'
  },
  activeDbPill: {
    backgroundColor: '#AEE874',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6
  },
  activeDbText: {
    color: '#2B5713',
    fontSize: 9,
    fontWeight: '800'
  },
  totalMembersContainer: {
    alignItems: 'flex-end',
    flexShrink: 1
  },
  totalMembersLabel: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.3
  },
  totalMembersValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D3866',
    marginTop: 1
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1
  },
  searchCardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D3866',
    marginBottom: 8
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#334D6E',
    padding: 0
  },
  tierPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  tierPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  tierPillActive: {
    backgroundColor: '#0D3866',
    borderColor: '#0D3866'
  },
  tierPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b'
  },
  tierPillTextActive: {
    color: '#FFFFFF'
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14
  },
  memberAvatar: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#F1F5F9'
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12
  },
  tierTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4
  },
  platinumBadge: {
    backgroundColor: '#AEE874' // Green
  },
  seniorBadge: {
    backgroundColor: '#1E40AF' // Dark blue
  },
  associateBadge: {
    backgroundColor: '#DBEAFE' // Soft blue
  },
  tierTagText: {
    fontSize: 8,
    fontWeight: '800'
  },
  memberName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D3866'
  },
  memberRole: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2
  },
  memberIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6
  },
  memberIdText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500'
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    gap: 8
  },
  viewProfileBtn: {
    flex: 1,
    backgroundColor: '#0D3866',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center'
  },
  viewProfileBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  messageBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0D3866',
    borderRadius: 6,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  messageBtnText: {
    color: '#0D3866',
    fontSize: 11,
    fontWeight: '800'
  },
  paginationPanel: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8
  },
  paginationInfo: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 10
  },
  pageNumbersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  arrowPageBtn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  pageArrow: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: 'bold'
  },
  pageNumberBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pageNumberBtnActive: {
    backgroundColor: '#0D3866'
  },
  pageNumberText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '700'
  },
  pageNumberTextActive: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '800'
  },
  pageEllipsis: {
    fontSize: 14,
    color: '#94a3b8',
    paddingHorizontal: 4
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10
  },
  eventDateText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#467A18',
    marginBottom: 4
  },
  eventTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D3866'
  },
  eventDetailsText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 156,
    right: 22,
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
  fabButton: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#70B62C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 99
  },
  eventsContainer: {
    paddingHorizontal: 0,
    marginTop: 4
  },
  eventsPageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0D3866',
    marginBottom: 6
  },
  eventsPageSubtitle: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 20
  },
  eventCardPremium: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1
  },
  eventImageContainer: {
    height: 160,
    width: '100%',
    position: 'relative'
  },
  eventHeroImage: {
    width: '100%',
    height: '100%'
  },
  flagshipTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#0D3866',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4
  },
  flagshipTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  eventPremiumBody: {
    padding: 16
  },
  eventRowJustified: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  eventPremiumDate: {
    fontSize: 12,
    fontWeight: '800',
    color: '#65A30D'
  },
  confirmedPill: {
    backgroundColor: '#BEF264',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  confirmedText: {
    color: '#3F6212',
    fontSize: 10,
    fontWeight: '800'
  },
  eventPremiumTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D3866',
    marginBottom: 12
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  eventDetailText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500'
  },
  eventActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16
  },
  cancelEventBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  cancelEventText: {
    color: '#0D3866',
    fontSize: 13,
    fontWeight: '700'
  },
  editEventBtn: {
    flex: 1,
    backgroundColor: '#0D3866',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  editEventText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  eventHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  eventIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmedPillBlue: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DBEAFE'
  },
  confirmedTextBlue: {
    color: '#1E40AF',
    fontSize: 10,
    fontWeight: '800'
  },
  confirmedPillGray: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  confirmedTextGray: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '800'
  },
  eventPremiumDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12
  },
  eventLinkText: {
    fontSize: 12,
    color: '#0D3866',
    fontWeight: '600'
  },
  editDetailsBtn: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0D3866',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  editDetailsText: {
    color: '#0D3866',
    fontSize: 13,
    fontWeight: '700'
  },
  goalCard: {
    backgroundColor: '#0D3866',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8
  },
  goalText: {
    fontSize: 13,
    color: '#93C5FD',
    lineHeight: 18,
    marginBottom: 20
  },
  goalStatsRow: {
    flexDirection: 'row',
    gap: 12
  },
  goalStatBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center'
  },
  goalStatValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  goalStatLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#93C5FD',
    marginTop: 4,
    letterSpacing: 0.5
  }
});

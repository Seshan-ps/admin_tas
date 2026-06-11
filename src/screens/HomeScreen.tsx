import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {
  User,
  MessageSquare,
  Users,
  BarChart3,
  Calendar,
  FileText,
  ArrowUp,
  Send,
  ShieldCheck,
  MoreHorizontal,
  ChevronRight,
  Bookmark,
  Share2,
  ThumbsUp,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  onSignOut: () => void;
  navigation?: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSignOut, navigation }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Monitor scroll height to show/hide the back to top button
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 300);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleSendBroadcast = () => {
    if (!broadcastSubject || !broadcastMessage) {
      Alert.alert('Incomplete Broadcast', 'Please fill in both the subject and message fields.');
      return;
    }
    Alert.alert(
      'Secure Broadcast Sent',
      `Your notification has been encrypted and broadcasted successfully.\n\nSubject: ${broadcastSubject}`
    );
    setBroadcastSubject('');
    setBroadcastMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        {/* Profile Avatar (Left) */}
        <TouchableOpacity 
          onPress={() => navigation?.navigate('Profile')}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/admin_profile.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>

        {/* Small Center Logo */}
        <Image
          source={require('../../assets/logo_icon.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />

        {/* Chat / Messages Button (Right) */}
        <TouchableOpacity 
          onPress={() => navigation?.navigate('Messages')}
          activeOpacity={0.8}
          style={styles.chatButton}
        >
          <MessageSquare size={22} color="#134074" />
        </TouchableOpacity>
      </View>

      {/* Main Feed Content */}
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.feedScroll}
        contentContainerStyle={styles.feedContentContainer}
      >
        {/* SECTION 1: QUICK ACTIONS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsContainer}>
            {/* User Management */}
            <TouchableOpacity 
              style={styles.actionRow}
              onPress={() => navigation?.navigate('Directory')}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconWrapper}>
                <Users size={18} color="white" />
              </View>
              <Text style={styles.actionText}>User Management</Text>
            </TouchableOpacity>

            {/* Financial Reports */}
            <TouchableOpacity 
              style={styles.actionRow}
              onPress={() => navigation?.navigate('Analytics')}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconWrapper}>
                <BarChart3 size={18} color="white" />
              </View>
              <Text style={styles.actionText}>Financial Reports</Text>
            </TouchableOpacity>

            {/* Event Management */}
            <TouchableOpacity 
              style={styles.actionRow}
              onPress={() => navigation?.navigate('Directory', { subTab: 'events' })}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconWrapper}>
                <Calendar size={18} color="white" />
              </View>
              <Text style={styles.actionText}>Event Management</Text>
            </TouchableOpacity>

            {/* Post Management */}
            <TouchableOpacity 
              style={styles.actionRow}
              onPress={() => navigation?.navigate('Posts')}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconWrapper}>
                <FileText size={18} color="white" />
              </View>
              <Text style={styles.actionText}>Post Management</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 2: SYSTEM UPDATE CARD (FEED 1) */}
        <View style={styles.card}>
          {/* Header Row */}
          <View style={styles.feedHeaderRow}>
            <TouchableOpacity 
              onPress={() => navigation?.navigate('MemberProfile', {
                name: 'Dr. Alistair Vance',
                role: 'Chief Financial Auditor',
                branch: 'London Branch',
                tierLabel: 'Platinum Member',
                memberId: 'TAS-9920-PL',
                joinDate: 'Joined: Jan 2015',
                email: 'a.vance@tas-governance.org',
                fullIdCode: '9920-AV-TAS',
                joinDateFull: 'January 14, 2015',
                firm: 'Global Trust',
                avatar: require('../../assets/admin_profile.png'),
              })}
              activeOpacity={0.8}
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
            >
              <Image
                source={require('../../assets/logo_icon.png')}
                style={styles.feedAvatar}
                resizeMode="contain"
              />
              <View style={styles.feedHeaderTexts}>
                <Text style={styles.feedAuthorName}>Texcity Accountants Society</Text>
                <Text style={styles.feedSubtitle}>Promoted • 10,240 members</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Post Text */}
          <Text style={styles.postBodyText}>
            We are pleased to announce the successful rollout of the <Text style={styles.boldText}>Q3 Security Patch</Text> for the national administration portal. All member accounts now benefit from enhanced biometric authentication layers. Ensure your regional office has updated their node.
          </Text>

          {/* Post Image with tag */}
          <View style={styles.postImageContainer}>
            <Image
              source={require('../../assets/server_room_update.png')}
              style={styles.postImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlayTag}>
              <Text style={styles.overlayTagText}>System Update 4.2.0</Text>
            </View>
          </View>

          {/* Interaction Row */}
          <View style={styles.interactionRow}>
            <View style={styles.leftInteractionGroup}>
              <TouchableOpacity style={styles.interactionButton}>
                <ThumbsUp size={16} color="#64748b" />
                <Text style={styles.interactionCount}>42</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.interactionButton}>
                <MessageSquare size={16} color="#64748b" />
                <Text style={styles.interactionCount}>12</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.interactionButton}>
              <Share2 size={16} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 3: ELENA POST CARD (FEED 2) */}
        <View style={styles.card}>
          {/* Header Row */}
          <View style={styles.feedHeaderRow}>
            <TouchableOpacity 
              onPress={() => navigation?.navigate('MemberProfile', {
                name: 'Elena Rodriguez',
                role: 'Partner',
                branch: 'Rodriguez & Assoc.',
                tierLabel: 'Senior Fellow',
                memberId: 'TAS-4412-SR',
                joinDate: 'Joined: Mar 2018',
                email: 'elena.rodriguez@tas-governance.org',
                fullIdCode: '4412-ER-TAS',
                joinDateFull: 'March 10, 2018',
                firm: 'Rodriguez & Assoc.',
                avatar: require('../../assets/elena_profile.png'),
              })}
              activeOpacity={0.8}
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
            >
              <Image
                source={require('../../assets/elena_profile.png')}
                style={styles.feedUserAvatar}
              />
              <View style={styles.feedHeaderTexts}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.feedAuthorName}>Elena Rodriguez, CPA</Text>
                  <Text style={styles.timeTag}>2h ago</Text>
                </View>
                <Text style={styles.feedSubtitle}>Regional Director at TAS South</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Post Text */}
          <Text style={styles.postBodyText}>
            Is anyone else observing a significant increase in automated reconciliation errors following the latest API update? We've had to revert to manual validation for three major enterprise audits this morning.
          </Text>

          {/* Quote Block */}
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              "Maintaining fiscal integrity requires human oversight, especially during transition phases."
            </Text>
          </View>

          {/* Interaction Row */}
          <View style={styles.interactionRow}>
            <View style={styles.leftInteractionGroup}>
              <TouchableOpacity style={styles.interactionButton}>
                <ThumbsUp size={16} color="#4D831E" fill="#E8F5E9" />
                <Text style={[styles.interactionCount, { color: '#4D831E' }]}>8</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.interactionButton}>
                <MessageSquare size={16} color="#64748b" />
                <Text style={styles.interactionCount}>24</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.interactionButton}>
              <Bookmark size={16} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 4: UPCOMING SOCIETY EVENTS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming Society Events</Text>
          
          {/* Event 1 */}
          <View style={styles.eventItem}>
            <Text style={styles.eventDate}>OCT 14</Text>
            <Text style={styles.eventTitle}>Tax Ethics Round-Table</Text>
            <Text style={styles.eventDetails}>Virtual • 148 Administrators Attending</Text>
          </View>

          {/* Event 2 */}
          <View style={styles.eventItem}>
            <Text style={styles.eventDate}>OCT 22</Text>
            <Text style={styles.eventTitle}>Annual Society Gala</Text>
            <Text style={styles.eventDetails}>Grand Ballroom, City Center</Text>
          </View>

          {/* Link to all events */}
          <TouchableOpacity 
            style={styles.viewAllEventsLink}
            onPress={() => navigation?.navigate('Directory', { subTab: 'events' })}
          >
            <Text style={styles.viewAllEventsText}>View All Events</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION 5: QUICK BROADCAST */}
        <View style={styles.broadcastCard}>
          <Text style={styles.broadcastTitle}>Quick Broadcast</Text>
          <Text style={styles.broadcastSubtitle}>
            Send an instant secure push notification to all active administrative members.
          </Text>

          {/* Subject Field */}
          <TextInput
            placeholder="Subject..."
            placeholderTextColor="#94a3b8"
            value={broadcastSubject}
            onChangeText={setBroadcastSubject}
            style={styles.broadcastInput}
          />

          {/* Message Field */}
          <TextInput
            placeholder="Your message here..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            value={broadcastMessage}
            onChangeText={setBroadcastMessage}
            style={[styles.broadcastInput, styles.broadcastTextArea]}
          />

          {/* Send Button */}
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendBroadcast}
            activeOpacity={0.8}
          >
            <Send size={16} color="#0D3866" />
            <Text style={styles.sendButtonText}>Send Notification</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom padding for navigation spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Scroll to Top */}
      {showScrollTop && (
        <TouchableOpacity
          onPress={scrollToTop}
          activeOpacity={0.85}
          style={styles.scrollTopButton}
        >
          <ArrowUp size={20} color="white" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 30,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerLogo: {
    width: 36,
    height: 36,
  },
  chatButton: {
    padding: 6,
  },
  feedScroll: {
    flex: 1,
  },
  feedContentContainer: {
    padding: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D3866',
    marginBottom: 14,
  },
  quickActionsContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
  },
  actionIconWrapper: {
    backgroundColor: '#103B6B',
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334D6E',
  },
  feedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedAvatar: {
    width: 32,
    height: 32,
  },
  feedUserAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  feedHeaderTexts: {
    flex: 1,
    marginLeft: 10,
  },
  feedAuthorName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D3866',
  },
  feedSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  timeTag: {
    fontSize: 11,
    color: '#94a3b8',
  },
  postBodyText: {
    fontSize: 13,
    color: '#334D6E',
    lineHeight: 18,
    marginBottom: 12,
  },
  boldText: {
    fontWeight: '700',
  },
  postImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 160,
  },
  imageOverlayTag: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(13, 56, 102, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  overlayTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  interactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 4,
  },
  leftInteractionGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  interactionCount: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  quoteCard: {
    backgroundColor: '#F0F7FF',
    borderLeftWidth: 4,
    borderLeftColor: '#467A18',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 12.5,
    fontStyle: 'italic',
    color: '#467A18',
    lineHeight: 18,
    fontWeight: '600',
  },
  eventItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  eventDate: {
    fontSize: 11,
    fontWeight: '800',
    color: '#467A18',
    marginBottom: 2,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334D6E',
  },
  eventDetails: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  viewAllEventsLink: {
    alignItems: 'center',
    paddingTop: 4,
  },
  viewAllEventsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D3866',
  },
  broadcastCard: {
    backgroundColor: '#103B6B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  broadcastTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  broadcastSubtitle: {
    fontSize: 12,
    color: '#93C5FD',
    lineHeight: 16,
    marginBottom: 14,
  },
  broadcastInput: {
    backgroundColor: '#1E4E80',
    borderWidth: 1,
    borderColor: '#3873B0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 13,
    marginBottom: 10,
  },
  broadcastTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  sendButtonText: {
    color: '#0D3866',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0D3866',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 99,
  },
});

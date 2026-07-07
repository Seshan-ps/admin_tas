import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, X, Heart, ShieldAlert, UserPlus, CreditCard, ChevronRight, Calendar, ArrowUp } from 'lucide-react-native';
import { dbStore } from '../config/dbStore';

const UserAvatar = ({ name, image, size = 42, initialsColor = '#0D3866', initialsBg = '#EFF6FF' }) => {
  if (image) {
    return <Image source={image} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : '??';
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: initialsBg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
      }}
    >
      <Text style={{ color: initialsColor, fontSize: size * 0.35, fontWeight: '700' }}>{initials}</Text>
    </View>
  );
};

export const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = React.useRef(null);
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 300);
  };
  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true
    });
  };

  // Load notifications and sync with dbStore queue
  useEffect(() => {
    const syncNotifications = () => {
      const pendingQueue = dbStore.getQueue();

      // Static mock notifications for other alert types (errors, events, comments)
      const staticAlerts = [
        {
          id: 'report_1',
          type: 'report',
          userName: 'System Monitor',
          avatar: null,
          initialsBg: '#FEE2E2',
          initialsColor: '#EF4444',
          message: 'reported a community synchronization error: "API connection lost" in TAX COMPLIANCE & AUDIT NETWORK.',
          time: '30m ago',
          unread: true,
          communityId: 'tc_corporate',
          communityName: 'TAX COMPLIANCE & AUDIT NETWORK',
        },
        {
          id: 'event_1',
          type: 'event',
          userName: 'Admin TAS',
          avatar: require('../../assets/admin_profile.png'),
          message: 'updated the details for the upcoming event "Annual Financial Audit Symposium".',
          time: '1h ago',
          unread: true,
        },
        {
          id: 'comment_1',
          type: 'comment',
          userName: 'Elena Rodriguez',
          avatar: require('../../assets/elena_profile.png'),
          message: 'commented on your post: "Excellent guidelines for audit trails!"',
          time: '4h ago',
          unread: false,
          postId: 'static_1',
        },
      ];

      // Map pending connection queue to connection_request notifications
      const connectionAlerts = pendingQueue.map(item => ({
        id: `conn_${item.id}`,
        connectionId: item.id,
        type: 'connection_request',
        userName: item.full_name,
        avatar: item.avatar,
        message: 'wants to connect with you.',
        time: 'Just now',
        unread: true,
      }));

      // Mock connection request if empty to always show one
      const mockConnAlerts = pendingQueue.length === 0 ? [
        {
          id: 'conn_mock',
          connectionId: 'sarah',
          type: 'connection_request',
          userName: 'Sarah Jenkins',
          avatar: require('../../assets/elena_profile.png'),
          message: 'wants to connect with you.',
          time: '2h ago',
          unread: true,
        }
      ] : [];

      const merged = [...connectionAlerts, ...mockConnAlerts, ...staticAlerts];
      setNotifications(merged);

      // Count unread
      const unreads = merged.filter(n => n.unread).length;
      setUnreadCount(unreads);
    };

    syncNotifications();
    return dbStore.subscribe(syncNotifications);
  }, []);

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({
        ...n,
        unread: false,
      }))
    );
    setUnreadCount(0);
    Alert.alert('Success', 'All notifications marked as read.');
  };

  const handleNotificationClick = (notif) => {
    // Mark as read locally
    setNotifications(prev =>
      prev.map(n => n.id === notif.id ? { ...n, unread: false } : n)
    );
    
    // Redirect based on type
    switch (notif.type) {
      case 'connection_request':
        navigation.navigate('Connections');
        break;
      case 'report':
        navigation.navigate('Messages', { groupId: notif.communityId || 'tc_corporate' });
        break;
      case 'event':
        navigation.navigate('MainTabs', { screen: 'Events' });
        break;
      case 'comment':
        navigation.navigate('MainTabs', { screen: 'Home' });
        break;
      default:
        break;
    }
  };

  const renderIconBadge = (type) => {
    switch (type) {
      case 'comment':
        return (
          <View style={[styles.badgeContainer, { backgroundColor: '#EF4444' }]}>
            <Heart size={8} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        );
      case 'report':
        return (
          <View style={[styles.badgeContainer, { backgroundColor: '#DC2626' }]}>
            <ShieldAlert size={8} color="#FFFFFF" />
          </View>
        );
      case 'connection_request':
        return (
          <View style={[styles.badgeContainer, { backgroundColor: '#3B82F6' }]}>
            <UserPlus size={8} color="#FFFFFF" />
          </View>
        );
      case 'event':
        return (
          <View style={[styles.badgeContainer, { backgroundColor: '#7C3AED' }]}>
            <Calendar size={8} color="#FFFFFF" />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={22} color="#0D3866" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Sub-Header */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderLeft}>
          You have {unreadCount} unread {unreadCount === 1 ? 'update' : 'updates'}
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles.subHeaderRight}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Feed List */}
      <ScrollView ref={scrollRef} onScroll={handleScroll} scrollEventThrottle={16} style={styles.feed} showsVerticalScrollIndicator={false}>
        {notifications.map(notif => {
          return (
            <TouchableOpacity
              key={notif.id}
              onPress={() => handleNotificationClick(notif)}
              style={[
                styles.notificationRow,
                notif.unread && styles.notificationRowUnread,
              ]}
              activeOpacity={0.8}
            >
              {/* Avatar area with overlapping badge */}
              <View style={styles.avatarContainer}>
                <UserAvatar
                  name={notif.userName}
                  image={notif.avatar}
                  initialsBg={notif.initialsBg}
                  initialsColor={notif.initialsColor}
                />
                {renderIconBadge(notif.type)}
              </View>

              {/* Text content area */}
              <View style={styles.textContainer}>
                <Text style={styles.notificationText}>
                  <Text style={styles.boldText}>{notif.userName}</Text>{' '}
                  {notif.message}
                </Text>
                <Text style={styles.timeText}>{notif.time}</Text>
              </View>

              {/* Right Side Column (Chevron indicator and optional unread dot) */}
              <View style={styles.rightSideColumn}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {notif.unread && (
                    <View style={styles.unreadDot} />
                  )}
                  <ChevronRight size={16} color="#94A3B8" />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Empty state fallback */}
        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No new notifications</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

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
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    backgroundColor: '#EBF3FC',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D3866',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#EFF6FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  subHeaderLeft: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  subHeaderRight: {
    fontSize: 13,
    color: '#70B62C',
    fontWeight: '700',
  },
  feed: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  notificationRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  notificationRowUnread: {
    backgroundColor: '#EFF6FF',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  notificationText: {
    fontSize: 13,
    color: '#334D6E',
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
    color: '#0D3866',
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 3,
  },
  connectionActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  approveButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  declineButton: {
    backgroundColor: '#F1F5F9',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rightSideColumn: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  viewCommunityButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  viewCommunityButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  thumbnailImage: {
    width: 44,
    height: 44,
    borderRadius: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginRight: 4,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#64748B',
    fontSize: 14,
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 86,
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
  },
});

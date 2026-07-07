import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, Alert, StyleSheet, Dimensions, Modal, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageSquare, Users, Calendar, ArrowUp, Send, Share2, ThumbsUp, X, Bell, PlusCircle } from 'lucide-react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { dbStore } from '../config/dbStore';
const {
  width
} = Dimensions.get('window');
const UserAvatar = ({
  name,
  image,
  size = 32
}) => {
  if (image) {
    return <Image source={image} style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 1,
      borderColor: '#E2E8F0'
    }} />;
  }
  const colors = ['#1E3A8A', '#0D9488', '#B45309', '#4338CA', '#0369A1', '#0F766E', '#7C2D12'];
  const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const bgColor = colors[charCodeSum % colors.length];
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  return <View style={{
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: bgColor,
    justifyContent: 'center',
    alignItems: 'center'
  }}>
      <Text style={{
      color: '#FFFFFF',
      fontSize: size * 0.38,
      fontWeight: '700'
    }}>{initials}</Text>
    </View>;
};

// Custom premium Directory Icon (Book with lens)
const DirectoryBookIcon = ({ color, size = 18 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="2" width="16" height="20" rx="3" fill="none" stroke={color} strokeWidth="2.5" />
      <Path d="M8 2v20" stroke={color} strokeWidth="1.5" />
      <Circle cx="14" cy="10" r="3" stroke={color} strokeWidth="2" fill="white" />
      <Path d="M16.5 12.5l2.5 2.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  </View>
);

export const HomeScreen = ({
  onSignOut,
  navigation
}) => {
  const [feedPosts, setFeedPosts] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sharingPost, setSharingPost] = useState(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState('');
  const [shareMessageText, setShareMessageText] = useState('');
  const resolvePostImage = imgSrc => {
    if (!imgSrc) return null;
    if (typeof imgSrc === 'string') {
      if (imgSrc.startsWith('http://') || imgSrc.startsWith('https://') || imgSrc.startsWith('file://') || imgSrc.startsWith('content://')) {
        return {
          uri: imgSrc
        };
      }
      if (imgSrc === 'annual_conference.png') {
        return require('../../assets/annual_conference.png');
      }
      if (imgSrc === 'server_room_update.png') {
        return require('../../assets/server_room_update.png');
      }
      return {
        uri: imgSrc
      };
    }
    return imgSrc;
  };

  // Sync published posts from dbStore and merge them with initial feed posts
  useEffect(() => {
    const updateFeed = () => {
      const dbPosts = dbStore.getPosts().filter(p => p.status === 'published');
      setFeedPosts(prevFeed => {
        // Keep track of existing interactive states (likes count, comments, isLiked, isShared, commentsExpanded)
        const stateMap = new Map();
        prevFeed.forEach(p => {
          stateMap.set(p.id, {
            likesCount: p.likesCount,
            commentsCount: p.commentsCount,
            sharesCount: p.sharesCount,
            isLiked: p.isLiked,
            isShared: p.isShared,
            isCommentsExpanded: p.isCommentsExpanded,
          });
        });
        const mappedDbPosts = dbPosts.map(p => {
          const savedState = stateMap.get(p.id) || {};
          const postBody = `**${p.title}**\n\n${p.body}`;
          return {
            id: p.id,
            authorName: 'Admin TAS',
            avatar: require('../../assets/admin_profile.png'),
            subtitle: p.isPrivate ? 'Private • Admin TAS' : 'Public • Admin TAS',
            postBody: postBody,
            postImage: p.image || undefined,
            likesCount: p.likes || 0,
            commentsCount: p.comments || 0,
            sharesCount: p.shares || 0,
            isLiked: p.isLiked || false,
            isShared: p.isShared || false,
            isCommentsExpanded: savedState.isCommentsExpanded !== undefined ? savedState.isCommentsExpanded : false,
            comments: p.commentsList || [],
            timeLabel: p.postedDate || 'Just now',
            memberProfileParams: {
              name: 'Admin TAS',
              role: 'System Administrator',
              branch: 'Main Office',
              tierLabel: 'Admin',
              memberId: 'TAS-0001-AD',
              joinDate: 'Joined: Aug 2020',
              email: 'admin@tas-governance.org',
              fullIdCode: '0001-AD-TAS',
              joinDateFull: 'August 1, 2020',
              firm: 'TAS Board',
              avatar: require('../../assets/admin_profile.png')
            }
          };
        });

        return [...mappedDbPosts].reverse();
      });
      const unread = dbStore.getDms().some(d => d.unread);
      setHasUnread(unread);
    };
    updateFeed();
    const unsubscribe = dbStore.subscribe(updateFeed);
    return unsubscribe;
  }, []);
  const handleLikePost = postId => {
    dbStore.likePost(postId);
  };
  const handleToggleComments = postId => {
    setFeedPosts(prevPosts => prevPosts.map(post => post.id === postId ? {
      ...post,
      isCommentsExpanded: !post.isCommentsExpanded
    } : post));
  };
  const handleCommentLike = (postId, commentId) => {
    dbStore.likeComment(postId, commentId);
  };
  const handleSharePost = post => {
    setSharingPost(post);
    setSelectedConnectionId('');
    setShareMessageText('');
  };
  const handleSendShare = () => {
    if (!sharingPost || !selectedConnectionId) {
      Alert.alert('Selection Required', 'Please select a contact to share this post with.');
      return;
    }

    // Call dbStore to increment share count on DB posts
    if (!sharingPost.id.startsWith('static_')) {
      dbStore.sharePost(sharingPost.id);
    }

    const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `msg_share_${Date.now()}`,
      sender: 'me',
      text: shareMessageText.trim(),
      time: newTime,
      status: 'SENT',
      sharedPost: {
        id: sharingPost.id,
        authorName: sharingPost.authorName,
        body: sharingPost.postBody,
        image: sharingPost.postImage
      }
    };

    // Send it via dbStore
    dbStore.addMessage(selectedConnectionId, newMsg);

    // Update local feedPosts to mark shared
    setFeedPosts(prevPosts => prevPosts.map(p => {
      if (p.id === sharingPost.id) {
        return {
          ...p,
          isShared: true,
          sharesCount: p.sharesCount + 1
        };
      }
      return p;
    }));

    const recipient = dbStore.getDms().find(d => d.id === selectedConnectionId);
    Alert.alert('Shared Successfully', `This post has been shared with ${recipient ? recipient.name : 'your contact'}.`);
    
    // Close Modal
    setSharingPost(null);
  };
  const handleAddComment = postId => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    const newComment = {
      id: `${postId}_comment_${Date.now()}`,
      authorName: 'Admin TAS',
      avatar: require('../../assets/admin_profile.png'),
      timestamp: 'Just now',
      content: text,
      likesCount: 0,
      isLiked: false
    };
    dbStore.addComment(postId, newComment);
    setCommentInputs(prev => ({
      ...prev,
      [postId]: ''
    }));
  };
  const renderPostBody = text => {
    const parts = text.split('**');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <Text key={index} style={styles.boldText}>
            {part}
          </Text>;
      }
      return <Text key={index}>{part}</Text>;
    });
  };
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const scrollViewRef = useRef(null);

  // Monitor scroll height to show/hide the back to top button
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
  const handleSendBroadcast = () => {
    if (!broadcastSubject || !broadcastMessage) {
      Alert.alert('Incomplete Broadcast', 'Please fill in both the subject and message fields.');
      return;
    }
    Alert.alert('Secure Broadcast Sent', `Your notification has been encrypted and broadcasted successfully.\n\nSubject: ${broadcastSubject}`);
    setBroadcastSubject('');
    setBroadcastMessage('');
  };
  return <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        {/* Profile Avatar (Left) */}
        <TouchableOpacity onPress={() => navigation?.navigate('Profile')} activeOpacity={0.8}>
          <Image source={require('../../assets/admin_profile.png')} style={styles.avatar} />
        </TouchableOpacity>

        {/* Center Title */}
        <Text style={styles.headerTitle}>Admin Feed</Text>

        {/* Right Side Group */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Notification Button */}
          <TouchableOpacity onPress={() => navigation?.navigate('Notification')} activeOpacity={0.8} style={{ padding: 6 }}>
            <View style={{ position: 'relative', width: 22, height: 22 }}>
              <Bell size={22} color="#134074" />
              {dbStore.getQueue().length > 0 && <View style={styles.unreadDot} />}
            </View>
          </TouchableOpacity>

          {/* Messages Button */}
          <TouchableOpacity onPress={() => navigation?.navigate('Messages')} activeOpacity={0.8} style={{ padding: 6, marginLeft: 12 }}>
            <View style={{ position: 'relative', width: 22, height: 22 }}>
              <MessageSquare size={22} color="#134074" />
              {hasUnread && <View style={styles.unreadDot} />}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* QUICK ACCESS (Static, outside ScrollView) */}
      <View style={[styles.quickAccessCard, { marginHorizontal: 12, marginTop: 12, marginBottom: 0, paddingVertical: 12, paddingHorizontal: 8 }]}>
        <Text style={[styles.quickAccessTitle, { marginBottom: 6, paddingLeft: 6 }]}>Quick Access</Text>
        <View style={styles.gridRow}>
          {/* Events */}
          <TouchableOpacity 
            style={styles.gridItem} 
            onPress={() => navigation?.navigate('CreateEvent')}
            activeOpacity={0.75}
          >
            <View style={[styles.gridIconWrapper, { backgroundColor: '#F5F3FF' }]}>
              <Calendar size={18} color="#7C3AED" />
            </View>
            <Text style={styles.gridText} numberOfLines={1}>New Event</Text>
          </TouchableOpacity>

          {/* New Post */}
          <TouchableOpacity 
            style={styles.gridItem} 
            onPress={() => navigation?.navigate('MainTabs', { screen: 'Post', params: { action: 'new' } })}
            activeOpacity={0.75}
          >
            <View style={[styles.gridIconWrapper, { backgroundColor: '#FFF7ED' }]}>
              <PlusCircle size={18} color="#EA580C" />
            </View>
            <Text style={styles.gridText} numberOfLines={1}>New Post</Text>
          </TouchableOpacity>

          {/* Member Directory */}
          <TouchableOpacity 
            style={styles.gridItem} 
            onPress={() => navigation?.navigate('Directory')}
            activeOpacity={0.75}
          >
            <View style={[styles.gridIconWrapper, { backgroundColor: '#F0FDFA' }]}>
              <DirectoryBookIcon size={18} color="#0D9488" />
            </View>
            <Text style={styles.gridText} numberOfLines={1}>Directory</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Feed Content */}
      <ScrollView ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} style={styles.feedScroll} contentContainerStyle={styles.feedContentContainer}>

        {/* DYNAMIC POST FEED */}
        {feedPosts.map(post => <View key={post.id} style={[styles.card, {
        paddingBottom: post.isCommentsExpanded ? 0 : 16,
        overflow: 'hidden'
      }]}>
            {/* Header Row */}
            <View style={styles.feedHeaderRow}>
              <TouchableOpacity onPress={() => navigation?.navigate('MemberProfile', post.memberProfileParams)} activeOpacity={0.8} style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1
          }}>
                {post.id === 'static_1' ? <Image source={post.avatar} style={styles.feedAvatar} resizeMode="contain" /> : <Image source={post.avatar} style={styles.feedUserAvatar} />}
                <View style={styles.feedHeaderTexts}>
                  <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                    <Text style={styles.feedAuthorName}>{post.authorName}</Text>
                    {post.id !== 'static_1' && <Text style={styles.timeTag}>{post.timeLabel || '2h ago'}</Text>}
                  </View>
                  <Text style={styles.feedSubtitle}>{post.subtitle}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Post Text */}
            <Text style={styles.postBodyText}>
              {renderPostBody(post.postBody)}
            </Text>

            {/* Post Image with tag */}
            {post.postImage && <View style={styles.postImageContainer}>
                <Image source={resolvePostImage(post.postImage)} style={styles.postImage} resizeMode="cover" />
                {post.imageTag && <View style={styles.imageOverlayTag}>
                    <Text style={styles.overlayTagText}>{post.imageTag}</Text>
                  </View>}
              </View>}

            {/* Quote Block */}
            {post.quoteText && <View style={styles.quoteCard}>
                <Text style={styles.quoteText}>{post.quoteText}</Text>
              </View>}

            {/* Interaction Row */}
            <View style={[styles.interactionRow, post.isCommentsExpanded && {
          borderBottomWidth: 1,
          borderBottomColor: '#F1F5F9',
          paddingBottom: 10
        }]}>
              <View style={styles.leftInteractionGroup}>
                <TouchableOpacity onPress={() => handleLikePost(post.id)} style={styles.interactionButton}>
                  <ThumbsUp size={16} color={post.isLiked ? "#4D831E" : "#64748b"} fill={post.isLiked ? "#E8F5E9" : "none"} />
                  <Text style={[styles.interactionCount, post.isLiked && {
                color: '#4D831E'
              }]}>
                    {post.likesCount}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleToggleComments(post.id)} style={styles.interactionButton}>
                  <MessageSquare size={16} color={post.isCommentsExpanded ? "#134074" : "#64748b"} />
                  <Text style={[styles.interactionCount, post.isCommentsExpanded && {
                color: '#134074'
              }]}>
                    {post.commentsCount}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => handleSharePost(post)} style={styles.interactionButton}>
                <Share2 size={16} color={post.isShared ? "#134074" : "#64748b"} />
              </TouchableOpacity>
            </View>

            {/* Comments Section */}
            {post.isCommentsExpanded && <View style={styles.commentsSection}>
                <View style={styles.commentsHeader}>
                  <Text style={styles.commentsHeaderTitle}>Comments</Text>
                  <TouchableOpacity onPress={() => handleToggleComments(post.id)} style={styles.closeCommentsButton}>
                    <X size={16} color="#64748b" />
                  </TouchableOpacity>
                </View>

                {/* Comments List */}
                <View style={styles.commentsList}>
                  {post.comments.map(comment => <View key={comment.id} style={styles.commentItem}>
                      <UserAvatar name={comment.authorName} image={comment.avatar} size={32} />
                      <View style={styles.commentContentWrapper}>
                        <View style={styles.commentAuthorRow}>
                          <Text style={styles.commentAuthorName}>{comment.authorName}</Text>
                          <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                        </View>
                        <Text style={styles.commentText}>{comment.content}</Text>
                        
                        {/* Actions Row: Like & Reply */}
                        <View style={styles.commentActionsRow}>
                          <TouchableOpacity onPress={() => handleCommentLike(post.id, comment.id)} style={styles.commentLikeButton}>
                            <ThumbsUp size={12} color={comment.isLiked ? "#4D831E" : "#64748b"} fill={comment.isLiked ? "#E8F5E9" : "none"} />
                            <Text style={[styles.commentLikeCount, comment.isLiked && {
                              color: '#4D831E'
                            }]}>
                              {comment.likesCount}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => Alert.alert('Reply', `Reply to ${comment.authorName}`)} style={styles.commentReplyButton}>
                            <Text style={styles.commentReplyText}>Reply</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>)}
                </View>

                {/* Add Comment Input Bar */}
                <View style={styles.commentInputRow}>
                  <UserAvatar name="Admin TAS" image={require('../../assets/admin_profile.png')} size={32} />
                  <View style={styles.commentInputContainer}>
                    <TextInput 
                      placeholder="Add a comment..." 
                      placeholderTextColor="#94a3b8" 
                      value={commentInputs[post.id] || ''} 
                      onChangeText={val => setCommentInputs(prev => ({
                        ...prev,
                        [post.id]: val
                      }))} 
                      style={styles.commentTextInput} 
                      onSubmitEditing={() => handleAddComment(post.id)} 
                    />
                  </View>
                  <TouchableOpacity onPress={() => handleAddComment(post.id)} style={styles.commentSendButton}>
                    <Send size={16} color="#134074" />
                  </TouchableOpacity>
                </View>
              </View>}
          </View>)}


        {/* Bottom padding for navigation spacing */}
        <View style={{
        height: 100
      }} />
      </ScrollView>

      {/* Premium Share Modal */}
      {sharingPost && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={sharingPost !== null}
          onRequestClose={() => setSharingPost(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Share Post to Connection</Text>
                <TouchableOpacity onPress={() => setSharingPost(null)} style={styles.closeModalBtn}>
                  <X size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Connections List Selector */}
              <Text style={styles.modalSectionLabel}>Select a contact:</Text>
              <ScrollView style={styles.connectionsList} showsVerticalScrollIndicator={false}>
                {dbStore.getDms().map((connection) => {
                  const isSelected = selectedConnectionId === connection.id;
                  return (
                    <TouchableOpacity
                      key={connection.id}
                      onPress={() => setSelectedConnectionId(connection.id)}
                      style={[
                        styles.connectionRow,
                        isSelected && styles.connectionRowSelected
                      ]}
                      activeOpacity={0.8}
                    >
                      <Image source={connection.avatar} style={styles.connectionAvatar} />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={[styles.connectionName, isSelected && styles.connectionNameSelected]}>
                          {connection.name}
                        </Text>
                        <Text style={styles.connectionRole} numberOfLines={1}>
                          {connection.id === 'sarah' ? 'Senior Auditor • PKF' : connection.id === '1' ? 'Regional Director • TAS' : 'Chief Auditor • Global Trust'}
                        </Text>
                      </View>
                      <View style={[
                        styles.checkboxCircle,
                        isSelected && styles.checkboxCircleSelected
                      ]}>
                        {isSelected && <View style={styles.checkboxInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Message Input */}
              <Text style={styles.modalSectionLabel}>Add a message (optional):</Text>
              <TextInput
                placeholder="Write a message..."
                placeholderTextColor="#94A3B8"
                value={shareMessageText}
                onChangeText={setShareMessageText}
                style={styles.modalMessageInput}
                multiline
                numberOfLines={3}
              />

              {/* Send Button */}
              <TouchableOpacity
                onPress={handleSendShare}
                style={[
                  styles.modalSendBtn,
                  !selectedConnectionId && styles.modalSendBtnDisabled
                ]}
                disabled={!selectedConnectionId}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSendBtnText}>Send in Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}



      {/* Floating Scroll to Top */}
      {showScrollTop && <TouchableOpacity onPress={scrollToTop} activeOpacity={0.85} style={styles.scrollTopButton}>
          <ArrowUp size={20} color="white" />
        </TouchableOpacity>}
    </SafeAreaView>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC'
  },
  header: {
    height: 56,
    backgroundColor: '#EBF3FC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 30
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  headerLogo: {
    width: 36,
    height: 36
  },
  chatButton: {
    padding: 6
  },
  chatIconContainer: {
    position: 'relative',
    width: 22,
    height: 22
  },
  unreadDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    zIndex: 10
  },
  feedScroll: {
    flex: 1
  },
  feedContentContainer: {
    padding: 12
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D3866',
    marginBottom: 14
  },
  quickActionsContainer: {
    flexDirection: 'column',
    gap: 8
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10
  },
  actionIconWrapper: {
    backgroundColor: '#103B6B',
    padding: 8,
    borderRadius: 8,
    marginRight: 12
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334D6E'
  },
  feedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  feedAvatar: {
    width: 32,
    height: 32
  },
  feedUserAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  feedHeaderTexts: {
    flex: 1,
    marginLeft: 10
  },
  feedAuthorName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D3866'
  },
  feedSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1
  },
  timeTag: {
    fontSize: 11,
    color: '#94a3b8'
  },
  postBodyText: {
    fontSize: 13,
    color: '#334D6E',
    lineHeight: 18,
    marginBottom: 12
  },
  boldText: {
    fontWeight: '700'
  },
  postImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12
  },
  postImage: {
    width: '100%',
    height: 160
  },
  imageOverlayTag: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(13, 56, 102, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  overlayTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600'
  },
  interactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 4
  },
  leftInteractionGroup: {
    flexDirection: 'row',
    gap: 16
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  interactionCount: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600'
  },
  quoteCard: {
    backgroundColor: '#F0F7FF',
    borderLeftWidth: 4,
    borderLeftColor: '#467A18',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  quoteText: {
    fontSize: 12.5,
    fontStyle: 'italic',
    color: '#467A18',
    lineHeight: 18,
    fontWeight: '600'
  },
  eventItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10
  },
  eventDate: {
    fontSize: 11,
    fontWeight: '800',
    color: '#467A18',
    marginBottom: 2
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334D6E'
  },
  eventDetails: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2
  },
  viewAllEventsLink: {
    alignItems: 'center',
    paddingTop: 4
  },
  viewAllEventsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D3866'
  },
  broadcastCard: {
    backgroundColor: '#103B6B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12
  },
  broadcastTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4
  },
  broadcastSubtitle: {
    fontSize: 12,
    color: '#93C5FD',
    lineHeight: 16,
    marginBottom: 14
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
    marginBottom: 10
  },
  broadcastTextArea: {
    height: 80,
    textAlignVertical: 'top'
  },
  sendButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 4
  },
  sendButtonText: {
    color: '#0D3866',
    fontSize: 13,
    fontWeight: '700'
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
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 99
  },
  commentsSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginTop: 12,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  commentsHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D3866'
  },
  closeCommentsButton: {
    padding: 2
  },
  commentsList: {
    marginBottom: 12
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start'
  },
  commentContentWrapper: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 2,
  },
  commentAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },
  commentAuthorName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D3866'
  },
  commentTimestamp: {
    fontSize: 10,
    color: '#94a3b8',
    marginLeft: 6
  },
  commentText: {
    fontSize: 12.5,
    color: '#334D6E',
    lineHeight: 16
  },
  commentActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 6,
  },
  commentLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentLikeCount: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600'
  },
  commentReplyButton: {
    paddingVertical: 2,
  },
  commentReplyText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 8,
  },
  commentInputContainer: {
    flex: 1,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12
  },
  commentTextInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#334D6E',
    paddingVertical: 0
  },
  commentSendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D3866',
  },
  closeModalBtn: {
    padding: 4,
  },
  modalSectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  connectionsList: {
    maxHeight: 180,
    marginBottom: 16,
  },
  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    backgroundColor: '#FAFCFF',
  },
  connectionRowSelected: {
    borderColor: '#134074',
    backgroundColor: '#F0F6FC',
  },
  connectionAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  connectionName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334D6E',
  },
  connectionNameSelected: {
    color: '#0D3866',
    fontWeight: '800',
  },
  connectionRole: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  checkboxCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCircleSelected: {
    borderColor: '#134074',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#134074',
  },
  modalMessageInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#334D6E',
    textAlignVertical: 'top',
    height: 70,
    marginBottom: 20,
  },
  modalSendBtn: {
    backgroundColor: '#134074',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#134074',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  modalSendBtnDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  modalSendBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  notificationItem: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    backgroundColor: '#FFFFFF'
  },
  notificationItemUnread: {
    backgroundColor: '#F0F6FC',
    borderColor: '#134074'
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D3866'
  },
  notificationTime: {
    fontSize: 11,
    color: '#94A3B8'
  },
  notificationMessage: {
    fontSize: 12.5,
    color: '#334D6E',
    marginTop: 4
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D3866'
  },
  quickAccessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5
  },
  quickAccessTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D3866',
    marginBottom: 12
  },
  gridContainer: {
    flexDirection: 'column',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 4,
  },
  gridIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  gridText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#334D6E',
    textAlign: 'center',
  }
});

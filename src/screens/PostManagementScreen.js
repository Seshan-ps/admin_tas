import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, StyleSheet, Platform, Image, Linking, StatusBar, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Globe, Lock, Edit2, Trash2, Info, Plus, X, ChevronDown, Eye, Heart, MessageSquare, Share2, Home as HomeIcon, BarChart3, Newspaper, Users, ArrowUp, Bold, Italic, List, Image as ImageIcon, FileText, Link, AtSign, Check, ArrowRight, SlidersHorizontal, Calendar as CalendarIcon } from 'lucide-react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { dbStore } from '../config/dbStore';
import * as ImagePicker from 'expo-image-picker';
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
const handleLinkPressUrl = url => {
  let cleanUrl = url;
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }
  Linking.openURL(cleanUrl).catch(() => {
    Alert.alert('Error', 'Cannot open link: ' + url);
  });
};
const parseMarkdown = text => {
  if (!text) return [];

  // Combine matches: links [text](url), bold **text**, italic *text*, hashtag #tag
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|(#[a-zA-Z0-9_]+)/g;
  const result = [];
  let lastIndex = 0;
  let match;
  let keyIndex = 0;
  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      result.push(<Text key={`text-${keyIndex++}`}>
          {text.substring(lastIndex, matchIndex)}
        </Text>);
    }
    if (match[1] && match[2]) {
      const linkText = match[1];
      const linkUrl = match[2];
      result.push(<Text key={`link-${keyIndex++}`} style={{
        color: '#0284C7',
        fontWeight: '700',
        textDecorationLine: 'underline'
      }} onPress={() => handleLinkPressUrl(linkUrl)}>
          {linkText}
        </Text>);
    } else if (match[3]) {
      result.push(<Text key={`bold-${keyIndex++}`} style={{
        fontWeight: '800',
        color: '#0D3866'
      }}>
          {match[3]}
        </Text>);
    } else if (match[4]) {
      result.push(<Text key={`italic-${keyIndex++}`} style={{
        fontStyle: 'italic'
      }}>
          {match[4]}
        </Text>);
    } else if (match[5]) {
      result.push(<Text key={`tag-${keyIndex++}`} style={{
        color: '#134074',
        fontWeight: '700'
      }}>
          {match[5]}
        </Text>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    result.push(<Text key={`text-${keyIndex++}`}>
        {text.substring(lastIndex)}
      </Text>);
  }
  return result;
};
export const PostManagementScreen = ({
  onBack,
  onTabPress,
  navigation,
  route
}) => {
  // Initialize posts from dbStore
  const [posts, setPosts] = useState(dbStore.getPosts());
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [showSortModal, setShowSortModal] = useState(false);

  // Create / Edit state
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formStatus, setFormStatus] = useState('published');
  const [formIsPrivate, setFormIsPrivate] = useState(false);
  const suggestedTagsList = ['#Networking', '#TaxUpdate', '#Referral', '#Opportunities'];
  const [selectedTags, setSelectedTags] = useState([]);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedDocument, setAttachedDocument] = useState(null);
  const [selection, setSelection] = useState({
    start: 0,
    end: 0
  });
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

  // Sync with dbStore reactively via subscription
  useEffect(() => {
    const updatePosts = () => {
      setPosts(dbStore.getPosts());
    };
    updatePosts();
    const unsubscribe = dbStore.subscribe(updatePosts);
    return unsubscribe;
  }, []);

  // Helper to parse reach strings (e.g. "1.2k") to numbers for sorting
  const parseReach = (reach) => {
    if (!reach) return 0;
    const str = String(reach).toLowerCase().trim();
    if (str.endsWith('k')) {
      return parseFloat(str) * 1000;
    }
    if (str.endsWith('m')) {
      return parseFloat(str) * 1000000;
    }
    return parseFloat(str) || 0;
  };

  // Helper to parse dates/times to timestamps for sorting
  const parsePostDate = (post) => {
    if (post.status === 'draft') {
      const lastSaved = post.lastSaved || '';
      if (lastSaved.includes('now')) return Date.now();
      const num = parseInt(lastSaved) || 0;
      if (lastSaved.includes('hour')) return Date.now() - num * 60 * 60 * 1000;
      if (lastSaved.includes('day')) return Date.now() - num * 24 * 60 * 60 * 1000;
      return 0;
    }
    const dateStr = post.postedDate || '';
    if (dateStr.toLowerCase() === 'today') {
      return Date.now();
    }
    const parsed = Date.parse(dateStr);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Handle Search, Filter and Sorting
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || post.status === activeTab;
    return matchesSearch && matchesTab;
  }).sort((a, b) => {
    if (sortBy === 'likes') {
      const likesA = a.likes ?? 0;
      const likesB = b.likes ?? 0;
      return likesB - likesA;
    } else if (sortBy === 'views') {
      const viewsA = parseReach(a.reach);
      const viewsB = parseReach(b.reach);
      return viewsB - viewsA;
    } else { // 'date'
      return parsePostDate(b) - parsePostDate(a);
    }
  });

  // Actions
  const handleCreateNew = () => {
    setEditingPost(null);
    setFormTitle('');
    setFormBody('');
    setFormStatus('published');
    setFormIsPrivate(false);
    setSelectedTags([]);
    setAttachedImage(null);
    setAttachedDocument(null);
    setIsFormVisible(true);
  };

  // Handle direct creation from Quick Access params
  useEffect(() => {
    if (route?.params?.action === 'new') {
      handleCreateNew();
      navigation.setParams({ action: undefined });
    }
  }, [route?.params]);
  const handleEdit = post => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormBody(post.body);
    setFormStatus(post.status);
    setFormIsPrivate(post.isPrivate);
    setAttachedImage(post.image || null);
    setAttachedDocument(post.document || null);
    // Auto-select tags if they exist in title/body
    const tags = suggestedTagsList.filter(tag => post.body.toLowerCase().includes(tag.replace('#', '').toLowerCase()) || post.title.toLowerCase().includes(tag.replace('#', '').toLowerCase()));
    setSelectedTags(tags);
    setIsFormVisible(true);
  };
  const handleBold = () => {
    const start = selection.start;
    const end = selection.end;
    const selectedText = formBody.slice(start, end);
    const newText = formBody.slice(0, start) + `**${selectedText || 'bold'}**` + formBody.slice(end);
    setFormBody(newText);
  };
  const handleItalic = () => {
    const start = selection.start;
    const end = selection.end;
    const selectedText = formBody.slice(start, end);
    const newText = formBody.slice(0, start) + `*${selectedText || 'italic'}*` + formBody.slice(end);
    setFormBody(newText);
  };
  const handleList = () => {
    const start = selection.start;
    const end = selection.end;
    const selectedText = formBody.slice(start, end);
    const newText = formBody.slice(0, start) + `\n- ${selectedText || 'item'}` + formBody.slice(end);
    setFormBody(newText);
  };
  const handlePhotoPress = () => {
    Alert.alert('Select Photo', 'Choose an image source:', [{
      text: 'Cancel',
      style: 'cancel'
    }, {
      text: 'Choose from Gallery / Local Device',
      onPress: async () => {
        try {
          const {
            status
          } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need gallery permissions to attach photos!');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1
          });
          if (!result.canceled && result.assets && result.assets.length > 0) {
            setAttachedImage(result.assets[0].uri);
          }
        } catch (err) {
          Alert.alert('Error', 'Failed to pick image from device.');
        }
      }
    }, {
      text: 'Use Mock: Annual Conference',
      onPress: () => setAttachedImage('annual_conference.png')
    }, {
      text: 'Use Mock: Server Room Update',
      onPress: () => setAttachedImage('server_room_update.png')
    }, {
      text: 'Remove Photo',
      style: 'destructive',
      onPress: () => setAttachedImage(null)
    }]);
  };
  const handleDocPress = () => {
    Alert.alert('Select Document', 'Choose a file to attach:', [{
      text: 'Cancel',
      style: 'cancel'
    }, {
      text: 'Q3 Financial Guidelines.pdf',
      onPress: () => setAttachedDocument('Q3 Financial Guidelines.pdf')
    }, {
      text: 'Annual Audit Report.pdf',
      onPress: () => setAttachedDocument('Annual Audit Report.pdf')
    }, {
      text: 'Remove Document',
      style: 'destructive',
      onPress: () => setAttachedDocument(null)
    }]);
  };
  const handleLinkPress = () => {
    if (Platform.OS === 'web') {
      const url = window.prompt('Enter URL:');
      if (url) {
        const start = selection.start;
        const end = selection.end;
        const selectedText = formBody.slice(start, end) || 'link';
        const newText = formBody.slice(0, start) + `[${selectedText}](${url})` + formBody.slice(end);
        setFormBody(newText);
      }
    } else {
      const start = selection.start;
      const end = selection.end;
      const selectedText = formBody.slice(start, end) || 'link';
      const newText = formBody.slice(0, start) + `[${selectedText}](https://example.com)` + formBody.slice(end);
      setFormBody(newText);
    }
  };
  const handleMentionPress = () => {
    const start = selection.start;
    const end = selection.end;
    const selectedText = formBody.slice(start, end);
    const newText = formBody.slice(0, start) + `@Admin ${selectedText}` + formBody.slice(end);
    setFormBody(newText);
  };
  const handleToggleTag = tag => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
      if (formBody.includes(tag)) {
        setFormBody(formBody.replace(new RegExp(`\\s*${tag}`), '').trim());
      }
    } else {
      setSelectedTags([...selectedTags, tag]);
      if (!formBody.includes(tag)) {
        setFormBody(prev => `${prev} ${tag}`.trim());
      }
    }
  };
  const handleCustomTag = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt('Add Custom Tag', 'Enter your custom tag:', [{
        text: 'Cancel',
        style: 'cancel'
      }, {
        text: 'Add',
        onPress: text => {
          if (text && text.trim()) {
            let formattedTag = text.trim();
            if (!formattedTag.startsWith('#')) {
              formattedTag = `#${formattedTag}`;
            }
            handleToggleTag(formattedTag);
          }
        }
      }]);
    } else if (Platform.OS === 'web') {
      const text = window.prompt('Enter your custom tag:');
      if (text && text.trim()) {
        let formattedTag = text.trim();
        if (!formattedTag.startsWith('#')) {
          formattedTag = `#${formattedTag}`;
        }
        handleToggleTag(formattedTag);
      }
    } else {
      Alert.alert('Custom Tag', 'Custom tags can be typed directly into the editor body starting with a # symbol.');
    }
  };
  const handleDelete = id => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this post?', [{
      text: 'Cancel',
      style: 'cancel'
    }, {
      text: 'Delete',
      style: 'destructive',
      onPress: () => {
        dbStore.setPosts(posts.filter(p => p.id !== id));
      }
    }]);
  };
  const handleSaveForm = overrideStatus => {
    if (!formTitle.trim() || !formBody.trim()) {
      Alert.alert('Incomplete Form', 'Please enter both title and body content.');
      return;
    }
    const isAlreadyPublished = editingPost && editingPost.status === 'published';
    const finalStatus = isAlreadyPublished ? 'published' : overrideStatus || formStatus;
    let newPosts;
    if (editingPost) {
      // Edit mode
      newPosts = posts.map(p => p.id === editingPost.id ? {
        ...p,
        title: formTitle,
        body: formBody,
        status: finalStatus,
        isPrivate: formIsPrivate,
        image: attachedImage || undefined,
        document: attachedDocument || undefined,
        lastSaved: finalStatus === 'draft' ? 'Just now' : undefined
      } : p);
    } else {
      // Create mode
      const newPost = {
        id: `post_${Date.now()}`,
        title: formTitle,
        body: formBody,
        status: finalStatus,
        isPrivate: formIsPrivate,
        image: attachedImage || undefined,
        document: attachedDocument || undefined,
        reach: finalStatus === 'published' ? '0' : undefined,
        likes: finalStatus === 'published' ? 0 : undefined,
        comments: finalStatus === 'published' ? 0 : undefined,
        shares: finalStatus === 'published' ? 0 : undefined,
        postedDate: finalStatus === 'published' ? 'Today' : undefined,
        lastSaved: finalStatus === 'draft' ? 'Just now' : undefined
      };
      newPosts = [newPost, ...posts];
    }
    dbStore.setPosts(newPosts);

    // Reset attachments
    setAttachedImage(null);
    setAttachedDocument(null);

    // If published, show success screen
    if (finalStatus === 'published') {
      setShowSuccessScreen(true);
    } else {
      setIsFormVisible(false);
      Alert.alert('Success', 'Draft saved successfully.');
    }
  };
  const handleInfoPress = post => {
    Alert.alert('Post Details', `Title: ${post.title}\nStatus: ${post.status.toUpperCase()}\nReach: ${post.reach || 'N/A'}\nLikes: ${post.likes ?? 'N/A'}\nComments: ${post.comments ?? 'N/A'}`);
  };
  return <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Conditionally Render Header based on State */}
      {showSuccessScreen ? <View style={styles.formHeader}>
          <View style={{
        width: 44
      }} />
          <Text style={styles.formHeaderTitle}>Posting</Text>
          <View style={{
        width: 44
      }} />
        </View> : !isFormVisible ? <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={22} color="#0D3866" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post Management</Text>
          <View style={{
        width: 44
      }} />
        </View> : <View style={styles.formHeader}>
          <TouchableOpacity onPress={() => setIsFormVisible(false)} style={styles.formCloseButton}>
            <X size={22} color="#0D3866" />
          </TouchableOpacity>
          <Text style={styles.formHeaderTitle}>{editingPost ? 'Edit Post' : 'Create Post'}</Text>
          <View style={{
        width: 44
      }} />
        </View>}

      {showSuccessScreen ? (/* Success Screen */
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.successContent}>
          <View style={styles.successCard}>
            {/* Checked Square Icon */}
            <View style={styles.successIconWrapper}>
              <View style={styles.successIconCircle}>
                <Check size={28} color="white" />
              </View>
            </View>

            <Text style={styles.successTitle}>Posted Successfully</Text>
            <Text style={styles.successSubtitle}>
              Your update is now live on the society network. All verified members can now view your contribution.
            </Text>

            {/* Info Box */}
            <View style={styles.successInfoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>STATUS</Text>
                <View style={styles.liveBadge}>
                  <Check size={10} color="#3F6212" style={{
                marginRight: 4
              }} />
                  <Text style={styles.liveBadgeText}>LIVE</Text>
                </View>
              </View>
              <View style={styles.infoDivider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>TIME</Text>
                <Text style={styles.infoValue}>{new Date().toUTCString().slice(17, 25)} UTC</Text>
              </View>
              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>NETWORK</Text>
                <Text style={styles.infoValue}>Texcity Secure Cluster</Text>
              </View>
            </View>

            {/* Verified Badge */}
            <View style={styles.verifiedBadgeContainer}>
              <Lock size={12} color="#1E40AF" style={{
            marginRight: 6
          }} />
              <Text style={styles.verifiedBadgeText}>Secure Session Verified</Text>
            </View>

            {/* Done Button */}
            <TouchableOpacity style={styles.doneButton} onPress={() => {
          setShowSuccessScreen(false);
          setIsFormVisible(false);
        }}>
              <Text style={styles.doneButtonText}>Done</Text>
              <ArrowRight size={18} color="white" style={{
            marginLeft: 8
          }} />
            </TouchableOpacity>
          </View>
        </ScrollView>) : isFormVisible ? (/* Edit / Create Form View */
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={true}>
          {/* Author Block */}
          <View style={styles.authorRow}>
            <Image source={require('../../assets/admin_profile.png')} style={styles.authorAvatar} />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>Admin TAS</Text>
              <TouchableOpacity style={styles.privacyPill} onPress={() => setFormIsPrivate(!formIsPrivate)}>
                {formIsPrivate ? <Lock size={12} color="#1E3A8A" style={{
              marginRight: 4
            }} /> : <Globe size={12} color="#1E3A8A" style={{
              marginRight: 4
            }} />}
                <Text style={styles.privacyText}>
                  {formIsPrivate ? 'Private' : 'Public'}
                </Text>
                <ChevronDown size={12} color="#1E3A8A" style={{
              marginLeft: 4
            }} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Editor Canvas Card */}
          <View style={styles.editorCard}>
            <TextInput style={styles.editorTitleInput} value={formTitle} onChangeText={setFormTitle} placeholder="Title of your post..." placeholderTextColor="#64748B" />
            
            <TextInput style={styles.editorBodyInput} value={formBody} onChangeText={setFormBody} placeholder={editingPost ? "What do you want to talk about?" : "Share a update, referral, or new opportunity..."} placeholderTextColor="#64748B" multiline textAlignVertical="top" onSelectionChange={event => setSelection(event.nativeEvent.selection)} />

            {/* Attached Image Preview inside the Card */}
            {attachedImage && <View style={styles.attachedImageContainer}>
                <Image source={attachedImage === 'annual_conference.png' ? require('../../assets/annual_conference.png') : attachedImage === 'server_room_update.png' ? require('../../assets/server_room_update.png') : {
            uri: attachedImage
          }} style={styles.attachedImagePreview} resizeMode="cover" />
                <TouchableOpacity style={styles.removeImageBtn} onPress={() => setAttachedImage(null)}>
                  <X size={16} color="white" />
                </TouchableOpacity>
              </View>}

            {/* Attached Document Preview inside the Card */}
            {attachedDocument && <View style={styles.attachedDocContainer}>
                <FileText size={16} color="#0D3866" style={{
            marginRight: 6
          }} />
                <Text style={styles.attachedDocText}>{attachedDocument}</Text>
                <TouchableOpacity style={styles.removeDocBtn} onPress={() => setAttachedDocument(null)}>
                  <X size={14} color="#64748B" />
                </TouchableOpacity>
              </View>}

            {/* Suggested Tags inside the card */}
            <View style={styles.editorFooterRow}>
              <View style={styles.tagsSection}>
                <Text style={styles.suggestedTagsLabel}>SUGGESTED TAGS</Text>
                <View style={styles.tagsContainer}>
                  {suggestedTagsList.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return <TouchableOpacity key={tag} style={[styles.tagPill, isSelected && styles.tagPillSelected]} onPress={() => handleToggleTag(tag)}>
                        <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                          {tag}
                        </Text>
                      </TouchableOpacity>;
              })}
                  <TouchableOpacity style={styles.customTagBtn} onPress={handleCustomTag}>
                    <Text style={styles.customTagText}>+ Custom</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Character Counter Circular Indicator */}
              <View style={styles.charCounterContainer}>
                <View style={styles.progressCircle}>
                  <Text style={styles.progressText}>{formBody.length}</Text>
                </View>
                <Text style={styles.maxCharText}> / 2000</Text>
              </View>
            </View>
          </View>

          {/* Formatting Toolbar */}
          <View style={styles.toolbarDivider} />
          <View style={styles.toolbarContainer}>
            <View style={styles.toolbarFormatGroup}>
              <TouchableOpacity style={styles.toolbarFormatButton} onPress={handleBold}>
                <Bold size={20} color="#134074" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarFormatButton} onPress={handleItalic}>
                <Italic size={20} color="#134074" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarFormatButton} onPress={handleList}>
                <List size={20} color="#134074" />
              </TouchableOpacity>
              <View style={styles.toolbarVerticalDivider} />
            </View>

            <View style={styles.toolbarAttachmentGroup}>
              <TouchableOpacity style={styles.toolbarAttachmentButton} onPress={handlePhotoPress}>
                <ImageIcon size={20} color="#134074" />
                <Text style={styles.toolbarAttachmentLabel}>Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarAttachmentButton} onPress={handleDocPress}>
                <FileText size={20} color="#134074" />
                <Text style={styles.toolbarAttachmentLabel}>Document</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarAttachmentButton} onPress={handleLinkPress}>
                <Link size={20} color="#134074" />
                <Text style={styles.toolbarAttachmentLabel}>Link</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarAttachmentButton} onPress={handleMentionPress}>
                <AtSign size={20} color="#134074" />
                <Text style={styles.toolbarAttachmentLabel}>Mention</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.toolbarDivider} />

          {/* Save and Post Actions */}
          <View style={styles.actionButtonRow}>
            {(!editingPost || editingPost.status !== 'published') && <TouchableOpacity style={styles.saveTextButton} onPress={() => handleSaveForm('draft')}>
                <Text style={styles.saveTextButtonText}>Save</Text>
              </TouchableOpacity>}
            <TouchableOpacity style={styles.postGradientButton} onPress={() => handleSaveForm('published')}>
              <Text style={styles.postGradientButtonText}>
                {editingPost && editingPost.status === 'published' ? 'Update' : 'Post'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>) : (/* List View */
    <View style={{
      flex: 1
    }}>
          {/* Search Bar container */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={18} color="#94a3b8" style={{
            marginRight: 8
          }} />
              <TextInput style={styles.searchInput} placeholder="Search posts by title, keyword, or author..." placeholderTextColor="#94a3b8" value={searchQuery} onChangeText={setSearchQuery} />
            </View>
            <TouchableOpacity style={styles.filterButton} onPress={() => setShowSortModal(true)} activeOpacity={0.8}>
              <SlidersHorizontal size={18} color="#0D3866" />
              {sortBy !== 'date' && <View style={styles.filterActiveDot} />}
            </TouchableOpacity>
          </View>

          {/* Tab Filter switcher */}
          <View style={styles.tabSwitcherRow}>
            {['all', 'published', 'draft'].map(tab => <TouchableOpacity key={tab} style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabButtonText, activeTab === tab && styles.tabButtonTextActive]}>
                  {tab === 'all' ? 'All Posts' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>)}
          </View>

          <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16} style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
            {/* Engagement Summary Card */}
            {activeTab !== 'draft' && <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Post Engagement Summary</Text>
                <Text style={styles.summaryText}>
                  Overall post reach has increased by 14.5% this month. Your most active demographic is 'Senior Accountants' based in metropolitan areas.
                </Text>
                <View style={styles.summaryStatsRow}>
                  <View style={styles.summaryStatBox}>
                    <Text style={styles.summaryStatVal}>4.8k</Text>
                    <Text style={styles.summaryStatLabel}>Total Reach</Text>
                  </View>
                  <View style={styles.summaryVerticalDivider} />
                  <View style={styles.summaryStatBox}>
                    <Text style={styles.summaryStatVal}>286</Text>
                    <Text style={styles.summaryStatLabel}>New Interactions</Text>
                  </View>
                </View>
              </View>}

            {/* Posts Cards list */}
            {filteredPosts.map(post => {
          const isPublished = post.status === 'published';
          return <View key={post.id} style={styles.postCard}>
                  {/* Card Header tag status */}
                  <View style={styles.cardHeaderRow}>
                    <View style={[styles.statusTag, isPublished ? styles.publishedTag : styles.draftTag]}>
                      <Text style={isPublished ? styles.publishedTagText : styles.draftTagText}>
                        {post.status.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.visibilityBox}>
                      {post.isPrivate ? <>
                          <Lock size={14} color="#8e9bb0" style={{
                    marginRight: 4
                  }} />
                          <Text style={styles.visibilityText}>Private</Text>
                        </> : <>
                          <Globe size={14} color="#8e9bb0" style={{
                    marginRight: 4
                  }} />
                          <Text style={styles.visibilityText}>Public</Text>
                        </>}
                    </View>
                  </View>

                  {/* Title & Body */}
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postBody}>{parseMarkdown(post.body)}</Text>

                  {post.image && <Image source={post.image === 'annual_conference.png' ? require('../../assets/annual_conference.png') : post.image === 'server_room_update.png' ? require('../../assets/server_room_update.png') : {
              uri: post.image
            }} style={styles.postCardImage} resizeMode="cover" />}

                  {post.document && <View style={styles.postCardDoc}>
                      <FileText size={14} color="#0D3866" style={{
                marginRight: 6
              }} />
                      <Text style={styles.postCardDocText}>{post.document}</Text>
                    </View>}

                  {/* Metrics Row (only for published) */}
                  {isPublished && <View style={styles.metricsRow}>
                      <View style={styles.metricItem}>
                        <Eye size={15} color="#0D3866" style={{
                  marginRight: 4
                }} />
                        <Text style={styles.metricText}>{post.reach || '0'}</Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Heart size={14} color="#0D3866" style={{
                  marginRight: 4
                }} />
                        <Text style={styles.metricText}>{post.likes ?? 0}</Text>
                      </View>
                      <View style={styles.metricItem}>
                        <MessageSquare size={14} color="#0D3866" style={{
                  marginRight: 4
                }} />
                        <Text style={styles.metricText}>{post.comments ?? 0}</Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Share2 size={14} color="#0D3866" style={{
                  marginRight: 4
                }} />
                        <Text style={styles.metricText}>{post.shares ?? 0}</Text>
                      </View>
                    </View>}

                  {/* Footer Row */}
                  <View style={styles.cardFooterRow}>
                    <View>
                      <Text style={styles.footerLabel}>
                        {isPublished ? 'POSTED DATE' : 'LAST SAVED'}
                      </Text>
                      <Text style={styles.footerValue}>
                        {isPublished ? post.postedDate : post.lastSaved}
                      </Text>
                    </View>

                    <View style={styles.cardActions}>
                      <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(post)}>
                        <Edit2 size={16} color="#0D3866" />
                      </TouchableOpacity>
                      {isPublished && <TouchableOpacity style={styles.actionBtn} onPress={() => handleInfoPress(post)}>
                          <Info size={16} color="#0D3866" />
                        </TouchableOpacity>}
                      <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(post.id)}>
                        <Trash2 size={16} color="#C2410C" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Continue editing for drafts */}
                  {!isPublished && <TouchableOpacity style={styles.continueLink} onPress={() => handleEdit(post)}>
                      <Text style={styles.continueText}>Continue Editing →</Text>
                    </TouchableOpacity>}
                </View>;
        })}

            <View style={{
          height: 100
        }} />
          </ScrollView>

          {/* Floating Scroll to Top */}
          {showScrollTop && <TouchableOpacity onPress={scrollToTop} activeOpacity={0.85} style={styles.scrollTopButton}>
              <ArrowUp size={20} color="white" />
            </TouchableOpacity>}

          {/* FAB Button */}
          <TouchableOpacity style={styles.fabButton} onPress={handleCreateNew} activeOpacity={0.85}>
            <Plus size={26} color="white" />
          </TouchableOpacity>

          {/* Sort Options Bottom Sheet / Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showSortModal}
            onRequestClose={() => setShowSortModal(false)}
          >
            <View style={styles.bottomSheetOverlay}>
              <View style={styles.bottomSheetContent}>
                <View style={styles.bottomSheetHeader}>
                  <Text style={styles.bottomSheetTitle}>Sort Posts By</Text>
                  <TouchableOpacity onPress={() => setShowSortModal(false)} style={styles.closeSheetBtn}>
                    <X size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.sortOptionsList}>
                  <TouchableOpacity 
                    style={[styles.sortOptionItem, sortBy === 'date' && styles.sortOptionItemActive]} 
                    onPress={() => { setSortBy('date'); setShowSortModal(false); }}
                  >
                    <View style={styles.sortOptionTextGroup}>
                      <CalendarIcon size={16} color={sortBy === 'date' ? '#0D3866' : '#64748B'} style={{ marginRight: 10 }} />
                      <Text style={[styles.sortOptionText, sortBy === 'date' && styles.sortOptionTextActive]}>Date of Upload</Text>
                    </View>
                    {sortBy === 'date' && <Check size={18} color="#0D3866" />}
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.sortOptionItem, sortBy === 'likes' && styles.sortOptionItemActive]} 
                    onPress={() => { setSortBy('likes'); setShowSortModal(false); }}
                  >
                    <View style={styles.sortOptionTextGroup}>
                      <Heart size={16} color={sortBy === 'likes' ? '#0D3866' : '#64748B'} style={{ marginRight: 10 }} fill={sortBy === 'likes' ? '#0D3866' : 'none'} />
                      <Text style={[styles.sortOptionText, sortBy === 'likes' && styles.sortOptionTextActive]}>Like Count</Text>
                    </View>
                    {sortBy === 'likes' && <Check size={18} color="#0D3866" />}
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.sortOptionItem, sortBy === 'views' && styles.sortOptionItemActive]} 
                    onPress={() => { setSortBy('views'); setShowSortModal(false); }}
                  >
                    <View style={styles.sortOptionTextGroup}>
                      <Eye size={16} color={sortBy === 'views' ? '#0D3866' : '#64748B'} style={{ marginRight: 10 }} />
                      <Text style={[styles.sortOptionText, sortBy === 'views' && styles.sortOptionTextActive]}>Most Viewed</Text>
                    </View>
                    {sortBy === 'views' && <Check size={18} color="#0D3866" />}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>)}

      {/* Fallback Bottom Navigation (Visible when navigation is standalone) */}
      {!navigation && <View style={styles.footerContainer}>
          <View style={styles.footerTabBar}>
            <TouchableOpacity style={styles.footerTabItem} onPress={() => onTabPress?.('feed')}>
              <HomeIcon size={22} color="#134074" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerTabItem} onPress={() => onTabPress?.('analytics')}>
              <BarChart3 size={22} color="#134074" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.footerTabItem, styles.footerTabItemActive]} onPress={() => {}}>
              <Newspaper size={22} color="#70B62C" />
              <Text style={styles.footerTabLabel}>Post</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerTabItem} onPress={() => onTabPress?.('Connect')}>
              <Users size={22} color="#134074" />
            </TouchableOpacity>
          </View>
        </View>}

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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F4F7FB',
    gap: 8
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#334D6E',
    padding: 0
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  filterActiveDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#467A18'
  },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D3866'
  },
  closeSheetBtn: {
    padding: 4
  },
  sortOptionsList: {
    flexDirection: 'column',
    gap: 8
  },
  sortOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  sortOptionItemActive: {
    backgroundColor: '#F0F5FC',
    borderColor: '#0D3866'
  },
  sortOptionTextGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569'
  },
  sortOptionTextActive: {
    color: '#0D3866',
    fontWeight: '700'
  },
  tabSwitcherRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8
  },
  tabButtonActive: {
    backgroundColor: '#0D3866',
    borderColor: '#0D3866'
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b'
  },
  tabButtonTextActive: {
    color: '#FFFFFF'
  },
  scrollContainer: {
    flex: 1
  },
  scrollContent: {
    padding: 16
  },
  summaryCard: {
    backgroundColor: '#0D3866',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6
  },
  summaryText: {
    fontSize: 12,
    color: '#93C5FD',
    lineHeight: 16,
    marginBottom: 16
  },
  summaryStatsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  summaryStatBox: {
    flex: 1
  },
  summaryStatVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  summaryStatLabel: {
    fontSize: 10,
    color: '#93C5FD',
    fontWeight: '700',
    marginTop: 2
  },
  summaryVerticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  statusTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  publishedTag: {
    backgroundColor: '#BEF264'
  },
  publishedTagText: {
    color: '#3F6212',
    fontSize: 10,
    fontWeight: '800'
  },
  draftTag: {
    backgroundColor: '#E2E8F0'
  },
  draftTagText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '800'
  },
  visibilityBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  visibilityText: {
    fontSize: 11,
    color: '#8e9bb0',
    fontWeight: '600'
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D3866',
    marginBottom: 6
  },
  postBody: {
    fontSize: 12.5,
    color: '#64748b',
    lineHeight: 17,
    marginBottom: 14
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginBottom: 12,
    gap: 16
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metricText: {
    fontSize: 11.5,
    color: '#0D3866',
    fontWeight: '700'
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5
  },
  footerValue: {
    fontSize: 12,
    color: '#334D6E',
    fontWeight: '700',
    marginTop: 2
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  actionBtn: {
    padding: 4
  },
  continueLink: {
    marginTop: 12,
    alignSelf: 'flex-start'
  },
  continueText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D3866'
  },
  fabButton: {
    position: 'absolute',
    bottom: 100,
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
  formContent: {
    paddingVertical: 16
  },
  formHeader: {
    height: 56,
    backgroundColor: '#EBF3FC',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  formCloseButton: {
    padding: 8,
    marginLeft: -8
  },
  formHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D3866'
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12
  },
  authorInfo: {
    flexDirection: 'column'
  },
  authorName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D3866',
    marginBottom: 4
  },
  privacyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9F0FA',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start'
  },
  privacyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#134074'
  },
  editorCard: {
    backgroundColor: '#EBF1F6',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    minHeight: 280
  },
  editorTitleInput: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D3866',
    marginBottom: 12,
    padding: 0
  },
  editorBodyInput: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 22,
    minHeight: 150,
    textAlignVertical: 'top',
    padding: 0,
    marginBottom: 16
  },
  editorFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(13, 56, 102, 0.08)',
    paddingTop: 12,
    marginTop: 'auto'
  },
  tagsSection: {
    flex: 1,
    marginRight: 8
  },
  suggestedTagsLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  tagPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  tagPillSelected: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0D3866'
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334D6E'
  },
  tagTextSelected: {
    color: '#0D3866'
  },
  customTagBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center'
  },
  customTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF'
  },
  charCounterContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  progressCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#70B62C',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334D6E'
  },
  maxCharText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600'
  },
  toolbarDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4
  },
  toolbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-between'
  },
  toolbarFormatGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  toolbarFormatButton: {
    padding: 6
  },
  toolbarVerticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8
  },
  toolbarAttachmentGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  toolbarAttachmentButton: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  toolbarAttachmentLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2
  },
  actionButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 100
  },
  saveTextButton: {
    paddingVertical: 8
  },
  saveTextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D3866'
  },
  postGradientButton: {
    backgroundColor: '#0D3866',
    borderRadius: 8,
    paddingHorizontal: 28,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  postGradientButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    zIndex: 100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  footerTabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  footerTabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20
  },
  footerTabItemActive: {
    backgroundColor: '#f0fdf4'
  },
  footerTabLabel: {
    color: '#70B62C',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 165,
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
  successContent: {
    padding: 16,
    alignItems: 'center',
    paddingBottom: 120
  },
  successHeader: {
    height: 56,
    backgroundColor: '#EBF3FC',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    marginBottom: 24
  },
  successHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D3866'
  },
  successCard: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  successIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16
  },
  successIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#70B62C',
    justifyContent: 'center',
    alignItems: 'center'
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0D3866',
    marginBottom: 12,
    textAlign: 'center'
  },
  successSubtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 12
  },
  successInfoBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    width: '100%',
    padding: 16,
    marginBottom: 32
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D3866'
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#E2E8F0'
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BEF264',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  liveBadgeText: {
    color: '#3F6212',
    fontSize: 10,
    fontWeight: '800'
  },
  verifiedBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 48
  },
  verifiedBadgeText: {
    color: '#1E40AF',
    fontSize: 12,
    fontWeight: '700'
  },
  doneButton: {
    flexDirection: 'row',
    backgroundColor: '#0D3866',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700'
  },
  attachedImageContainer: {
    marginTop: 12,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    height: 160,
    width: '100%'
  },
  attachedImagePreview: {
    width: '100%',
    height: '100%'
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  attachedDocContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 12
  },
  attachedDocText: {
    fontSize: 13,
    color: '#0D3866',
    fontWeight: '600',
    flex: 1
  },
  removeDocBtn: {
    padding: 4
  },
  postCardImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 8
  },
  postCardDoc: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    padding: 8,
    marginTop: 10,
    marginBottom: 4
  },
  postCardDocText: {
    fontSize: 12,
    color: '#0D3866',
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  confirmModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // Round corner box as requested!
    padding: 24,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8
  },
  confirmModalBody: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 24
  },
  confirmModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  confirmModalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 12
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D3866',
    letterSpacing: 0.5
  },
  deleteBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
    letterSpacing: 0.5
  }
});

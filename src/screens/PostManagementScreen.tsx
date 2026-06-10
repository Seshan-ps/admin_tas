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
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bold,
  Italic,
  List,
  Image as ImageIcon,
  FileText,
  Link,
  AtSign,
  Home,
  BarChart3,
  Calendar,
  Users,
} from 'lucide-react-native';
import { supabase } from '../config/supabase';

interface Post {
  id: string;
  title: string;
  body: string;
  status: 'published' | 'draft';
  isPrivate: boolean;
  reach?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  lastSaved?: string;
  postedDate?: string;
  tags?: string[];
}

interface PostManagementScreenProps {
  onBack: () => void;
  onTabPress?: (tab: string) => void;
  navigation?: any;
}

export const PostManagementScreen: React.FC<PostManagementScreenProps> = ({
  onBack,
  onTabPress,
  navigation,
}) => {
  // Mock initial posts
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'Annual Fiscal Review: 2023 Highlights',
      body: 'Explore the key findings and growth metrics from the TAS accounting review this year...',
      status: 'published',
      isPrivate: false,
      likes: 342,
      comments: 89,
      shares: 12,
      reach: '1.2k',
      postedDate: 'Oct 24, 2023',
      tags: ['#TaxUpdate', '#Referral'],
    },
    {
      id: '2',
      title: 'Car service Annual',
      body: 'Explore the key findings and growth metrics from the TAS accounting systems check...',
      status: 'published',
      isPrivate: false,
      likes: 142,
      comments: 90,
      shares: 12,
      reach: '5.2k',
      postedDate: 'Oct 14, 2023',
      tags: ['#Opportunities'],
    },
    {
      id: '3',
      title: 'MSV Company',
      body: 'Explore the key findings and growth metrics from the TAS accounting review panel...',
      status: 'published',
      isPrivate: false,
      likes: 502,
      comments: 91,
      shares: 52,
      reach: '5.9k',
      postedDate: 'Oct 14, 2023',
      tags: ['#Networking'],
    },
    {
      id: '4',
      title: 'Internal Memo: Staff Accreditation',
      body: 'Please review the attached document regarding the 2024 accreditation procedures...',
      status: 'draft',
      isPrivate: true,
      lastSaved: '2 hours ago',
      tags: ['#Referral'],
    },
    {
      id: '5',
      title: 'Q3 Financial Guidelines Update',
      body: 'This document outlines the revised reporting standards for all TAS registered members. Please ensure compliance with the updated audit trail requirements. The new measures focus on enhancing digital verification and institutional transparency across our multi-tier accounting frameworks.',
      status: 'draft',
      isPrivate: true,
      lastSaved: '12 hours ago',
      tags: ['#TaxUpdate', '#Opportunities'],
    },
    {
      id: '6',
      title: 'Tax Reform Analysis Brief',
      body: 'A deep dive into the recent legislative changes regarding international tax credits. This analysis is intended for the administrative review board.',
      status: 'draft',
      isPrivate: true,
      lastSaved: '12 days ago',
      tags: ['#TaxUpdate'],
    },
  ]);

  const [activeFilter, setActiveFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Editor States
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorBody, setEditorBody] = useState('');
  const [editorTags, setEditorTags] = useState<string[]>([]);
  const [editorIsPrivate, setEditorIsPrivate] = useState(false);

  // Suggested tags list
  const suggestedTagsList = ['#Networking', '#TaxUpdate', '#Referral', '#Opportunities'];

  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data && data.length > 0) {
          const formatted = data.map((item: any) => ({
            id: item.id,
            title: item.content.split('\n')[0] || 'Untitled Post',
            body: item.content,
            status: item.status,
            isPrivate: item.type !== 'regular',
            tags: item.tags || [],
            likes: item.interaction_count || 0,
            comments: 0,
            shares: 0,
            reach: `${item.reach_count || 0}`,
            postedDate: new Date(item.created_at).toLocaleDateString(),
          }));
          setPosts(formatted);
        }
      } catch (e) {
        // Fallback to local mockup
      }
    };
    fetchPosts();
  }, []);

  const handleDeletePost = async (id: string) => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post permanently?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.from('posts').delete().eq('id', id);
            if (error) throw error;
          } catch (e) {
            // fallback
          }
          setPosts(posts.filter((p) => p.id !== id));
        },
      },
    ]);
  };

  const handleEditPress = (post: Post) => {
    setEditingPost(post);
    setEditorTitle(post.title);
    setEditorBody(post.body);
    setEditorTags(post.tags || []);
    setEditorIsPrivate(post.isPrivate);
    setIsEditing(true);
  };

  const handleCreatePress = () => {
    setEditingPost({});
    setEditorTitle('');
    setEditorBody('');
    setEditorTags([]);
    setEditorIsPrivate(false);
    setIsEditing(true);
  };

  const handleSaveDraft = async () => {
    if (!editorTitle) {
      Alert.alert('Error', 'Please enter a post title.');
      return;
    }
    const updatedPosts = [...posts];
    const postPayload = {
      content: `${editorTitle}\n${editorBody}`,
      status: 'draft',
      type: editorIsPrivate ? 'promoted' : 'regular',
      tags: editorTags,
    };

    if (editingPost?.id) {
      // Edit existing
      try {
        const { error } = await supabase.from('posts').update(postPayload).eq('id', editingPost.id);
        if (error) throw error;
      } catch (e) {}
      
      const idx = updatedPosts.findIndex((p) => p.id === editingPost.id);
      if (idx !== -1) {
        updatedPosts[idx] = {
          ...updatedPosts[idx],
          title: editorTitle,
          body: editorBody,
          tags: editorTags,
          isPrivate: editorIsPrivate,
          status: 'draft',
          lastSaved: 'Just now',
        };
      }
    } else {
      // Add new draft
      let newId = Date.now().toString();
      try {
        const { data, error } = await supabase.from('posts').insert([postPayload]).select();
        if (error) throw error;
        if (data && data[0]) newId = data[0].id;
      } catch (e) {}

      const newPost: Post = {
        id: newId,
        title: editorTitle,
        body: editorBody,
        status: 'draft',
        isPrivate: editorIsPrivate,
        lastSaved: 'Just now',
        tags: editorTags,
      };
      updatedPosts.unshift(newPost);
    }
    setPosts(updatedPosts);
    setIsEditing(false);
    Alert.alert('Draft Saved', 'Your post draft has been updated successfully.');
  };

  const handlePublishPost = async () => {
    if (!editorTitle || !editorBody) {
      Alert.alert('Error', 'Please fill in both the title and body content.');
      return;
    }
    const updatedPosts = [...posts];
    const postPayload = {
      content: `${editorTitle}\n${editorBody}`,
      status: 'published',
      type: editorIsPrivate ? 'promoted' : 'regular',
      tags: editorTags,
      reach_count: 1000,
    };

    if (editingPost?.id) {
      // Edit existing and publish
      try {
        const { error } = await supabase.from('posts').update(postPayload).eq('id', editingPost.id);
        if (error) throw error;
      } catch (e) {}

      const idx = updatedPosts.findIndex((p) => p.id === editingPost.id);
      if (idx !== -1) {
        updatedPosts[idx] = {
          ...updatedPosts[idx],
          title: editorTitle,
          body: editorBody,
          tags: editorTags,
          isPrivate: editorIsPrivate,
          status: 'published',
          postedDate: 'Today',
          likes: updatedPosts[idx].likes || 0,
          comments: updatedPosts[idx].comments || 0,
          shares: updatedPosts[idx].shares || 0,
          reach: updatedPosts[idx].reach || '1.0k',
        };
      }
    } else {
      // Create new published post
      let newId = Date.now().toString();
      try {
        const { data, error } = await supabase.from('posts').insert([postPayload]).select();
        if (error) throw error;
        if (data && data[0]) newId = data[0].id;
      } catch (e) {}

      const newPost: Post = {
        id: newId,
        title: editorTitle,
        body: editorBody,
        status: 'published',
        isPrivate: editorIsPrivate,
        postedDate: 'Today',
        likes: 0,
        comments: 0,
        shares: 0,
        reach: '1.0k',
        tags: editorTags,
      };
      updatedPosts.unshift(newPost);
    }
    setPosts(updatedPosts);
    setIsEditing(false);
    Alert.alert('Success', 'Your post has been published successfully.');
  };

  const toggleTag = (tag: string) => {
    if (editorTags.includes(tag)) {
      setEditorTags(editorTags.filter((t) => t !== tag));
    } else {
      setEditorTags([...editorTags, tag]);
    }
  };

  const filteredPosts = posts
    .filter((post) => {
      if (activeFilter === 'published') return post.status === 'published';
      if (activeFilter === 'draft') return post.status === 'draft';
      return true;
    })
    .filter((post) => {
      return (
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  // RENDER 1: EDITOR PAGE
  const renderEditor = () => {
    return (
      <SafeAreaView className="flex-1 bg-white">
        {/* Editor Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-[#E9F0FA] border-b border-blue-100">
          <TouchableOpacity onPress={() => setIsEditing(false)} className="p-1.5 -ml-1">
            <X size={22} color="#134074" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-[#134074]">Edit Post</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={true}>
          {/* Profile Header */}
          <View className="flex-row items-center mb-5">
            <Image
              source={require('../../assets/admin_profile.png')}
              className="w-10 h-10 rounded-full border border-slate-100"
            />
            <View className="ml-3">
              <Text className="font-bold text-slate-800 text-[15px]">Admin TAS</Text>
              {/* Dropdown status selector */}
              <TouchableOpacity 
                onPress={() => setEditorIsPrivate(!editorIsPrivate)}
                className="flex-row items-center bg-slate-100 rounded-md px-2 py-0.5 mt-0.5 space-x-1 w-20"
              >
                {editorIsPrivate ? <Lock size={11} color="#64748b" /> : <Globe size={11} color="#64748b" />}
                <Text className="text-[11px] font-bold text-slate-500">
                  {editorIsPrivate ? 'Private' : 'Public'}
                </Text>
                <ChevronDown size={11} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Content area */}
          <View className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 min-h-[300px] mb-5">
            <TextInput
              value={editorTitle}
              onChangeText={setEditorTitle}
              placeholder="Enter post title..."
              placeholderTextColor="#94a3b8"
              className="text-slate-800 font-bold text-[17px] pb-3 border-b border-slate-200/60 mb-3"
            />
            <TextInput
              value={editorBody}
              onChangeText={setEditorBody}
              placeholder="This document outlines the revised reporting standards for all TAS registered members..."
              placeholderTextColor="#94a3b8"
              multiline
              className="text-slate-700 text-[14px] leading-relaxed flex-1 min-h-[180px]"
              textAlignVertical="top"
            />

            {/* Suggested Tags section */}
            <View className="mt-4 pt-3 border-t border-slate-200/60">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                Suggested Tags
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {suggestedTagsList.map((tag) => {
                  const isSelected = editorTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      onPress={() => toggleTag(tag)}
                      className={`rounded-full px-3 py-1 border ${
                        isSelected 
                          ? 'bg-blue-100 border-blue-200' 
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <Text className={`text-[11px] font-semibold ${isSelected ? 'text-[#134074]' : 'text-slate-500'}`}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity className="bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
                  <Text className="text-[#134074] text-[11px] font-bold">+ Custom</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Character Counter */}
            <View className="flex-row justify-end items-center mt-4 space-x-1.5">
              <View className="w-5 h-5 rounded-full border-2 border-green-600 items-center justify-center">
                <Text className="text-[9px] font-bold text-green-600">0</Text>
              </View>
              <Text className="text-[10px] text-slate-400 font-semibold">/ 2000</Text>
            </View>
          </View>

          {/* Formatting bar shortcuts */}
          <View className="flex-row justify-between items-center border-y border-slate-100 py-3 mb-6">
            <View className="flex-row space-x-5 px-1">
              <TouchableOpacity><Bold size={18} color="#64748b" /></TouchableOpacity>
              <TouchableOpacity><Italic size={18} color="#64748b" /></TouchableOpacity>
              <TouchableOpacity><List size={18} color="#64748b" /></TouchableOpacity>
            </View>
            <View className="h-6 w-[1px] bg-slate-200" />
            <View className="flex-row space-x-5 px-1">
              <TouchableOpacity className="items-center"><ImageIcon size={18} color="#64748b" /><Text className="text-[8px] text-slate-400 font-bold mt-0.5">Photo</Text></TouchableOpacity>
              <TouchableOpacity className="items-center"><FileText size={18} color="#64748b" /><Text className="text-[8px] text-slate-400 font-bold mt-0.5">Document</Text></TouchableOpacity>
              <TouchableOpacity className="items-center"><Link size={18} color="#64748b" /><Text className="text-[8px] text-slate-400 font-bold mt-0.5">Link</Text></TouchableOpacity>
              <TouchableOpacity className="items-center"><AtSign size={18} color="#64748b" /><Text className="text-[8px] text-slate-400 font-bold mt-0.5">Mention</Text></TouchableOpacity>
            </View>
          </View>

          {/* Action buttons */}
          <View className="flex-row items-center justify-end space-x-5 mb-10">
            <TouchableOpacity onPress={handleSaveDraft}>
              <Text className="text-[#134074] font-bold text-sm">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handlePublishPost}
              className="bg-[#134074] px-6 py-2.5 rounded-lg active:bg-[#0f325c]"
            >
              <Text className="text-white font-bold text-sm">Post</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  // RENDER 2: FEED MAIN LIST PAGE
  const renderFeedList = () => {
    return (
      <SafeAreaView className="flex-1 bg-white relative">
        {/* Top Header */}
        <View className="flex-row items-center px-4 py-3 bg-[#E9F0FA] border-b border-blue-100 z-20">
          <TouchableOpacity onPress={onBack} className="p-1.5 -ml-1 mr-3">
            <ArrowLeft size={22} color="#134074" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-[#134074]">Post Management</Text>
        </View>

        <ScrollView className="flex-1 bg-[#F8FAFC]" contentContainerStyle={{ paddingBottom: 110 }}>
          {/* Search bar */}
          <View className="bg-white border border-slate-200 rounded-lg m-3 px-3 py-2 flex-row items-center">
            <Search size={18} color="#94a3b8" className="mr-2" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search posts by title, keyword, or author..."
              placeholderTextColor="#94a3b8"
              className="flex-1 text-slate-800 text-[14px] p-0"
            />
          </View>

          {/* Filter Tags row */}
          <View className="flex-row px-3 mb-3 justify-between">
            <TouchableOpacity
              onPress={() => setActiveFilter('all')}
              className={`flex-1 rounded-lg py-2 border items-center mr-2 ${
                activeFilter === 'all' 
                  ? 'bg-[#134074] border-[#134074]' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text className={`text-xs font-bold ${activeFilter === 'all' ? 'text-white' : 'text-slate-500'}`}>
                All Posts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveFilter('published')}
              className={`flex-1 rounded-lg py-2 border items-center mr-2 ${
                activeFilter === 'published' 
                  ? 'bg-[#134074] border-[#134074]' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text className={`text-xs font-bold ${activeFilter === 'published' ? 'text-white' : 'text-slate-500'}`}>
                Published
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveFilter('draft')}
              className={`flex-1 rounded-lg py-2 border items-center ${
                activeFilter === 'draft' 
                  ? 'bg-[#134074] border-[#134074]' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text className={`text-xs font-bold ${activeFilter === 'draft' ? 'text-white' : 'text-slate-500'}`}>
                Drafts
              </Text>
            </TouchableOpacity>
          </View>

          {/* Post Engagement Summary Block (Only visible on All Posts / Published) */}
          {activeFilter !== 'draft' && (
            <View className="bg-[#134074] m-3 p-5 rounded-2xl shadow-sm relative overflow-hidden">
              <Text className="text-white font-bold text-base mb-1">Post Engagement Summary</Text>
              <Text className="text-blue-100/80 text-[13px] leading-relaxed mb-4">
                Overall post reach has increased by 14.5% this month. Your most active demographic is 'Senior Accountants' based in metropolitan areas.
              </Text>
              <View className="flex-row space-x-8">
                <View>
                  <Text className="text-[#A4E06E] font-extrabold text-xl">4.8k</Text>
                  <Text className="text-blue-100/60 text-[10px] font-bold uppercase mt-0.5">Total Reach</Text>
                </View>
                <View>
                  <Text className="text-[#A4E06E] font-extrabold text-xl">286</Text>
                  <Text className="text-blue-100/60 text-[10px] font-bold uppercase mt-0.5">New Interactions</Text>
                </View>
              </View>
            </View>
          )}

          {/* Cards List */}
          <View className="px-3">
            {filteredPosts.map((post) => {
              const isDraft = post.status === 'draft';
              return (
                <View key={post.id} className="bg-white border border-slate-150 rounded-2xl p-4 mb-3 shadow-sm">
                  {/* Status header */}
                  <View className="flex-row justify-between items-center mb-3">
                    <View className={`rounded px-2.5 py-0.5 ${isDraft ? 'bg-[#D2E4F9]' : 'bg-[#A4E06E]'}`}>
                      <Text className={`text-[10px] font-bold uppercase tracking-wider ${isDraft ? 'text-[#134074]' : 'text-[#2B5713]'}`}>
                        {post.status}
                      </Text>
                    </View>
                    <View className="flex-row items-center space-x-1">
                      {post.isPrivate ? <Lock size={12} color="#94a3b8" /> : <Globe size={12} color="#94a3b8" />}
                      <Text className="text-[11px] text-slate-400 font-semibold uppercase">
                        {post.isPrivate ? 'Private' : 'Public'}
                      </Text>
                    </View>
                  </View>

                  {/* Title & Body */}
                  <Text className="text-base font-bold text-[#134074] mb-1.5">{post.title}</Text>
                  <Text className="text-[13px] text-slate-500 leading-relaxed mb-4">{post.body}</Text>

                  {/* Published Stats */}
                  {!isDraft && (
                    <View className="flex-row justify-between items-center border-y border-slate-50 py-2.5 mb-4">
                      <View className="flex-row items-center space-x-1.5">
                        <Eye size={13} color="#94a3b8" />
                        <Text className="text-[11px] text-slate-500 font-bold">{post.reach}</Text>
                      </View>
                      <View className="flex-row items-center space-x-1.5">
                        <ThumbsUp size={12} color="#94a3b8" />
                        <Text className="text-[11px] text-slate-500 font-bold">{post.likes}</Text>
                      </View>
                      <View className="flex-row items-center space-x-1.5">
                        <MessageSquare size={13} color="#94a3b8" />
                        <Text className="text-[11px] text-slate-500 font-bold">{post.comments}</Text>
                      </View>
                      <View className="flex-row items-center space-x-1.5">
                        <Share2 size={13} color="#94a3b8" />
                        <Text className="text-[11px] text-slate-500 font-bold">{post.shares}</Text>
                      </View>
                    </View>
                  )}

                  {/* Footer actions */}
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        {isDraft ? 'Last Saved' : 'Posted Date'}
                      </Text>
                      <Text className="text-[12px] font-semibold text-slate-800 mt-0.5 italic">
                        {isDraft ? post.lastSaved : post.postedDate}
                      </Text>
                    </View>
                    
                    {/* Action buttons */}
                    <View className="flex-row items-center space-x-4">
                      {isDraft ? (
                        <TouchableOpacity 
                          onPress={() => handleEditPress(post)}
                          className="flex-row items-center space-x-1"
                        >
                          <Text className="text-[#134074] font-bold text-[12px]">Continue Editing</Text>
                          <Text className="text-[#134074] font-bold text-[12px]">→</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity><Info size={16} color="#64748b" /></TouchableOpacity>
                      )}

                      <TouchableOpacity onPress={() => handleEditPress(post)}>
                        <Edit2 size={16} color="#134074" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeletePost(post.id)}>
                        <Trash2 size={16} color="#8A1F1F" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          onPress={handleCreatePress}
          activeOpacity={0.85}
          style={styles.fabButton}
          className="bg-[#70B62C] rounded-full justify-center items-center shadow-lg"
        >
          <Plus size={26} color="white" />
        </TouchableOpacity>

        {/* Bottom Navigation */}
        {!navigation && (
          <View className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center bg-white border-t border-slate-200 py-2.5 z-20">
            <TouchableOpacity className="items-center" onPress={() => onTabPress?.('feed')}>
              <Home size={24} color="#94a3b8" />
              <Text className="text-[10px] mt-0.5 font-medium text-slate-400">Home</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center" onPress={() => onTabPress?.('analytics')}>
              <BarChart3 size={24} color="#94a3b8" />
              <Text className="text-[10px] mt-0.5 font-medium text-slate-400">Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center" onPress={() => onTabPress?.('directory')}>
              <Calendar size={24} color="#94a3b8" />
              <Text className="text-[10px] mt-0.5 font-medium text-slate-400">Events</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center" onPress={() => onTabPress?.('directory')}>
              <Users size={24} color="#94a3b8" />
              <Text className="text-[10px] mt-0.5 font-medium text-slate-400">Directory</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center" onPress={() => onTabPress?.('posts_all')}>
              <FileText size={24} color="#70B62C" />
              <Text className="text-[10px] mt-0.5 font-medium text-[#70B62C]">Post</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  };

  return isEditing ? renderEditor() : renderFeedList();
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

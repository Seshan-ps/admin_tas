import { supabase } from './supabase';
// Initial Mock Data
const initialQueue = [{
  id: 'conn_1',
  user_name: 'Jonathan Sterling, CPA',
  designation: 'Senior Tax Consultant • Midwest Region',
  id_badge: 'ID: 8829-X',
  avatar: require('../../assets/admin_profile.png'),
  viewed: false
}, {
  id: 'conn_2',
  user_name: 'Ann Rose Mari, CPA',
  designation: 'Audit ,Global',
  id_badge: 'ID: 8830-X',
  avatar: require('../../assets/elena_profile.png'),
  viewed: false
}, {
  id: 'conn_3',
  user_name: 'Dom Nick Toretto, CPA',
  designation: 'Tax Consultant • AVM',
  id_badge: 'ID: 8838-X',
  avatar: require('../../assets/admin_profile.png'),
  viewed: false
}];
const initialApproved = [{
  id: 'app1',
  user_name: 'Marcus Kallis',
  designation: 'International Liaison • HQ',
  avatar: require('../../assets/admin_profile.png')
}, {
  id: 'app2',
  user_name: 'Lucas Marv',
  designation: 'Pdq • HQ',
  avatar: require('../../assets/elena_profile.png')
}, {
  id: 'app3',
  user_name: 'Paul Walker',
  designation: 'FandF • Main',
  avatar: require('../../assets/elena_profile.png')
}, {
  id: 'app4',
  user_name: 'Deepak Kumar',
  designation: 'MGM • STA',
  avatar: require('../../assets/admin_profile.png')
}];
const initialEvents = [{
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
  attendees: 192
}];

// Simple Pub-Sub Store
class DbStore {
  queue = [...initialQueue];
  approved = [...initialApproved];
  events = [...initialEvents];
  posts = [{
    id: '1',
    title: 'Annual Fiscal Review: 2023 Highlights',
    body: 'Explore the key findings and growth metrics from the TAS accounting...',
    status: 'published',
    isPrivate: false,
    reach: '1.2k',
    likes: 342,
    comments: 89,
    shares: 12,
    postedDate: 'Oct 24, 2023'
  }, {
    id: '2',
    title: 'Car service Annual',
    body: 'Explore the key findings and growth metrics from the TAS accounting...',
    status: 'published',
    isPrivate: false,
    reach: '5.2k',
    likes: 142,
    comments: 90,
    shares: 12,
    postedDate: 'Oct 14, 2023'
  }, {
    id: '3',
    title: 'Internal Memo: Staff Accreditation',
    body: 'DRAFT: Please review the attached document regarding the 2024...',
    status: 'draft',
    isPrivate: true,
    lastSaved: '2 hours ago'
  }, {
    id: '4',
    title: 'Q3 Financial Guidelines Update',
    body: 'This document outlines the revised reporting standards for all TAS registered members. Please ensure compliance with the updated audit trail requirements. The new measures focus on enhancing digital verification and institutional transparency across our multi-tier accounting frameworks.',
    status: 'draft',
    isPrivate: true,
    lastSaved: '12 hours ago'
  }, {
    id: '5',
    title: 'Tax Reform Analysis Brief',
    body: 'A deep dive into the recent legislative changes regarding international tax credits...',
    status: 'draft',
    isPrivate: true,
    lastSaved: '12 days ago'
  }];
  dms = [
    { id: 'marcus_t', name: 'Marcus Thornton', text: 'Please review the Q4 audit results', time: '2m ago', avatar: require('../../assets/admin_profile.png'), unread: true, viewed: false },
    { id: 'elena', name: 'Elena Rodriguez', text: 'The broadcast for the Annual Gala', time: '15m ago', avatar: require('../../assets/elena_profile.png'), unread: true, viewed: false },
    { id: 'julian', name: 'Julian Vance', text: 'Sent a file: budget_proposal_2024.pdf', time: '1h ago', avatar: require('../../assets/admin_profile.png'), unread: false, viewed: true },
    { id: 'sarah', name: 'Sarah oenkins', text: 'New membership applications are', time: '3h ago', avatar: require('../../assets/elena_profile.png'), unread: true, viewed: false },
    { id: 'david', name: 'David Chen', text: '[Draft] The reconciliation is almost complete...', time: 'Yesterday', avatar: require('../../assets/admin_profile.png'), unread: false, viewed: true },
  ];
  groups = [
    { 
      id: 'tax_ethics', 
      name: 'Tax Ethics & Compliance', 
      category: 'Specialized', 
      badge: 'SPECIALIZED', 
      description: 'Standard-setting body for corporate tax ethics and professional integrity...', 
      member_count: 1248, 
      icon: 'gavel' 
    },
    { 
      id: 'southern_auditors', 
      name: 'Southern Region Auditors', 
      category: 'Regional Chapters', 
      badge: 'REGIONAL', 
      description: 'The primary hub for audit professionals operating in the Southern economic...', 
      member_count: 856, 
      icon: 'location' 
    },
    { 
      id: 'junior_accountants', 
      name: 'Junior Accountants Network', 
      category: 'Public', 
      badge: 'PUBLIC', 
      description: 'A collaborative space for newly qualified CPAs and students to share resources...', 
      member_count: 4102, 
      icon: 'chat' 
    },
    { 
      id: 'audit_integrity', 
      name: 'Audit Integrity Watch', 
      category: 'Confidential', 
      badge: 'CONFIDENTIAL', 
      description: 'Internal monitoring committee focused on cross-referencing regional audit...', 
      member_count: 42, 
      icon: 'shield' 
    }
  ];
  members = [{
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
  }];
  groupPosts = {
    'tax_ethics': [
      {
        id: 'gp_1',
        authorName: 'Elena Rodriguez',
        authorRole: 'SENIOR REGULATORY ANALYST',
        time: '2H AGO',
        avatar: require('../../assets/elena_profile.png'),
        title: 'New SEC Disclosure Requirements: Navigating the 2024 Framework',
        body: "Following the latest briefing, the SEC has introduced rigorous new standards for environmental liability disclosures. This represents a significant shift for firms specializing in industrial audit trails. I've compiled a summary of the ethical implications regarding 'good faith' reporting under the new regime. What are your firms' strategies for ensuring compliance without compromising reporting speed?",
        impactAnalysis: {
          title: 'IMPACT ANALYSIS',
          text: '"The shift from qualitative to quantitative disclosure mandates will require a 40% increase in data audit granularity."'
        },
        likes: 42,
        comments: 18,
        shares: 7,
        bookmarked: false
      },
      {
        id: 'gp_2',
        authorName: 'Marcus Thorne',
        authorRole: 'ETHICS COMMITTEE LEAD',
        time: '5H AGO',
        avatar: require('../../assets/admin_profile.png'),
        title: 'Professional Skepticism in the AI Era',
        body: 'How are we maintaining institutional trust when AI-generated reports are becoming the norm? A thread on the upcoming society whitepaper...',
        tags: ['#AlinAccounting', '#EthicalStandards'],
        likes: 24,
        comments: 8,
        shares: 3,
        bookmarked: false
      }
    ],
    'southern_auditors': [
      {
        id: 'gp_3',
        authorName: 'Julian Vance',
        authorRole: 'CHIEF AUDITOR',
        time: '1D AGO',
        avatar: require('../../assets/admin_profile.png'),
        title: 'Southern Region Audit Schedules - Q3',
        body: 'Please make sure all branch audits are aligned with the new Q3 compliance checkpoints. Contact me directly for schedule adjustments.',
        likes: 12,
        comments: 4,
        shares: 2,
        bookmarked: false
      }
    ]
  };
  messages = {
    'marcus_t': [
      { id: '1', sender: 'them', text: "Please review the Q4 audit results", time: '2m ago' }
    ],
    'elena': [
      { id: '1', sender: 'them', text: "The broadcast for the Annual Gala", time: '15m ago' }
    ],
    'julian': [
      { id: '1', sender: 'them', text: "Sent a file: budget_proposal_2024.pdf", time: '1h ago', document: 'budget_proposal_2024.pdf' }
    ],
    'sarah': [
      { id: '1', sender: 'them', text: "Hi Marcus, I've just uploaded the Q3 Compliance Audit. Could you take a quick look?", time: '10:24 AM' },
      { id: '2', sender: 'me', text: "Thanks Sarah. I'll review it right away. Is there anything specific you're concerned about?", time: '10:26 AM', status: 'READ' },
      { id: '3', sender: 'them', text: "New membership applications are", time: '3h ago' }
    ],
    'david': [
      { id: '1', sender: 'them', text: "[Draft] The reconciliation is almost complete...", time: 'Yesterday' }
    ]
  };
  postsCount = 5; // base initial posts
  listeners = [];
  typingStatus = {};
  totalProfilesCount = null;
  constructor() {
    this.syncWithSupabase();
    this.setupRealtime();
  }
  setupRealtime() {
    try {
      supabase
        .channel('public-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public' },
          (payload) => {
            this.syncWithSupabase();
          }
        )
        .subscribe();
    } catch (e) {}
  }
  getTypingStatus(chatId) {
    return this.typingStatus[chatId] || 'ONLINE';
  }

  // Subscribe to store updates
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  notify() {
    this.listeners.forEach(l => l());
  }

  // Getters
  getQueue() {
    return this.queue;
  }
  getApprovedList() {
    return this.approved;
  }
  getEvents() {
    return this.events;
  }
  getPostsCount() {
    return this.postsCount;
  }
  getPosts() {
    return this.posts;
  }
  setPosts(posts) {
    this.posts = posts;
    this.postsCount = posts.length;
    this.notify();
  }

  // Actions
  async approveConnection(id) {
    const item = this.queue.find(q => q.id === id);
    if (item) {
      const newApproved = {
        id: `app_${Date.now()}`,
        user_name: item.user_name,
        designation: item.designation,
        avatar: item.avatar
      };
      this.approved = [newApproved, ...this.approved];
      this.queue = this.queue.filter(q => q.id !== id);

      // Update Supabase if active
      try {
        await supabase.from('connections_queue').update({
          verification_status: 'approved',
          updated_at: new Date()
        }).eq('id', id);
      } catch (e) {
        // Safe fail
      }
      this.notify();
    }
  }
  async declineConnection(id) {
    this.queue = this.queue.filter(q => q.id !== id);

    // Update Supabase if active
    try {
      await supabase.from('connections_queue').update({
        verification_status: 'declined',
        updated_at: new Date()
      }).eq('id', id);
    } catch (e) {
      // Safe fail
    }
    this.notify();
  }
  async addEvent(event) {
    this.events = [event, ...this.events];
    this.notify();

    try {
      let parsedDate = new Date();
      if (event.date) {
        parsedDate = new Date(event.date);
        if (isNaN(parsedDate.getTime())) {
          parsedDate = new Date();
        }
      }

      await supabase.from('events').insert([{
        title: event.title,
        date: parsedDate.toISOString(),
        start_time: '09:00 AM',
        location: event.location || 'Virtual Session',
        registered_count: event.attendees || 0,
        capacity: 300,
        privacy: 'Members Only',
        description: event.description || ''
      }]);
    } catch (e) {
      console.warn('Failed to insert event into Supabase:', e);
    }
  }
  setPostsCount(count) {
    this.postsCount = count;
    this.notify();
  }
  markQueueItemViewed(id) {
    const item = this.queue.find(q => q.id === id);
    if (item && !item.viewed) {
      item.viewed = true;
      try {
        supabase.from('connections_queue').update({
          warning_flag: 'viewed',
          updated_at: new Date()
        }).eq('id', id);
      } catch (e) {}
      this.notify();
    }
  }
  sharePost(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.shares = (post.shares || 0) + 1;
      try {
        supabase.from('posts').update({
          interaction_count: (post.interaction_count || 0) + 1
        }).eq('id', postId);
      } catch (e) {}
      this.notify();
    }
  }
  getDms() {
    return this.dms;
  }
  getMessages(chatId) {
    return this.messages[chatId] || [];
  }
  async addMessage(chatId, msg) {
    if (!this.messages[chatId]) {
      this.messages[chatId] = [];
    }
    // Set default status to SENT if not provided
    if (!msg.status) {
      msg.status = 'SENT';
    }
    this.messages[chatId].push(msg);

    // Update preview in the DMs list
    const dm = this.dms.find(d => d.id === chatId);
    if (dm) {
      dm.text = msg.text || (msg.sharedPost ? "🔗 Shared a post" : msg.image ? "📷 Shared a photo" : "📄 Shared a document");
      dm.time = msg.time;
      if (msg.sender === 'me') {
        dm.unread = false;
        dm.viewed = true;
      } else {
        dm.unread = true;
        dm.viewed = false;
      }
    }

    // DB sync: update or insert messages
    try {
      await supabase.from('messages').insert([{
        id: msg.id,
        chat_id: chatId,
        sender: msg.sender,
        text: msg.text || null,
        time: msg.time,
        image_url: msg.image || null,
        document_url: msg.document || null,
        shared_post_id: msg.sharedPost?.id || null,
        status: msg.status
      }]);
    } catch(e) {}

    // DB sync: update DMs status
    try {
      await supabase.from('dms').update({
        last_text: dm.text,
        last_time: dm.time,
        unread: dm.unread,
        viewed: dm.viewed
      }).eq('id', chatId);
    } catch (e) {}

    this.notify();

    // Simulating WhatsApp visual and reply interaction if message was sent by me
    if (msg.sender === 'me') {
      // 1. Ticks turn blue (READ) after 1.8 seconds
      setTimeout(async () => {
        const foundMsg = this.messages[chatId]?.find(m => m.id === msg.id);
        if (foundMsg && foundMsg.status === 'SENT') {
          foundMsg.status = 'READ';
          try {
            await supabase.from('messages').update({
              status: 'READ'
            }).eq('id', msg.id);
          } catch(e) {}
          this.notify();
        }
      }, 1800);

      // 2. typing status begins after 0.8 seconds
      setTimeout(() => {
        this.typingStatus[chatId] = 'typing...';
        this.notify();
      }, 800);

      // 3. deliver response & reset status to ONLINE after 3.0 seconds
      setTimeout(async () => {
        this.typingStatus[chatId] = 'ONLINE';

        // Generate friendly context-aware automated response
        let botText = "Got it! I will review the audit reports and get back to you shortly.";
        if (msg.text) {
          const lowerText = msg.text.toLowerCase();
          if (lowerText.includes('audit')) {
            botText = "Reconciling the audit trails right now. Everything seems intact.";
          } else if (lowerText.includes('share') || lowerText.includes('post') || lowerText.includes('guidelines')) {
            botText = "Thanks for sharing this guidelines post! I will ensure our team reviews it.";
          } else if (lowerText.includes('hi') || lowerText.includes('hello')) {
            botText = `Hello! Hope you are having a productive day. How can I assist you with the accounts?`;
          } else if (lowerText.includes('omg')) {
            botText = "Yes, it is indeed a critical transition phase!";
          }
        } else if (msg.sharedPost) {
          botText = `Interesting post about "${msg.sharedPost.title || 'the updates'}". Let's schedule a call to discuss.`;
        } else if (msg.image) {
          botText = "Got the image. Pushing it to the verification logs.";
        } else if (msg.document) {
          botText = `Received document: ${msg.document}. I'll archive it in the secure repository.`;
        }

        const replyMsg = {
          id: `msg_reply_${Date.now()}`,
          sender: 'them',
          text: botText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'READ'
        };

        if (!this.messages[chatId]) {
          this.messages[chatId] = [];
        }
        this.messages[chatId].push(replyMsg);

        const activeDm = this.dms.find(d => d.id === chatId);
        if (activeDm) {
          activeDm.text = botText;
          activeDm.time = replyMsg.time;
          activeDm.unread = true;
          activeDm.viewed = false;
        }

        try {
          await supabase.from('messages').insert([{
            id: replyMsg.id,
            chat_id: chatId,
            sender: 'them',
            text: replyMsg.text,
            time: replyMsg.time,
            status: 'READ'
          }]);
        } catch (e) {}

        try {
          await supabase.from('dms').update({
            last_text: botText,
            last_time: replyMsg.time,
            unread: true,
            viewed: false
          }).eq('id', chatId);
        } catch (e) {}

        this.notify();
      }, 3000);
    }
  }
  async deleteMessage(chatId, msgId) {
    if (this.messages[chatId]) {
      this.messages[chatId] = this.messages[chatId].filter(m => m.id !== msgId);
      const dm = this.dms.find(d => d.id === chatId);
      if (dm) {
        if (this.messages[chatId].length > 0) {
          const lastMsg = this.messages[chatId][this.messages[chatId].length - 1];
          dm.text = lastMsg.text || (lastMsg.sharedPost ? "🔗 Shared a post" : lastMsg.image ? "📷 Shared a photo" : "📄 Shared a document");
          dm.time = lastMsg.time;
        } else {
          dm.text = "No messages";
        }
        try {
          await supabase.from('dms').update({
            last_text: dm.text,
            last_time: dm.time
          }).eq('id', chatId);
        } catch (e) {}
      }
      try {
        await supabase.from('messages').delete().eq('id', msgId);
      } catch (e) {}
      this.notify();
    }
  }
  async markDmAsRead(id) {
    const dm = this.dms.find(d => d.id === id);
    if (dm && (dm.unread || !dm.viewed)) {
      dm.unread = false;
      dm.viewed = true;
      try {
        await supabase.from('dms').update({
          unread: false,
          viewed: true
        }).eq('id', id);
      } catch (e) {}

      // Update all incoming messages in this DM to READ in both local store and Supabase
      const chatMsgs = this.messages[id] || [];
      let updatedCount = 0;
      chatMsgs.forEach(m => {
        if (m.sender === 'them' && m.status !== 'READ') {
          m.status = 'READ';
          updatedCount++;
        }
      });

      if (updatedCount > 0) {
        try {
          await supabase.from('messages').update({
            status: 'READ'
          }).eq('chat_id', id).eq('sender', 'them');
        } catch(e) {}
      }

      this.notify();
    }
  }
  async updateDmText(id, text, time) {
    const dm = this.dms.find(d => d.id === id);
    if (dm) {
      dm.text = text;
      dm.time = time;
      try {
        await supabase.from('dms').update({
          last_text: text,
          last_time: time
        }).eq('id', id);
      } catch (e) {}
      this.notify();
    }
  }

  // Calculate dynamic analytics based on the connection approvals
  getAnalytics() {
    const approvedCount = this.approved.length - initialApproved.length; // number of newly approved items

    // Use profiles count from DB if available, otherwise fallback
    const totalActiveMembers = this.totalProfilesCount ? this.totalProfilesCount : (4200 + approvedCount * 100);
    const totalMembersText = totalActiveMembers >= 1000 
      ? `${(totalActiveMembers / 1000).toFixed(1)}k` 
      : `${totalActiveMembers}`;

    // General Analysis metrics
    const revenueVal = 85 + approvedCount * 12; // e.g. increases by ₹12k per approved user

    // Sum registrations dynamically from the events list
    const eventRegistrationsVal = this.events.reduce((sum, e) => sum + e.attendees, 0);

    // Memberships Analysis metrics
    const activeMembershipsVal = 15000 + approvedCount;
    const membershipRevenueVal = 428500 + approvedCount * 3500; // e.g. increases by $3500 per approved user
    const conversionRateVal = 24.8 + approvedCount * 0.4;
    const newSalesVal = 142 + approvedCount;

    // Membership tier distribution calculations
    const platinumFellowPct = Math.round(40 + approvedCount * 0.2);
    const seniorAssociatePct = Math.round(25 + approvedCount * 0.1);
    const associatePct = Math.round(20 - approvedCount * 0.1);
    const studentPct = 100 - (platinumFellowPct + seniorAssociatePct + associatePct);
    return {
      totalMembers: totalMembersText,
      revenue: `₹${revenueVal}k`,
      eventRegistrations: eventRegistrationsVal,
      activeMemberships: activeMembershipsVal.toLocaleString(),
      membershipRevenue: `$${membershipRevenueVal.toLocaleString()}`,
      conversionRate: `${conversionRateVal.toFixed(1)}%`,
      newSales: newSalesVal,
      distribution: {
        platinum: platinumFellowPct,
        senior: seniorAssociatePct,
        associate: associatePct,
        student: studentPct
      }
    };
  }

  // Attempt to sync and fetch initial database rows from Supabase
  async syncWithSupabase() {
    try {
      // Fetch profiles from Supabase and sync members
      try {
        const { data: profilesData } = await supabase.from('profiles').select('*');
        if (profilesData && profilesData.length > 0) {
          this.totalProfilesCount = profilesData.length;
          this.members = profilesData.map(p => {
            let avatarSource;
            if (p.avatar_url) {
              if (p.avatar_url.startsWith('http') || p.avatar_url.startsWith('file://') || p.avatar_url.startsWith('content://')) {
                avatarSource = { uri: p.avatar_url };
              } else if (p.avatar_url === 'admin_profile.png') {
                avatarSource = require('../../assets/admin_profile.png');
              } else if (p.avatar_url === 'elena_profile.png') {
                avatarSource = require('../../assets/elena_profile.png');
              } else if (p.avatar_url === 'logo_icon.png') {
                avatarSource = require('../../assets/logo_icon.png');
              } else {
                avatarSource = { uri: p.avatar_url };
              }
            } else {
              avatarSource = require('../../assets/admin_profile.png');
            }

            return {
              id: p.id,
              name: p.full_name || p.username || 'Unnamed Member',
              designation: p.department || 'Member',
              company: p.department || 'TAS Society',
              memberId: p.employee_id || `TAS-${p.id.slice(0, 4)}`,
              tier: p.access_level || 'ASSOCIATE',
              tierLabel: p.access_level === 'PLATINUM' ? 'Platinum Member' : p.access_level === 'SENIOR' ? 'Senior Fellow' : 'Associate',
              avatar: avatarSource,
              hasGreenBorder: p.access_level === 'PLATINUM',
              email: p.email
            };
          });
        } else {
          // Pre-populate Supabase profiles if empty
          const profilesToInsert = this.members.map((m, idx) => {
            let avatarStr = '';
            if (m.avatar) {
              if (typeof m.avatar === 'number') {
                avatarStr = m.avatar === require('../../assets/elena_profile.png') ? 'elena_profile.png' : 'admin_profile.png';
              } else if (m.avatar.uri) {
                avatarStr = m.avatar.uri;
              }
            }
            return {
              username: m.name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + idx,
              full_name: m.name,
              employee_id: m.memberId,
              email: m.email || `${m.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@tas-governance.org`,
              department: m.company || m.designation,
              access_level: m.tier || 'ASSOCIATE',
              avatar_url: avatarStr,
              status: 'active'
            };
          });
          await supabase.from('profiles').insert(profilesToInsert);
        }
      } catch (e) {
        console.warn('Profiles sync failed:', e);
      }

      // Fetch events from Supabase if table exists
      try {
        const { data: eventsData } = await supabase.from('events').select('*');
        if (eventsData && eventsData.length > 0) {
          this.events = eventsData.map(e => ({
            id: e.id,
            title: e.title,
            date: new Date(e.date).toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
            location: e.location || 'Virtual Session',
            attendees: e.registered_count || 0
          }));
        }
      } catch (e) {}

      // Try to fetch posts count from Supabase
      const {
        count
      } = await supabase.from('posts').select('*', {
        count: 'exact',
        head: true
      });
      if (count !== null && count !== undefined) {
        this.postsCount = count;
      }

      // Try to fetch connection approvals count to adjust local state
      const {
        data: queueData
      } = await supabase.from('connections_queue').select('*, profiles(full_name, department)');
      if (queueData) {
        // Sync queue items
        const pending = queueData.filter(q => q.verification_status === 'pending');
        if (pending.length > 0) {
          this.queue = pending.map(item => ({
            id: item.id,
            user_name: item.profiles?.full_name || 'Anonymous User',
            designation: item.profiles?.department || 'Member Request',
            id_badge: `ID: ${item.id.slice(0, 4)}-X`,
            avatar: require('../../assets/admin_profile.png'),
            viewed: item.warning_flag === 'viewed'
          }));
        }
        const approved = queueData.filter(q => q.verification_status === 'approved');
        if (approved.length > 0) {
          const syncedApproved = approved.map(item => ({
            id: item.id,
            user_name: item.profiles?.full_name || 'Approved Member',
            designation: item.profiles?.department || 'Verified',
            avatar: require('../../assets/admin_profile.png')
          }));
          this.approved = [...syncedApproved, ...initialApproved];
        }
      }

      // Try to fetch direct messages from Supabase
      try {
        const { data: dmsData } = await supabase.from('dms').select('*');
        if (dmsData && dmsData.length > 0) {
          this.dms = dmsData.map(d => ({
            id: d.id,
            name: d.name,
            text: d.last_text || d.text,
            time: d.last_time || d.time,
            avatar: d.avatar_url ? { uri: d.avatar_url } : require('../../assets/elena_profile.png'),
            unread: d.unread,
            viewed: d.viewed
          }));
        }
      } catch (e) {}

      // Try to fetch messages from Supabase
      try {
        const { data: msgsData } = await supabase.from('messages').select('*').order('time', { ascending: true });
        if (msgsData && msgsData.length > 0) {
          const grouped = {};
          msgsData.forEach(m => {
            if (!grouped[m.chat_id]) grouped[m.chat_id] = [];
            
            let sharedPostObj = null;
            if (m.shared_post_id) {
              const foundPost = this.posts.find(p => p.id === m.shared_post_id);
              if (foundPost) {
                sharedPostObj = {
                  id: foundPost.id,
                  authorName: 'Admin TAS',
                  title: foundPost.title,
                  body: foundPost.body,
                  image: foundPost.image
                };
              }
            }
            grouped[m.chat_id].push({
              id: m.id || `msg_${Date.now()}_${Math.random()}`,
              sender: m.sender,
              text: m.text,
              time: m.time,
              status: m.sender === 'me' ? 'READ' : undefined,
              image: m.image_url || undefined,
              document: m.document_url || undefined,
              sharedPost: sharedPostObj || undefined
            });
          });
          this.messages = { ...this.messages, ...grouped };
        }
      } catch (e) {}
      this.notify();
    } catch (e) {
      // Ignore sync error and stay on mock data
    }
  }
  getGroups() {
    return this.groups;
  }
  getMembers() {
    return this.members;
  }
  async updateMember(memberId, updatedFields) {
    this.members = this.members.map(m => 
      (m.id === memberId || m.memberId === memberId) 
        ? { ...m, ...updatedFields } 
        : m
    );
    this.notify();

    try {
      const member = this.members.find(m => m.id === memberId || m.memberId === memberId);
      if (member) {
        let avatarUrlStr = '';
        if (member.avatar) {
          if (typeof member.avatar === 'number') {
            avatarUrlStr = member.avatar === require('../../assets/elena_profile.png') ? 'elena_profile.png' : 'admin_profile.png';
          } else if (member.avatar.uri) {
            avatarUrlStr = member.avatar.uri;
          }
        }

        const updateData = {
          full_name: member.name,
          department: member.company || member.designation,
          avatar_url: avatarUrlStr,
          access_level: member.tier || 'ASSOCIATE',
          employee_id: member.memberId
        };

        let query = supabase.from('profiles').update(updateData);
        if (member.id && member.id.length > 8 && member.id.includes('-')) {
          await query.eq('id', member.id);
        } else {
          await query.eq('employee_id', member.memberId);
        }
      }
    } catch (e) {
      console.warn('Failed to update member in Supabase:', e);
    }
  }
  async deleteMember(memberId) {
    this.members = this.members.filter(m => m.id !== memberId && m.memberId !== memberId);
    this.notify();

    try {
      let query = supabase.from('profiles').delete();
      if (memberId && memberId.length > 8 && memberId.includes('-')) {
        await query.eq('id', memberId);
      } else {
        await query.eq('employee_id', memberId);
      }
    } catch (e) {
      console.warn('Failed to delete member in Supabase:', e);
    }
  }
  getGroupPosts(groupId) {
    return this.groupPosts[groupId] || [];
  }
  addGroupPost(groupId, post) {
    if (!this.groupPosts[groupId]) {
      this.groupPosts[groupId] = [];
    }
    this.groupPosts[groupId].unshift(post);
    this.notify();
  }
  likeGroupPost(groupId, postId) {
    const posts = this.groupPosts[groupId] || [];
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
      this.notify();
    }
  }
  bookmarkGroupPost(groupId, postId) {
    const posts = this.groupPosts[groupId] || [];
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.bookmarked = !post.bookmarked;
      this.notify();
    }
  }
}
export const dbStore = new DbStore();

import { supabase } from './supabase';
// Initial Mock Data
const initialQueue = [{
  id: 'conn_1',
  user_name: 'Jonathan Sterling, CPA',
  designation: 'Senior Tax Consultant • Midwest Region',
  id_badge: 'ID: 8829-X',
  avatar: require('../../assets/admin_profile.png')
}, {
  id: 'conn_2',
  user_name: 'Ann Rose Mari, CPA',
  designation: 'Audit ,Global',
  id_badge: 'ID: 8830-X',
  avatar: require('../../assets/elena_profile.png')
}, {
  id: 'conn_3',
  user_name: 'Dom Nick Toretto, CPA',
  designation: 'Tax Consultant • AVM',
  id_badge: 'ID: 8838-X',
  avatar: require('../../assets/admin_profile.png')
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
  postsCount = 5; // base initial posts
  listeners = [];
  constructor() {
    this.syncWithSupabase();
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
  addEvent(event) {
    this.events = [event, ...this.events];
    this.notify();
  }
  setPostsCount(count) {
    this.postsCount = count;
    this.notify();
  }

  // Calculate dynamic analytics based on the connection approvals
  getAnalytics() {
    const approvedCount = this.approved.length - initialApproved.length; // number of newly approved items

    // General Analysis metrics
    const totalMembersVal = 4.2 + approvedCount * 0.1; // e.g. increases by 0.1k per approved user
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
      totalMembers: `${totalMembersVal.toFixed(1)}k`,
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
            avatar: require('../../assets/admin_profile.png')
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
      this.notify();
    } catch (e) {
      // Ignore sync error and stay on mock data
    }
  }
}
export const dbStore = new DbStore();

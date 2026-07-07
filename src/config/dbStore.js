import { supabase } from './supabase';
// Initial Mock Data
const initialQueue = [{
  id: 'conn_1',
  user_name: 'sanjay_r',
  full_name: 'Sanjay Ramasamy, CPA',
  phone: '+91 98401 23456',
  dob: '12/04/1988',
  gender: 'Male',
  email: 'sanjay.ramasamy@chennaifinance.in',
  membership_plan: 'Premium',
  designation: 'Senior Tax Consultant • Chennai Region',
  id_badge: 'ID: 8829-X',
  avatar: require('../../assets/admin_profile.png'),
  viewed: false
}, {
  id: 'conn_2',
  user_name: 'priya_r',
  full_name: 'Priya Raman, CPA',
  phone: '+91 94441 23456',
  dob: '24/08/1993',
  gender: 'Female',
  email: 'priya.raman@bangaloreaudits.co.in',
  membership_plan: 'Lifetime',
  designation: 'Audit Director • Bengaluru Office',
  id_badge: 'ID: 8830-X',
  avatar: require('../../assets/elena_profile.png'),
  viewed: false
}, {
  id: 'conn_3',
  user_name: 'karthik_s',
  full_name: 'Karthik Subramanian, CPA',
  phone: '+91 97901 23456',
  dob: '18/09/1985',
  gender: 'Male',
  email: 'karthik.sub@maduraitax.org',
  membership_plan: 'Professional',
  designation: 'Forensic Accountant • Madurai Associates',
  id_badge: 'ID: 8838-X',
  avatar: require('../../assets/admin_profile.png'),
  viewed: false
}, {
  id: 'conn_4',
  user_name: 'aditya_s',
  full_name: 'Aditya Sundaram, CPA',
  phone: '+91 98405 12345',
  dob: '15/05/1992',
  gender: 'Male',
  email: 'aditya.sundaram@chennaifinance.in',
  membership_plan: 'Professional',
  designation: 'Audit Manager • Chennai Hub',
  id_badge: 'ID: 9012-X',
  avatar: require('../../assets/admin_profile.png'),
  viewed: false
}, {
  id: 'conn_5',
  user_name: 'kavitha_k',
  full_name: 'Kavitha Krishnan',
  phone: '+91 94440 67890',
  dob: '22/10/1994',
  gender: 'Female',
  email: 'kavitha.krishnan@bangaloreaudits.co.in',
  membership_plan: 'Premium',
  designation: 'Tax Consultant • Bengaluru Branch',
  id_badge: 'ID: 9013-X',
  avatar: require('../../assets/elena_profile.png'),
  viewed: false
}, {
  id: 'conn_6',
  user_name: 'hari_s',
  full_name: 'Hariharan Srinivasan',
  phone: '+91 97909 54321',
  dob: '08/12/1989',
  gender: 'Male',
  email: 'hari.srinivasan@hyderabadtax.org',
  membership_plan: 'Lifetime',
  designation: 'Partner • Hyderabad Head Office',
  id_badge: 'ID: 9014-X',
  avatar: require('../../assets/admin_profile.png'),
  viewed: false
}, {
  id: 'conn_7',
  user_name: 'meena_v',
  full_name: 'Meenakshi Venkat',
  phone: '+91 98840 98765',
  dob: '03/04/1996',
  gender: 'Female',
  email: 'meena.venkat@coimbatorefin.com',
  membership_plan: 'Basic',
  designation: 'Junior Auditor • Coimbatore Branch',
  id_badge: 'ID: 9015-X',
  avatar: require('../../assets/elena_profile.png'),
  viewed: false
}, {
  id: 'conn_8',
  user_name: 'balaji_n',
  full_name: 'Balaji Natarajan',
  phone: '+91 98412 34567',
  dob: '05/11/1990',
  gender: 'Male',
  email: 'balaji.natarajan@chennaifinance.in',
  membership_plan: 'Basic',
  designation: 'Junior Accountant • Chennai Hub',
  id_badge: 'ID: 9016-X',
  avatar: require('../../assets/admin_profile.png'),
  viewed: false
}, {
  id: 'conn_9',
  user_name: 'swetha_m',
  full_name: 'Swetha Murali',
  phone: '+91 94451 98765',
  dob: '14/02/1995',
  gender: 'Female',
  email: 'swetha.murali@bangaloreaudits.co.in',
  membership_plan: 'Professional',
  designation: 'Tax Auditor • Bengaluru Office',
  id_badge: 'ID: 9017-X',
  avatar: require('../../assets/elena_profile.png'),
  viewed: false
}, {
  id: 'conn_10',
  user_name: 'ramesh_t',
  full_name: 'Ramesh Tanguturi',
  phone: '+91 97910 87654',
  dob: '29/07/1987',
  gender: 'Male',
  email: 'ramesh.t@hyderabadtax.org',
  membership_plan: 'Premium',
  designation: 'Senior Audit Manager • Hyderabad Branch',
  id_badge: 'ID: 9018-X',
  avatar: require('../../assets/admin_profile.png'),
  viewed: false
}, {
  id: 'conn_11',
  user_name: 'ananya_s',
  full_name: 'Ananya Srinivasan',
  phone: '+91 98841 23450',
  dob: '10/10/1991',
  gender: 'Female',
  email: 'ananya.srinivasan@coimbatorefin.com',
  membership_plan: 'Lifetime',
  designation: 'Audit Director • Coimbatore Hub',
  id_badge: 'ID: 9019-X',
  avatar: require('../../assets/elena_profile.png'),
  viewed: false
}, {
  id: 'conn_12',
  user_name: 'senthil_k',
  full_name: 'Senthil Kumar, CPA',
  phone: '+91 98402 87654',
  dob: '03/03/1983',
  gender: 'Male',
  email: 'senthil.kumar@maduraitax.org',
  membership_plan: 'Premium',
  designation: 'Chief Tax Consultant • Madurai Region',
  id_badge: 'ID: 9020-X',
  avatar: require('../../assets/admin_profile.png'),
  viewed: false
}, {
  id: 'conn_13',
  user_name: 'divya_n',
  full_name: 'Divya Nair',
  phone: '+91 94443 12345',
  dob: '18/06/1994',
  gender: 'Female',
  email: 'divya.nair@kochiaudits.com',
  membership_plan: 'Basic',
  designation: 'Junior Tax Analyst • Kochi Office',
  id_badge: 'ID: 9021-X',
  avatar: require('../../assets/elena_profile.png'),
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
const initialEvents = [
  {
    id: 'e1',
    title: 'Tax Ethics Round-Table',
    date: 'OCT 14, 2026',
    location: 'Virtual Session',
    attendees: 148,
    capacity: 300,
    description: 'This event brings together taxation professionals, regulators, and industry leaders to discuss regulatory policies and audit automation trends.'
  },
  {
    id: 'e2',
    title: 'Annual Society Gala',
    date: 'OCT 22, 2026',
    location: 'Grand Ballroom, City Center',
    attendees: 192,
    capacity: 400,
    description: 'An elegant evening celebrating professional achievements and industry collaboration within our tax association.'
  },
  {
    id: 'e3',
    title: 'GST Audit Automation Seminar',
    date: 'JUL 18, 2026',
    location: 'Convention Hall & Virtual',
    attendees: 215,
    capacity: 500,
    description: 'Learn about the latest GST audit automated systems, API interfaces, and direct filing reconciliation frameworks.'
  },
  {
    id: 'e4',
    title: 'Corporate Tax Compliance Summit',
    date: 'AUG 05, 2026',
    location: 'Finance Hub Auditorium',
    attendees: 110,
    capacity: 200,
    description: 'A detailed overview of modern corporate tax audit mandates and compliance structures for global enterprises.'
  },
  {
    id: 'e5',
    title: 'International Tax Treaty Forum',
    date: 'SEP 12, 2026',
    location: 'Virtual Session',
    attendees: 75,
    capacity: 150,
    description: 'Focusing on double tax avoidance agreements (DTAA), multilateral instruments, and global transfer pricing frameworks.'
  },
  {
    id: 'e6',
    title: 'Q1 Financial Reporting Workshop',
    date: 'APR 10, 2026',
    location: 'TAS Training Center',
    attendees: 95,
    capacity: 100,
    description: 'Hands-on training session covering advanced quarterly financial reporting guidelines and audit preparation steps.'
  },
  {
    id: 'e7',
    title: 'FY2025 Tax Planning Forum',
    date: 'MAY 15, 2026',
    location: 'Virtual Session',
    attendees: 340,
    capacity: 400,
    description: 'Our annual tax planning framework overview covering standard deductions, tax credits, and changes in corporate codes.'
  },
  {
    id: 'e8',
    title: 'TAS Audit Standards Seminar',
    date: 'MAR 12, 2026',
    location: 'Conference Hall B',
    attendees: 80,
    capacity: 150,
    description: 'Annual review of regional auditing standards harmonization and compliance procedures.'
  },
  {
    id: 'e9',
    title: 'GST Return Filing Workshop',
    date: 'FEB 28, 2026',
    location: 'Virtual Session',
    attendees: 250,
    capacity: 300,
    description: 'Step-by-step practical session on filing quarterly GST returns and resolving reconciliation issues.'
  }
];


// Simple Pub-Sub Store
class DbStore {
  queue = [...initialQueue];
  approved = [...initialApproved];
  events = [...initialEvents];
  posts = [{
    id: '1',
    title: 'Annual Fiscal Review: 2023 Highlights',
    body: 'Explore the key findings and growth metrics from the TAS accounting network.',
    status: 'published',
    isPrivate: false,
    reach: '1.2k',
    likes: 342,
    comments: 89,
    shares: 12,
    postedDate: 'Oct 24, 2023',
    commentsList: []
  }, {
    id: '2',
    title: 'Car service Annual Guidelines',
    body: 'Centralized rules regarding company vehicle provisioning and fuel auditing standards for fiscal year 2024.',
    status: 'published',
    isPrivate: false,
    reach: '5.2k',
    likes: 142,
    comments: 90,
    shares: 12,
    postedDate: 'Oct 14, 2023',
    commentsList: []
  }, {
    id: '3',
    title: 'Internal Memo: Staff Accreditation',
    body: 'DRAFT: Please review the attached document regarding the 2024...',
    status: 'draft',
    isPrivate: true,
    lastSaved: '2 hours ago',
    commentsList: []
  }, {
    id: '4',
    title: 'Q3 Financial Guidelines Update',
    body: 'This document outlines the revised reporting standards for all TAS registered members. Please ensure compliance with the updated audit trail requirements. The new measures focus on enhancing digital verification and institutional transparency across our multi-tier accounting frameworks.',
    status: 'draft',
    isPrivate: true,
    lastSaved: '12 hours ago',
    commentsList: []
  }, {
    id: '5',
    title: 'Tax Reform Analysis Brief',
    body: 'A deep dive into the recent legislative changes regarding international tax credits...',
    status: 'draft',
    isPrivate: true,
    lastSaved: '12 days ago',
    commentsList: []
  }, {
    id: '6',
    title: 'Regional Auditing Standards Harmonization',
    body: 'Following the TAS annual summit, the board has approved the new harmonization policy for regional audits. All regional offices must adopt the unified template starting July 1st. Read the full compliance circular in the resources folder.',
    status: 'published',
    isPrivate: false,
    reach: '2.5k',
    likes: 114,
    comments: 28,
    shares: 5,
    postedDate: 'May 12, 2026',
    commentsList: []
  }, {
    id: '7',
    title: 'Welcome New Board Members',
    body: 'We are thrilled to welcome our newly elected board members for the 2026-2027 fiscal term. Their combined expertise in international taxation and digital fraud auditing will guide TAS through our next phase of expansion.',
    status: 'published',
    isPrivate: false,
    reach: '3.1k',
    likes: 198,
    comments: 2,
    shares: 9,
    postedDate: 'Jun 05, 2026',
    commentsList: [
      {
        id: 'c7_1',
        authorName: 'Dr. Alistair Vance',
        avatar: require('../../assets/admin_profile.png'),
        timestamp: '2d ago',
        content: 'A warm welcome to the new members. Exciting times ahead for the TAS board!',
        likesCount: 12,
        isLiked: false
      },
      {
        id: 'c7_2',
        authorName: 'Elena Rodriguez',
        avatar: require('../../assets/elena_profile.png'),
        timestamp: '1d ago',
        content: 'Looking forward to working together on the upcoming compliance frameworks.',
        likesCount: 8,
        isLiked: false
      }
    ]
  }, {
    id: '8',
    title: 'Upcoming Administrative Server Maintenance',
    body: 'Please note that the central TAS administrative portal will undergo scheduled security updates and database optimization on Sunday, June 21st, between 02:00 and 06:00 UTC. Some features may be temporarily offline during this period.',
    status: 'published',
    isPrivate: true,
    reach: '900',
    likes: 15,
    comments: 3,
    shares: 0,
    postedDate: 'Just now',
    commentsList: [
      {
        id: 'c8_1',
        authorName: 'Elena Rodriguez',
        avatar: require('../../assets/elena_profile.png'),
        timestamp: '2h ago',
        content: 'Is there any database downtime expected during this period?',
        likesCount: 5,
        isLiked: false
      },
      {
        id: 'c8_2',
        authorName: 'Sarah Jenkins',
        avatar: require('../../assets/elena_profile.png'),
        timestamp: '1h ago',
        content: 'Thanks for the heads up! I will let my audit team know to wrap up entries early.',
        likesCount: 3,
        isLiked: false
      },
      {
        id: 'c8_3',
        authorName: 'Jameson Thorne',
        avatar: require('../../assets/admin_profile.png'),
        timestamp: '30m ago',
        content: 'Will secure VPN logins be affected by the maintenance window?',
        likesCount: 2,
        isLiked: false
      }
    ]
  }];
  dms = [
    {
      id: 'sanjay_r',
      name: 'Sanjay Ramasamy',
      text: 'I just sent you the updated reconciliation...',
      time: '2:06 PM',
      unread: true,
      viewed: false,
      online: true,
      initials: 'SR',
      initialsBg: '#E2FBE8',
      initialsColor: '#0D3866',
      avatar: null
    },
    {
      id: 'ram_k',
      name: 'Ram Kumar',
      text: "Sounds good! Let me know when you're ...",
      time: '2:07 PM',
      unread: false,
      viewed: true,
      online: false,
      initials: 'RK',
      initialsBg: '#FFF7ED',
      initialsColor: '#0D3866',
      avatar: null
    },
    {
      id: 'sanjeev_s',
      name: 'Sanjeev Senthil',
      text: 'I just sent you the updated reconciliation...',
      time: '2:07 PM',
      unread: true,
      viewed: false,
      online: true,
      initials: 'SS',
      initialsBg: '#F5F3FF',
      initialsColor: '#0D3866',
      avatar: null
    }
  ];
  groups = [
    {
      id: 'tc_announcements',
      name: 'Announcements',
      category: 'TAX COMPLIANCE & AUDIT NETWORK',
      categoryMembers: '4 Members',
      categoryBg: '#E8EAF6',
      icon: 'megaphone',
      iconBg: '#E8F5E9',
      iconColor: '#4CAF50',
      lastUser: 'Pradeep Raj',
      text: 'Pradeep Raj: Are we meeting offline today fo...',
      time: '14:32',
      unreadCount: 1,
    },
    {
      id: 'tc_corporate',
      name: 'Corporate Tax Auditing',
      category: 'TAX COMPLIANCE & AUDIT NETWORK',
      categoryMembers: '4 Members',
      categoryBg: '#E8EAF6',
      icon: 'user',
      iconBg: '#FFF8E1',
      iconColor: '#FFB300',
      lastUser: 'Sanjeev Senthil',
      text: 'Sanjeev Senthil: Guys, are the Q4 tax s...',
      time: '26/03/2026',
      unreadCount: 3,
    },
    {
      id: 'tc_gst',
      name: 'GST & Indirect Tax Reforms',
      category: 'TAX COMPLIANCE & AUDIT NETWORK',
      categoryMembers: '4 Members',
      categoryBg: '#E8EAF6',
      icon: 'user',
      iconBg: '#F3E5F5',
      iconColor: '#8E24AA',
      lastUser: 'Sanjeev Senthil',
      text: "Sanjeev Senthil: Guys I'm going to clos...",
      time: '17/03/2026',
      unreadCount: 0,
    },
    {
      id: 'itc_announcements',
      name: 'Announcements',
      category: 'INTERNATIONAL TAXATION COUNCIL',
      categoryMembers: '3 Members',
      categoryBg: '#E8F5E9',
      icon: 'megaphone',
      iconBg: '#E8F5E9',
      iconColor: '#4CAF50',
      lastUser: 'Priya Mani',
      text: 'Priya Mani published "OECD guidelines...',
      time: '28/03/2026',
      unreadCount: 0,
    },
    {
      id: 'itc_transfer',
      name: 'Cross-Border Transfer Pricing',
      category: 'INTERNATIONAL TAXATION COUNCIL',
      categoryMembers: '3 Members',
      categoryBg: '#E8F5E9',
      icon: 'user',
      iconBg: '#FFEBEE',
      iconColor: '#E53935',
      lastUser: 'Tamil Selvan',
      text: 'Tamil Selvan: Thanks for the tax heads...',
      time: '28/03/2026',
      unreadCount: 0,
    }
  ];
  communityMembers = {
    'TAX COMPLIANCE & AUDIT NETWORK': ['m1', 'm2', 'm3', 'm4'],
    'INTERNATIONAL TAXATION COUNCIL': ['m2', 'm5', 'm6']
  };
  members = [
    {
      id: 'm1',
      name: 'Ramesh Krishnan, CPA',
      designation: 'Chief Tax Consultant',
      company: 'Chennai Finance Partners',
      memberId: 'TAS-2026-CH01',
      tier: 'Premium',
      tierLabel: 'Premium Member',
      avatar: require('../../assets/admin_profile.png'),
      hasGreenBorder: true,
      email: 'ramesh.krishnan@tas-governance.org'
    },
    {
      id: 'm2',
      name: 'Priya Sundaram',
      designation: 'Senior Audit Partner',
      company: 'Bengaluru Audits Ltd.',
      memberId: 'TAS-2026-BL02',
      tier: 'Lifetime',
      tierLabel: 'Lifetime Fellow',
      avatar: require('../../assets/elena_profile.png'),
      hasGreenBorder: true,
      email: 'priya.sundaram@tas-governance.org'
    },
    {
      id: 'm3',
      name: 'Lakshmi Narayanan',
      designation: 'Forensic Accountant',
      company: 'Madurai Tax Associates',
      memberId: 'TAS-2026-MD03',
      tier: 'Basic',
      tierLabel: 'Basic Member',
      avatar: require('../../assets/admin_profile.png'),
      hasGreenBorder: false,
      email: 'lakshmi.narayanan@tas-governance.org'
    },
    {
      id: 'm4',
      name: 'Karthik Venkatraman',
      designation: 'Corporate Audit Director',
      company: 'Coimbatore Audit Corp',
      memberId: 'TAS-2026-CB04',
      tier: 'Professional',
      tierLabel: 'Professional Member',
      avatar: require('../../assets/admin_profile.png'),
      hasGreenBorder: false,
      email: 'karthik.venkatraman@tas-governance.org'
    },
    {
      id: 'm5',
      name: 'Meera Rajagopal',
      designation: 'Indirect Tax Specialist',
      company: 'Kochi Compliance Group',
      memberId: 'TAS-2026-KC05',
      tier: 'Premium',
      tierLabel: 'Premium Member',
      avatar: require('../../assets/elena_profile.png'),
      hasGreenBorder: true,
      email: 'meera.rajagopal@tas-governance.org'
    },
    {
      id: 'm6',
      name: 'Sridhar Srinivasan',
      designation: 'Chief Financial Officer',
      company: 'Hyderabad FinServices',
      memberId: 'TAS-2026-HD06',
      tier: 'Lifetime',
      tierLabel: 'Lifetime Fellow',
      avatar: require('../../assets/admin_profile.png'),
      hasGreenBorder: true,
      email: 'sridhar.srinivasan@tas-governance.org'
    },
    {
      id: 'm7',
      name: 'Ananth Padmanabhan',
      designation: 'Tax Compliance Officer',
      company: 'Thiruvananthapuram Legal',
      memberId: 'TAS-2026-TR07',
      tier: 'Basic',
      tierLabel: 'Basic Member',
      avatar: require('../../assets/admin_profile.png'),
      hasGreenBorder: false,
      email: 'ananth.padmanabhan@tas-governance.org'
    },
    {
      id: 'm8',
      name: 'Divya Ranganathan',
      designation: 'Finance Director',
      company: 'Chennai Group of Industries',
      memberId: 'TAS-2026-CH08',
      tier: 'Professional',
      tierLabel: 'Professional Member',
      avatar: require('../../assets/elena_profile.png'),
      hasGreenBorder: false,
      email: 'divya.ranganathan@tas-governance.org'
    },
    {
      id: 'm9',
      name: 'Vignesh Balasubramanian',
      designation: 'Audit Manager',
      company: 'Mysore Consultants Ltd.',
      memberId: 'TAS-2026-MS09',
      tier: 'Premium',
      tierLabel: 'Premium Member',
      avatar: require('../../assets/admin_profile.png'),
      hasGreenBorder: true,
      email: 'vignesh.balasubramanian@tas-governance.org'
    },
    {
      id: 'm10',
      name: 'Kavin Selvam',
      designation: 'Junior Accountant',
      company: 'Trichy FinCorp',
      memberId: 'TAS-2026-TC10',
      tier: 'Basic',
      tierLabel: 'Basic Member',
      avatar: require('../../assets/admin_profile.png'),
      hasGreenBorder: false,
      email: 'kavin.selvam@tas-governance.org'
    },
    {
      id: 'm11',
      name: 'Sandhya Ramachandran',
      designation: 'Wealth Management Specialist',
      company: 'Bangalore Wealth Advisors',
      memberId: 'TAS-2026-BL11',
      tier: 'Professional',
      tierLabel: 'Professional Member',
      avatar: require('../../assets/elena_profile.png'),
      hasGreenBorder: false,
      email: 'sandhya.ramachandran@tas-governance.org'
    },
    {
      id: 'm12',
      name: 'Ashwin Ravichandran',
      designation: 'Senior Auditor',
      company: 'Chennai Audit Corp',
      memberId: 'TAS-2026-CH12',
      tier: 'Lifetime',
      tierLabel: 'Lifetime Fellow',
      avatar: require('../../assets/admin_profile.png'),
      hasGreenBorder: true,
      email: 'ashwin.ravichandran@tas-governance.org'
    },
    {
      id: 'm13',
      name: 'Rajeshwari Iyer',
      designation: 'Chief Treasurer',
      company: 'Tanjore Trust',
      memberId: 'TAS-2026-TJ13',
      tier: 'Premium',
      tierLabel: 'Premium Member',
      avatar: require('../../assets/elena_profile.png'),
      hasGreenBorder: true,
      email: 'rajeshwari.iyer@tas-governance.org'
    },
    {
      id: 'm14',
      name: 'Venkatadri Naidu',
      designation: 'Senior Tax Specialist',
      company: 'Vizag Exports Co.',
      memberId: 'TAS-2026-VZ14',
      tier: 'Basic',
      tierLabel: 'Basic Member',
      avatar: require('../../assets/admin_profile.png'),
      hasGreenBorder: false,
      email: 'venkatadri.naidu@tas-governance.org'
    },
    {
      id: 'm15',
      name: 'Shalini Prabhakar',
      designation: 'Indirect Tax Consultant',
      company: 'Bengaluru Advisory Services',
      memberId: 'TAS-2026-BL15',
      tier: 'Professional',
      tierLabel: 'Professional Member',
      avatar: require('../../assets/elena_profile.png'),
      hasGreenBorder: false,
      email: 'shalini.prabhakar@tas-governance.org'
    },
    {
      id: 'm16',
      name: 'Vijay Raghavan',
      designation: 'Corporate Auditor',
      company: 'Salem Steel Corp',
      memberId: 'TAS-2026-SL16',
      tier: 'Lifetime',
      tierLabel: 'Lifetime Fellow',
      avatar: require('../../assets/admin_profile.png'),
      hasGreenBorder: true,
      email: 'vijay.raghavan@tas-governance.org'
    },
    {
      id: 'm17',
      name: 'Deepa Muthukumar',
      designation: 'Tax Compliance Analyst',
      company: 'Chennai Port Services',
      memberId: 'TAS-2026-CH17',
      tier: 'Premium',
      tierLabel: 'Premium Member',
      avatar: require('../../assets/elena_profile.png'),
      hasGreenBorder: true,
      email: 'deepa.muthukumar@tas-governance.org'
    },
    {
      id: 'm18',
      name: 'Balaji Viswanathan',
      designation: 'Tax Partner',
      company: 'Balaji & Associates',
      memberId: 'TAS-2026-BL18',
      tier: 'Basic',
      tierLabel: 'Basic Member',
      avatar: require('../../assets/admin_profile.png'),
      hasGreenBorder: false,
      email: 'balaji.viswanathan@tas-governance.org'
    },
    {
      id: 'm19',
      name: 'Nithya Kalyani',
      designation: 'Finance Auditor',
      company: 'Madurai Spinning Mills',
      memberId: 'TAS-2026-MD19',
      tier: 'Professional',
      tierLabel: 'Professional Member',
      avatar: require('../../assets/elena_profile.png'),
      hasGreenBorder: false,
      email: 'nithya.kalyani@tas-governance.org'
    },
    {
      id: 'm20',
      name: 'Hariharan Sastry',
      designation: 'Chief Accountant',
      company: 'Hyderabad Holdings Ltd.',
      memberId: 'TAS-2026-HD20',
      tier: 'Premium',
      tierLabel: 'Premium Member',
      avatar: require('../../assets/admin_profile.png'),
      hasGreenBorder: true,
      email: 'hariharan.sastry@tas-governance.org'
    },
    {
      id: 'm21',
      name: 'Archana Ganesan',
      designation: 'Junior Auditor',
      company: 'Trichy Accounts Group',
      memberId: 'TAS-2026-TC21',
      tier: 'Basic',
      tierLabel: 'Basic Member',
      avatar: require('../../assets/elena_profile.png'),
      hasGreenBorder: false,
      email: 'archana.ganesan@tas-governance.org'
    },
    {
      id: 'm22',
      name: 'Suresh Kumar Swamy',
      designation: 'Senior Tax Advisor',
      company: 'Bangalore Consulting',
      memberId: 'TAS-2026-BL22',
      tier: 'Professional',
      tierLabel: 'Professional Member',
      avatar: require('../../assets/admin_profile.png'),
      hasGreenBorder: false,
      email: 'suresh.swamy@tas-governance.org'
    },
    {
      id: 'm23',
      name: 'Vikramaditya Reddy',
      designation: 'Audit Director',
      company: 'Hyderabad Metro Corp',
      memberId: 'TAS-2026-HD23',
      tier: 'Lifetime',
      tierLabel: 'Lifetime Fellow',
      avatar: require('../../assets/admin_profile.png'),
      hasGreenBorder: true,
      email: 'vikramaditya.reddy@tas-governance.org'
    },
    {
      id: 'm24',
      name: 'Janaki Ramaswamy',
      designation: 'Senior Tax Consultant',
      company: 'Coimbatore Textiles',
      memberId: 'TAS-2026-CB24',
      tier: 'Premium',
      tierLabel: 'Premium Member',
      avatar: require('../../assets/elena_profile.png'),
      hasGreenBorder: true,
      email: 'janaki.ramaswamy@tas-governance.org'
    },
    {
      id: 'm25',
      name: 'Manikandan Pillai',
      designation: 'Junior Accountant',
      company: 'Kerala Agri Products Ltd.',
      memberId: 'TAS-2026-KL25',
      tier: 'Basic',
      tierLabel: 'Basic Member',
      avatar: require('../../assets/admin_profile.png'),
      email: 'manikandan.pillai@tas-governance.org'
    },
    {
      id: 'm26',
      name: 'Sarah Jenkins',
      designation: 'Senior Auditor',
      company: 'Texcity Financial Service',
      memberId: 'TAS-2026-00125',
      tier: 'Platinum',
      tierLabel: 'Platinum Member',
      avatar: require('../../assets/elena_profile.png'),
      hasGreenBorder: true,
      email: 'thiru.acc@example.com'
    }
  ];
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
    'sanjay_r': [
      { id: '1', sender: 'them', text: "I just sent you the updated reconciliation reports for Q3.", time: '2:05 PM' },
      { id: '2', sender: 'them', text: "I just sent you the updated reconciliation...", time: '2:06 PM' }
    ],
    'ram_k': [
      { id: '1', sender: 'me', text: "Let's review the tax guidelines tomorrow.", time: '2:00 PM' },
      { id: '2', sender: 'them', text: "Sounds good! Let me know when you're ...", time: '2:07 PM' }
    ],
    'sanjeev_s': [
      { id: '1', sender: 'them', text: "Hi Marcus, the compliance logs are ready.", time: '2:06 PM' },
      { id: '2', sender: 'them', text: "I just sent you the updated reconciliation...", time: '2:07 PM' }
    ],
    'tc_announcements': [
      { id: '1', sender: 'them', senderName: 'Pradeep Raj', text: 'Are we meeting offline today for the tax compliance review?', time: '14:32' }
    ],
    'tc_corporate': [
      { id: '1', sender: 'them', senderName: 'Sanjeev Senthil', text: 'Guys, are the Q4 tax schedules ready for PKF team?', time: '26/03/2026' }
    ],
    'tc_gst': [
      { id: '1', sender: 'them', senderName: 'Sanjeev Senthil', text: "Guys I'm going to close the indirect tax ledger by 5 PM.", time: '17/03/2026' }
    ],
    'itc_announcements': [
      { id: '1', sender: 'them', senderName: 'Priya Mani', text: 'Priya Mani published "OECD guidelines on cross-border tax transparency".', time: '28/03/2026' }
    ],
    'itc_transfer': [
      { id: '1', sender: 'them', senderName: 'Tamil Selvan', text: 'Tamil Selvan: Thanks for the tax heads up, I will check the pricing models.', time: '28/03/2026' }
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
  async deleteEvent(id) {
    this.events = this.events.filter(e => e.id !== id);
    this.notify();

    try {
      await supabase.from('events').delete().eq('id', id);
    } catch (e) {
      console.warn('Failed to delete event from Supabase:', e);
    }
  }
  async updateEvent(updatedEvent) {
    this.events = this.events.map(e => e.id === updatedEvent.id ? { ...e, ...updatedEvent } : e);
    this.notify();

    try {
      let parsedDate = new Date(updatedEvent.date);
      if (isNaN(parsedDate.getTime())) {
        parsedDate = new Date();
      }
      await supabase.from('events').update({
        title: updatedEvent.title,
        date: parsedDate.toISOString(),
        start_time: updatedEvent.startTime || '09:00 AM',
        location: updatedEvent.location,
        capacity: updatedEvent.capacity || 300,
        description: updatedEvent.description || ''
      }).eq('id', updatedEvent.id);
    } catch (e) {
      console.warn('Failed to update event in Supabase:', e);
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
  async getOrCreateDm(memberId, name, avatar) {
    let dm = this.dms.find(d => d.id === memberId || d.name === name);
    if (!dm) {
      const avatarSource = avatar || require('../../assets/elena_profile.png');
      dm = {
        id: memberId,
        name: name,
        text: 'No messages yet',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: false,
        viewed: true,
        avatar: avatarSource
      };
      this.dms.push(dm);
      if (!this.messages[memberId]) {
        this.messages[memberId] = [];
      }
      this.notify();
      try {
        let avatarUrlStr = '';
        if (avatarSource) {
          if (typeof avatarSource === 'number') {
            avatarUrlStr = avatarSource === require('../../assets/elena_profile.png') ? 'elena_profile.png' : 'admin_profile.png';
          } else if (avatarSource.uri) {
            avatarUrlStr = avatarSource.uri;
          }
        }
        await supabase.from('dms').insert([{
          id: memberId,
          name: name,
          last_text: 'No messages yet',
          last_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar_url: avatarUrlStr,
          unread: false,
          viewed: true
        }]);
      } catch (e) {}
    }
    return dm;
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
    const membershipRevenueVal = 1240000 + approvedCount * 35000; // e.g. increases by ₹35,000 per approved user
    const conversionRateVal = 24.8 + approvedCount * 0.4;
    const newSalesVal = 142 + approvedCount;

    // Membership tier distribution calculations
    const lifetimePct = Math.round(40 + approvedCount * 0.2);
    const premiumPct = Math.round(25 + approvedCount * 0.1);
    const professionalPct = Math.round(20 - approvedCount * 0.1);
    const basicPct = 100 - (lifetimePct + premiumPct + professionalPct);

    // Post Analytics
    const parseReach = (reachStr) => {
      if (!reachStr) return 0;
      if (typeof reachStr === 'number') return reachStr;
      const clean = reachStr.toString().toLowerCase().trim();
      if (clean.endsWith('k')) {
        return parseFloat(clean) * 1000;
      }
      return parseInt(clean, 10) || 0;
    };

    const publishedPosts = this.posts.filter(p => p.status === 'published');
    const totalPostViewsVal = publishedPosts.reduce((sum, p) => sum + parseReach(p.reach), 0);
    const totalPostLikesVal = publishedPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
    const totalPostCommentsVal = publishedPosts.reduce((sum, p) => sum + (p.comments || 0), 0);
    const totalPostSharesVal = publishedPosts.reduce((sum, p) => sum + (p.shares || 0), 0);
    const totalPostActivityVal = totalPostLikesVal + totalPostCommentsVal + totalPostSharesVal;

    const postViewsText = totalPostViewsVal >= 1000 
      ? `${(totalPostViewsVal / 1000).toFixed(1)}k` 
      : `${totalPostViewsVal}`;
    const postLikesText = totalPostLikesVal.toLocaleString();
    const postActivityText = totalPostActivityVal.toLocaleString();

    return {
      totalMembers: totalMembersText,
      revenue: `₹${revenueVal}k`,
      eventRegistrations: eventRegistrationsVal,
      activeMemberships: activeMembershipsVal.toLocaleString(),
      membershipRevenue: `₹${(membershipRevenueVal / 100000).toFixed(1)} Lakh`,
      conversionRate: `${conversionRateVal.toFixed(1)}%`,
      newSales: newSalesVal,
      postViews: postViewsText,
      postLikes: postLikesText,
      postActivity: postActivityText,
      distribution: {
        lifetime: lifetimePct,
        premium: premiumPct,
        professional: professionalPct,
        basic: basicPct
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
      } = await supabase.from('connections_queue').select('*, profiles(*)');
      if (queueData) {
        // Sync queue items
        const pending = queueData.filter(q => q.verification_status === 'pending');
        if (pending.length > 0) {
          this.queue = pending.map(item => ({
            id: item.id,
            user_name: item.profiles?.username || 'Anonymous User',
            full_name: item.profiles?.full_name || 'Anonymous User',
            phone: item.profiles?.phone || '+1 555-000-0000',
            dob: item.profiles?.dob || '01/01/1990',
            gender: item.profiles?.gender || 'Prefer not to say',
            email: item.profiles?.email || 'no-email@tas-governance.org',
            membership_plan: item.profiles?.membership_plan || 'Premium',
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
  likePost(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likes = post.isLiked ? (post.likes || 0) + 1 : (post.likes || 0) - 1;
      this.notify();
    }
  }
  addComment(postId, comment) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      if (!post.commentsList) {
        post.commentsList = [];
      }
      post.commentsList.push(comment);
      post.comments = (post.comments || 0) + 1;
      this.notify();
    }
  }
  likeComment(postId, commentId) {
    const post = this.posts.find(p => p.id === postId);
    if (post && post.commentsList) {
      const comment = post.commentsList.find(c => c.id === commentId);
      if (comment) {
        comment.isLiked = !comment.isLiked;
        comment.likesCount = comment.isLiked ? (comment.likesCount || 0) + 1 : (comment.likesCount || 0) - 1;
        this.notify();
      }
    }
  }
  addGroupChannel(channel) {
    this.groups.push(channel);
    this.notify();
  }
  addGroup(group) {
    const id = group.id || group.name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_channel';
    const newGroup = {
      id,
      name: group.name,
      category: group.category || 'GENERAL',
      categoryMembers: '1 Members',
      categoryBg: '#E8EAF6',
      icon: 'users',
      iconBg: '#FFF8E1',
      iconColor: '#FFB300',
      lastUser: 'System',
      text: group.description || `Welcome to ${group.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unreadCount: 0
    };
    this.groups.push(newGroup);
    const catName = group.category || 'GENERAL';
    if (!this.communityMembers[catName]) {
      this.communityMembers[catName] = [];
    }
    this.communityMembers[catName].push('m1');
    this.notify();
  }
  deleteGroupChannel(channelId) {
    this.groups = this.groups.filter(g => g.id !== channelId);
    this.notify();
  }
  updateGroupCategory(oldCategoryName, newCategoryName) {
    this.groups = this.groups.map(g => 
      g.category === oldCategoryName ? { ...g, category: newCategoryName } : g
    );
    this.notify();
  }
  deleteGroupCategory(categoryName) {
    this.groups = this.groups.filter(g => g.category !== categoryName);
    this.notify();
  }
  getCommunityMembers(categoryName) {
    if (!this.communityMembers[categoryName]) {
      this.communityMembers[categoryName] = [];
    }
    return this.communityMembers[categoryName]
      .map(id => this.members.find(m => m.id === id || m.memberId === id))
      .filter(Boolean);
  }
  addMemberToCommunity(categoryName, memberId) {
    if (!this.communityMembers[categoryName]) {
      this.communityMembers[categoryName] = [];
    }
    if (!this.communityMembers[categoryName].includes(memberId)) {
      this.communityMembers[categoryName].push(memberId);
      const newCount = this.communityMembers[categoryName].length;
      this.groups = this.groups.map(g => 
        g.category === categoryName ? { ...g, categoryMembers: `${newCount} Members` } : g
      );
      this.notify();
    }
  }
  removeMemberFromCommunity(categoryName, memberId) {
    if (this.communityMembers[categoryName]) {
      this.communityMembers[categoryName] = this.communityMembers[categoryName].filter(id => id !== memberId);
      const newCount = this.communityMembers[categoryName].length;
      this.groups = this.groups.map(g => 
        g.category === categoryName ? { ...g, categoryMembers: `${newCount} Members` } : g
      );
      this.notify();
    }
  }
}
export const dbStore = new DbStore();

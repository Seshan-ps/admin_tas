import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet, Image, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Users, CreditCard, Calendar, Lock, TrendingUp, UserPlus, ChevronDown, ArrowUp, Home as HomeIcon, BarChart3, Newspaper, Shield, Activity, RefreshCw, Zap, Clock, Eye, Heart, MessageSquare } from 'lucide-react-native';
import Svg, { Circle, Rect, Path, Defs, LinearGradient, Stop, G, Line, Text as SvgText } from 'react-native-svg';
import { dbStore } from '../config/dbStore';

const { width } = Dimensions.get('window');

// Custom Directory Book Icon for bottom navigation
const DirectoryBookIcon = ({ color }) => (
  <View style={{ width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="2" width="16" height="20" rx="3" fill="none" stroke={color} strokeWidth="2.5" />
      <Path d="M8 2v20" stroke={color} strokeWidth="1.5" />
      <Circle cx="14" cy="10" r="3" stroke={color} strokeWidth="2" fill="white" />
      <Path d="M16.5 12.5l2.5 2.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  </View>
);

// High-fidelity timeframe datasets for interactive simulation
const TIMEFRAME_DATA = {
  '7D': {
    revenue: '₹2.8 Lakh',
    revenueGrowth: '+8.4% this week',
    revenueGrowthVal: '+8.4%',
    revenueTrend: 'up',
    members: '15,120',
    membersGrowth: '+1.2% this week',
    membersGrowthVal: '+1.2%',
    membersTrend: 'up',
    conversion: '24.2%',
    conversionGrowth: '+0.5% vs last week',
    conversionGrowthVal: '+0.5%',
    conversionTrend: 'up',
    events: '450',
    eventsGrowth: '+12% event signups',
    eventsGrowthVal: '+12%',
    eventsTrend: 'up',
    revenuePoints: [110, 130, 120, 150, 140, 185, 230],
    revenueLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    engagementBars: [
      { label: 'M', value: 45 },
      { label: 'T', value: 32 },
      { label: 'W', value: 68 },
      { label: 'T', value: 50 },
      { label: 'F', value: 85, active: true },
      { label: 'S', value: 40 },
      { label: 'S', value: 55 }
    ]
  },
  '30D': {
    revenue: '₹12.4 Lakh',
    revenueGrowth: '+14.2% vs last month',
    revenueGrowthVal: '+14.2%',
    revenueTrend: 'up',
    members: '15,680',
    membersGrowth: '+4.8% vs last month',
    membersGrowthVal: '+4.8%',
    membersTrend: 'up',
    conversion: '24.8%',
    conversionGrowth: '+2.1% vs last month',
    conversionGrowthVal: '+2.1%',
    conversionTrend: 'up',
    events: '1,280',
    eventsGrowth: '+18% event signups',
    eventsGrowthVal: '+18%',
    eventsTrend: 'up',
    revenuePoints: [75, 95, 88, 120, 115, 148, 175],
    revenueLabels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7'],
    engagementBars: [
      { label: 'W1', value: 62 },
      { label: 'W2', value: 80, active: true },
      { label: 'W3', value: 55 },
      { label: 'W4', value: 72 },
      { label: 'W5', value: 40 }
    ]
  },
  '6M': {
    revenue: '₹78.5 Lakh',
    revenueGrowth: '+28.6% vs last half',
    revenueGrowthVal: '+28.6%',
    revenueTrend: 'up',
    members: '18,200',
    membersGrowth: '+18.5% vs last half',
    membersGrowthVal: '+18.5%',
    membersTrend: 'up',
    conversion: '26.4%',
    conversionGrowth: '+5.4% vs last half',
    conversionGrowthVal: '+5.4%',
    conversionTrend: 'up',
    events: '5,800',
    eventsGrowth: '+32% event signups',
    eventsGrowthVal: '+32%',
    eventsTrend: 'up',
    revenuePoints: [45, 60, 52, 68, 72, 78, 92],
    revenueLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    engagementBars: [
      { label: 'Jan', value: 50 },
      { label: 'Feb', value: 60 },
      { label: 'Mar', value: 78 },
      { label: 'Apr', value: 92, active: true },
      { label: 'May', value: 65 },
      { label: 'Jun', value: 70 }
    ]
  },
  '12M': {
    revenue: '₹1.5 Crore',
    revenueGrowth: '+42.3% vs last year',
    revenueGrowthVal: '+42.3%',
    revenueTrend: 'up',
    members: '22,400',
    membersGrowth: '+38.2% vs last year',
    membersGrowthVal: '+38.2%',
    membersTrend: 'up',
    conversion: '28.9%',
    conversionGrowth: '+9.2% vs last year',
    conversionGrowthVal: '+9.2%',
    conversionTrend: 'up',
    events: '12,400',
    eventsGrowth: '+48% event signups',
    eventsGrowthVal: '+48%',
    eventsTrend: 'up',
    revenuePoints: [30, 48, 42, 62, 70, 85, 105, 95, 115, 130, 142, 160],
    revenueLabels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    engagementBars: [
      { label: 'Q1', value: 60 },
      { label: 'Q2', value: 72 },
      { label: 'Q3', value: 88, active: true },
      { label: 'Q4', value: 94 }
    ]
  }
};

export const AnalyticsScreen = ({ onBack, onTabPress, navigation }) => {
  const [activeTimeframe, setActiveTimeframe] = useState('30D');
  const [selectedPointIndex, setSelectedPointIndex] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(dbStore.getAnalytics());
  
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const unsubscribe = dbStore.subscribe(() => {
      setAnalyticsData(dbStore.getAnalytics());
    });
    return unsubscribe;
  }, []);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 300);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const data = TIMEFRAME_DATA[activeTimeframe];

  const getPostMetricsForTimeframe = () => {
    const parseReach = (str) => {
      if (!str) return 0;
      if (typeof str === 'number') return str;
      const clean = str.toString().toLowerCase().trim();
      if (clean.endsWith('k')) {
        return parseFloat(clean) * 1000;
      }
      return parseInt(clean, 10) || 0;
    };

    const parseLikes = (str) => {
      if (!str) return 0;
      if (typeof str === 'number') return str;
      return parseInt(str.toString().replace(/,/g, ''), 10) || 0;
    };

    const formatVal = (val) => {
      return val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val}`;
    };

    const rawViews = parseReach(analyticsData.postViews);
    const rawLikes = parseLikes(analyticsData.postLikes);
    const rawActivity = parseLikes(analyticsData.postActivity);

    if (activeTimeframe === '7D') {
      return {
        views: formatVal(Math.round(rawViews * 0.23)),
        likes: Math.round(rawLikes * 0.24).toLocaleString(),
        activity: Math.round(rawActivity * 0.25).toLocaleString(),
        viewsGrowth: '+4.2% this week',
        likesGrowth: '+5.1% this week',
        activityGrowth: '+3.8% this week'
      };
    } else if (activeTimeframe === '30D') {
      return {
        views: analyticsData.postViews || '0',
        likes: analyticsData.postLikes || '0',
        activity: analyticsData.postActivity || '0',
        viewsGrowth: '+12.4% this month',
        likesGrowth: '+10.8% this month',
        activityGrowth: '+14.5% this month'
      };
    } else if (activeTimeframe === '6M') {
      return {
        views: formatVal(Math.round(rawViews * 5.5)),
        likes: Math.round(rawLikes * 5.4).toLocaleString(),
        activity: Math.round(rawActivity * 5.5).toLocaleString(),
        viewsGrowth: '+22.8% vs last half',
        likesGrowth: '+25.4% vs last half',
        activityGrowth: '+24.1% vs last half'
      };
    } else { // 12M
      return {
        views: formatVal(Math.round(rawViews * 11.2)),
        likes: Math.round(rawLikes * 11.0).toLocaleString(),
        activity: Math.round(rawActivity * 11.1).toLocaleString(),
        viewsGrowth: '+38.5% vs last year',
        likesGrowth: '+42.1% vs last year',
        activityGrowth: '+40.6% vs last year'
      };
    }
  };

  const postMetrics = getPostMetricsForTimeframe();

  // Helper function to calculate a smooth Bezier Curve for SVG line chart
  const getBezierPath = (points, chartWidth, chartHeight, padding = 15) => {
    if (points.length === 0) return { path: '', areaPath: '', coords: [] };
    
    const drawWidth = chartWidth - padding * 2;
    const drawHeight = chartHeight - padding * 2;
    
    const maxVal = Math.max(...points, 1);
    const minVal = Math.min(...points, 0);
    const range = maxVal - minVal;
    
    const coords = points.map((p, index) => {
      const x = padding + (index / (points.length - 1)) * drawWidth;
      const y = padding + drawHeight - ((p - minVal) / (range || 1)) * drawHeight;
      return { x, y, value: p };
    });

    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }

    const areaPath = `${path} L ${coords[coords.length - 1].x} ${chartHeight} L ${coords[0].x} ${chartHeight} Z`;

    return { path, areaPath, coords };
  };

  // Render SVG Line Chart with Gradient Fill
  const renderLineChart = () => {
    const chartHeight = 160;
    const chartWidth = width - 64; // Horizontal margin subtraction
    const { path, areaPath, coords } = getBezierPath(data.revenuePoints, chartWidth, chartHeight);

    return (
      <View style={styles.chartWrapper}>
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#0D3866" stopOpacity="0.25" />
              <Stop offset="100%" stopColor="#0D3866" stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((ratio, idx) => (
            <Line
              key={idx}
              x1="0"
              y1={chartHeight * ratio}
              x2={chartWidth}
              y2={chartHeight * ratio}
              stroke="#F1F5F9"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          ))}

          {/* Shaded Area */}
          {areaPath ? <Path d={areaPath} fill="url(#lineGrad)" /> : null}

          {/* Curve Line */}
          {path ? <Path d={path} fill="none" stroke="#0D3866" strokeWidth="3" strokeLinecap="round" /> : null}

          {/* Touch/Interactive Overlay circles */}
          {coords.map((coord, index) => {
            const isSelected = selectedPointIndex === index;
            return (
              <G key={index}>
                {isSelected && (
                  <Circle
                    cx={coord.x}
                    cy={coord.y}
                    r="8"
                    fill="#0D3866"
                    fillOpacity="0.2"
                  />
                )}
                <Circle
                  cx={coord.x}
                  cy={coord.y}
                  r={isSelected ? "5" : "3.5"}
                  fill={isSelected ? "#0D3866" : "#FFFFFF"}
                  stroke="#0D3866"
                  strokeWidth="2.5"
                  onPressIn={() => setSelectedPointIndex(index)}
                />
              </G>
            );
          })}
        </Svg>

        {/* Dynamic X-Axis labels */}
        <View style={styles.lineLabelsRow}>
          {data.revenueLabels.map((lbl, idx) => (
            <Text key={idx} style={[styles.axisText, selectedPointIndex === idx && styles.axisTextActive]}>
              {lbl}
            </Text>
          ))}
        </View>

        {/* Selected Data Tooltip */}
        {selectedPointIndex !== null && (
          <View style={styles.chartTooltip}>
            <View style={styles.tooltipIndicatorColor} />
            <Text style={styles.tooltipTitle}>
              {data.revenueLabels[selectedPointIndex]}:{' '}
              <Text style={styles.tooltipBold}>₹{data.revenuePoints[selectedPointIndex]}k</Text>
            </Text>
            <TouchableOpacity onPress={() => setSelectedPointIndex(null)} style={styles.tooltipClose}>
              <Text style={styles.tooltipCloseText}>×</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Render SVG Donut Chart for Membership Plan Distribution
  const renderDonutChart = () => {
    const size = 140;
    const strokeWidth = 16;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const segments = [
      { percentage: analyticsData.distribution.lifetime, color: '#0D3866', label: 'Lifetime' },  // Theme Navy
      { percentage: analyticsData.distribution.premium, color: '#70B62C', label: 'Premium' },   // Emerald/Green
      { percentage: analyticsData.distribution.professional, color: '#1D4ED8', label: 'Professional' }, // Royal Blue
      { percentage: analyticsData.distribution.basic, color: '#93C5FD', label: 'Basic' }     // Sky Blue
    ];

    let currentOffset = 0;

    return (
      <View style={styles.donutLayout}>
        <View style={styles.donutGraphicContainer}>
          <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
            {segments.map((seg, index) => {
              const offset = currentOffset;
              currentOffset += seg.percentage;
              return (
                <Circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={circumference - (circumference * seg.percentage) / 100}
                  rotation={offset / 100 * 360}
                  origin={`${size / 2}, ${size / 2}`}
                />
              );
            })}
          </Svg>
          <View style={styles.donutCenterText}>
            <Text style={styles.donutNumber}>{analyticsData.totalMembers}</Text>
            <Text style={styles.donutLabel}>Members</Text>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.donutLegend}>
          {segments.map((seg, index) => (
            <View key={index} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: seg.color }]} />
              <Text style={styles.legendLabelText}>{seg.label}</Text>
              <Text style={styles.legendPctText}>{seg.percentage}%</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Styled Header matching Directory & Connections Screens */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <ArrowLeft size={22} color="#0D3866" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>System Dashboard</Text>
        
        {/* Themed Status widget */}
        <View style={styles.syncBadge}>
          <Activity size={12} color="#0D3866" style={{ marginRight: 4 }} />
          <Text style={styles.syncText}>LIVE</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Interactive Timeframe Selector */}
        <View style={styles.timeframeCard}>
          <Text style={styles.sectionTitle}>Dashboard Filters</Text>
          <View style={styles.pillContainer}>
            {['7D', '30D', '6M', '12M'].map((period) => {
              const isActive = activeTimeframe === period;
              return (
                <TouchableOpacity
                  key={period}
                  onPress={() => {
                    setActiveTimeframe(period);
                    setSelectedPointIndex(null);
                  }}
                  style={[styles.pillBtn, isActive && styles.pillBtnActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                    {period === '7D' ? '7 Days' : period === '30D' ? '30 Days' : period === '6M' ? '6 Months' : '1 Year'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Live Metrics Grid Carousel */}
        <Text style={styles.sectionHeading}>Performance Metrics</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
          style={styles.carouselStyle}
        >
          {/* Revenue Card */}
          <View style={[styles.metricBox, { borderLeftColor: '#0D3866' }]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>TOTAL REVENUE</Text>
              <CreditCard size={18} color="#0D3866" />
            </View>
            <Text style={styles.metricValue}>{activeTimeframe === '30D' ? analyticsData.membershipRevenue : data.revenue}</Text>
            <Text style={styles.metricTrendGreen}>
              <TrendingUp size={12} color="#70B62C" /> {data.revenueGrowthVal} growth
            </Text>
          </View>

          {/* Members Card */}
          <View style={[styles.metricBox, { borderLeftColor: '#0D3866' }]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>ACTIVE MEMBERS</Text>
              <Users size={18} color="#0D3866" />
            </View>
            <Text style={styles.metricValue}>{analyticsData.activeMemberships}</Text>
            <Text style={styles.metricTrendGreen}>
              <TrendingUp size={12} color="#70B62C" /> {data.membersGrowthVal} growth
            </Text>
          </View>

          {/* Conversion Card */}
          <View style={[styles.metricBox, { borderLeftColor: '#70B62C' }]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>CONVERSION RATE</Text>
              <TrendingUp size={18} color="#70B62C" />
            </View>
            <Text style={styles.metricValue}>{analyticsData.conversionRate}</Text>
            <Text style={styles.metricTrendGreen}>
              <TrendingUp size={12} color="#70B62C" /> {data.conversionGrowthVal}
            </Text>
          </View>

          {/* Event Attendees Card */}
          <View style={[styles.metricBox, { borderLeftColor: '#7C3AED' }]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>EVENT SIGNUPS</Text>
              <Calendar size={18} color="#7C3AED" />
            </View>
            <Text style={styles.metricValue}>{analyticsData.eventRegistrations}</Text>
            <Text style={styles.metricTrendGreen}>
              <TrendingUp size={12} color="#70B62C" /> {data.eventsGrowthVal}
            </Text>
          </View>

          {/* Pending Approvals Card */}
          <View style={[styles.metricBox, { borderLeftColor: '#EA580C' }]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>AWAITING VERIFICATION</Text>
              <Shield size={18} color="#EA580C" />
            </View>
            <Text style={styles.metricValue}>{dbStore.getQueue().length}</Text>
            <Text style={styles.metricTrendOrange}>
              Requires review
            </Text>
          </View>

          {/* Post Views Card */}
          <View style={[styles.metricBox, { borderLeftColor: '#0D3866' }]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>TOTAL POST VIEWS</Text>
              <Eye size={18} color="#0D3866" />
            </View>
            <Text style={styles.metricValue}>{postMetrics.views}</Text>
            <Text style={styles.metricTrendGreen}>
              <TrendingUp size={12} color="#70B62C" /> {postMetrics.viewsGrowth}
            </Text>
          </View>

          {/* Post Likes Card */}
          <View style={[styles.metricBox, { borderLeftColor: '#EF4444' }]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>TOTAL POST LIKES</Text>
              <Heart size={18} color="#EF4444" />
            </View>
            <Text style={styles.metricValue}>{postMetrics.likes}</Text>
            <Text style={styles.metricTrendGreen}>
              <TrendingUp size={12} color="#70B62C" /> {postMetrics.likesGrowth}
            </Text>
          </View>

          {/* Post Activity Card */}
          <View style={[styles.metricBox, { borderLeftColor: '#10B981' }]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>POST ACTIVITY</Text>
              <MessageSquare size={18} color="#10B981" />
            </View>
            <Text style={styles.metricValue}>{postMetrics.activity}</Text>
            <Text style={styles.metricTrendGreen}>
              <TrendingUp size={12} color="#70B62C" /> {postMetrics.activityGrowth}
            </Text>
          </View>
        </ScrollView>

        {/* Growth Trend (Line Chart) Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Revenue Growth Trend</Text>
              <Text style={styles.cardSubtitle}>Monthly financial overview trajectory</Text>
            </View>
            <Zap size={18} color="#0D3866" />
          </View>
          {renderLineChart()}
        </View>

        {/* Weekly Engagement & Membership Distribution (2 Column Layout) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Membership Plan Distribution</Text>
          <Text style={styles.cardSubtitle}>Real-time active member subscription tiers</Text>
          {renderDonutChart()}
        </View>

        {/* User Engagement Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Platform Engagement</Text>
              <Text style={styles.cardSubtitle}>Daily active sessions loading weight</Text>
            </View>
            <Activity size={18} color="#70B62C" />
          </View>
          <View style={styles.barChartContainer}>
            {data.engagementBars.map((bar, idx) => (
              <View key={idx} style={styles.barWrapper}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${bar.value}%` },
                      bar.active ? styles.barFillActive : styles.barFillNormal
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, bar.active && styles.barLabelActive]}>
                  {bar.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Live System Health Widget */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Administrative Node Health</Text>
          <View style={styles.healthGrid}>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>DB LATENCY</Text>
              <View style={styles.healthValueRow}>
                <View style={[styles.statusDot, { backgroundColor: '#70B62C' }]} />
                <Text style={styles.healthValue}>12ms (Low)</Text>
              </View>
            </View>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>SERVER UPTIME</Text>
              <Text style={styles.healthValue}>99.99%</Text>
            </View>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>MEMORY LOAD</Text>
              <Text style={styles.healthValue}>42.5% (Stable)</Text>
            </View>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>SSL SECURITY</Text>
              <Text style={[styles.healthValue, { color: '#70B62C', fontWeight: 'bold' }]}>ACTIVE</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.secureSessionRow}>
            <Lock size={12} color="#94A3B8" style={{ marginRight: 6 }} />
            <Text style={styles.secureSessionText}>Secure 256-bit encryption active</Text>
          </View>
        </View>

        {/* System Audit log / Recent Activity */}
        <View style={[styles.card, { marginBottom: 120 }]}>
          <Text style={styles.cardTitle}>Recent Activity Logs</Text>
          <Text style={styles.cardSubtitle}>Audit trail of member interactions</Text>
          
          <View style={styles.activityList}>
            {[
              {
                id: 'act1',
                title: 'New Member Registration Request',
                subtitle: 'Divya Nair submitted Basic membership request',
                time: '15 mins ago',
                icon: <UserPlus size={16} color="#3B82F6" />,
                iconBg: '#EFF6FF'
              },
              {
                id: 'act2',
                title: 'Connection Queue Action',
                subtitle: 'Sanjay Ramasamy CPA approved into Premium tier',
                time: '2 hours ago',
                icon: <Shield size={16} color="#10B981" />,
                iconBg: '#ECFDF5'
              },
              {
                id: 'act3',
                title: 'Event Config Modified',
                subtitle: 'Tax Ethics Round-Table capacity updated to 300',
                time: '5 hours ago',
                icon: <Calendar size={16} color="#8B5CF6" />,
                iconBg: '#F5F3FF'
              }
            ].map((activity, idx) => (
              <View key={activity.id} style={[styles.activityRow, idx === 2 && { borderBottomWidth: 0 }]}>
                <View style={[styles.activityIconBox, { backgroundColor: activity.iconBg }]}>
                  {activity.icon}
                </View>
                <View style={styles.activityTexts}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activitySub}>{activity.subtitle}</Text>
                  <View style={styles.activityTimeRow}>
                    <Clock size={10} color="#94A3B8" style={{ marginRight: 4 }} />
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer Tab Navigation */}
      {!navigation && (
        <View style={styles.footerContainer}>
          <View style={styles.footerTabBar}>
            <TouchableOpacity style={styles.footerTabItem} onPress={() => onTabPress?.('feed')}>
              <HomeIcon size={22} color="#0D3866" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.footerTabItem, styles.footerTabItemActive]} onPress={() => {}}>
              <BarChart3 size={20} color="#70B62C" />
              <Text style={styles.footerTabLabel}>Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerTabItem} onPress={() => onTabPress?.('posts_all')}>
              <Newspaper size={22} color="#0D3866" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerTabItem} onPress={() => onTabPress?.('Connect')}>
              <Users size={22} color="#0D3866" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Scroll to Top */}
      {showScrollTop && (
        <TouchableOpacity onPress={scrollToTop} style={styles.scrollTopBtn} activeOpacity={0.8}>
          <ArrowUp size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FC'
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F4F7FC'
  },
  scrollContent: {
    padding: 16
  },
  header: {
    height: 56,
    backgroundColor: '#EBF3FC',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    position: 'relative'
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D3866'
  },
  syncBadge: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 56, 102, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(13, 56, 102, 0.15)'
  },
  syncText: {
    color: '#0D3866',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  timeframeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D3866',
    marginBottom: 10
  },
  pillContainer: {
    flexDirection: 'row',
    gap: 6
  },
  pillBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  pillBtnActive: {
    backgroundColor: '#0D3866',
    borderColor: '#0D3866'
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B'
  },
  pillTextActive: {
    color: '#FFFFFF'
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D3866',
    marginHorizontal: 4,
    marginBottom: 10
  },
  carouselStyle: {
    marginBottom: 16
  },
  carouselContainer: {
    paddingHorizontal: 4,
    gap: 12
  },
  metricBox: {
    width: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1.5
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0D3866',
    marginBottom: 4
  },
  metricTrendGreen: {
    fontSize: 10,
    fontWeight: '700',
    color: '#70B62C',
    flexDirection: 'row',
    alignItems: 'center'
  },
  metricTrendOrange: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EA580C'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D3866'
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  chartWrapper: {
    alignItems: 'center',
    marginTop: 10,
    position: 'relative'
  },
  lineLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    marginTop: 8
  },
  axisText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600'
  },
  axisTextActive: {
    color: '#0D3866',
    fontWeight: '800'
  },
  chartTooltip: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#0D3866',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0D3866',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4
  },
  tooltipIndicatorColor: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 6
  },
  tooltipTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600'
  },
  tooltipBold: {
    fontWeight: '800',
    color: '#93C5FD'
  },
  tooltipClose: {
    marginLeft: 10,
    paddingHorizontal: 4
  },
  tooltipCloseText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 14
  },
  donutLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 14
  },
  donutGraphicContainer: {
    position: 'relative',
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center'
  },
  donutCenterText: {
    position: 'absolute',
    alignItems: 'center'
  },
  donutNumber: {
    fontSize: 18,
    fontWeight: '850',
    color: '#0D3866'
  },
  donutLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    marginTop: 1
  },
  donutLegend: {
    gap: 8,
    flex: 1,
    paddingLeft: 12
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8
  },
  legendLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    flex: 1
  },
  legendPctText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0D3866'
  },
  barChartContainer: {
    flexDirection: 'row',
    height: 130,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingHorizontal: 8
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1
  },
  barTrack: {
    height: 90,
    width: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  barFill: {
    width: '100%',
    borderRadius: 7
  },
  barFillNormal: {
    backgroundColor: '#94A3B8'
  },
  barFillActive: {
    backgroundColor: '#70B62C'
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 8
  },
  barLabelActive: {
    color: '#70B62C',
    fontWeight: '800'
  },
  healthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10
  },
  healthItem: {
    width: '47%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12
  },
  healthLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  healthValueRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6
  },
  healthValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D3866'
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14
  },
  secureSessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  secureSessionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8'
  },
  activityList: {
    marginTop: 6
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  activityIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  activityTexts: {
    flex: 1
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '850',
    color: '#0D3866'
  },
  activitySub: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2
  },
  activityTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  activityTime: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500'
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  footerTabBar: {
    flexDirection: 'row',
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
    backgroundColor: '#F0FDF4'
  },
  footerTabLabel: {
    color: '#70B62C',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6
  },
  scrollTopBtn: {
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
    zIndex: 99
  }
});

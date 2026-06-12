import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, StyleSheet, Image, Platform, StatusBar } from 'react-native';
import { ArrowLeft, Users, CreditCard, Calendar, Lock, TrendingUp, UserPlus, ChevronDown, ArrowUp, Home as HomeIcon, BarChart3, Newspaper } from 'lucide-react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import { dbStore } from '../config/dbStore';
const {
  width
} = Dimensions.get('window');
// Custom Directory Icon matching App.tsx bottom navigation tab
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
export const AnalyticsScreen = ({
  onBack,
  onTabPress,
  navigation
}) => {
  const [activeSegment, setActiveSegment] = useState('general');
  const [usagePeriod, setUsagePeriod] = useState('weekly');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(dbStore.getAnalytics());
  const scrollViewRef = useRef(null);
  React.useEffect(() => {
    const unsubscribe = dbStore.subscribe(() => {
      setAnalyticsData(dbStore.getAnalytics());
    });
    return unsubscribe;
  }, []);
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

  // SVG Donut Chart Parameters
  const size = 120;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const renderDonutChart = () => {
    const segments = [{
      percentage: analyticsData.distribution.platinum,
      color: '#0D3866'
    },
    // Platinum Fellow
    {
      percentage: analyticsData.distribution.senior,
      color: '#70B62C'
    },
    // Senior Associate
    {
      percentage: analyticsData.distribution.associate,
      color: '#1D4ED8'
    },
    // Associate
    {
      percentage: analyticsData.distribution.student,
      color: '#DBEAFE'
    } // Student
    ];
    let currentOffset = 0;
    return <View style={styles.donutContainer}>
        <Svg width={size} height={size} style={{
        transform: [{
          rotate: '-90deg'
        }]
      }}>
          {segments.map((seg, index) => {
          const offset = currentOffset;
          currentOffset += seg.percentage;
          return <Circle key={index} cx={size / 2} cy={size / 2} r={radius} stroke={seg.color} strokeWidth={strokeWidth} fill="none" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={circumference - circumference * seg.percentage / 100} rotation={offset / 100 * 360} origin={`${size / 2}, ${size / 2}`} />;
        })}
        </Svg>
        <View style={styles.donutCenterTextContainer}>
          <Text style={styles.donutCenterValue}>100%</Text>
          <Text style={styles.donutCenterLabel}>Active</Text>
        </View>
      </View>;
  };
  const renderGeneralView = () => {
    const barData = [{
      day: 'Mon',
      val: 50,
      green: false
    }, {
      day: 'Tue',
      val: 10,
      green: false
    }, {
      day: 'Wed',
      val: 35,
      green: false
    }, {
      day: 'Thu',
      val: 48,
      green: false
    }, {
      day: 'Fri',
      val: 72,
      green: true,
      label: '8hrs'
    }, {
      day: 'Sat',
      val: 35,
      green: false
    }, {
      day: 'Sun',
      val: 52,
      green: false
    }];
    return <View style={styles.tabContentContainer}>
        {/* Metrics Grid */}
        <View style={styles.metricsGridRow}>
          <View style={styles.metricCardHalf}>
            <View style={styles.metricIconBox}>
              <Users size={20} color="#134074" />
            </View>
            <View style={styles.metricInfo}>
              <Text style={styles.metricLabel}>TOTAL MEMBERS</Text>
              <Text style={styles.metricValue}>{analyticsData.totalMembers}</Text>
            </View>
          </View>
          <View style={styles.metricCardHalf}>
            <View style={styles.metricIconBox}>
              <CreditCard size={20} color="#134074" />
            </View>
            <View style={styles.metricInfo}>
              <Text style={styles.metricLabel}>REVENUE</Text>
              <Text style={styles.metricValue}>{analyticsData.revenue}</Text>
            </View>
          </View>
        </View>

        {/* Sub-Metric Card */}
        <View style={styles.metricCardFull}>
          <View style={styles.metricIconBox}>
            <Calendar size={20} color="#134074" />
          </View>
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>EVENT REGISTRATIONS</Text>
            <Text style={styles.metricValue}>{analyticsData.eventRegistrations}</Text>
          </View>
        </View>

        {/* Usage Chart Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Usage</Text>
          </View>

          {/* Bar Chart Graphics */}
          <View style={styles.chartContainer}>
            {barData.map((bar, index) => <View key={index} style={styles.chartBarWrapper}>
                {bar.green && <View style={styles.tooltipPill}>
                    <Text style={styles.tooltipText}>{bar.label}</Text>
                  </View>}
                <View style={[styles.chartBar, {
              height: `${bar.val}%`
            }, bar.green ? styles.chartBarGreen : styles.chartBarBlue]} />
                <Text style={[styles.chartDayLabel, bar.green && styles.chartDayLabelActive]}>
                  {bar.day}
                </Text>
              </View>)}
          </View>
        </View>

        {/* System Config Card */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>System Config</Text>

          <View style={styles.configContentBlock}>
            {/* Server Uptime */}
            <View style={styles.configRowSpacing}>
              <View style={styles.configHeaderRow}>
                <Text style={styles.configLabelText}>Server Uptime</Text>
                <Text style={styles.configValueText}>99.9%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, {
                width: '99.9%'
              }]} />
              </View>
            </View>

            {/* DB Latency */}
            <View style={styles.configRowJustified}>
              <Text style={styles.configLabelText}>DB Latency</Text>
              <View style={styles.latencyIndicatorRow}>
                <View style={styles.latencyDotGreen} />
                <Text style={styles.latencyTextGreen}>Low</Text>
              </View>
            </View>

            <View style={styles.thinDivider} />

            {/* Lock Banner */}
            <View style={styles.lockBannerRow}>
              <Lock size={14} color="#cbd5e1" style={{
              marginRight: 6
            }} />
              <Text style={styles.lockBannerText}>
                Secure Administrative Session Active
              </Text>
            </View>
          </View>
        </View>

        {/* Top Performing Regions Card */}
        <View style={[styles.cardContainer, {
        marginBottom: 120
      }]}>
          <Text style={styles.cardTitle}>Top Performing Regions</Text>

          <View style={styles.regionsContainer}>
            {/* Maharashtra */}
            <View style={styles.regionRowSpacing}>
              <View style={styles.configHeaderRow}>
                <Text style={styles.regionTitleText}>Maharashtra (Mumbai Cluster)</Text>
                <Text style={styles.regionCapacityText}>88% Capacity</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, {
                width: '88%'
              }]} />
              </View>
            </View>

            {/* Delhi NCR */}
            <View style={styles.regionRowSpacing}>
              <View style={styles.configHeaderRow}>
                <Text style={styles.regionTitleText}>Delhi NCR</Text>
                <Text style={styles.regionCapacityText}>74% Capacity</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, {
                width: '74%'
              }]} />
              </View>
            </View>

            {/* Karnataka */}
            <View style={styles.regionRowSpacing}>
              <View style={styles.configHeaderRow}>
                <Text style={styles.regionTitleText}>Karnataka (Bangalore Hub)</Text>
                <Text style={styles.regionCapacityText}>62% Capacity</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, {
                width: '62%'
              }]} />
              </View>
            </View>
          </View>
        </View>
      </View>;
  };
  const renderMembershipsView = () => {
    const totalCountVal = parseInt(analyticsData.activeMemberships.replace(/,/g, '')) || 15000;
    const tierData = [{
      tier: 'Lifetime',
      count: Math.round(totalCountVal * 0.0667).toLocaleString()
    }, {
      tier: 'Premium',
      count: Math.round(totalCountVal * 0.5333).toLocaleString()
    }, {
      tier: 'Professional',
      count: Math.round(totalCountVal * 0.20).toLocaleString()
    }, {
      tier: 'Basic',
      count: Math.round(totalCountVal * 0.20).toLocaleString()
    }];
    return <View style={styles.tabContentContainer}>
        {/* Header Title with Live status */}
        <View style={styles.subHeaderSection}>
          <Text style={styles.subHeaderTitle}>Memberships</Text>
          <View style={styles.liveDataBadge}>
            <View style={styles.liveDataDot} />
            <Text style={styles.liveDataText}>Live Data</Text>
          </View>
        </View>

        {/* Total Active Memberships Card */}
        <View style={styles.metricCardFull}>
          <View style={styles.metricIconBox}>
            <Users size={20} color="#134074" />
          </View>
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>TOTAL ACTIVE MEMBERSHIPS</Text>
            <Text style={styles.metricValue}>{analyticsData.activeMemberships}</Text>
          </View>
        </View>

        {/* Membership Tier List Rows */}
        <View style={styles.tierListSection}>
          {tierData.map((item, idx) => <View key={idx} style={styles.tierRowCard}>
              <Text style={styles.tierRowTitle}>{item.tier}</Text>
              <View style={styles.tierRowStats}>
                <Text style={styles.tierRowCount}>{item.count}</Text>
                <Text style={styles.tierRowLabel}>Members</Text>
              </View>
            </View>)}
        </View>

        {/* Membership Analytics Dropdown section */}
        <View style={styles.sectionHeaderSpacing}>
          <Text style={styles.sectionHeadingTitle}>Membership Analytics</Text>
        </View>

        {/* KPI Cards with Left Border Accents */}
        <View style={styles.kpiContainer}>
          {/* Card 1: Total Revenue */}
          <View style={[styles.kpiCard, {
          borderLeftColor: '#0D3866'
        }]}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiTitle}>Total Revenue</Text>
              <CreditCard size={16} color="#0D3866" />
            </View>
            <Text style={styles.kpiValue}>{analyticsData.membershipRevenue}</Text>
            <Text style={styles.kpiTrendGreen}>↑ 12%</Text>
          </View>

          {/* Card 2: Conversion Rate */}
          <View style={[styles.kpiCard, {
          borderLeftColor: '#70B62C'
        }]}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiTitle}>Conversion Rate</Text>
              <TrendingUp size={16} color="#70B62C" />
            </View>
            <Text style={styles.kpiValue}>{analyticsData.conversionRate}</Text>
            <Text style={styles.kpiTrendGreen}>↑ 5.1%</Text>
          </View>

          {/* Card 3: New Sales */}
          <View style={[styles.kpiCard, {
          borderLeftColor: '#475569'
        }]}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiTitle}>New Sales (MTD)</Text>
              <UserPlus size={16} color="#475569" />
            </View>
            <Text style={styles.kpiValue}>{analyticsData.newSales}</Text>
            <Text style={styles.kpiTrendRed}>↓ 3%</Text>
          </View>
        </View>

        {/* Tier Distribution Donut chart */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Tier Distribution</Text>
          {renderDonutChart()}
          <View style={styles.donutLegendContainer}>
            {[{
            label: 'Platinum Fellow',
            val: `${analyticsData.distribution.platinum}%`,
            color: '#0D3866'
          }, {
            label: 'Senior Associate',
            val: `${analyticsData.distribution.senior}%`,
            color: '#70B62C'
          }, {
            label: 'Associate',
            val: `${analyticsData.distribution.associate}%`,
            color: '#1D4ED8'
          }, {
            label: 'Student',
            val: `${analyticsData.distribution.student}%`,
            color: '#DBEAFE'
          }].map((leg, idx) => <View key={idx} style={styles.donutLegendItem}>
                <View style={styles.legendLabelRow}>
                  <View style={[styles.legendIndicatorColor, {
                backgroundColor: leg.color
              }]} />
                  <Text style={styles.legendText}>{leg.label}</Text>
                </View>
                <Text style={styles.legendPercentage}>{leg.val}</Text>
              </View>)}
          </View>
        </View>

        {/* Recent Activity Card */}
        <View style={[styles.cardContainer, {
        marginBottom: 140
      }]}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {[{
            name: 'Julian Sterling',
            time: 'Joined 45 mins ago',
            badge: 'Lifetime',
            avatar: require('../../assets/admin_profile.png')
          }, {
            name: 'Sarah Chen',
            time: 'Joined 2 hours ago',
            badge: 'Premium',
            avatar: require('../../assets/elena_profile.png')
          }, {
            name: 'Marcus Thorne',
            time: 'Joined 5 hours ago',
            badge: 'Basic',
            avatar: require('../../assets/admin_profile.png')
          }].map((act, index) => <View key={index} style={[styles.activityItem, index === 2 && {
            borderBottomWidth: 0
          }]}>
                <Image source={act.avatar} style={styles.activityAvatar} />
                <View style={styles.activityInfo}>
                  <Text style={styles.activityName}>{act.name}</Text>
                  <Text style={styles.activityTime}>{act.time}</Text>
                </View>
                <View style={styles.badgePill}>
                  <Text style={styles.badgeText}>{act.badge}</Text>
                </View>
              </View>)}
          </View>
        </View>
      </View>;
  };
  const renderHeader = () => {
    return <View style={styles.headerContainer}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={22} color="#0D3866" />
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>Analytics</Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabSwitcherOuter}>
          <TouchableOpacity onPress={() => setActiveSegment('general')} style={[styles.tabSwitcherBtn, activeSegment === 'general' && styles.tabSwitcherBtnActive]}>
            <Text style={[styles.tabSwitcherText, activeSegment === 'general' && styles.tabSwitcherTextActive]}>
              General Analysis
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveSegment('memberships')} style={[styles.tabSwitcherBtn, activeSegment === 'memberships' && styles.tabSwitcherBtnActive]}>
            <Text style={[styles.tabSwitcherText, activeSegment === 'memberships' && styles.tabSwitcherTextActive]}>
              Memberships Analysis
            </Text>
          </TouchableOpacity>
        </View>
      </View>;
  };
  const renderFooterNav = () => {
    return <View style={styles.footerContainer}>
        <View style={styles.footerTabBar}>
          <TouchableOpacity style={styles.footerTabItem} onPress={() => onTabPress?.('feed')}>
            <HomeIcon size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.footerTabItem, styles.footerTabItemActive]} onPress={() => {}}>
            <BarChart3 size={22} color="#70B62C" />
            <Text style={styles.footerTabLabel}>Analytics</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerTabItem} onPress={() => onTabPress?.('posts_all')}>
            <Newspaper size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerTabItem} onPress={() => onTabPress?.('Connect')}>
            <Users size={22} color="#134074" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerTabItem} onPress={() => onTabPress?.('directory')}>
            <DirectoryBookIcon color="#134074" />
          </TouchableOpacity>
        </View>
      </View>;
  };
  return <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        {activeSegment === 'general' ? renderGeneralView() : renderMembershipsView()}
      </ScrollView>

      {/* Footer Fallback (Visible only when rendering in standalone mode) */}
      {!navigation && renderFooterNav()}

      {/* Floating Scroll to Top */}
      {showScrollTop && <TouchableOpacity onPress={scrollToTop} activeOpacity={0.85} style={styles.scrollTopButton}>
          <ArrowUp size={20} color="white" />
        </TouchableOpacity>}
    </SafeAreaView>;
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
    backgroundColor: '#F4F7FB'
  },
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#E9F0FA',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    paddingBottom: 12
  },
  headerTitleRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  backButton: {
    padding: 8,
    marginLeft: -8
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D3866',
    marginLeft: 8
  },
  tabSwitcherOuter: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1
  },
  tabSwitcherBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8
  },
  tabSwitcherBtnActive: {
    backgroundColor: '#0D3866'
  },
  tabSwitcherText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'center'
  },
  tabSwitcherTextActive: {
    color: '#FFFFFF'
  },
  scrollContainer: {
    flex: 1
  },
  tabContentContainer: {
    padding: 16
  },
  metricsGridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  metricCardHalf: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1
  },
  metricCardFull: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 16
  },
  metricIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  metricInfo: {
    flex: 1
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0D3866'
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
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
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D3866'
  },
  periodSwitcherTrack: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 20,
    padding: 2
  },
  periodSwitcherBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14
  },
  periodSwitcherBtnActive: {
    backgroundColor: '#0D3866'
  },
  periodSwitcherText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E40AF'
  },
  periodSwitcherTextActive: {
    color: '#FFFFFF'
  },
  chartContainer: {
    height: 160,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingHorizontal: 4
  },
  chartBarWrapper: {
    alignItems: 'center',
    flex: 1,
    position: 'relative'
  },
  chartBar: {
    width: 14,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4
  },
  chartBarBlue: {
    backgroundColor: '#0D3866'
  },
  chartBarGreen: {
    backgroundColor: '#70B62C'
  },
  tooltipPill: {
    position: 'absolute',
    top: -24,
    backgroundColor: '#70B62C',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    zIndex: 10
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800'
  },
  chartDayLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 8
  },
  chartDayLabelActive: {
    color: '#0D3866',
    fontWeight: '800'
  },
  configContentBlock: {
    marginTop: 16
  },
  configRowSpacing: {
    marginBottom: 16
  },
  configHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  configRowJustified: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  configLabelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b'
  },
  configValueText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D3866'
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 6
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0D3866',
    borderRadius: 4
  },
  latencyIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  latencyDotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#70B62C',
    marginRight: 6
  },
  latencyTextGreen: {
    fontSize: 13,
    fontWeight: '800',
    color: '#70B62C'
  },
  thinDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12
  },
  lockBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4
  },
  lockBannerText: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '600'
  },
  regionsContainer: {
    marginTop: 16
  },
  regionRowSpacing: {
    marginBottom: 20
  },
  regionTitleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D3866',
    flex: 1,
    marginRight: 10
  },
  regionCapacityText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#70B62C'
  },
  subHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 16
  },
  subHeaderTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0D3866'
  },
  liveDataBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  liveDataDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#70B62C',
    marginRight: 5
  },
  liveDataText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#70B62C'
  },
  tierListSection: {
    gap: 8,
    marginBottom: 20
  },
  tierRowCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1
  },
  tierRowTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D3866'
  },
  tierRowStats: {
    alignItems: 'flex-end'
  },
  tierRowCount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B'
  },
  tierRowLabel: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 1
  },
  sectionHeaderSpacing: {
    marginTop: 8,
    marginBottom: 14
  },
  sectionHeadingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D3866',
    marginBottom: 8
  },
  dropdownSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D3866'
  },
  kpiContainer: {
    gap: 12,
    marginBottom: 16
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 5,
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  kpiTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b'
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0D3866',
    marginBottom: 2
  },
  kpiTrendGreen: {
    fontSize: 11,
    fontWeight: '700',
    color: '#70B62C'
  },
  kpiTrendRed: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626'
  },
  donutContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 20,
    height: 120
  },
  donutCenterTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  donutCenterValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D3866'
  },
  donutCenterLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  donutLegendContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
    gap: 10
  },
  donutLegendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  legendLabelRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  legendIndicatorColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569'
  },
  legendPercentage: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B'
  },
  activityList: {
    marginTop: 8
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  activityAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    marginRight: 12
  },
  activityInfo: {
    flex: 1
  },
  activityName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D3866'
  },
  activityTime: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 1
  },
  badgePill: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D3866'
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
  }
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Shield,
  Clock,
  Download,
  AlertTriangle,
} from 'lucide-react-native';
import { supabase } from '../config/supabase';

interface QueueItem {
  id: string;
  user_name: string;
  designation: string;
  blockchain_verified: boolean;
  warning_flag?: string;
  avatar: any;
}

interface ConnectionsScreenProps {
  onBack?: () => void;
}

export const ConnectionsScreen: React.FC<ConnectionsScreenProps> = ({ onBack }) => {
  const [queue, setQueue] = useState<QueueItem[]>([
    {
      id: '1',
      user_name: 'Marcus Vance',
      designation: 'Financial Auditor',
      blockchain_verified: true,
      avatar: require('../../assets/admin_profile.png'),
    },
    {
      id: '2',
      user_name: 'Julian Sterling',
      designation: 'CPA Associate',
      blockchain_verified: false,
      warning_flag: 'Previous Association: Pending Clarification',
      avatar: require('../../assets/elena_profile.png'),
    },
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 'log1', action: 'Approved Elena Rodriguez', timestamp: '2h ago', actor: 'Admin VGM' },
    { id: 'log2', action: 'Approved Alistair Vance', timestamp: '5h ago', actor: 'Admin VGM' },
  ]);

  // Fetch queue from Supabase if active
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const { data, error } = await supabase
          .from('connections_queue')
          .select('*, profiles(full_name, department)')
          .eq('verification_status', 'pending');
        
        if (data && data.length > 0) {
          const formatted = data.map((item: any) => ({
            id: item.id,
            user_name: item.profiles?.full_name || 'Anonymous User',
            designation: item.profiles?.department || 'Member Request',
            blockchain_verified: item.blockchain_verified,
            warning_flag: item.warning_flag,
            avatar: require('../../assets/admin_profile.png'),
          }));
          setQueue(formatted);
        }
      } catch (e) {
        // Fallback to mock
      }
    };
    fetchQueue();
  }, []);

  const handleAction = async (id: string, status: 'approved' | 'declined') => {
    try {
      const { error } = await supabase
        .from('connections_queue')
        .update({ verification_status: status, updated_at: new Date() })
        .eq('id', id);

      if (error) throw error;
      
      Alert.alert('State Updated', `Verification request has been ${status}.`);
      setQueue(queue.filter((q) => q.id !== id));
      
      const newLog = {
        id: Date.now().toString(),
        action: `${status.charAt(0).toUpperCase() + status.slice(1)} user ${queue.find((q) => q.id === id)?.user_name}`,
        timestamp: 'Just now',
        actor: 'Admin VGM',
      };
      setAuditLogs([newLog, ...auditLogs]);
    } catch (err) {
      // Local execution fallback
      Alert.alert('Local Success', `Request has been marked as ${status} locally.`);
      setQueue(queue.filter((q) => q.id !== id));
      const newLog = {
        id: Date.now().toString(),
        action: `${status.charAt(0).toUpperCase() + status.slice(1)} user ${queue.find((q) => q.id === id)?.user_name}`,
        timestamp: 'Just now',
        actor: 'Admin VGM (Offline)',
      };
      setAuditLogs([newLog, ...auditLogs]);
    }
  };

  const handleExportLogs = () => {
    Alert.alert('Audit Logs Exported', 'Historical audit log sheet has been compiled and downloaded as CSV.');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      {/* Top Header */}
      <View className="px-4 py-3 bg-[#E9F0FA] border-b border-blue-100 flex-row items-center">
        {onBack && (
          <TouchableOpacity onPress={onBack} className="p-1.5 -ml-1 mr-3">
            <ArrowLeft size={22} color="#134074" />
          </TouchableOpacity>
        )}
        <Text className="text-xl font-bold text-[#134074]">Verification Queue</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={true}>
        {/* Verification Queue Section */}
        <Text className="text-lg font-bold text-[#134074] mb-3">Pending Verification</Text>

        {queue.length === 0 ? (
          <View className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm items-center justify-center mb-6">
            <CheckCircle size={36} color="#70B62C" />
            <Text className="text-slate-500 font-bold mt-3 text-sm">All verification items resolved</Text>
          </View>
        ) : (
          queue.map((item) => (
            <View key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4 mb-3.5 shadow-sm">
              <View className="flex-row items-center mb-3">
                <Image source={item.avatar} className="w-12 h-12 rounded-full border border-slate-200" />
                <View className="ml-3">
                  <Text className="font-extrabold text-slate-800 text-[15px]">{item.user_name}</Text>
                  <Text className="text-xs text-slate-500 font-semibold">{item.designation}</Text>
                </View>
              </View>

              {/* Status Flag */}
              {item.blockchain_verified ? (
                <View className="bg-green-50 border border-green-100 rounded-lg p-2.5 flex-row items-center mb-4 space-x-2">
                  <Shield size={16} color="#3F7E1F" />
                  <Text className="text-[#3F7E1F] text-xs font-bold">Credentials Verified via Blockchain</Text>
                </View>
              ) : (
                item.warning_flag && (
                  <View className="bg-red-50 border border-red-100 rounded-lg p-2.5 flex-row items-center mb-4 space-x-2">
                    <AlertTriangle size={16} color="#8A1F1F" />
                    <Text className="text-[#8A1F1F] text-xs font-bold">{item.warning_flag}</Text>
                  </View>
                )
              )}

              {/* Action Buttons */}
              <View className="flex-row space-x-3.5 pt-3 border-t border-slate-100">
                <TouchableOpacity
                  onPress={() => handleAction(item.id, 'declined')}
                  className="flex-1 bg-white border border-slate-200 rounded-lg py-2 flex-row justify-center items-center space-x-1"
                >
                  <XCircle size={14} color="#8A1F1F" />
                  <Text className="text-[#8A1F1F] font-bold text-xs">Decline</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleAction(item.id, 'approved')}
                  className="flex-1 bg-[#134074] rounded-lg py-2 flex-row justify-center items-center space-x-1"
                >
                  <CheckCircle size={14} color="white" />
                  <Text className="text-white font-bold text-xs">Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Audit Log Section */}
        <View className="flex-row justify-between items-center mb-3 mt-4">
          <Text className="text-lg font-bold text-[#134074]">Historical Audit Log</Text>
          <TouchableOpacity onPress={handleExportLogs} className="flex-row items-center space-x-1 bg-blue-50 border border-blue-100 rounded px-2.5 py-1">
            <Download size={12} color="#134074" />
            <Text className="text-[#134074] text-[10px] font-bold">Export Logs</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white border border-slate-150 rounded-2xl p-4 shadow-sm mb-12">
          <View className="space-y-3">
            {auditLogs.map((log) => (
              <View key={log.id} className="flex-row justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
                <View>
                  <Text className="text-slate-800 font-bold text-xs">{log.action}</Text>
                  <Text className="text-[10px] text-slate-400 font-semibold mt-0.5">Verified by {log.actor}</Text>
                </View>
                <View className="flex-row items-center space-x-1">
                  <Clock size={11} color="#94a3b8" />
                  <Text className="text-[10px] text-slate-400 font-semibold">{log.timestamp}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

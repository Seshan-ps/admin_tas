import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabase';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMessage('');
    
    if (!username || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    try {
      // Bind credentials directly to Supabase authentication layer
      const email = username.includes('@') ? username : `${username.toLowerCase()}@tas-governance.org`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback to local admin user for preview/offline purposes
        if (
          (username.trim() === 'Admin' || username.trim().toUpperCase() === 'S') && 
          (password === 'Admin@12' || password === 'Admin@123' || password === 'S' || password === 's')
        ) {
          setIsLoading(false);
          onLoginSuccess();
          return;
        }
        throw error;
      }

      setIsLoading(false);
      onLoginSuccess();
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error.message || 'Invalid username or password.\nPlease try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <Image
        source={require('../../assets/background.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={true}
          className="px-6 py-8"
        >
          {/* Logo Header */}
          <View className="items-center mb-1 mt-1">
            <Image
              source={require('../../assets/logo.png')}
              style={{ width: 240, height: 95 }}
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-[#0D3866] mt-1 tracking-wide">
              Admin Portal
            </Text>
          </View>

          {/* Login Card */}
          <View 
            style={{ backgroundColor: '#CBE0F8', borderColor: 'rgba(219, 234, 254, 0.6)' }}
            className="rounded-[32px] p-6 shadow-sm border mb-6"
          >
            <Text className="text-2xl font-bold text-center text-[#0D3866] mb-1">
              Login
            </Text>
            <Text className="text-[14px] text-center text-[#334D6E] mb-6">
              Authorized Administrative Access Only
            </Text>

            {/* Username Field */}
            <View className="mb-4">
              <Text className="text-[#334D6E] font-medium mb-1.5 text-[14px] ml-1">
                Username
              </Text>
              <View 
                style={{ backgroundColor: '#FFFFFF', borderColor: '#AEC8E8' }}
                className="flex-row items-center border rounded-lg px-3 py-2.5"
              >
                <Feather name="user" size={18} color="#64748b" className="mr-2.5" />
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter username"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="none"
                  className="flex-1 text-slate-800 text-[15px] p-0"
                  style={Platform.OS === 'web' ? { outlineStyle: 'none', borderStyle: 'none' } as any : undefined}
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="mb-5">
              <Text className="text-[#334D6E] font-medium mb-1.5 text-[14px] ml-1">
                Password
              </Text>
              <View 
                style={{ backgroundColor: '#FFFFFF', borderColor: '#AEC8E8' }}
                className="flex-row items-center border rounded-lg px-3 py-2.5 relative"
              >
                <Feather name="lock" size={18} color="#64748b" className="mr-2.5" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter Password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  className="flex-1 text-slate-800 text-[15px] p-0 pr-8"
                  style={Platform.OS === 'web' ? { outlineStyle: 'none', borderStyle: 'none' } as any : undefined}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 10, zIndex: 10 } as any}
                  className="p-1"
                >
                  <Feather
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={18}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Error Banner */}
            {errorMessage ? (
              <View className="bg-[#D99A9A]/90 border border-red-300 rounded-xl p-3 flex-row items-center mb-5 space-x-3">
                <Ionicons name="alert-circle-outline" size={22} color="#8A1F1F" />
                <Text className="text-[#6B1A1A] text-[13px] font-medium flex-1">
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
              style={{ backgroundColor: '#0D3866' }}
              className="rounded-lg py-3 flex-row justify-center items-center space-x-2 shadow-sm active:bg-[#0a2c52]"
            >
              <Text className="text-white font-bold text-base">
                {isLoading ? 'Signing In...' : 'Login'}
              </Text>
              {!isLoading && <Feather name="log-in" size={16} color="white" />}
            </TouchableOpacity>

            {/* Divider Line */}
            <View className="h-[1px] bg-blue-200/50 my-5" />

            {/* SSL badge */}
            <View className="flex-row justify-center items-center space-x-1.5">
              <Ionicons name="shield-checkmark" size={16} color="#3E7016" />
              <Text className="text-[#3E7016] text-[12px] font-semibold">
                Secure SSL-Encrypted Connection
              </Text>
            </View>
          </View>

          {/* Footer Branding & Links */}
          <View className="items-center mt-auto pt-6">
            <Text className="text-[11px] text-slate-500 text-center mb-1">
              © 2024 Texcity Accountants Society. Secure Administrative Access.
            </Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity><Text className="text-[11px] text-slate-500 underline">Privacy Policy</Text></TouchableOpacity>
              <TouchableOpacity><Text className="text-[11px] text-slate-500 underline">Security Standards</Text></TouchableOpacity>
              <TouchableOpacity><Text className="text-[11px] text-slate-500 underline">Support</Text></TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

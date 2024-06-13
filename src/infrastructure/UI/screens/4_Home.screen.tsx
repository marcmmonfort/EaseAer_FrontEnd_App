import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import ProfileScreen from './5_UserProfile.screen';
import { ImageBackground, StyleSheet, Image, TouchableOpacity, View, Text, Platform } from 'react-native';
import MapScreen from './10_AirportMap.screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { useNavigation } from "@react-navigation/native";
import ShopScreen from './31_ManagerShop.screen';
import EntertainmentScreen from './32_ManagerEntertainment.screen';
import FlightsScreen from './33_ManagerFlights.screen';
import TimesScreen from './34_ManagerTime.screen';

async function loadFonts() {
  await Font.loadAsync({
    'Corporate': require('../../../../assets/easeaer_fonts/Corporate_Font.ttf'),
    'Emirates': require('../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
    'SFNS': require('../../../../assets/easeaer_fonts/SF_Font.ttf'),
  });
}

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const titleFont = Platform.select({
    ios: 'Emirates',
    android: 'Emirates',
  });
  const subtitleFont = Platform.select({
    ios: 'Corporate',
    android: 'Corporate',
  });
  const bodyFont = Platform.select({
    ios: 'SFNS',
    android: 'SFNS',
  });

  const [initialUser, setInitialUser] = useState('');

  useEffect(() => {
    const loadNameUser = async () => {
      try {
        const nameUser = await AsyncStorage.getItem('nameUser');
        console.log("Nombre: " + nameUser);
        if (nameUser) {
          const firstLetter = nameUser.charAt(1).toUpperCase();
          setInitialUser(firstLetter);
        }
      } catch (error) {
        console.error('Error Getting Initial Letter', error);
      }
    };
    loadNameUser();
  }, []);

  const navigation = useNavigation();

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('LoginScreen');
  };

  const goToProfile = async () => {
    navigation.navigate('Profile');
  };

  const goToHelp = async () => {
    navigation.navigate('Help');
  };
  
  return (
    
    <Tab.Navigator screenOptions={{ tabBarStyle: { backgroundColor: 'white', borderTopWidth: 0 }, tabBarShowLabel: false,  }}>
      
      <Tab.Screen name="Back" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => (
        <TouchableOpacity onPress={() => { logout() }}>
          <MaterialCommunityIcons name="arrow-left" size={30} color='#321e29' />
        </TouchableOpacity>
        ), headerStyle: { backgroundColor: 'white', borderBottomWidth: 0, shadowOpacity: 0 }, headerTitleStyle: { color: '#321e29', fontSize: 30 },
      }} />

      <Tab.Screen name="Map" component={TimesScreen} options={{ tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="timer-outline" size={25} color='#321e29' />
        ), headerStyle: { backgroundColor: 'white', borderBottomWidth: 0, shadowOpacity: 0 }, headerTitleStyle: { color: '#321e29', fontSize: 30 },
        headerTitle: () => ( <Image source={require('../../../../assets/easeaer_icons/EaseAer_Logo_3_Png.png')} style={{ width: 132, marginBottom: 10 }} resizeMode="contain"/>
        ),
        headerLeft: () => (
          <TouchableOpacity onPress={() => { goToProfile() }}>
            <View style={{ width: 36, height: 36, backgroundColor: '#875a31', borderRadius: 10, marginBottom: 10, marginLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 24, fontFamily: titleFont,  }}>{initialUser}</Text>
            </View>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => { goToHelp() }}>
            <View style={{ width: 36, height: 36, backgroundColor: '#321e29', borderRadius: 10, marginBottom: 10, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialCommunityIcons name="headset" size={20} color='white' />
            </View>
          </TouchableOpacity>
        ),
      }} />

      <Tab.Screen name="Flights" component={FlightsScreen} options={{ tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="airplane" size={25} color='#321e29' />
        ), headerStyle: { backgroundColor: 'white', borderBottomWidth: 0, shadowOpacity: 0 }, headerTitleStyle: { color: '#321e29', fontSize: 30 },
        headerTitle: () => ( <Image source={require('../../../../assets/easeaer_icons/EaseAer_Logo_3_Png.png')} style={{ width: 132, marginBottom: 10 }} resizeMode="contain"/>
        ),
        headerLeft: () => (
          <TouchableOpacity onPress={() => { goToProfile() }}>
            <View style={{ width: 36, height: 36, backgroundColor: '#875a31', borderRadius: 10, marginBottom: 10, marginLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 24, fontFamily: titleFont,  }}>{initialUser}</Text>
            </View>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => { goToHelp() }}>
            <View style={{ width: 36, height: 36, backgroundColor: '#321e29', borderRadius: 10, marginBottom: 10, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialCommunityIcons name="headset" size={20} color='white' />
            </View>
          </TouchableOpacity>
        ),
      }} />
      
      <Tab.Screen name="Shopping" component={ShopScreen} options={{ tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="shopping" size={25} color='#321e29' />
        ), headerStyle: { backgroundColor: 'white', borderBottomWidth: 0, shadowOpacity: 0 }, headerTitleStyle: { color: '#321e29', fontSize: 30 },
        headerTitle: () => ( <Image source={require('../../../../assets/easeaer_icons/EaseAer_Logo_3_Png.png')} style={{ width: 132, marginBottom: 10 }} resizeMode="contain"/>
        ),
        headerLeft: () => (
          <TouchableOpacity onPress={() => { goToProfile() }}>
            <View style={{ width: 36, height: 36, backgroundColor: '#875a31', borderRadius: 10, marginBottom: 10, marginLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 24, fontFamily: titleFont,  }}>{initialUser}</Text>
            </View>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => { goToHelp() }}>
            <View style={{ width: 36, height: 36, backgroundColor: '#321e29', borderRadius: 10, marginBottom: 10, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialCommunityIcons name="headset" size={20} color='white' />
            </View>
          </TouchableOpacity>
        ),
      }} />

      <Tab.Screen name="Entertainment" component={EntertainmentScreen} options={{ tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="play" size={25} color='#321e29' />
        ), headerStyle: { backgroundColor: 'white', borderBottomWidth: 0, shadowOpacity: 0 }, 
        headerTitle: () => ( <Image source={require('../../../../assets/easeaer_icons/EaseAer_Logo_3_Png.png')} style={{ width: 132, marginBottom: 10 }} resizeMode="contain"/>
        ), headerTitleStyle: { color: '#321e29', fontSize: 30 },
        headerLeft: () => (
          <TouchableOpacity onPress={() => { goToProfile() }}>
            <View style={{ width: 36, height: 36, backgroundColor: '#875a31', borderRadius: 10, marginBottom: 10, marginLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 24, fontFamily: titleFont,  }}>{initialUser}</Text>
            </View>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => { goToHelp() }}>
            <View style={{ width: 36, height: 36, backgroundColor: '#321e29', borderRadius: 10, marginBottom: 10, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialCommunityIcons name="headset" size={20} color='white' />
            </View>
          </TouchableOpacity>
        ),
      }} />

    </Tab.Navigator>
    
  );
}
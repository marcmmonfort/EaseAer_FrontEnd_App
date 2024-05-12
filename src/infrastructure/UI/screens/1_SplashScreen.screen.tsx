import React, { useEffect, useState } from 'react';
import { ImageBackground, Image, View, StyleSheet, Text, Platform } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import NormalText from '../components/texts/NormalText';
import Video from 'react-native-video';
import jwtDecode from 'jwt-decode';
import { DecodedToken } from '../../../domain/decodedToken';
import { useTranslation } from 'react-i18next';

async function loadFonts() {
  await Font.loadAsync({
    'Corporate': require('../../../../assets/easeaer_fonts/Corporate_Font.ttf'),
    'Emirates': require('../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
    'SFNS': require('../../../../assets/easeaer_fonts/SF_Font.ttf'),
  });
}

export default function SplashScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const {t}=useTranslation();

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

  const navigation = useNavigation();

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    footerContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      marginBottom: 32,
    },
    image: {
      height: 80,
      resizeMode: 'contain',
      marginBottom: -6,
    },
    imageEA: {
      height: 40,
      resizeMode: 'contain',
      marginTop: 0,
    },
    text_normal: {
      color: 'white',
      fontSize: 20,
      marginBottom: 10,
    },
    creditsText: {
      color: '#875a31',
      fontFamily: bodyFont,
      fontSize: 18,
      marginTop: 8,
    },
    versionText: {
      color: '#321E29',
      fontFamily: subtitleFont,
      fontSize: 22,
      marginBottom: 0,
    },
    footerText: {
      color: '#875A31',
      fontFamily: bodyFont,
      fontSize: 14,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
  });

  useEffect(() => {
    setTimeout(() => {
        const checkToken = async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (token) {
                const decodedToken : DecodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Obtener la hora actual en segundos
                console.log("Decoded Token: ", decodedToken);

                if (decodedToken.exp < currentTime) {
                  // navigation.navigate('LoginScreen' as never);
                } else {
                  console.log("Valid Token");
                  // navigation.navigate('HomeScreen' as never, { screen: 'ProfileScreen' } as never);
                }
                // navigation.navigate('HomeScreen' as never, { screen: 'ProfileScreen' } as never);

              } else {
                // navigation.navigate('LoginScreen' as never);
              }
            } catch (error) {
              console.log('Error Obteniendo El Token', error);
            }
          };
        checkToken();
    }, 3600);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground style={[styles.backgroundImage, { backgroundColor: '#e9e8e6' }]}>
      <View style={styles.mainContainer}>
        <View style={styles.mainContainer}>
            <Image source={require('../../../../assets/easeaer_icons/EaseAer_Logo_2_Png.png')} style={styles.image} />
            <Image source={require('../../../../assets/easeaer_icons/EaseAer_Logo_1_Png.png')} style={styles.imageEA} />
            <Text style={styles.creditsText}>1.0.0</Text>
        </View>
        <View style={styles.footerContainer}>
            <Text style={styles.versionText}>Barcelona - El Prat Airport</Text>
            <Text style={styles.footerText}>@easeaer</Text>
        </View>
      </View>
    </ImageBackground> 
  );
}
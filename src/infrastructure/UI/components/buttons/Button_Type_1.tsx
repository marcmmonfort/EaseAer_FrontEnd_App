import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ButtonGradientProps } from './Types';

import * as Font from 'expo-font';
import { useTranslation } from 'react-i18next';

const Button_Type_1 = ({ onPress, containerStyle, buttonStyle, textStyle }: ButtonGradientProps) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const {t}=useTranslation();

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Corporate': require('../../../../../assets/easeaer_fonts/Corporate_Font.ttf'),
        'Emirates': require('../../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
        'SFNS': require('../../../../../assets/easeaer_fonts/SF_Font.ttf'),
      });
    }

    loadFonts().then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const titleFont = Platform.select({
    ios: 'Rafaella',
    android: 'Rafaella',
  });
  const bodyFont = Platform.select({
    ios: 'SFNS',
    android: 'SFNS',
  });

  const styles = StyleSheet.create({
    container: {
      width: 200,
      alignItems: 'center',
      marginTop: 50,
    },
    button: {
      marginTop: -30,
      height: 38,
      width: 120,
      borderRadius: 50,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontFamily: bodyFont,
      fontWeight: 'bold',
      fontSize: 18,
      color: 'black',
    },
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress}>
      <LinearGradient colors={['#66fcf1', '#66fcf1']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={[styles.button, buttonStyle]}>
        <Text style={[styles.text, textStyle]}>{t("Log_in")}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Button_Type_1;
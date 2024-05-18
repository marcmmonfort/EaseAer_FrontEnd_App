import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import { ButtonGradientProps } from './Types';
import { useTranslation } from 'react-i18next';

async function loadFonts() {
  await Font.loadAsync({
    'Corporate': require('../../../../../assets/easeaer_fonts/Corporate_Font.ttf'),
    'Emirates': require('../../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
    'SFNS': require('../../../../../assets/easeaer_fonts/SF_Font.ttf'),
  });
}

const ButtonGradientBirthdate = ({ onPress, containerStyle, buttonStyle, textStyle }: ButtonGradientProps) => {
  const {t} = useTranslation();
  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress}>
      <LinearGradient colors={['#b3b0a1', '#b3b0a1']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={[styles.button, buttonStyle]}>
        <Text style={[styles.text, textStyle]}>Select Birthdate</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 0,
  },
  button: {
    marginTop: 0,
    height: 38,
    borderRadius: 12,
    width: 180,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    fontFamily: subtitleFont,
  },
  input: {
    height: 40,
  }
});

export default ButtonGradientBirthdate;

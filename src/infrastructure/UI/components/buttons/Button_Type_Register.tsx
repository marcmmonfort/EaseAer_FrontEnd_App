import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ButtonGradientProps } from './Types';

import * as Font from 'expo-font';
import { useTranslation } from 'react-i18next';

const ButtonGradientRegister = ({ onPress, containerStyle, buttonStyle, textStyle }: ButtonGradientProps) => {
  const {t}= useTranslation();
  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress}>
      <LinearGradient
        colors={['#66fcf1', '#66fcf1']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.button, buttonStyle]}
      >
        <Text style={[styles.text, textStyle]}>{t("Sign_Up")}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    alignItems: 'center',
    marginTop: 60,
  },
  button: {
    marginTop: -44,
    height: 28,
    width: 120,
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    //fontFamily: 'SF UI Display',
    fontWeight: 'bold',
    fontSize: 14,
    color: 'black',
  },
});

export default ButtonGradientRegister;

import React, { FunctionComponent } from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';
import * as Font from 'expo-font';
import { StyledTextInputProps } from './Types';

async function loadFonts() {
    await Font.loadAsync({
      'Corporate': require('../../../../../assets/easeaer_fonts/Corporate_Font.ttf'),
      'Emirates': require('../../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
      'SFNS': require('../../../../../assets/easeaer_fonts/SF_Font.ttf'),
    });
  }

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
    textInput: {
        fontFamily: subtitleFont,
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        borderWidth: 0,
        width: '68%',
        height: 55,
        marginTop: 20,
        borderRadius: 12,
        backgroundColor: '#b3b0a1',
        paddingStart: 10,
    },
});

const StyledTextInputs: FunctionComponent<StyledTextInputProps> = ({ placeholder, style, value, onChangeText, secureTextEntry, editable, ...props }) => {
    return <TextInput placeholder={placeholder} style={[styles.textInput, style]} {...props} value={value}
    onChangeText={onChangeText} secureTextEntry={secureTextEntry} editable={editable}/>;
  };

export default StyledTextInputs;
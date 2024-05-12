import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Platform } from 'react-native';
import * as Font from 'expo-font';

async function loadFonts() {
  await Font.loadAsync({
    'Corporate': require('../../../../../assets/easeaer_fonts/Corporate_Font.ttf'),
    'Emirates': require('../../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
    'SFNS': require('../../../../../assets/easeaer_fonts/SF_Font.ttf'),
  });
}

interface SearchBarProps {
  onSearch: (searchText: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
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

  const handleChangeText = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    input: {
      flex: 1,
      height: 40,
      borderColor: 'transparent',
      fontFamily: bodyFont,
      backgroundColor: '#66fcf1',
      borderWidth: 1,
      paddingHorizontal: 10,
      margin: 20,
      borderRadius: 10,
      paddingStart: 10,
    },
  });

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Search" value={searchText} onChangeText={handleChangeText}/>
    </View>
  );
};


export default SearchBar;
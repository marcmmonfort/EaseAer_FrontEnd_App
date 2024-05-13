import React, { useEffect, useState } from "react";
import { Button, TextInput, Text, Alert, View, Platform, ImageBackground, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MainContainer from "../../components/containers/Main";
import SubTitle from "../../components/texts/Subtitle";
import StyledTextInputs from "../../components/inputs/StyledTextInputs";
import ButtonGradientNext from "../../components/buttons/Button_Type_Next";
import ButtonGradientBack from "../../components/buttons/Button_Type_2";
import { StyleSheet } from "react-native";
import * as Font from 'expo-font';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";

async function loadFonts() {
  await Font.loadAsync({
    'Corporate': require('../../../../../assets/easeaer_fonts/Corporate_Font.ttf'),
    'Emirates': require('../../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
    'SFNS': require('../../../../../assets/easeaer_fonts/SF_Font.ttf'),
  });
}

export default function ScreenRegisterInicial() {
  const [appUser, setAppUser] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [surnameUser, setSurnameUser] = useState("");
  const navigation = useNavigation();
  const {t} = useTranslation();

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

  const handleGoToScreenRegisterB = () => {
    if (!appUser || !nameUser || !surnameUser) {
      Alert.alert("EaseAer", "Incomplete Fields");
    } else {
      navigation.navigate("ScreenRegisterB" as any, { appUser, nameUser, surnameUser } as any);
    }
  };

  const handleGoBack = () => {
    navigation.navigate("LoginScreen" as never);
  };

  const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    requiredText: {
      color: 'yellow',
      marginTop: 10,
      fontFamily: bodyFont,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    mainContainer: {
      backgroundColor: 'transparent',
    },
    input: {
      width: 300,
      height: 40,
    },
    nextBackButton: {
      margin: 6,
      padding: 6,
      backgroundColor: "#66fcf1",
      borderRadius: 20,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignSelf: "center",
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 16,
      color: '#000',
      marginTop: 0,
      marginBottom: 0,
      alignItems: 'center',
    },
    nextBackButtonText: {
      fontFamily: bodyFont,
      fontSize: 16,
      color: '#000',
    },    
    registerTitle: {
      textAlign: 'center',
      fontFamily: titleFont,
      fontSize: 34,
      color: '#ffffff',
      height: 40,
      marginTop: 0,
      marginBottom: 0,
    },
    stepTitle: {
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 18,
      color: '#ffffff',
    },
    iconContainer: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 0,
      marginBottom: 0,
    },
    image: {
      height: 36,
      resizeMode: 'contain',
      marginTop: 0,
      marginBottom: 0,
    },
    formContainer: {
      flex: 1,
      alignItems: 'center',
      marginBottom: 0,
      marginTop: -250,
    },
  });

  return (
    <ImageBackground style={[styles.backgroundImage, { backgroundColor: '#e9e8e6' }]}>
      <MainContainer style={styles.mainContainer}>
        <View style={styles.iconContainer}>
          <Image source={require('../../../../../assets/easeaer_icons/EaseAer_Logo_3_Png.png')} style={styles.image} />
        </View>
        <View style={styles.formContainer}>
        <Text style={styles.registerTitle}>{t("Register")}</Text>
        <Text style={styles.stepTitle}>{t("Step")} 1</Text>
        <StyledTextInputs style={styles.input} placeholder="Username *" value={appUser} onChangeText={(value: React.SetStateAction<string>) => setAppUser(value) } /*keyboardType="numeric"*//>
        <StyledTextInputs style={styles.input} placeholder="Name *" value={nameUser} onChangeText={(value: React.SetStateAction<string>) => setNameUser(value) }/>
        <StyledTextInputs style={styles.input} placeholder="Surname *" value={surnameUser} onChangeText={(value: React.SetStateAction<string>) => setSurnameUser(value) }/>
        <Text style={styles.requiredText}>* {t("Mandatory fields")}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextBackButton} onPress={handleGoBack}>
            <MaterialCommunityIcons color="#000000" name="arrow-left" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextBackButton} onPress={handleGoToScreenRegisterB}>
            <MaterialCommunityIcons color="#000000" name="arrow-right" size={24} />
          </TouchableOpacity>
        </View>
        </View>
      </MainContainer>
    </ImageBackground>
  );
}
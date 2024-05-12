import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Svg, { Defs, Path, Pattern, Use } from "react-native-svg";
import MainContainer from "../components/containers/Main";
import Title from "../components/texts/Title";
import SubTitle from "../components/texts/Subtitle";
import StyledTextInputs from "../components/inputs/StyledTextInputs";
import Button_Type_1 from "../components/buttons/Button_Type_1";
import { AuthEntity } from "../../../domain/user/user.entity";
import { SessionService } from "../../services/user/session.service";
import NormalText from "../components/texts/NormalText";
import { Platform, StatusBar, TouchableOpacity, StyleSheet, ImageBackground, Image, View, Text} from "react-native";
import Register from "../components/texts/Register";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import '../../../../assets/fonts/Rafaella.ttf';
import { useTranslation } from "react-i18next";

async function loadFonts() {
  await Font.loadAsync({
    'Corporate': require('../../../../assets/easeaer_fonts/Corporate_Font.ttf'),
    'Emirates': require('../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
    'SFNS': require('../../../../assets/easeaer_fonts/SF_Font.ttf'),
  });
}

export default function LoginScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const {t}=useTranslation();
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

  const navigation = useNavigation();

  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const styles = StyleSheet.create({
    titleText: {
      color: 'white',
      fontFamily: titleFont,
      fontSize: 80,
      marginBottom: 10,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    mainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconContainer: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 0,
    },
    formContainer: {
      flex: 1,
      alignItems: 'center',
      marginBottom: 0,
      marginTop:-260,
    },
    image: {
      width: 30,
      height: 30,
      resizeMode: 'cover',
    },
    iconText: {
      color: 'white',
      fontFamily: titleFont,
      fontSize: 44,
      marginTop: 10,
    },
    xText: {
      color: 'white',
      fontFamily: bodyFont,
      fontSize: 24,
      marginBottom: 4,
      marginLeft: 6,
      marginRight: 6,
    },
    input: {
      width: 300,
      height: 40,
    },
    normalText: {
      color: 'white',
      fontFamily: bodyFont,
      fontSize: 18,
      marginTop: 38,
      marginBottom: -2,
    },
    bottomText: {
      color: 'white',
      fontFamily: bodyFont,
      fontSize: 18,
      marginTop: 44,
      marginBottom: -4,
    },
    signUpText: {
      color: '#66fcf1',
      fontFamily: bodyFont,
      fontSize: 28,
      marginTop: 6,
      marginBottom: 0
    },
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground source={require('../../../../assets/visualcontent/background_3.png')} style={styles.backgroundImage}>
      <View style={styles.mainContainer}>
        <View style={styles.iconContainer}>
          <Image source={require('../../../../assets/easeaer_others/logo_lplan.png')} style={styles.image} />
          <Title style={styles.xText}>x</Title>
          <Title style={styles.iconText}>Lplan</Title>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.normalText}>Let's Go!</Text>
          <StyledTextInputs style={styles.input} placeholder="Mail" value={inputEmail} onChangeText={setInputEmail}/>
          <StyledTextInputs style={styles.input} placeholder="Password" value={inputPassword} onChangeText={setInputPassword} secureTextEntry={true}/>
          <Button_Type_1 onPress={() => { const formData: AuthEntity = { mailUser: inputEmail, passwordUser: inputPassword, };
              SessionService.loginFrontEndUser(formData)
                .then((response) => {
                  console.log(response);
                  if (response.status === 200) {
                    console.log(response.data);
                    SessionService.setCurrentUser(
                      JSON.stringify(response.data.user.uuid),
                      JSON.stringify(response.data.token)
                    );
                    console.log("_id" + JSON.stringify(response.data.user.uuid));
                    console.log("token" + JSON.stringify(response.data.token));
                    console.log("Login Succesfull!");
                    navigation.navigate('HomeScreen' as never, { screen: 'FeedScreen' } as never);
                  }
                })
                .catch((error) => {
                  console.error("error: " + error);
                  console.log("error.response: " + error.response);
                  switch (error.response.status) {
                    case 403:
                      // Poner aquí el alert ...
                      console.log("Incorrect Password");

                      break;
                    case 404:
                      // Poner aquí el alert ...
                      console.log("User does not exist");
                      navigation.navigate("Register" as never);
                      break;
                  }
                });
            }} />
          <Text style={styles.bottomText}>{t("AlplanMember")}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register" as never)}> 
            <Text style={styles.signUpText}>{t("Sign_Up")}</Text> 
          </TouchableOpacity>
          <StatusBar/>
        </View>      
      </View>
    </ImageBackground>

  );
}
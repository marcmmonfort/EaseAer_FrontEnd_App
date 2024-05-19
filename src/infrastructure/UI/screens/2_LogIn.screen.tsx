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
import { Platform, StatusBar, TouchableOpacity, StyleSheet, ImageBackground, Image, View, Text, Alert} from "react-native";
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
      height: 120,
      resizeMode: 'contain',
      marginBottom: 150,
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
      color: '#321e29',
      fontFamily: bodyFont,
      fontSize: 20,
      marginTop: 38,
      marginBottom: 0,
    },
    bottomText: {
      color: '#321e29',
      fontFamily: bodyFont,
      fontSize: 20,
      marginTop: 20,
      marginBottom: -4,
    },
    signUpText: {
      color: '#875a31',
      fontFamily: subtitleFont,
      fontSize: 20,
      marginTop: 6,
      marginBottom: 0
    },
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground style={[styles.backgroundImage, { backgroundColor: '#e9e8e6' }]}>
      <View style={styles.mainContainer}>
        <View style={styles.iconContainer}>
          <Image source={require('../../../../assets/easeaer_icons/EaseAer_Logo_2_Png.png')} style={styles.image} />
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.normalText}>Let's Travel!</Text>
          <StyledTextInputs style={styles.input} placeholder="E-Mail" value={inputEmail} onChangeText={setInputEmail}/>
          <StyledTextInputs style={styles.input} placeholder="Password" value={inputPassword} onChangeText={setInputPassword} secureTextEntry={true}/>
          <Button_Type_1 onPress={() => { const formData: AuthEntity = { mailUser: inputEmail, passwordUser: inputPassword };
            console.log(formData);
              SessionService.loginUser(formData)
                .then((response) => {
                  console.log(response);
                  console.log("PHOTO URL SAVED: " + response.data.user.photoUser);
                  if (response.status === 200) {
                    console.log("USUARIO COMPLETO:" + JSON.stringify(response.data.user));
                    SessionService.setCurrentUser(
                      JSON.stringify(response.data.user.uuid),
                      JSON.stringify(response.data.token),
                      JSON.stringify(response.data.user.nameUser),
                    );
                    navigation.navigate('HomeScreen' as never, { screen: 'Flights' } as never);
                    // navigation.navigate('Splash' as never);
                  }
                })
                .catch((error) => {
                  console.error("error: " + error);
                  console.log("error.response: " + error.response);
                  switch (error.response.status) {
                    case 403:
                      Alert.alert("EaseAer", "Incorrect Password");
                      console.log("Incorrect Password");
                      break;
                    case 404:
                      Alert.alert("EaseAer", "User Not Registered");
                      console.log("User Not Registered");
                      navigation.navigate("ScreenRegisterA" as never);
                      break;
                  }
                });
            }} />
          <Text style={styles.bottomText}>Aren't you a member?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("ScreenRegisterA" as never)}> 
            <Text style={styles.signUpText}>Register Here</Text> 
          </TouchableOpacity>
          <StatusBar/>
        </View>      
      </View>
    </ImageBackground>

  );
}
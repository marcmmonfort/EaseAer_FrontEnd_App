import React, { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, Platform, StyleSheet, ImageBackground, Image, Alert, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { SessionService } from "../../../services/user/session.service";
import { UserAuthEntity } from "../../../../domain/user/user.entity";
import * as Font from 'expo-font';
import MainContainer from "../../components/containers/Main";
import { useTranslation } from "react-i18next";

async function loadFonts() {
  await Font.loadAsync({
    'Corporate': require('../../../../../assets/easeaer_fonts/Corporate_Font.ttf'),
    'Emirates': require('../../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
    'SFNS': require('../../../../../assets/easeaer_fonts/SF_Font.ttf'),
  });
}

interface RouteParams {
  appUser?: any;
  nameUser?: string;
  surnameUser?: string;
  mailUser?: string;
  passwordUser?: string;
  photoUser?: string;
  birthdateUser?: string;
  genderUser?: string;
  descriptionUser?: string;
  roleUser?: string;
  privacyUser?: string;
}

export default function ScreenRegisterFinal({
  navigation,
}: {
  navigation: any;
}) {
  const {t} = useTranslation();
  const route = useRoute();
  const {
    appUser,
    nameUser,
    surnameUser,
    mailUser,
    passwordUser,
    photoUser,
    birthdateUser,
    genderUser,
    descriptionUser,
    roleUser,
    privacyUser,
  }: RouteParams = route.params || {};

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

  const handleRegister = async () => {
    try {
      const user: UserAuthEntity = {
        uuid: " " ?? "",
        appUser: appUser ?? "",
        nameUser: nameUser ?? "",
        surnameUser: surnameUser ?? "",
        mailUser: mailUser ?? "",
        passwordUser: passwordUser ?? "",
        photoUser: photoUser ?? "",
        birthdateUser: new Date(birthdateUser ?? ""),
        genderUser:
          genderUser === "male" || genderUser === "female"
            ? genderUser
            : "male",
        descriptionUser: descriptionUser ?? "",
        roleUser:
          roleUser === "pax" ||
          roleUser === "company" ||
          roleUser === "admin" ||
          roleUser === "tech"
            ? roleUser
            : "pax",
        privacyUser: privacyUser === "private" ? true : false,
        recordGameUser: 0,
        flightsUser: ["661ec1faec20908a9de42415"], // No me deja pasar el vector vacío. No pasa nada porque el BackEnd al hacer el registro pone el vector a 0.
        deletedUser: false,
      };

      console.log("Usuario: " +  JSON.stringify(user));

      SessionService.registerUser(user).then((response)=>{
        console.log(response);
        if(response.status===200){
          console.log(JSON.stringify(response.data));
          Alert.alert("EaseAer", "You're In!");
        };
      }).catch((error)=>{
        console.log("Error: " + error);
        Alert.alert("EaseAer", "Error");
      })
      navigation.navigate("LoginScreen");
    } catch (error) {
      console.error("Error During Registration: ", error);
      Alert.alert("EaseAer", "Error");
    }
  };

  const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    mainContainer: {
      backgroundColor: 'transparent',
      marginTop: 20,
      marginBottom: 20,
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
      marginBottom: 96,
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 16,
      color: '#000',
      marginTop: 0,
      alignItems: 'center',
    },
    input: {
      width: 300,
      height: 40,
    },
    registerTitle: {
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 20,
      color: '#321e29',
      marginTop: 0,
      marginBottom: 0,
    },
    stepTitle: {
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 20,
      color: '#b3b0a1',
      marginTop: 0,
      marginBottom: 0,
    },
    subtitleText: {
      fontFamily: bodyFont,
      fontSize: 18,
      color: '#b3b0a1',
    },
    contentText: {
      fontFamily: subtitleFont,
      fontSize: 20,
      color: '#321e29',
      marginTop: 2,
      marginBottom: 8,
    },
    finalHeader: {
      marginBottom: 20,
    },
    button: {
      marginTop: 14,
      height: 38,
      width: 120,
      borderRadius: 12,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#875a31',
    },
    registerText: {
      fontFamily: subtitleFont,
      fontWeight: 'bold',
      fontSize: 20,
      color: 'white',
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginTop: 16,
      marginBottom: 16,
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    image: {
      height: 36,
      resizeMode: 'contain',
      marginBottom: 16,
    },
  });

  const imageUrl = photoUser;

  const formatDate = (dateString: string | undefined) => {
    if (dateString != undefined){
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(2); // Obtener los últimos dos dígitos del año
      return `${day}/${month}/${year}`;
    } else {
      return `Not Available`;
    }
  };

  const formatRole = (roleString: string | undefined) => {
    if (roleString == "pax"){
      return `Passenger`;
    } else if (roleString == "company") {
      return `Company`;
    } else if (roleString == "admin") {
      return `Admin Team`;
    } else if (roleString == "tech") {
      return `Tech Team`;
    } else {
      return `Not Available`;
    }
  };

  const formatGender = (roleString: string | undefined) => {
    if (roleString == "male"){
      return `Male`;
    } else if (roleString == "female") {
      return `Female`;
    } else if (roleString == "other") {
      return `Other`;
    } else {
      return `Not Available`;
    }
  };

  return (
    <ImageBackground style={[styles.backgroundImage, { backgroundColor: '#e9e8e6' }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <MainContainer style={styles.mainContainer}>
        <Image source={require('../../../../../assets/easeaer_icons/EaseAer_Logo_3_Png.png')} style={styles.image} />
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.stepTitle}>Final Step</Text>
            <Text style={styles.registerTitle}> Summary</Text>
          </View>
          <Image source={{ uri: imageUrl }} style={styles.profileImage} />
          <Text style={styles.subtitleText}>Username</Text>
          <Text style={styles.contentText}>@{appUser}</Text>
          <Text style={styles.subtitleText}>Surname(s), Name</Text>
          <Text style={styles.contentText}>{surnameUser}, {nameUser}</Text>
          <Text style={styles.subtitleText}>E-Mail</Text>
          <Text style={styles.contentText}>{mailUser}</Text>
          <Text style={styles.subtitleText}>Birthdate</Text>
          <Text style={styles.contentText}>{formatDate(birthdateUser)}</Text>
          <Text style={styles.subtitleText}>Gender</Text>
          <Text style={styles.contentText}>{formatGender(genderUser)}</Text>
          <Text style={styles.subtitleText}>Description</Text>
          <Text style={styles.contentText}>{descriptionUser}</Text>
          <Text style={styles.subtitleText}>Account Type</Text>
          <Text style={styles.contentText}>{formatRole(roleUser)}</Text>
          <TouchableOpacity style={styles.button} onPress={handleRegister}> 
            <Text style={styles.registerText}>Confirm</Text> 
          </TouchableOpacity>
        </MainContainer>
      </ScrollView>
    </ImageBackground>
  );
}

import React, { useEffect, useState } from "react";
import { Button, TextInput, Text, Alert, View, Platform, ImageBackground, TouchableOpacity, Image, ScrollView } from "react-native";
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

export default function ScreenRegisterA() {
  const [appUser, setAppUser] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [surnameUser, setSurnameUser] = useState("");
  const [mailUser, setMail] = useState("");
  const [passwordUser, setPasswordUser] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

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
    } else if (passwordUser !== confirmation) {
      Alert.alert("EaseAer", "Passwords Not Matching");
    } else if (!isValidEmail(mailUser)) {
      Alert.alert("EaseAer", "E-Mail Not Valid");
    } else if (passwordStrength === "weak") {
      Alert.alert("EaseAer", "Weak Password: Improve It");
    } else {
      console.log("Username: " + appUser + " | Name: " + nameUser + " | Surname(s): " + surnameUser + " | E-Mail: " + mailUser + " | Password: " + passwordUser);
      navigation.navigate("ScreenRegisterB" as never, { appUser, nameUser, surnameUser, mailUser, passwordUser } as never);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPasswordUser(value);

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChars = /[~¡@#$%^*()_\-+={}\[\]|:;",.¿]/.test(value);
    const hasMinimumLength = value.length >= 8;

    if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChars && hasMinimumLength) {
      setPasswordStrength("strong");
    } else if (
      (hasUpperCase && hasLowerCase && hasNumber && hasMinimumLength) ||
      (hasUpperCase && hasLowerCase && hasSpecialChars && hasMinimumLength) ||
      (hasUpperCase && hasNumber && hasSpecialChars && hasMinimumLength) ||
      (hasLowerCase && hasNumber && hasSpecialChars && hasMinimumLength)
    ) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("weak");
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  function getPasswordStrengthColor(strength: string) {
  switch (strength) {
    case "strong":
      return "green";
    case "medium":
      return "yellow";
    case "weak":
      return "red";
    default:
      return "#b3b0a1";
  }
}

  const handleGoBack = () => {
    navigation.navigate("LoginScreen" as never);
  };

  const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    requiredText: {
      color: '#d8131b',
      marginTop: 6,
      fontFamily: bodyFont,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    mainContainer: {
      backgroundColor: 'transparent',
      marginTop: 0,
    },
    input: {
      width: 300,
      height: 40,
    },
    inputPassword: {
      width: 284,
      height: 40,
    },
    nextBackButton: {
      margin: 6,
      padding: 6,
      backgroundColor: "#875a31",
      borderRadius: 20,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignSelf: "center",
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 16,
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
    image: {
      height: 36,
      resizeMode: 'contain',
      marginBottom: 16,
    },
    passwordStrengthContainer: {
      height: 10,
      backgroundColor: 'black',
      borderRadius: 5,
      marginTop: 10,
    },
    passwordStrengthBar: {
      marginLeft: 6,
      width: 10,
      height: 40,
      borderRadius: 5,
      backgroundColor: 'black',
    },
    showPasswordButton: {
      marginTop: 6,
      marginBottom: 0,
      padding: 0,
      backgroundColor: "transparent",
      fontFamily: subtitleFont,
      borderRadius: 20,
      width: 140,
      height: 36,
      justifyContent: 'center',
      alignSelf: "center",
      alignContent: "center",
      alignItems: 'center',
    },
    showPasswordButtonText: {
      color: "#875a31",
      fontFamily: subtitleFont,
      fontSize: 20,
      marginBottom: 0,
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
  });

  return (
    <ImageBackground style={[styles.backgroundImage, { backgroundColor: '#e9e8e6' }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <MainContainer style={styles.mainContainer}>
          <Image source={require('../../../../../assets/easeaer_icons/EaseAer_Logo_3_Png.png')} style={styles.image} />
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.stepTitle}>Step 1</Text>
            <Text style={styles.registerTitle}> Basic Data</Text>
          </View>
          <StyledTextInputs style={styles.input} placeholder="Username *" value={appUser} onChangeText={(value: React.SetStateAction<string>) => setAppUser(value) } /*keyboardType="numeric"*//>
          <StyledTextInputs style={styles.input} placeholder="Name *" value={nameUser} onChangeText={(value: React.SetStateAction<string>) => setNameUser(value) }/>
          <StyledTextInputs style={styles.input} placeholder="Surname *" value={surnameUser} onChangeText={(value: React.SetStateAction<string>) => setSurnameUser(value) }/>
          <StyledTextInputs style={styles.input} placeholder="Email *" value={mailUser} onChangeText={(value: React.SetStateAction<string>) => setMail(value)}/>
          <View style={{ flexDirection: 'row' }}>
            <StyledTextInputs style={styles.inputPassword} placeholder="Password *" value={passwordUser} onChangeText={handlePasswordChange} secureTextEntry={!showPassword}/>
            <StyledTextInputs editable={false} style={[ styles.passwordStrengthBar, { backgroundColor: getPasswordStrengthColor(passwordStrength) } ]}/>
          </View>
          <StyledTextInputs style={styles.input} placeholder="Repeat Password *" value={confirmation} onChangeText={(value: React.SetStateAction<string>) => setConfirmation(value)} secureTextEntry={!showPassword} />
          <View style={styles.showPasswordButton}>
            <TouchableOpacity onPress={toggleShowPassword}>
              <Text style={styles.showPasswordButtonText}> {showPassword ? "Hide Password" : "Show Password"} </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.requiredText}>* Compulsory</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.nextBackButton} onPress={handleGoBack}>
              <MaterialCommunityIcons color="white" name="arrow-left" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextBackButton} onPress={handleGoToScreenRegisterB}>
              <MaterialCommunityIcons color="white" name="arrow-right" size={24} />
            </TouchableOpacity>
          </View>
        </MainContainer>
      </ScrollView>
    </ImageBackground>
  );
}
import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform, Alert, ActivityIndicator, TouchableOpacity, ImageBackground, Text, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import ButtonGradientBack from "../../components/buttons/Button_Type_2";
import ButtonGradientBack2 from "../../components/buttons/Button_Type_3";
import SubTitle from "../../components/texts/Subtitle";
import * as Font from 'expo-font';
import MainContainer from "../../components/containers/Main";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
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
}
export default function ScreenRegisterC() {
  const {t}=useTranslation();
  const route = useRoute();
  const {
    appUser,
    nameUser,
    surnameUser,
    mailUser,
    passwordUser,
  }: RouteParams = route.params || {};

  const [fontsLoaded, setFontsLoaded] = useState(false);

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

  const [photoUser, setPhotoUser] = useState("");
  const [auxPhotoUser, setAux] = useState("");
  const [loading, setLoading] = useState(false);
  const [cam, setCam] = useState(false);
  const navigation = useNavigation();
  let CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlsyquban/upload";
  
  const handleCameraPress = async () => {
    setCam(true);
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("EaseAer", "Permission Denied");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setAux(result.assets[0].uri);
      setLoading(true);
      const base64Image = await convertImageToBase64(result.assets[0].uri);
      setPhotoUser(base64Image);

      console.log("Set Photo User: " + base64Image);

      let data = {
        file: base64Image,
        upload_preset: "profilePictures",
      };

      fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      })
        .then(async (r) => {
          let data = await r.json();
          console.log("Data URL: " + data.url);
          setPhotoUser(data.url); // Not Really Used.
          console.log("User Photo: " + photoUser);
          handleUpload(data.url);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadFonts().then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const convertImageToBase64 = async (imageUri:any) => {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpg;base64,${base64}`;
  };

  const handleGalleryPress = async () => {
    setCam(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    console.log("Result (Object): " + result);

    if (!result.canceled) {
      setAux(result.assets[0].uri);
      setLoading(true);
      const base64Image = await convertImageToBase64(result.assets[0].uri);
      setPhotoUser(base64Image);

      let data = {
        file: base64Image,
        upload_preset: "profilePictures",
      };
      fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      })
        .then(async (r) => {
          let data = await r.json();
          console.log("Data URL: " + data.url);
          setPhotoUser(data.url); // Not Really Used.
          console.log("User Photo: " + photoUser);
          handleUpload(data.url);
        })
        .catch((err) => console.log("Error: " + err))
        .finally(() => setLoading(false));
    }
  };

  const handleUpload = (url:any) => {
    if (!url) {
      Alert.alert("EaseAer", "Error: Try Again");
    } else {
      console.log("Username: " + appUser + " | Name: " + nameUser + " | Surname(s): " + surnameUser + " | E-Mail: " + mailUser + " | Password: " + passwordUser + " | Photo URL: " + url);
      navigation.navigate(
        "ScreenRegisterD" as never, { appUser, nameUser, surnameUser, mailUser, passwordUser, photoUser:url } as never);
    }
  };
  const handleGoBack = () => {
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    text:{
      marginBottom:0,
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      marginBottom: 10,
      marginTop: 10,
    },
    buttonContainerB: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 0,
      marginBottom:0,
    },
    gradient: {
      width: "100%",
      height: "100%",
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    mainContainer: {
      backgroundColor: 'transparent',
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
    newPost: {
      margin: 6,
      padding: 6,
      backgroundColor: "#b3b0a1",
      borderRadius: 40,
      width: 56,
      height: 56,
      justifyContent: 'center',
      alignSelf: "center",
      marginBottom: 0,
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
    stepSubtitle: {
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 16,
      color: 'yellow',
      marginTop: 10,
      marginBottom: 14,
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
    loadingStyle: {
      marginTop: 8,
      marginBottom: 8,
    },
  });
  

  return (
    <ImageBackground style={[styles.backgroundImage, { backgroundColor: '#e9e8e6' }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <MainContainer style={styles.mainContainer}>
          <Image source={require('../../../../../assets/easeaer_icons/EaseAer_Logo_3_Png.png')} style={styles.image} />
          <View style={{ flexDirection: 'row' }}>
              <Text style={styles.stepTitle}>Step 2</Text>
              <Text style={styles.registerTitle}> Profile Picture</Text>
          </View>
          {loading ? (
            <ActivityIndicator style={styles.loadingStyle} size={24} color="d0871e" />
            ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.newPost} onPress={handleCameraPress}>
                <Ionicons name="camera" size={28} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.newPost} onPress={handleGalleryPress}>
                <Ionicons name="image" size={28} color="white" />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.buttonContainerB}>
            <TouchableOpacity style={styles.nextBackButton} onPress={handleGoBack}>
              <MaterialCommunityIcons color="white" name="arrow-left" size={24} />
            </TouchableOpacity>
          </View>
        </MainContainer>   
      </ScrollView>
    </ImageBackground>
  );
}


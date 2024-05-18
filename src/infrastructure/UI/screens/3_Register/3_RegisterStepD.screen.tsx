import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, View, Text, Button, Platform, ImageBackground, TouchableOpacity, ScrollView, Image } from "react-native";
import MainContainer from "../../components/containers/Main";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import StyledTextInputs from "../../components/inputs/StyledTextInputs";
import ButtonGradientNext from "../../components/buttons/Button_Type_Next";
import ButtonGradientBack from "../../components/buttons/Button_Type_2";
import ButtonGradientBirthdate from "../../components/buttons/Button_Type_Birthdate";
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

interface RouteParams {
  appUser?: any;
  nameUser?: string;
  surnameUser?: string;
  mailUser?: string;
  passwordUser?: string;
  photoUser?: string;
}

export default function ScreenRegisterD() {
  const route = useRoute();

  const {
    appUser,
    nameUser,
    surnameUser,
    mailUser,
    passwordUser,
    photoUser,
  }: RouteParams = route.params || {};

  const [birthdateUser, setbirthdateUser] = useState("");
  const [genderUser, setgenderUser] = useState("");
  const [privacyUser, setPrivacyUser] = useState(false);
  const [descriptionUser, setDescriptionUser] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const {t} = useTranslation();

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

  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setbirthdateUser(selectedDate.toISOString());
    }
  };

  const formatDate = (date: {
    getDate: () => any;
    getMonth: () => number;
    getFullYear: () => any;
  }) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? "0" + day : day}/${
      month < 10 ? "0" + month : month
    }/${year}`;
  };

  const navigation = useNavigation();

  const handleGoToScreenRegisterF = () => {
    if (!birthdateUser || !descriptionUser || !genderUser) {
      Alert.alert("EaseAer", "Incomplete Fields");
    } else {
      const selectedGender = genderUser || "male";
      const selectedPrivacy = privacyUser || true;
      if (isDateValid(selectedDate)) {
        console.log("Username: " + appUser + " | Name: " + nameUser + " | Surname(s): " + surnameUser + " | E-Mail: " + mailUser + " | Password: " + passwordUser + " | Photo URL: " + photoUser + " | BirthDate: " + selectedDate.toISOString() + " | Gender: " + selectedGender + " | Description: " + descriptionUser + " | Role: " + "pax" + " | Privacy: " + selectedPrivacy);
        navigation.navigate("ScreenRegisterFinal" as never, { appUser, nameUser, surnameUser, mailUser, passwordUser, photoUser, birthdateUser: selectedDate.toISOString(), genderUser: selectedGender, descriptionUser, roleUser: "pax", privacyUser: selectedPrivacy} as never);
      } else {
        Alert.alert("EaseAer", "Invalid Age: App +16");
      }
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const isDateValid = (date: Date) => {
    const currentDate = new Date();
    const sixteenYearsAgo = new Date(
      currentDate.getFullYear() - 16,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    return date <= sixteenYearsAgo;
  };

  const styles = StyleSheet.create({
    text: {
      color: "black",
      marginBottom: 0,
      fontSize: 20,
      marginTop: 0,
      alignContent:"center",
    },
    picker: {
      borderWidth: 0,
      borderRadius: 12,
      color: "black",
      backgroundColor: 'transparent',
      marginTop: 10,
      marginBottom: 0,
      width: 180,
    },
    pickerPrivacy: {
      borderWidth: 0,
      borderRadius: 12,
      color: "black",
      backgroundColor: 'transparent',
      marginTop: 0,
      marginBottom: 0,
      width: 180,
    },
    pickerItem:{
      fontSize: 16,
      color: "black",
      fontFamily: subtitleFont,
      height: 60,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
    buttonContainerB: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
    },
    requiredText: {
      color: '#d8131b',
      marginTop: 4,
      fontFamily: bodyFont,
    },
    birthdate_text: {
      color: 'white',
      marginTop: 20,
      marginBottom: 0,
      fontFamily: bodyFont,
    },
    textInput: {
      width: 300,
      height: 40,
      justifyContent:"center",
      alignItems: 'center',
    },
    date:{
      justifyContent:"center"
    },
    requiredTextB: {
      color: "red",
      marginTop: 10,
      marginBottom: 0,
      fontStyle: "italic",
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
    formContainer: {
      alignItems: 'center',
    },
    dateTimePickerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 0,
    },
    dateTimePicker: {
      backgroundColor: 'transparent',
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

  return (
    <ImageBackground style={[styles.backgroundImage, { backgroundColor: '#e9e8e6' }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <MainContainer style={styles.mainContainer}>
          <Image source={require('../../../../../assets/easeaer_icons/EaseAer_Logo_3_Png.png')} style={styles.image} />
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.stepTitle}>Step 3</Text>
            <Text style={styles.registerTitle}> Personal Details</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.buttonContainerB}>
                <ButtonGradientBirthdate onPress={handleShowDatePicker} />
              </View>
              {showDatePicker && (
                <View style={styles.dateTimePickerContainer}>
                  <DateTimePicker value={selectedDate} mode="date" display="default" style={styles.dateTimePicker} onChange={handleDateChange}/>
                </View>
              )}
            </View>
            <StyledTextInputs style={styles.textInput} placeholder="Description *" value={descriptionUser} onChangeText={(value: React.SetStateAction<string>) => setDescriptionUser(value) }/>
            <Picker selectedValue={genderUser} style={styles.picker} itemStyle={styles.pickerItem} onValueChange={(itemValue) => setgenderUser(itemValue)}>
              <Picker.Item label="Male" value="male"/>
              <Picker.Item label="Female" value="female"/>
              <Picker.Item label="Other" value="other"/>
            </Picker>
            <Picker selectedValue={privacyUser} style={styles.pickerPrivacy} itemStyle={styles.pickerItem} onValueChange={(itemValue) => setPrivacyUser(itemValue)}>
              <Picker.Item label="Public" value="false"/>
              <Picker.Item label="Private" value="true"/>
            </Picker>
          </View>
          <Text style={styles.requiredText}>* Compulsory</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.nextBackButton} onPress={handleGoBack}>
              <MaterialCommunityIcons color="white" name="arrow-left" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextBackButton} onPress={handleGoToScreenRegisterF}>
              <MaterialCommunityIcons color="white" name="arrow-right" size={24} />
            </TouchableOpacity>
          </View>
        </MainContainer>
      </ScrollView>
    </ImageBackground>
  );
}


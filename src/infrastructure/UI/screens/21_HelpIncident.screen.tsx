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
import { Platform, StatusBar, TouchableOpacity, StyleSheet, ImageBackground, Image, View, Text, Alert, ScrollView} from "react-native";
import Register from "../components/texts/Register";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import '../../../../assets/fonts/Rafaella.ttf';
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native-gesture-handler";
import { IncidentEntity } from "../../../domain/incident/incident.entity";
import { IncidentService } from "../../services/incident/incident.service";

async function loadFonts() {
  await Font.loadAsync({
    'Corporate': require('../../../../assets/easeaer_fonts/Corporate_Font.ttf'), 
    'Emirates': require('../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
    'SFNS': require('../../../../assets/easeaer_fonts/SF_Font.ttf'),
  });
}

export default function HelpIncident() {
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

  const [idUserIncident, setIdUserIncident] = useState("");
  const [descriptionIncident, setDescriptionIncident] = useState("");
  const [collectiveIncident, setCollectiveIncident] = useState("");
  const [statusIncident, setStatusIncident] = useState("");


  // AsyncStorage.getItem("uuid");

  const handleReportIncident = async () => {
    const userId = await AsyncStorage.getItem("uuid");
    console.log("ID USUARIO INCIDENTE: " + userId);
    if (userId != null) {
        const idUser = JSON.parse(userId);
        try {
            const incident: IncidentEntity = {
              uuid: " " ?? "",
              idUserIncident: idUser ?? "",
              descriptionIncident: descriptionIncident ?? "",
              collectivesIncident:
                  collectiveIncident === "security" ||
                  collectiveIncident === "medical" ||
                  collectiveIncident === "fire" ||
                  collectiveIncident === "cleaning" ||
                  collectiveIncident === "assistance" ||
                  collectiveIncident === "tech" ||
                  collectiveIncident === "other" ? collectiveIncident : "other",
              statusIncident:
                  statusIncident === "new" ||
                  statusIncident === "received" ||
                  statusIncident === "managed" ||
                  statusIncident === "solved" ||
                  statusIncident === "unsolved" ? statusIncident : "new",
              deletedIncident: false,
            };
      
            console.log("Incidente A Registrar: " +  JSON.stringify(incident));
      
            IncidentService.createIncident(incident).then((response)=>{
              console.log(response);
              if (response.status===200){
                console.log(JSON.stringify(response.data));
                Alert.alert("EaseAer", "Incident Notified!");
                setDescriptionIncident("");
              };
            }).catch((error)=>{
              console.log("Error: " + error);
              Alert.alert("EaseAer", "Error");
            })
            navigation.goBack();
            // navigation.navigate('HomeScreen');
          } catch (error) {
            console.error("Error Creating Incident: ", error);
            Alert.alert("EaseAer", "Error");
          }
    }
    else {
        Alert.alert("EaseAer", "Error");
    }
  };

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
      marginTop: 0,
    },
    image: {
      height: 120,
      resizeMode: 'contain',
      marginBottom: 150,
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
    subtitleNewsText: {
      color: '#321e29',
      fontFamily: subtitleFont,
      fontSize: 19,
      marginTop: 12,
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

    sectionTitle: {
        backgroundColor: '#321e29',
        fontFamily: subtitleFont,
        fontSize: 20,
        height: 40,
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        marginBottom: 0,
    },
    pageTitle: {
        color: 'white',
        fontFamily: bodyFont,
        fontSize: 20,
        marginTop: 10,
        marginBottom: 0
    },
    airportContainer: {
        flexDirection: 'row', 
        justifyContent: 'flex-end',
    },
    airportTitle: {
        backgroundColor: '#633b51',
        fontFamily: subtitleFont,
        fontSize: 20,
        height: 28,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 15,
        width: 92,
        marginTop: 6,
    },
    nameTitle: {
        color: 'white',
        fontFamily: bodyFont,
        fontSize: 20,
        marginTop: 5,
        marginLeft: 12,

    },
    headerContainer: {
        position: 'relative',
        height: 40,
        marginBottom: 0,
    },
    styleContainer: {
        marginTop: 0,
    },
    picker: {
        borderWidth: 0,
        borderRadius: 12,
        color: "#321e29",
        backgroundColor: 'transparent',
        marginTop: 0,
        marginBottom: 10,
        width: 320,
    },
    pickerItem:{
        fontSize: 16,
        color: "#321e29",
        fontFamily: subtitleFont,
        height: 60,
    },
    multilineTextInputStyle: {
        fontFamily: subtitleFont,
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        borderWidth: 0,
        width: 300,
        height: 240,
        marginTop: 12,
        borderRadius: 12,
        backgroundColor: '#b3b0a1',
        paddingStart: 10,
        padding: 8,
    },
    detailsContainer: {
        flex: 1,
        marginBottom: 0,
        marginTop: 0,
        marginLeft: 26,
        marginRight: 26,
    },
    detailsText: {
        color: '#321e29',
        fontFamily: bodyFont,
        fontSize: 14,
        marginTop: 8,
        marginBottom: 0,
        textAlign: 'justify',
      },
      submitReportButton: {
        marginRight: 4,
        marginLeft: 4,
        padding: 6,
        backgroundColor: "#875a31",
        borderRadius: 12,
        width: 92,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      },
      submitReportText: {
        fontFamily: subtitleFont,
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
      },
      newsHeader: {
        marginBottom: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: '#d8131b',
        shadowColor: '#000',
        shadowOpacity: 0,
        shadowRadius: 10,
        alignItems: 'center',
        zIndex: 2,
    },
    titleNewsText: {
      color: 'white',
      fontFamily: subtitleFont,
      fontSize: 22,
      marginTop: 6,
      marginBottom: 6,
  },
  newsContent: {
    marginBottom: 0,
    marginTop: -12,
    paddingTop: 12,
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 12,
    paddingRight: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 0,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0,
    shadowRadius: 10,
    alignItems: 'center',
    zIndex: 1,
  },
  profileContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    marginTop: 5,
    marginBottom: 2,
    marginLeft: -6,
    marginRight: 0,
    flexDirection: 'row',
  },
  profileDetailsContainer: {
      marginLeft: 2,
      marginTop: 5,
  },
  usernameText: {
    color: '#b3b0a1',
    fontFamily: bodyFont,
    fontSize: 16,
    marginTop: 0,
    marginBottom: 0,
  },
  dateText: {
      color: '#e9e8e6',
      fontFamily: bodyFont,
      fontSize: 14,
      marginTop: 0,
      marginBottom: 0,
  },
  newsContainer: {
    marginBottom: -2,
    marginTop: 26,
    marginLeft: 26,
    marginRight: 26,
    borderRadius: 12,
    borderWidth: 0,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0,
    shadowRadius: 10,
  },
  charactersCountText: {
    color: '#d0871e',
    fontFamily: bodyFont,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 0,
  }
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground style={[styles.backgroundImage, { backgroundColor: '#e9e8e6' }]}>
        <View style={styles.headerContainer}>
            <View style={styles.sectionTitle}>
                <Text style={styles.pageTitle}>Incident</Text>
            </View>
            <View style={styles.airportContainer}>
                <View style={styles.airportTitle}>
                <Text style={styles.nameTitle}>Barcelona</Text>
                </View>
            </View>
        </View>
        <ScrollView style={styles.styleContainer}>
          <View style={styles.newsContainer}>
            <View style={styles.newsHeader}>
              <Text style={styles.titleNewsText}>Incident</Text>
            </View>
            <View style={styles.newsContent}>
              <View style={styles.formContainer}>
                  <Text style={styles.subtitleNewsText}>Report An Incident</Text>
                  <TextInput style={styles.multilineTextInputStyle} placeholder="Description" value={descriptionIncident} onChangeText={ setDescriptionIncident } multiline maxLength={250}/>
                  <Text style={styles.charactersCountText}>{descriptionIncident.length} Characters / 250 Max.</Text>
                  <Picker selectedValue={collectiveIncident} style={styles.picker} itemStyle={styles.pickerItem} onValueChange={(itemValue) => setCollectiveIncident(itemValue)}>
                      <Picker.Item label="Security Forces" value="security"/>
                      <Picker.Item label="Medical Team" value="medical"/>
                      <Picker.Item label="Fire Department" value="fire"/>
                      <Picker.Item label="Cleaning Service" value="cleaning"/>
                      <Picker.Item label="Airport Assistance" value="assistance"/>
                      <Picker.Item label="Tech Team" value="tech"/>
                      <Picker.Item label="Other" value="other"/>
                  </Picker>
              </View>
              
            </View>
          </View>
            <View style={styles.formContainer}>
                <TouchableOpacity onPress={() => { handleReportIncident() }} style={styles.submitReportButton}>
                    <Text style={styles.submitReportText}>Report</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </ImageBackground>
  );
}
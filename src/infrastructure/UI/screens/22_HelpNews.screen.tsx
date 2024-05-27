import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
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
import { NewsService } from "../../services/news/news.service";
import { NewsEntity } from "../../../domain/news/news.entity";
import { CRUDService } from "../../services/user/CRUD.service";

async function loadFonts() {
  await Font.loadAsync({
    'Corporate': require('../../../../assets/easeaer_fonts/Corporate_Font.ttf'), 
    'Emirates': require('../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
    'SFNS': require('../../../../assets/easeaer_fonts/SF_Font.ttf'),
  });
}

export default function HelpNews() {
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

  const [listNews, setListNews] = useState<NewsEntity[] | null>(null);
  const [userDetails, setUserDetails] = useState<{ [key: string]: string }>({});

  useFocusEffect(
    React.useCallback(() => {
      const getNews = async () => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
            try {
                await NewsService.listNews().then(async (response) => {
                    if (response?.data && response.data[0].titleNews) {
                        setListNews(response.data);
                        console.log("TÍTULO EJEMPLO: " + response.data[0].titleNews);
                        response.data.forEach(async (newsItem: NewsEntity) => {
                            const details = await getNameAndRoleUserById(newsItem.idUserAuthorNews);
                            setUserDetails(prevDetails => ({
                              ...prevDetails,
                              [newsItem.idUserAuthorNews]: details || 'HOLA'
                            }));
                        });
                    }
                    else {
                        Alert.alert("EaseAer", "No News Available");
                    }
                });
            } catch (error) {
                console.error("Error Getting News:", error);
                Alert.alert("EaseAer", "Error Getting News");
            }
        }
      };
      getNews();
    }, [])
  );

  const getNameAndRoleUserById = async (userId: string) => {
    try {
        await CRUDService.getUserById(userId).then(async (response) => {
            if (response?.data && response.data.nameUser && response.data.roleUser) {
                const nameUser = response.data.nameUser;
                let roleUser = "Unknown";
                // roleUser: "pax" | "company" | "admin" | "tech";
                if (response.data.roleUser==="pax"){ roleUser = "Passenger" };
                if (response.data.roleUser==="company"){ roleUser = "Company" };
                if (response.data.roleUser==="admin"){ roleUser = "Administrator" };
                if (response.data.roleUser==="tech"){ roleUser = "Tech Worker" };
                return nameUser + "," + roleUser;
            }
            else {
                return 'Error';
            }
        });
    } catch (error) {
        return 'Error';
    }
  };

  // AsyncStorage.getItem("uuid");

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
      marginTop: 26,
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
    picker: {
        borderWidth: 0,
        borderRadius: 12,
        color: "black",
        backgroundColor: 'transparent',
        marginTop: 10,
        marginBottom: 0,
        width: 320,
    },
    pickerItem:{
        fontSize: 16,
        color: "black",
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
        height: 140,
        marginTop: 20,
        borderRadius: 12,
        backgroundColor: '#b3b0a1',
        paddingStart: 10,
        padding: 8,
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
    newsHeader: {
        marginBottom: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: '#d0871e',
        shadowColor: '#000',
        shadowOpacity: 0,
        shadowRadius: 10,
        alignItems: 'center',
        zIndex: 2,
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
    titleNewsText: {
        color: 'white',
        fontFamily: subtitleFont,
        fontSize: 20,
        marginTop: 6,
        marginBottom: 6,
    },
    subtitleNewsText: {
        color: '#321e29',
        fontFamily: subtitleFont,
        fontSize: 18,
        marginTop: 0,
        marginBottom: 6,
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
    detailsText: {
        color: '#875a31',
        fontFamily: bodyFont,
        fontSize: 14,
        marginTop: 4,
        marginBottom: 12,
    },
    image: {
        height: 42,
        width: 42,
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
    noNewsText: {
        color: '#875a31',
        fontFamily: bodyFont,
        textAlign: 'center',
        fontSize: 18,
        marginTop: 14,
    }
  });

  if (!fontsLoaded) {
    return null;
  }

  const renderNewsItem = (newsItem: NewsEntity) => (
    <View style={styles.newsContainer} key={newsItem.uuid}>
      <View style={styles.newsHeader}>
        <Text style={styles.titleNewsText}>{newsItem.titleNews}</Text>
      </View>
      <View style={styles.newsContent}>
        <View style={styles.profileContainer}>
          <Image source={require('../../../../assets/easeaer_icons/EaseAer_Logo_2_Png.png')} style={styles.image} />
          <View style={styles.profileDetailsContainer}>
            <Text style={styles.usernameText}>{userDetails[newsItem.idUserAuthorNews]}</Text>
            <Text style={styles.dateText}>{newsItem.idUserAuthorNews}</Text>
          </View>
        </View>
        <Text style={styles.subtitleNewsText}>{newsItem.subtitleNews}</Text>
        <Text style={styles.detailsText}>{newsItem.descriptionNews}</Text>
      </View>
    </View>
  );

  return (
    <ImageBackground style={[styles.backgroundImage, { backgroundColor: '#e9e8e6' }]}>
        <View style={styles.headerContainer}>
            <View style={styles.sectionTitle}>
                <Text style={styles.pageTitle}>News</Text>
            </View>
            <View style={styles.airportContainer}>
                <View style={styles.airportTitle}>
                <Text style={styles.nameTitle}>Barcelona</Text>
                </View>
            </View>
        </View>
        <ScrollView>
            {listNews ? listNews.map(renderNewsItem) : <Text style={styles.noNewsText}>Not Available</Text>}
        </ScrollView>
    </ImageBackground>
  );
}
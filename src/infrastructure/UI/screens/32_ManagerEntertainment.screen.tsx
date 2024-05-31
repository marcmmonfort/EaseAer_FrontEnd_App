import { SessionService } from "../../services/user/session.service";
import { UserEntity } from "../../../domain/user/user.entity";
import { useFocusEffect } from "@react-navigation/native";
import { CRUDService } from "../../services/user/CRUD.service";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity,Button, ImageBackground, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Speech from 'expo-speech';
import Filter from 'bad-words';

// BEREAL
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { CardEntity } from "../../../domain/card/card.entity";
import { CardService } from "../../services/card/card.service";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "./5_UserProfile.screen";
import HelpIncident from "./21_HelpIncident.screen";
import HelpNews from "./22_HelpNews.screen";
import ShopProducts from "./25_ShopProducts.screen";
import ShopOffers from "./27_ShopOffers.screen";
import EntertainmentGameHome from "./19_EntertainmentGame.screen";

async function loadFonts() {
  await Font.loadAsync({
    'Corporate': require('../../../../assets/easeaer_fonts/Corporate_Font.ttf'),
    'Emirates': require('../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
    'SFNS': require('../../../../assets/easeaer_fonts/SF_Font.ttf'),
  });
}

export default function EntertainmentScreen() {
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [currentCard, setCurrentCard] = useState<CardEntity | null>(null);
  const [photoUser, setPhotoUser] = useState("");
  const [auxPhotoUser, setAux] = useState("");
  const [loading, setLoading] = useState(false);
  const [cam, setCam] = useState(false);
  const [icon, setIcon] = useState(<MaterialCommunityIcons name="store" size={24} color="black"/>);
  let CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlsyquban/upload";
  const navigation = useNavigation();

  const Tab = createBottomTabNavigator();

  // BEREAL
  const [numPagePublication, setNumPagePublication] = useState<number>(1);
  const [numOwnPublications, setNumOwnPublications] = useState<number>(0);
  const [recargar, setRecargar] = useState<string>('');
  const [currentPublicationIndex, setCurrentPublicationIndex] = useState(1);
  const {t} = useTranslation();
  const [qrVisible, setqrVisible] = useState<boolean>(false);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -50,
  },
  titleContainer: {
    marginBottom: 20,
  },
  profileContour: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: 20,
  },
  profile: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileUserName: {
    fontSize: 26,
    textAlign: 'center',
    fontFamily: titleFont,
    color: "#d0871e",
    marginRight: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 75,
    marginRight: 4,
  },
  profileUserButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginTop: 6,
    marginBottom: 18,
  },
  buttonForChanges: {
    marginRight: 4,
    marginLeft: 4,
    padding: 6,
    backgroundColor: "#875a31",
    borderRadius: 12,
    width: 92,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainDescription: {
    alignItems: 'center',
    marginLeft: 4,
    marginTop: 3,
  },
  editSettingsButtons: {
    flexDirection: "row",
  },
  insideButtonForChanges: {
    flexDirection: "row",
  },
  buttonLogOut: {
    justifyContent: 'center',
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: bodyFont,
    fontSize: 16,
    color: '#000',
    marginTop: 0,
    marginBottom: 0,
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 12,
    marginBottom: -10,
  },
  profileStatCountLeft: {
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profileStatCountRight: {
    alignItems: "center",
    justifyContent: "center",
  },
  textFoll: {
    fontSize: 14,
    fontFamily: bodyFont,
    color: "yellow",
  },
  numFoll: {
    fontFamily: bodyFont,
    fontSize: 26,
    color: '#66fcf1',
  },
  titleNameDescription: {
    fontFamily: bodyFont,
    fontSize: 18,
    color: '#b3b0a1',
  },
  textNameDescription: {
    fontFamily: subtitleFont,
    fontSize: 20,
    color: '#321e29',
    marginTop: 2,
    marginBottom: 8,
  },
  profileBio: {
    alignItems: 'center',
    justifyContent: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  usernameAndVerified: {
    flexDirection: "row",
    marginBottom: 5,
  },
  iconVerified: {
    marginTop: 2,
  },
  post_images: {
    width: 120,
    height: 120,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  posts: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  post_complete: {
    alignItems: 'center',
    marginRight: 4,
    marginLeft: 4,
  },
  post_description: {
    alignItems: 'center',
    width: 120,
    backgroundColor: 'black',
    marginTop: 4,
    borderRadius: 16,
  },
  time_post: {
    fontSize: 12,
    fontFamily: bodyFont,
    color: "yellow",
    marginTop: 2,
    marginBottom: 6,
  },
  scrow_style: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
  },
  userButtonEdit: {
    fontFamily: subtitleFont,
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
  cardContainer: {
    width: 273,
    height: 161,
    borderRadius: 12,
    position: 'relative',
    marginBottom: 10,
  },
  cardImage: {
    width: 273,
    height: 161,
    borderRadius: 12,
    position: 'relative',
  },
  cardNameText: {
    fontFamily: subtitleFont,
    fontSize: 20,
    color: 'white',
    position: 'absolute',
    bottom: 44,
    left: 12,
  },
  cardNumberText: {
    fontFamily: bodyFont,
    fontSize: 14,
    color: 'white',
    position: 'absolute',
    bottom: 29,
    left: 12,
  },
  cardPointsText: {
    fontFamily: subtitleFont,
    fontSize: 18,
    color: 'white',
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  cardNameTextRookie: {
    fontFamily: subtitleFont,
    fontSize: 20,
    color: '#321e29',
    position: 'absolute',
    bottom: 44,
    left: 12,
  },
  cardNumberTextRookie: {
    fontFamily: bodyFont,
    fontSize: 14,
    color: '#321e29',
    position: 'absolute',
    bottom: 29,
    left: 12,
  },
  cardPointsTextRookie: {
    fontFamily: subtitleFont,
    fontSize: 18,
    color: '#321e29',
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  navText: {
    fontFamily: subtitleFont,
    marginTop: 10,
    fontSize: 20,
    color: 'white',
  },
});

  return (
    <Tab.Navigator screenOptions={{ tabBarStyle: { backgroundColor: '#b3b0a1', borderTopWidth: 0, height: 60, marginBottom: -19.5 }, tabBarShowLabel: false }}>

        <Tab.Screen name="History" component={ShopProducts} options={{ tabBarIcon: ({ color, size }) => (
            <Text style={styles.navText}>History</Text>
            ), headerShown: false,
        }} />

        <Tab.Screen name="Statistics" component={ShopOffers} options={{ tabBarIcon: ({ color, size }) => (
            <Text style={styles.navText}>Statistics</Text>
            ), headerShown: false,
        }} />

        <Tab.Screen name="Quiz" component={EntertainmentGameHome} options={{ tabBarIcon: ({ color, size }) => (
            <Text style={styles.navText}>Quiz</Text>
            ), headerShown: false,
        }} />

        <Tab.Screen name="Friends" component={ShopOffers} options={{ tabBarIcon: ({ color, size }) => (
            <Text style={styles.navText}>Friends</Text>
            ), headerShown: false,
        }} />

    </Tab.Navigator>
  );  
}


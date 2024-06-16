import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import Svg, { Defs, Path, Pattern, Use } from "react-native-svg";
import MainContainer from "../components/containers/Main";
import Title from "../components/texts/Title";
import SubTitle from "../components/texts/Subtitle";
import StyledTextInputs from "../components/inputs/StyledTextInputs";
import Button_Type_1 from "../components/buttons/Button_Type_1";
import { AuthEntity, UserAuthEntity, UserEntity } from "../../../domain/user/user.entity";
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
import { ProductEntity } from "../../../domain/product/product.entity";
import { ProductService } from "../../services/product/product.service";
import QRCode from 'react-native-qrcode-svg';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FlightEntity } from "../../../domain/flight/flight.entity";
import { FlightService } from "../../services/flight/flight.service";
import { LuggageService } from "../../services/luggage/luggage.service";
import { LuggageEntity } from "../../../domain/luggage/luggage.entity";

async function loadFonts() {
  await Font.loadAsync({
    'Corporate': require('../../../../assets/easeaer_fonts/Corporate_Font.ttf'), 
    'Emirates': require('../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
    'SFNS': require('../../../../assets/easeaer_fonts/SF_Font.ttf'),
  });
}

export default function EntertainmentFriendsHome() {
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

    const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);

    const [listUsers, setListUsers] = useState<UserEntity[] | null>(null);

    useFocusEffect(
        React.useCallback(() => {
        const getUsersByFlight = async () => {
            const userId = await SessionService.getCurrentUser();
            if (userId) {
                setCurrentUser(userId);
                try {
                    const response = await CRUDService.getUsersByFlightId("665c53bd3f4aebb74408558d");
                    console.log("OBTENGO " + response?.data.length + " USUARIOS");
                    if (response?.data && response.data[0]?.nameUser) {
                        setListUsers(response.data);
                        console.log("GUARDO: " + JSON.stringify(response.data));
                    } else {
                        Alert.alert("EaseAer", "No Users Available");
                    }
                } catch (error) {
                    Alert.alert("EaseAer", "Error Loading Users");
                }
            }
        };
        getUsersByFlight();
        }, [])
    );

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
            borderRadius: 0,
            color: "black",
            backgroundColor: '#b3b0a1',
            marginTop: 0,
            marginBottom: 0,
            height: 40,
        },
        pickerItem:{
            fontSize: 16,
            color: "white",
            fontFamily: subtitleFont,
            height: 40,
            marginLeft: -32,
            marginRight: -32,
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
        subtitleNewsText: {
            color: '#321e29',
            fontFamily: subtitleFont,
            fontSize: 19,
            marginTop: 0,
            marginBottom: 6,
        },
        usernameText: {
            color: '#e9e8e6',
            fontFamily: bodyFont,
            fontSize: 12,
            marginTop: 4,
            marginBottom: 12,
        },
        dateText: {
            color: '#e9e8e6',
            fontFamily: bodyFont,
            fontSize: 14,
            marginTop: 0,
            marginBottom: 0,
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
            alignItems: 'center',
        },
        noNewsText: {
            color: '#875a31',
            fontFamily: bodyFont,
            textAlign: 'center',
            fontSize: 18,
            marginTop: 14,
        },
        statusBox: {
            width: 6,
            marginRight: 8,
            marginLeft: 0,
            backgroundColor: '#d8131b',
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
        },
        searcherContainer: {
            height: 40,
            marginBottom: 0,
        },
        searcherPack: {
            backgroundColor: '#b3b0a1',
            color: 'white',
            fontFamily: subtitleFont,
            fontSize: 20,
            height: 40,
            alignItems: 'center',
            position: 'absolute',
            width: '100%',
            marginBottom: 0,
            paddingLeft: 10,
        },
        searcherText: {
            color: 'white',
            fontFamily: subtitleFont,
            fontSize: 20,
            marginTop: 10,
            marginBottom: 0
        },
        searcherIcon: {
            position: 'absolute',
            right: 10,
            top: 10,
        },
        deletedProduct: {
            backgroundColor: '#d8131b',
        },
        activeProduct: {
            backgroundColor: '#51a145',
        },
        flightContainer: {
            marginBottom: -2,
            borderRadius: 12,
            borderWidth: 0,
            marginLeft: 6,
            marginRight: 6,
            backgroundColor: 'transparent',
            overflow: 'hidden',
        },
        flightPack: {
            zIndex: 2,
            backgroundColor: "transparent",
            height: 300,
            width: 225,
            borderRadius: 12,
            overflow: 'hidden',
            alignContent: 'center',
        }, 
        scrollStyle: {
            alignContent: 'center',
            marginLeft: 0,
            marginRight: 0,
        },
        viewScrollStyle: {
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: "transparent",
            marginTop: 26,
            marginLeft: 20,
            marginRight: 20,
        },
        titleFlightText: {
            color: 'white',
            fontFamily: subtitleFont,
            fontSize: 22,
            marginTop: 6,
            marginBottom: 6,
        },
        detailsText: {
            color: '#b3b0a1',
            fontFamily: bodyFont,
            fontSize: 16,
            marginTop: 0,
            marginBottom: 0,
            marginRight: 2,
            textAlign: 'justify',
        },
        image: {
            height: 66,
            width: 66,
            borderRadius: 12,
        },
        addFlightLink: {
            width: '8%',
            marginLeft: 24,
            marginRight: 0,
            borderRadius: 12,
            backgroundColor: '#875a31',
            alignItems: 'center',
            justifyContent: 'center',
        },
        addText: {
            color: 'white',
            fontFamily: bodyFont,
            fontSize: 16,
            marginTop: 0,
            marginBottom: 0,
        },
        locationContent: {
            flexDirection: 'row',
            marginTop: 4,
        },
        flightDetails: {
            flexDirection: 'row',
            marginTop: 0,
        },
        flightICAO: {
            color: '#d0871e',
            fontFamily: titleFont,
            fontSize: 20,
            marginTop: 0,
            marginBottom: 0,
            marginRight: 4,
            textAlign: 'justify',
        },
        flightLocationName: {
            color: '#321e29',
            fontFamily: titleFont,
            fontSize: 20,
            marginTop: 0,
            marginBottom: 0,
            textAlign: 'justify',
        },
        flightNumberText: {
            color: '#92c5fc',
            fontFamily: bodyFont,
            fontSize: 16,
            marginRight: 4,
            textAlign: 'justify',
        },
        statusText: {
            color: 'white',
            fontFamily: bodyFont,
            fontSize: 16,
            marginTop: 4,
            marginBottom: 0,
            textAlign: 'center',
        },
        terminalText: {
            color: 'white',
            fontFamily: bodyFont,
            fontSize: 16,
            marginTop: 0,
            marginBottom: 0,
            textAlign: 'justify',
        },
        scheduledText: {
            color: 'white',
            fontFamily: bodyFont,
            fontSize: 16,
            marginTop: 0,
            marginBottom: 0,
            marginRight: 2,
            textAlign: 'justify',
            textDecorationLine: 'line-through'
        },
        estimatedText: {
            color: 'yellow',
            fontFamily: bodyFont,
            fontSize: 16,
            marginTop: 0,
            marginBottom: 0,
            marginRight: 2,
            textAlign: 'justify',
        },
        companyIcon: {
            marginBottom: 0,
            marginTop: 0,
            marginLeft: -12,
            marginRight: 0,
            borderRadius: 12,
            borderWidth: 0,
            backgroundColor: '#b3b0a1',
            shadowColor: '#000',
            shadowOpacity: 0,
            shadowRadius: 10,
            alignItems: 'center',
            zIndex: 5,
        },
        luggageQr: {
            marginBottom: 0,
            marginTop: 0,
            marginLeft: -12,
            marginRight: 0,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            borderWidth: 0,
            backgroundColor: '#321e29',
            alignItems: 'center',
            paddingLeft: 19.5,
            paddingRight: 8.5,
            paddingTop: 8,
            paddingBottom: 8,
            zIndex: 1,
        },
        companyText: {
            color: '#875a31',
            fontFamily: bodyFont,
            fontSize: 16,
            textAlign: 'justify',
        },
        statusTitleText: {
            color: '#875a31',
            fontFamily: bodyFont,
            fontSize: 16,
            textAlign: 'justify',
        },
        statusNameText: {
            color: '#321e29',
            fontFamily: bodyFont,
            fontSize: 16,
            textAlign: 'justify',
        },
        statusBarText: {
            color: '#e9e8e6',
            fontFamily: titleFont,
            marginTop: 2,
            fontSize: 26,
            textAlign: 'justify',
        },
        alternativeText: {
            color: '#b3b0a1',
            fontFamily: bodyFont,
            fontSize: 16,
            textAlign: 'justify',
        },
        flightContent: {
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            marginLeft: 0,
            paddingLeft: 8,
            paddingTop: 7,
            borderWidth: 0,
            backgroundColor: 'white',
            width: '92.5%',
            height: 66,
            zIndex: 4,
        },
        rowContainer: {
            flexDirection: 'row',
        },
        statusLuggageContainer: {
            alignItems: 'center',
            backgroundColor: '#b3b0a1',
            height: 68,
            zIndex: 1,
            marginTop: -12,
            paddingTop: 12,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
        }
    });

    if (!fontsLoaded) {
        return null;
    }

    const truncateText = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const renderUserItem = (userItem: UserEntity) => (            
        <View style={styles.flightContainer} key={userItem.uuid}>
            <ImageBackground source={{uri: userItem.photoUser}} style={styles.flightPack}>
                <Text style={styles.alternativeText}>{userItem.nameUser}</Text>
                <Text style={styles.alternativeText}>{userItem.surnameUser}</Text>
                <Text style={styles.alternativeText}>{userItem.mailUser}</Text>
                <Text style={styles.alternativeText}>{userItem.birthdateUser.toString()}</Text>
                <Text style={styles.statusBarText}>Text</Text>
            </ImageBackground>
        </View>
    );

    const formatICAO = (icaoCode: string | undefined) => {
        if (icaoCode === "LEAL") return "Alicante - Elche";
        if (icaoCode === "EHAM") return "Ámsterdam Schiphol";
        if (icaoCode === "LEBL") return "Barcelona - El Prat";
        if (icaoCode === "EKCH") return "Copenhague Kastrup";
        if (icaoCode === "EIDW") return "Dublín";
        if (icaoCode === "GCHI") return "El Hierro";
        if (icaoCode === "ESSA") return "Estocolmo Arlanda";
        if (icaoCode === "EDDF") return "Fráncfort Del Meno - Frankfurt";
        if (icaoCode === "GCFV") return "Fuerteventura";
        if (icaoCode === "LEGE") return "Girona - Costa Brava";
        if (icaoCode === "GCLP") return "Gran Canaria";
        if (icaoCode === "LEHC") return "Huesca - Pirineos";
        if (icaoCode === "GCGM") return "La Gomera";
        if (icaoCode === "GCLA") return "La Palma";
        if (icaoCode === "LESU") return "La Seu d'Urgell";
        if (icaoCode === "GCRR") return "Lanzarote";
        if (icaoCode === "LEDA") return "Lleida - Alguaire";
        if (icaoCode === "LERJ") return "Logroño";
        if (icaoCode === "EGKK") return "Londres Gatwick";
        if (icaoCode === "EGLL") return "Londres Heathrow";
        if (icaoCode === "EGSS") return "Londres Stansted";
        if (icaoCode === "LEMD") return "Madrid - Barajas Adolfo Suárez";
        if (icaoCode === "EDDM") return "Múnich Franz Josef Strauss";
        if (icaoCode === "ENGM") return "Oslo Gardermoen";
        if (icaoCode === "LERS") return "Reus - Tarragona";
        if (icaoCode === "LELL") return "Sabadell";
        if (icaoCode === "LESO") return "San Sebastián";
        if (icaoCode === "LGSR") return "Santorini";
        if (icaoCode === "GCXO") return "Tenerife Norte - Los Rodeos";
        if (icaoCode === "EPWA") return "Varsovia Chopin";
        else return "Unknown";
    };

  return (
    <ImageBackground style={[styles.backgroundImage, { backgroundColor: '#e9e8e6' }]}>
        <View style={styles.headerContainer}>
            <View style={styles.sectionTitle}>
                <Text style={styles.pageTitle}>Travellers</Text>
            </View>
            <View style={styles.airportContainer}>
                <View style={styles.airportTitle}>
                    <Text style={styles.nameTitle}>Barcelona</Text>
                </View>
            </View>
        </View>

        <View style={styles.viewScrollStyle}>
            <ScrollView style={styles.scrollStyle} horizontal={true} showsHorizontalScrollIndicator={false}>
                {listUsers
                ? (listUsers
                    .filter(user => {
                        if (user.deletedUser) { return false; }
                        if (user.privacyUser) { return false; }
                        return true;
                    })
                    .length === 0
                    ? <Text style={styles.noNewsText}>
                        No Luggage Available
                    </Text>
                    : listUsers
                        .map(renderUserItem))
                : <Text style={styles.noNewsText}>No Users</Text>
                }
            </ScrollView>
        </View>   
    </ImageBackground>
  );
}


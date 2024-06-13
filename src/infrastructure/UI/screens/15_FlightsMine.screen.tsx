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
import { Platform, StatusBar, TouchableOpacity, StyleSheet, ImageBackground, Image, View, Text, Alert, ScrollView, Modal} from "react-native";
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
import { LuggageEntity } from "../../../domain/luggage/luggage.entity";
import { LuggageService } from "../../services/luggage/luggage.service";
import { PredictionEntity } from "../../../domain/prediction/prediction.entity";
import { PredictionService } from "../../services/prediction/prediction.service";
import { PreferencesEntity } from "../../../domain/preferences/preferences.entity";
import { PreferencesService } from "../../services/preferences/preferences.service";
import axios from "axios";

async function loadFonts() {
  await Font.loadAsync({
    'Corporate': require('../../../../assets/easeaer_fonts/Corporate_Font.ttf'), 
    'Emirates': require('../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
    'SFNS': require('../../../../assets/easeaer_fonts/SF_Font.ttf'),
  });
}

export default function FlightsMine() {
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

    const [userDetails, setUserDetails] = useState<{ [key: string]: string }>({});
    const [searchText, setSearchText] = useState("");

    const [listFlights, setListFlights] = useState<FlightEntity[]>([]);
    const [companyInfo, setCompanyInfo] = useState<{ [key: string]: { name: string, logo: string } }>({});

    const [modalVisible, setModalVisible] = useState(false);
    const [idFlightLuggage, setIdFlightLuggage] = useState("");
    const [infoLuggage, setInfoLuggage] = useState('');

    const [preferencesModalVisible, setPreferencesModalVisible] = useState(false);
    const [idFlightPrediction, setIdFlightPrediction] = useState("");
    const [datePrediction, setDatePrediction] = useState(new Date());
    const [foodPreferences, setFoodPreferences] = useState("none");
    const [shopPreferences, setShopPreferences] = useState("none");
    const [carParkPreferences, setCarParkPreferences] = useState("none");
    const [luggagePreferences, setLuggagePreferences] = useState("none");
    const [marginPreferences, setMarginPreferences] = useState("high");

    const updateCompanyInfo = async (companyId: string, flightUuid: string) => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
            try {
                await CRUDService.getUserById(companyId).then(async (response) => {
                    // Si se pide el UUID de una compañía que no existe falla el BackEnd.
                    if (response?.data && response?.data != undefined && response?.data.nameUser) {
                        setCompanyInfo(prevInfo => ({
                            ...prevInfo,
                            [flightUuid]: {
                            name: `${response.data.nameUser} ${response.data.surnameUser}`,
                            logo: response.data.photoUser
                            }
                        }));
                    } else {
                        setCompanyInfo(prevInfo => ({
                            ...prevInfo,
                            [flightUuid]: {
                            name: "Unknown",
                            logo: "Unknown"
                            }
                        }));
                    }
                })
            } catch (error) {
                console.error("Error Getting Company Information:", error);
            }
        }
    };

    useFocusEffect(
        React.useCallback(() => {

        const getOwnFlights = async () => {
            const userId = await SessionService.getCurrentUser();
            if (userId) {
                try {
                    const response = await CRUDService.getUserById(userId);
                    if (response?.data && response.data.flightsUser) {
                        setListFlights([]);

                        for (let flightId of response.data.flightsUser){
                            console.log("PIDO EL VUELO CON ID " + flightId);
                            const flightResponse = await FlightService.getFlightById(flightId);
                            if (flightResponse?.data) {
                                setListFlights(prevFlights => [...prevFlights, flightResponse.data]);
                                updateCompanyInfo(flightResponse.data.companyFlight, flightResponse.data.uuid);
                            }
                        }
                    }
                } catch (error) {
                    Alert.alert("EaseAer", "Error Loading Flights");
                }
            }
        };

        getOwnFlights();

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
        backgroundColor: '#transparent',
        marginTop: 10,
        marginBottom: 0,
        height: 40,
        width: 255,
    },
    pickerItem:{
        fontSize: 16,
        color: "black",
        fontFamily: subtitleFont,
        height: 40,
        marginLeft: 0,
        marginRight: 0,
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
    scrollStyle: {
        alignContent: 'center',
    },
    searcherContainer: {
        height: 162,
        marginBottom: 0,
        alignItems: 'center',
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
        marginTop: 26,
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOpacity: 0,
        shadowRadius: 10,
        flexDirection: 'row',
        marginLeft: 26,
        marginRight: 26,
    },
    flightPack: {
        marginLeft: 0,
        width: '80%',
        zIndex: 2,
        flexDirection: 'row',
    }, 
    flightHeader: {
        marginBottom: 0,
        marginTop: 0,
        marginLeft: 0,
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
    titleFlightText: {
        color: 'white',
        fontFamily: subtitleFont,
        fontSize: 22,
        marginTop: 6,
        marginBottom: 6,
    },
    flightContent: {
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        marginLeft: -12,
        paddingLeft: 20,
        paddingTop: 0,
        borderWidth: 0,
        backgroundColor: '#321e29',
        width: '80%',
        height: 92,
        zIndex: 4,
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
    removeFlightLink: {
        width: '8%',
        marginLeft: 0,
        marginRight: 8,
        borderRadius: 12,
        backgroundColor: '#875a31',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addLuggageLink: {
        width: '8%',
        marginLeft: 8,
        marginRight: 0,
        borderRadius: 12,
        backgroundColor: '#d0871e',
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
    fromToText: {
        color: 'white',
        fontFamily: titleFont,
        fontSize: 20,
        marginTop: 0,
        marginBottom: 0,
        marginRight: 4,
        textAlign: 'justify',
    },
    flightLocationName: {
        color: 'white',
        fontFamily: titleFont,
        fontSize: 20,
        marginTop: 0,
        marginBottom: 0,
        marginRight: 4,
        textAlign: 'justify',
    },
    companyText: {
        color: '#e9e8e6',
        fontFamily: bodyFont,
        fontSize: 16,
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
    dayText: {
        color: 'white',
        fontFamily: bodyFont,
        fontSize: 16,
        marginTop: 0,
        marginBottom: 0,
        marginRight: 2,
        textAlign: 'justify',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.42)',
    },
    modalView: {
        width: '90%',
        backgroundColor: '#e9e8e6',
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    quizButton: {
        padding: 6,
        backgroundColor: "#875a31",
        borderRadius: 12,
        height: 38,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 20,
        width: 80,
        marginRight: 4,
        marginLeft: 4,
    },
    loadAllText: {
        fontFamily: subtitleFont,
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        marginTop: 3.5,
    },
    searcherPack: {
        backgroundColor: '#b3b0a1',
        color: 'white',
        fontFamily: subtitleFont,
        fontSize: 20,
        height: 80,
        width: 300,
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
    multilineTextInputStyle: {
        fontFamily: subtitleFont,
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        borderWidth: 0,
        width: 300,
        height: 60,
        marginTop: 8,
        borderRadius: 12,
        backgroundColor: '#b3b0a1',
        paddingStart: 10,
        padding: 8,
    },
    subtitleNewsText: {
        color: '#321e29',
        fontFamily: subtitleFont,
        fontSize: 19,
        marginTop: 14,
        marginBottom: 0,
    },
    modalButtons: {
        flexDirection: 'row',
    },
    createPredictionButton: {
        marginTop: 10,
        marginBottom: -4,
        marginLeft: 25,
        marginRight: 25,
        borderRadius: 12,
        height: 30,
        backgroundColor: '#b3b0a1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    createPredictionText: {
        color: 'white',
        fontFamily: subtitleFont,
        fontSize: 18,
        marginTop: 0,
        marginBottom: 0,
        textAlign: 'center',
    },
    modalPreferencesOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.42)',
    },
    modalPreferencesView: {
        width: '90%',
        backgroundColor: '#e9e8e6',
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    modalPreferencesContainer: {
        height: 480,
        marginBottom: 0,
        alignItems: 'center',
    },
    preferencesStatementText: {
        color: '#d0871e',
        fontFamily: bodyFont,
        fontSize: 16,
        marginTop: 10,
        marginBottom: 0,
        marginRight: 2,
        textAlign: 'justify',
    },
    preferencesModalButtons: {
        marginTop: 4,
        flexDirection: 'row',
    },
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

    const removeFlight = async (flightId: string) => {
        const thisUserId = await SessionService.getCurrentUser();
        if (thisUserId) {
            await CRUDService.getUserById(thisUserId).then(async (userResponse) => {
                if (userResponse?.data) {                
                    setCurrentUser(userResponse.data);
                    console.log(">>> Se va a actualizar el usuario: " + JSON.stringify(userResponse.data));
                    
                    let updatedVectorFlights: string[] = [];

                    if (userResponse.data.flightsUser!=undefined){
                        for (let r = 0; r < userResponse.data.flightsUser.length; r++){
                            if (userResponse.data.flightsUser[r]!=flightId){
                                updatedVectorFlights.push(userResponse.data.flightsUser[r]);
                            }
                        }
                    }

                    const user: UserAuthEntity = {
                        uuid: userResponse.data.uuid ?? "",
                        appUser: userResponse.data.appUser ?? "",
                        nameUser: userResponse.data.nameUser ?? "",
                        surnameUser: userResponse.data.surnameUser ?? "",
                        mailUser: userResponse.data.mailUser ?? "",
                        passwordUser: userResponse.data.passwordUser ?? "",
                        photoUser: userResponse.data.photoUser ?? "",
                        birthdateUser: new Date(userResponse.data.birthdateUser ?? ""),
                        genderUser:
                            userResponse.data.genderUser === "male" || userResponse.data.genderUser === "female" || userResponse.data.genderUser === "other"
                            ? userResponse.data.genderUser
                                : "male",
                        descriptionUser: userResponse.data.descriptionUser ?? "",
                        roleUser:
                            userResponse.data.roleUser === "pax" ||
                            userResponse.data.roleUser === "company" ||
                            userResponse.data.roleUser === "admin" ||
                            userResponse.data.roleUser === "tech"
                            ? userResponse.data.roleUser
                                : "pax",
                        privacyUser: userResponse.data.privacyUser === "private" ? true : false,
                        recordGameUser: userResponse.data.recordGameUser,
                        flightsUser: updatedVectorFlights,
                        deletedUser: userResponse.data.deletedUser ?? false,
                    };

                    CRUDService.updateUser(thisUserId, user).then((response)=>{
                        if (response?.status===200){
                            Alert.alert("EaseAer", "Flight Removed");
                        };
                    })
                }
            })
        }
    }

    const addLuggage = async (flightId: string) => {
        setIdFlightLuggage(flightId);
        setModalVisible(true);
    }

    const computePrediction = async (flightId: string, std: Date) => {
        setIdFlightPrediction(flightId);
        setDatePrediction(std);
        setPreferencesModalVisible(true);
    }

    const registerLuggage = async () => {
        const thisUserId = await SessionService.getCurrentUser();
        if (thisUserId) {
            await CRUDService.getUserById(thisUserId).then(async (userResponse) => {
                if (userResponse?.data) {                
                    setCurrentUser(userResponse.data);
                    
                    const newLuggage: LuggageEntity = {
                        uuid: " " ?? "",
                        idUserLuggage: thisUserId ?? "",
                        idFlightLuggage: idFlightLuggage ?? "",
                        infoLuggage: infoLuggage ?? "",
                        statusLuggage: "waiting" ?? "",
                        deletedLuggage: false ?? false,
                    };

                    LuggageService.createLuggage(newLuggage).then((response)=>{
                        if (response?.status===200){
                            Alert.alert("EaseAer", "Luggage Added");
                        } else {
                            Alert.alert("EaseAer", "Error Creating Luggage");
                        }
                    })
                }
            })
        }
        setModalVisible(false);
    }

    const createPreferencesAndPrediction = async () => {
        const thisUserId = await SessionService.getCurrentUser();
        if (thisUserId) {
            await CRUDService.getUserById(thisUserId).then(async (userResponse) => {
                if (userResponse?.data) {                
                    setCurrentUser(userResponse.data);

                    const resultTimes = computePredictionTimes(datePrediction);
                    console.log(">>>>> RESULTADOS TMB: " + resultTimes);

                    const newPrediction: PredictionEntity = {
                        uuid: " " ?? "",
                        idUserPrediction: userResponse.data.uuid ?? "",
                        idFlightPredition: idFlightPrediction ?? "",
                        datePrediction: datePrediction ?? "",
                        exitHomeTimePrediction: "12:00",
                        transportTimePrediction: "12:10",
                        entranceTimePrediction: "12:20",
                        checkInTimePrediction: "12:30",
                        securityTimePrediction: "12:40",
                        passportTimePrediction: "12:50",
                        gateTimePrediction: "13:00",
                        planeTimePrediction: "12:10",
                        deletedPrediction: false ?? false,
                    };

                    PredictionService.createPrediction(newPrediction).then((response)=>{
                        if (response?.status===200 && response?.data != "ALREADY_PREDICTED"){
                            const newPreferences: PreferencesEntity = {
                                uuid: " " ?? "",
                                idPredPreferences: response.data.uuid ?? "",
                                foodPreferences:
                                    foodPreferences === "none" || foodPreferences === "lightmeal" || foodPreferences === "fullmeal"
                                    ? foodPreferences : "none",
                                shopPreferences:
                                    foodPreferences === "none" || foodPreferences === "look" || foodPreferences === "search"
                                    ? foodPreferences : "none",
                                carParkPreferences:
                                    foodPreferences === "none" || foodPreferences === "own" || foodPreferences === "rentacar"
                                    ? foodPreferences : "none",
                                luggagePreferences:
                                    foodPreferences === "none" || foodPreferences === "one" || foodPreferences === "multiple" || foodPreferences === "special"
                                    ? foodPreferences : "none",
                                marginPreferences:
                                    foodPreferences === "none" || foodPreferences === "low" || foodPreferences === "mid" || foodPreferences === "high"
                                    ? foodPreferences : "high",  
                                deletedPreferences: false ?? false,
                            };

                            PreferencesService.createPreferences(newPreferences).then((responsePref)=>{
                                if (responsePref?.status===200){
                                    Alert.alert("EaseAer", "Prediction Created");
                                } else {
                                    Alert.alert("EaseAer", "Error Saving Preferences");
                                }
                            })
                        } else {
                            Alert.alert("EaseAer", "Error Creating Prediction");
                        }
                    })
                }
            })
        }
        setPreferencesModalVisible(false);
    }

    const renderFlightItem = (flightItem: FlightEntity) => (
        <View>
            <View style={styles.flightContainer} key={flightItem.uuid}>
                <TouchableOpacity style={styles.removeFlightLink} onPress={() => removeFlight(flightItem.uuid)}>
                    <Text style={styles.addText}>-</Text>
                </TouchableOpacity>
                <View style={styles.flightPack}>
                    <View style={styles.flightHeader}>
                        <Image source={{uri: companyInfo[flightItem.uuid]?.logo} || require('../../../../assets/easeaer_icons/EaseAer_Logo_2_Png.png') } style={styles.image} />
                        <Text style={styles.statusText}>{formatStatus(flightItem.statusFlight)}</Text>
                    </View>
                    <View style={styles.flightContent}>
                        {flightItem.originFlight == "LEBL" && (
                            <View style={styles.locationContent}>
                                <Text style={styles.flightLocationName}>Barcelona</Text>
                                <Text style={styles.flightICAO}>-</Text>
                                <Text style={styles.flightLocationName}>{truncateText(formatICAO(flightItem.destinationFlight), 14)}</Text>
                            </View>
                        )}
                        {flightItem.destinationFlight == "LEBL" && (
                            <View style={styles.locationContent}>
                                <Text style={styles.flightLocationName}>{truncateText(formatICAO(flightItem.originFlight), 14)}</Text>
                                <Text style={styles.flightICAO}>-</Text>
                                <Text style={styles.flightLocationName}>Barcelona</Text>
                            </View>
                        )}
                        <View style={styles.flightDetails}>
                            <Text style={styles.flightNumberText}>{flightItem.numberFlight}</Text>
                            <Text style={styles.companyText}>{companyInfo[flightItem.uuid]?.name}</Text>
                        </View>
                        <View style={styles.flightDetails}>
                            <Text style={styles.detailsText}>From</Text>
                            <Text style={styles.scheduledText}>{formatDate(flightItem.stdFlight.toString())}</Text>
                            <Text style={styles.estimatedText}>{formatDate(flightItem.etdFlight.toString())}</Text>
                            <Text style={styles.detailsText}>To</Text>
                            <Text style={styles.scheduledText}>{formatDate(flightItem.staFlight.toString())}</Text>
                            <Text style={styles.estimatedText}>{formatDate(flightItem.etaFlight.toString())}</Text>
                        </View>
                        <View style={styles.flightDetails}>
                            <Text style={styles.detailsText}>Day</Text>
                            <Text style={styles.dayText}>{formatDay(flightItem.stdFlight.toString())}</Text>
                        </View>
                        <Text style={styles.terminalText}>{formatTerminal(flightItem.depTerminalFlight)}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.addLuggageLink} onPress={() => addLuggage(flightItem.uuid)}>
                    <MaterialCommunityIcons name="bag-suitcase" size={20} color='white' />
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={styles.createPredictionButton} onPress={() => computePrediction(flightItem.uuid, flightItem.stdFlight)}>
                    <Text style={styles.createPredictionText}>Calculate Prediction</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const formatDate = (dateString: string | undefined) => {
        if (dateString != undefined) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(0);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}`;
        } else {
            return `Not Available`;
        }
    };

    const formatDay = (dateString: string | undefined) => {
        if (dateString != undefined) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(0);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${day}.${month}.${year}`;
        } else {
            return `Not Available`;
        }
    };

    const formatTerminal = (terminalString: string | undefined) => {
        if ((terminalString != undefined) && (terminalString === "t1")) {
            return `Terminal 1`;
        } 
        if ((terminalString != undefined) && (terminalString === "t2")) {
            return `Terminal 2`;
        } else {
            return `Not Available`;
        }
    };

    const formatStatus = (status: string | undefined) => {
        if ((status != undefined) && (status === "ontime")) {
            return `On Time`;
        } 
        if ((status != undefined) && (status === "delayed")) {
            return `Delayed`;
        } 
        if ((status != undefined) && (status === "cancelled")) {
            return `Cancelled`;
        } 
    };

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
                <Text style={styles.pageTitle}>My {listFlights?.length} Trips</Text>
            </View>
            <View style={styles.airportContainer}>
                <View style={styles.airportTitle}>
                    <Text style={styles.nameTitle}>Barcelona</Text>
                </View>
            </View>
        </View>

        <Modal animationType="none" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(false) }}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                    <View style={styles.searcherContainer}>
                        <Text style={styles.subtitleNewsText}>Create Luggage</Text>
                        <TextInput style={styles.multilineTextInputStyle} placeholder="Description" value={infoLuggage} onChangeText={ setInfoLuggage } multiline maxLength={72}/>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.quizButton} onPress={() => registerLuggage()}>
                                <Text style={styles.loadAllText}>Add</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.quizButton, {backgroundColor: "#d8131b"}]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.loadAllText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>

        <Modal animationType="none" transparent={true} visible={preferencesModalVisible} onRequestClose={() => { setPreferencesModalVisible(false) }}>
            <View style={styles.modalPreferencesOverlay}>
                <View style={styles.modalPreferencesView}>
                    <View style={styles.modalPreferencesContainer}>
                        <Text style={styles.subtitleNewsText}>Create Prediction</Text>
                        
                        <Text style={styles.preferencesStatementText}>Eating / Drinking</Text>
                        <Picker selectedValue={foodPreferences} style={styles.picker} itemStyle={styles.pickerItem} onValueChange={(itemValue) => setFoodPreferences(itemValue)}>
                            <Picker.Item label="None" value="none"/>
                            <Picker.Item label="Lunch / Dinner" value="fullmeal"/>
                            <Picker.Item label="Snack / Drink / Light Meal" value="lightmeal"/>
                        </Picker>

                        <Text style={styles.preferencesStatementText}>Shopping</Text>
                        <Picker selectedValue={shopPreferences} style={styles.picker} itemStyle={styles.pickerItem} onValueChange={(itemValue) => setShopPreferences(itemValue)}>
                            <Picker.Item label="None" value="none"/>
                            <Picker.Item label="Buying" value="search"/>
                            <Picker.Item label="Just Looking" value="look"/>
                        </Picker>

                        <Text style={styles.preferencesStatementText}>Own Car / Rental Car</Text>
                        <Picker selectedValue={carParkPreferences} style={styles.picker} itemStyle={styles.pickerItem} onValueChange={(itemValue) => setCarParkPreferences(itemValue)}>
                            <Picker.Item label="None" value="none"/>
                            <Picker.Item label="Returning Rental Car" value="rentacar"/>
                            <Picker.Item label="Parking Own Car" value="own"/>
                        </Picker>

                        <Text style={styles.preferencesStatementText}>Luggage</Text>
                        <Picker selectedValue={luggagePreferences} style={styles.picker} itemStyle={styles.pickerItem} onValueChange={(itemValue) => setLuggagePreferences(itemValue)}>
                            <Picker.Item label="None" value="none"/>
                            <Picker.Item label="1 Bag" value="one"/>
                            <Picker.Item label="> 1 Bags" value="multiple"/>
                            <Picker.Item label="Special Luggage" value="special"/>
                        </Picker>

                        <Text style={styles.preferencesStatementText}>Margin?</Text>
                        <Picker selectedValue={marginPreferences} style={styles.picker} itemStyle={styles.pickerItem} onValueChange={(itemValue) => setMarginPreferences(itemValue)}>
                            <Picker.Item label="Comfortable" value="high"/>
                            <Picker.Item label="Normal" value="mid"/>
                            <Picker.Item label="Hurry" value="low"/>
                        </Picker>                        
                        
                        <View style={styles.preferencesModalButtons}>
                            <TouchableOpacity style={styles.quizButton} onPress={() => createPreferencesAndPrediction()}>
                                <Text style={styles.loadAllText}>Calculate</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.quizButton, {backgroundColor: "#d8131b"}]} onPress={() => setPreferencesModalVisible(false)}>
                                <Text style={styles.loadAllText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>

        <ScrollView style={styles.scrollStyle}>
        {listFlights
            ? (listFlights
                .length === 0
                ? <Text style={styles.noNewsText}>
                    No Flights Available
                </Text>
                : listFlights
                    .sort((a, b) => {
                        const dateA = new Date(a.stdFlight);
                        const dateB = new Date(b.stdFlight);
                        return dateA.getTime() - dateB.getTime();
                    })
                    .map(renderFlightItem))
            : <Text style={styles.noNewsText}>No Flights</Text>
            }
        </ScrollView>
    </ImageBackground>
  );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// FUNCIÓN DE PREDICCIÓN DE TIEMPOS "DOOR TO GATE":

const computePredictionTimes = (std: Date) => {
    const stdDate = new Date(std);
    const dayFlight = String(stdDate.getDate()).padStart(2, '0');
    const monthFlight = String(stdDate.getMonth() + 1).padStart(2, '0');
    const yearFlight = String(stdDate.getFullYear()).slice(0);
    const stdHours = String(stdDate.getHours()).padStart(2, '0');
    const stdMinutes = String(stdDate.getMinutes()).padStart(2, '0');
    const timePlane = `${stdHours}:${stdMinutes}`;

    // (1) EXIT HOME TIME:

    // (2) ENTER TRANSPORT TIME:
    let travelTime = 0;
    const origin = '41.22047888509405, 1.7210408222311584'; // AQUÍ DEBERÍA UBICAR LAS COORDENADAS DE TU CASA
    const destination = '41.28774514491456, 2.073313634621097'; // COORDENADAS T1 BARCELONA
    const date = `${monthFlight}-${dayFlight}-${yearFlight}`;
    let hourValue = stdHours;
    let amOrPm = "am";
    if (parseInt(hourValue, 10) > 12){
        hourValue = (parseInt(hourValue, 10)-12).toString();
        amOrPm = "pm";
    }
    const time = `${hourValue}:${stdMinutes}${amOrPm}`;
    const arriveBy = 'true'; // 'true' = HORA LLEGADA | 'false' = HORA SALIDA
    const mode = 'TRANSIT,WALK'; // MODOS DE TRANSPORTE
    const url = `https://api.tmb.cat/v1/planner/plan?app_id=ee1987cb&app_key=b53bd5d74b9cfd81e5170f825d74f7f6&fromPlace=${origin}&toPlace=${destination}&date=${date}&time=${time}&arriveBy=${arriveBy}&mode=${mode}`;
    axios.get(url)
        .then(response => {
            if (response.data.plan && response.data.plan.itineraries.length > 0) {
                const result = response.data.plan.itineraries[0];
                const duration = result.duration;
                const durationMinutes = Math.round(duration / 60);
                travelTime = durationMinutes;
                console.log("TRAYECTO DE: " + durationMinutes + " MINUTOS.");
            } else {
                travelTime = -1;
            }
        })
        .catch(error => {
            console.error('Error Computing Travel Time: ', error);
            travelTime = -1;
        });

    // (3) ENTER AIRPORT TIME:

    // (4) CHECK-IN TIME (IF ANY):

    // (5) SECURITY CONTROL TIME:

    // (6) PASSPORT CONTROL (IF ANY):

    // (7) BE-AT-THE-GATE TIME:

    return ("HOLA");
    
    // RETURNING THE 8 RESULTS:
    // return `${A}|${B}|${C}|${D}|${E}|${F}|${G}|${timePlane}`;
    // "15:30|15:45|16:30|-|17:00|-|17:30|18:00";
};


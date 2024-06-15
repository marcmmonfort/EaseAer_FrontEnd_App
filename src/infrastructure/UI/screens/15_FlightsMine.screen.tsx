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
import { Platform, StatusBar, TouchableOpacity, StyleSheet, ImageBackground, Image, View, Text, Alert, ScrollView, Modal, PermissionsAndroid} from "react-native";
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
import * as Location from 'expo-location';
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
    const [icaoFlightPrediction, setIcaoFlightPrediction] = useState("");
    const [datePrediction, setDatePrediction] = useState(new Date());
    const [foodPreferences, setFoodPreferences] = useState("none");
    const [shopPreferences, setShopPreferences] = useState("none");
    const [carParkPreferences, setCarParkPreferences] = useState("none");
    const [luggagePreferences, setLuggagePreferences] = useState("none");
    const [marginPreferences, setMarginPreferences] = useState("high");
    const [coordinates, setCoordinates] = useState("");

    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (Platform.OS === 'android') {
            requestLocationPermission();
        } else {
            getCurrentLocation();
        }
    }, []);

    const requestLocationPermission = async () => {
        try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Permission',
                message: 'THIS APP NEEDS ACCESS TO YOUR LOCATION',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentLocation();
        } else {
            console.log('Location Permission Denied');
        }
        } catch (err) {
            console.warn(err);
        }
    };

    const getCurrentLocation = async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
  
            if (status === "granted") {
                const location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;
                setCoordinates(latitude + "," + longitude);
                console.log("COORDENADAS ENCONTRADAS: " + latitude + "," + longitude);
            }
        } catch (error) {
          console.log("Error Obteniendo Ubicación", error);
        }
    };

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

    const computePrediction = async (flightId: string, std: Date, icao: string, originICAO: string) => {
        if (originICAO === "LEBL"){
            setIdFlightPrediction(flightId);
            setIcaoFlightPrediction(icao);
            setDatePrediction(std);
            setPreferencesModalVisible(true);
        } else {
            Alert.alert("EaseAer", "Function Available Only For Departing Flights");
        }        
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

                    const resultTimes = await computePredictionTimes(datePrediction, coordinates);
                    console.log("---> Resultado Predicción: " + resultTimes);
                    if (resultTimes != undefined) {
                        const timesArray = resultTimes.split("|");

                        const newPrediction: PredictionEntity = {
                            uuid: " " ?? "",
                            idUserPrediction: userResponse.data.uuid ?? "",
                            idFlightPredition: idFlightPrediction ?? "",
                            datePrediction: datePrediction ?? "",
                            exitHomeTimePrediction: timesArray[0],
                            transportTimePrediction: timesArray[1],
                            entranceTimePrediction: timesArray[2],
                            checkInTimePrediction: timesArray[3],
                            securityTimePrediction: timesArray[4],
                            passportTimePrediction: timesArray[5],
                            gateTimePrediction: timesArray[6],
                            planeTimePrediction: timesArray[7],
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
                                        shopPreferences === "none" || shopPreferences === "look" || shopPreferences === "search"
                                        ? shopPreferences : "none",
                                    carParkPreferences:
                                        carParkPreferences === "none" || carParkPreferences === "own" || carParkPreferences === "rentacar"
                                        ? carParkPreferences : "own",
                                    luggagePreferences:
                                        luggagePreferences === "none" || luggagePreferences === "one" || luggagePreferences === "multiple" || luggagePreferences === "special"
                                        ? luggagePreferences : "none",
                                    marginPreferences:
                                        marginPreferences === "none" || marginPreferences === "low" || marginPreferences === "mid" || marginPreferences === "high"
                                        ? marginPreferences : "high",  
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
                <TouchableOpacity style={styles.createPredictionButton} onPress={() => computePrediction(flightItem.uuid, flightItem.stdFlight, flightItem.destinationFlight, flightItem.originFlight)}>
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

    const getFlightRadius = (icaoCode: string | undefined) => {
        if (icaoCode === "LELL") { return "25"; } // LELL (Sabadell): 25 km
        if (icaoCode === "LERS") { return "78"; } // LERS (Reus - Tarragona): 78 km
        if (icaoCode === "LEGE") { return "88"; } // LEGE (Girona - Costa Brava): 88 km
        if (icaoCode === "LESU") { return "129"; } // LESU (La Seu d'Urgell): 129 km
        if (icaoCode === "LEDA") { return "138"; } // LEDA (Lleida - Alguaire): 138 km
        if (icaoCode === "LEHC") { return "217"; } // LEHC (Huesca - Pirineos): 217 km
        if (icaoCode === "LERJ") { return "387"; } // LERJ (Logroño): 387 km
        if (icaoCode === "LESO") { return "392"; } // LESO (San Sebastián): 392 km
        if (icaoCode === "LEAL") { return "404"; } // LEAL (Alicante - Elche): 404 km
        if (icaoCode === "LEMD") { return "483"; } // LEMD (Madrid - Barajas Adolfo Suárez): 483 km
        if (icaoCode === "EDDF") { return "1094"; } // EDDF (Fráncfort Del Meno - Frankfurt): 1094 km
        if (icaoCode === "EDDM") { return "1094"; } // EDDM (Múnich Franz Josef Strauss): 1094 km
        if (icaoCode === "EGKK") { return "1109"; } // EGKK (Londres Gatwick): 1109 km
        if (icaoCode === "EGLL") { return "1148"; } // EGLL (Londres Heathrow): 1148 km
        if (icaoCode === "EGSS") { return "1186"; } // EGSS (Londres Stansted): 1186 km
        if (icaoCode === "EHAM") { return "1241"; } // EHAM (Ámsterdam Schiphol): 1241 km
        if (icaoCode === "EIDW") { return "1485"; } // EIDW (Dublín): 1485 km
        if (icaoCode === "EKCH") { return "1768"; } // EKCH (Copenhague Kastrup): 1768 km
        if (icaoCode === "EPWA") { return "1869"; } // EPWA (Varsovia Chopin): 1869 km
        if (icaoCode === "GCRR") { return "1974"; } // GCRR (Lanzarote): 1974 km
        if (icaoCode === "GCFV") { return "2032"; } // GCFV (Fuerteventura): 2032 km
        if (icaoCode === "LGSR") { return "2091"; } // LGSR (Santorini): 2091 km
        if (icaoCode === "GCLP") { return "2175"; } // GCLP (Gran Canaria): 2175 km
        if (icaoCode === "ENGM") { return "2190"; } // ENGM (Oslo Gardermoen): 2190 km
        if (icaoCode === "GCXO") { return "2195"; } // GCXO (Tenerife Norte - Los Rodeos): 2195 km
        if (icaoCode === "GCLA") { return "2282"; } // GCLA (La Palma): 2282 km
        if (icaoCode === "GCGM") { return "2291"; } // GCGM (La Gomera): 2291 km
        if (icaoCode === "ESSA") { return "2314"; } // ESSA (Estocolmo Arlanda): 2314 km
        if (icaoCode === "GCHI") { return "2354"; } // GCHI (El Hierro): 2354 km
        else return "0";
    };

    const getPassportRequired = (icaoCode: string | undefined) => {
        if (icaoCode === "LELL") { return false } // LELL (Sabadell)
        if (icaoCode === "LERS") { return false } // LERS (Reus - Tarragona)
        if (icaoCode === "LEGE") { return false } // LEGE (Girona - Costa Brava)
        if (icaoCode === "LESU") { return false } // LESU (La Seu d'Urgell)
        if (icaoCode === "LEDA") { return false } // LEDA (Lleida - Alguaire)
        if (icaoCode === "LEHC") { return false } // LEHC (Huesca - Pirineos)
        if (icaoCode === "LERJ") { return false } // LERJ (Logroño)
        if (icaoCode === "LESO") { return false } // LESO (San Sebastián)
        if (icaoCode === "LEAL") { return false } // LEAL (Alicante - Elche)
        if (icaoCode === "LEMD") { return false } // LEMD (Madrid - Barajas Adolfo Suárez)
        if (icaoCode === "EDDF") { return false } // EDDF (Fráncfort Del Meno - Frankfurt)
        if (icaoCode === "EDDM") { return false } // EDDM (Múnich Franz Josef Strauss)
        if (icaoCode === "EGKK") { return true } // EGKK (Londres Gatwick)
        if (icaoCode === "EGLL") { return true } // EGLL (Londres Heathrow)
        if (icaoCode === "EGSS") { return true } // EGSS (Londres Stansted)
        if (icaoCode === "EHAM") { return false } // EHAM (Ámsterdam Schiphol)
        if (icaoCode === "EIDW") { return true } // EIDW (Dublín)
        if (icaoCode === "EKCH") { return false } // EKCH (Copenhague Kastrup)
        if (icaoCode === "EPWA") { return false } // EPWA (Varsovia Chopin)
        if (icaoCode === "GCRR") { return false } // GCRR (Lanzarote)
        if (icaoCode === "GCFV") { return false } // GCFV (Fuerteventura)
        if (icaoCode === "LGSR") { return false } // LGSR (Santorini)
        if (icaoCode === "GCLP") { return false } // GCLP (Gran Canaria)
        if (icaoCode === "ENGM") { return false } // ENGM (Oslo Gardermoen)
        if (icaoCode === "GCXO") { return false } // GCXO (Tenerife Norte - Los Rodeos)
        if (icaoCode === "GCLA") { return false } // GCLA (La Palma)
        if (icaoCode === "GCGM") { return false } // GCGM (La Gomera)
        if (icaoCode === "ESSA") { return false } // ESSA (Estocolmo Arlanda)
        if (icaoCode === "GCHI") { return false } // GCHI (El Hierro)
        else return false;
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // FUNCIÓN DE PREDICCIÓN DE TIEMPOS "DOOR TO GATE":

    const computePredictionTimes = async (std: Date, coordinates: string) => {
        if (coordinates == ""){
            Alert.alert("EaseAer", "Unable To Locate Your Position");
        }
        else {
            const destinationIcao = icaoFlightPrediction;
            const passportNeeded = getPassportRequired(destinationIcao);
            const flightRadius = getFlightRadius(destinationIcao);
            const stdDate = new Date(std);
            const dayFlight = String(stdDate.getDate()).padStart(2, '0');
            const monthFlight = String(stdDate.getMonth() + 1).padStart(2, '0');
            const yearFlight = String(stdDate.getFullYear()).slice(0);
            let flightType = "long";

            // # # # # # # # # # # # # # # # SETTING THE MARGIN COEFFICIENTS # # # # # # # # # # # # # # # 
            let marginCoefficient = 1;
            if (marginPreferences=="low") { marginCoefficient = 1; }
            if (marginPreferences=="mid") { marginCoefficient = 1.5; }
            if (marginPreferences=="high") { marginCoefficient = 2; }

            // (8) # # # # # # # # # # # # # # # PLANE TIME # # # # # # # # # # # # # # #           
            const timePlaneHours = String(stdDate.getHours()).padStart(2, '0');
            const timePlaneMinutes = String(stdDate.getMinutes()).padStart(2, '0');
            const timePlane = `${timePlaneHours}:${timePlaneMinutes}`;

            // (7) # # # # # # # # # # # # # # # BE-AT-THE-GATE TIME # # # # # # # # # # # # # # #
            let gateAnticipationTime = 60;
            if (parseInt(flightRadius, 10) < 3000){
                console.log("Vuelo Corto Radio");
                flightType = "short";
                if (marginPreferences=="low"){ gateAnticipationTime = 30; }
                if (marginPreferences=="mid"){ gateAnticipationTime = 45; }
                if (marginPreferences=="high"){ gateAnticipationTime = 60; }
            } else {
                console.log("Vuelo Largo Radio")
                if (marginPreferences=="low"){ gateAnticipationTime = 40; }
                if (marginPreferences=="mid"){ gateAnticipationTime = 50; }
                if (marginPreferences=="high"){ gateAnticipationTime = 60; }
            }
            const timeGateInMinutes = parseInt(timePlaneHours, 10)*60 + parseInt(timePlaneMinutes, 10) - gateAnticipationTime;
            const adjustedTimeGateInMinutes = (timeGateInMinutes + 24 * 60) % (24 * 60); // ASEGURAR QUE NO VOLVEMOS AL DÍA ANTERIOR
            const timeGateHour = Math.floor(adjustedTimeGateInMinutes / 60);
            const timeGateMinutes = adjustedTimeGateInMinutes % 60;
            const timeGateHourFormatted = String(timeGateHour).padStart(2, '0'); // 2 DÍGITOS
            const timeGateMinutesFormatted  = String(timeGateMinutes).padStart(2, '0'); // 2 DÍGITOS
            const timeGate = `${timeGateHourFormatted}:${timeGateMinutesFormatted}`;

            // (6) # # # # # # # # # # # # # # # PASSPORT CONTROL (IF ANY) # # # # # # # # # # # # # # #
            let preControlDelay = 4;
            let postControlDelay = 8;
            if (marginPreferences=="low") { preControlDelay = 2; postControlDelay = 4; }
            if (marginPreferences=="mid") { preControlDelay = 3; postControlDelay = 6; }
            if (marginPreferences=="high") { preControlDelay = 4; postControlDelay = 8; }
            let passportControlTime = 0;
            if (foodPreferences != "none"){
                if (passportNeeded){
                    if (foodPreferences == "lightmeal"){ preControlDelay = preControlDelay + 15; }
                    if (foodPreferences == "fullmeal"){ preControlDelay = preControlDelay + 35; }
                } else {
                    if (foodPreferences == "lightmeal"){ postControlDelay = postControlDelay + 15; }
                    if (foodPreferences == "fullmeal"){ postControlDelay = postControlDelay + 35; }
                }
            }
            if (shopPreferences != "none"){
                if (passportNeeded){
                    if (shopPreferences == "look"){ preControlDelay = preControlDelay + 10; }
                    if (shopPreferences == "search"){ preControlDelay = preControlDelay + 20; }
                } else {
                    if (shopPreferences == "look"){ postControlDelay = postControlDelay + 10; }
                    if (shopPreferences == "search"){ postControlDelay = postControlDelay + 20; }
                }
            }
            if (passportNeeded){
                let passportProcessDelay = getPassportControlTime(timeGateHour, monthFlight);
                passportControlTime = preControlDelay + passportProcessDelay + postControlDelay;
            } else {
                passportControlTime = postControlDelay;
            }
            const timeExitSCInMinutes = adjustedTimeGateInMinutes - passportControlTime;
            const adjustedTimeExitSCInMinutes = (timeExitSCInMinutes + 24 * 60) % (24 * 60);
            const timeExitSCHour = Math.floor(adjustedTimeExitSCInMinutes / 60);
            const timeExitSCMinutes = adjustedTimeExitSCInMinutes % 60;
            const timeExitSCHourFormatted = String(timeExitSCHour).padStart(2, '0'); // 2 DÍGITOS
            const timeExitSCMinutesFormatted  = String(timeExitSCMinutes).padStart(2, '0'); // 2 DÍGITOS
            const timeExitSC = `${timeExitSCHourFormatted}:${timeExitSCMinutesFormatted}`;
            let timeEnterPassports = "-"; // CUANDO NO APLICA
            if (passportNeeded){
                const timeEnterPassportsInMinutes = timeExitSCInMinutes + preControlDelay;
                const adjustedTimeEnterPassportsInMinutes = (timeEnterPassportsInMinutes + 24 * 60) % (24 * 60);
                const timeEnterPassportsHour = Math.floor(adjustedTimeEnterPassportsInMinutes / 60);
                const timeEnterPassportsMinutes = adjustedTimeEnterPassportsInMinutes % 60;
                const timeEnterPassportsHourFormatted = String(timeEnterPassportsHour).padStart(2, '0'); // 2 DÍGITOS
                const timeEnterPassportsMinutesFormatted  = String(timeEnterPassportsMinutes).padStart(2, '0'); // 2 DÍGITOS
                timeEnterPassports = `${timeEnterPassportsHourFormatted}:${timeEnterPassportsMinutesFormatted}`;
            }

            // (5) # # # # # # # # # # # # # # # SECURITY CONTROL TIME # # # # # # # # # # # # # # #
            const securityFilterTime = getSecurityControlTime(timeExitSCHour, monthFlight);
            const timeEnterSCInMinutes = adjustedTimeExitSCInMinutes - securityFilterTime;
            const adjustedTimeEnterSCInMinutes = (timeEnterSCInMinutes + 24 * 60) % (24 * 60);
            const timeEnterSCHour = Math.floor(adjustedTimeEnterSCInMinutes / 60);
            const timeEnterSCMinutes = adjustedTimeEnterSCInMinutes % 60;
            const timeEnterSCHourFormatted = String(timeEnterSCHour).padStart(2, '0'); // 2 DÍGITOS
            const timeEnterSCMinutesFormatted  = String(timeEnterSCMinutes).padStart(2, '0'); // 2 DÍGITOS
            const timeEnterSC = `${timeEnterSCHourFormatted}:${timeEnterSCMinutesFormatted}`;

            // (4, 3) # # # # # # # # # # # # # # # CHECK-IN TIME (IF ANY) - ENTER AIRPORT TIME # # # # # # # # # # # # # # # 
            // const getCheckInTime = (finishTime: number, month: string, flightType: string) => {
            let preCheckInDelay = 8;
            let postCheckInDelay = 4;
            if (marginPreferences=="low") { preCheckInDelay = 4; postCheckInDelay = 2; }
            if (marginPreferences=="mid") { preCheckInDelay = 6; postCheckInDelay = 3; }
            if (marginPreferences=="high") { preCheckInDelay = 8; postCheckInDelay = 4; }
            let checkInTime = preCheckInDelay;
            let timeStartCheckIn = "-"; // CUANDO NO APLICA
            let checkInProcessTime = 0;
            if (luggagePreferences != "none"){ // "one" - "multiple" - "special"
                const timePlaneSTDInMinutes = parseInt(timePlaneHours, 10)*60 + parseInt(timePlaneMinutes, 10);
                let timeDifVsSTD = timePlaneSTDInMinutes - adjustedTimeEnterSCInMinutes;
                checkInProcessTime = getCheckInTime(timeEnterSCHour, monthFlight, flightType, timeDifVsSTD);
                if (luggagePreferences == "one"){ checkInTime = preCheckInDelay + checkInProcessTime*1 + postCheckInDelay; }
                if (luggagePreferences == "multiple"){ checkInTime = preCheckInDelay + checkInProcessTime*2 + postCheckInDelay; }
                if (luggagePreferences == "special"){ checkInTime = preCheckInDelay + checkInProcessTime*3 + postCheckInDelay; }
            }
            const timeEnterAirportInMinutes = adjustedTimeEnterSCInMinutes - checkInTime;
            const adjustedTimeEnterAirport = (timeEnterAirportInMinutes + 24 * 60) % (24 * 60);
            const timeEnterAirportHour = Math.floor(adjustedTimeEnterAirport / 60);
            const timeEnterAirportMinutes = adjustedTimeEnterAirport % 60;
            const timeEnterAirportHourFormatted = String(timeEnterAirportHour).padStart(2, '0'); // 2 DÍGITOS
            const timeEnterAirportMinutesFormatted  = String(timeEnterAirportMinutes).padStart(2, '0'); // 2 DÍGITOS
            const timeEnterAirport = `${timeEnterAirportHourFormatted}:${timeEnterAirportMinutesFormatted}`;
            if (luggagePreferences != "none"){ // "one" - "multiple" - "special"
                const timeStartCheckInInMinutes = timeEnterAirportInMinutes + checkInProcessTime;
                const adjustedTimeStartCheckInInMinutes = (timeStartCheckInInMinutes + 24 * 60) % (24 * 60);
                const timeStartCheckInHour = Math.floor(adjustedTimeStartCheckInInMinutes / 60);
                const timeStartCheckInMinutes = adjustedTimeStartCheckInInMinutes % 60;
                const timeStartCheckInHourFormatted = String(timeStartCheckInHour).padStart(2, '0'); // 2 DÍGITOS
                const timeStartCheckInMinutesFormatted  = String(timeStartCheckInMinutes).padStart(2, '0'); // 2 DÍGITOS
                timeStartCheckIn = `${timeStartCheckInHourFormatted}:${timeStartCheckInMinutesFormatted}`;
            }
            
            // (2, 1) # # # # # # # # # # # # # # # ENTER TRANSPORT TIME - EXIT HOME TIME # # # # # # # # # # # # # # # 
            let timeStartTrip = "-";
            let timeStartTripButInMinutes = 0;
            let timeExitHome = "-";
            let travelTime = 0;
            const origin = coordinates;
            const destination = '41.28774514491456, 2.073313634621097'; // T1 BCN
            const date = `${monthFlight}-${dayFlight}-${yearFlight}`;
            let amOrPm = "am";
            let timeEnterAirportHourForTMB = timeEnterAirportHour;
            if (timeEnterAirportHourForTMB > 12){
                timeEnterAirportHourForTMB = timeEnterAirportHourForTMB - 12;
                amOrPm = "pm";
            }
            const time = `${timeEnterAirportHour}:${timeEnterAirportMinutes}${amOrPm}`;
            const arriveBy = 'true'; // 'true' = HORA LLEGADA | 'false' = HORA SALIDA
            const mode = 'TRANSIT,WALK'; // MODOS DE TRANSPORTE
            const url = `https://api.tmb.cat/v1/planner/plan?app_id=73b4e50d&app_key=46215a9e903beb0b41208f01259f0d90&fromPlace=${origin}&toPlace=${destination}&date=${date}&time=${time}&arriveBy=${arriveBy}&mode=${mode}`;
            console.log("PETICIÓN: " + url);
            const getTravelTime = async () => {
                try {
                    const response = await axios.get(url);
                    if (response.data.plan && response.data.plan.itineraries.length > 0) {
                        const result = response.data.plan.itineraries[0];
                        const duration = result.duration;
                        const durationMinutes = Math.round(duration / 60);
                        travelTime = durationMinutes;
                        console.log("[TIME] Duración del Trayecto Según TMB: " + travelTime + " Min.");
                        if (carParkPreferences != "none"){ // ESTIMACIÓN EN CASO DE IR EN VEHÍCULO PROPIO / RENT-A-CAR:
                            if (carParkPreferences == "ownY"){
                                if (marginPreferences == "low"){ travelTime = Math.round(durationMinutes / 2) + 12; }
                                if (marginPreferences == "mid"){ travelTime = Math.round(durationMinutes / 2) + 16; }
                                if (marginPreferences == "high"){ travelTime = Math.round(durationMinutes / 2) + 20; }
                            }
                            if (carParkPreferences == "ownN"){
                                travelTime = Math.round(durationMinutes / 2) + 8;
                            }
                            if (carParkPreferences == "rentacar"){
                                travelTime = Math.round(durationMinutes / 2) + 12;
                            }
                        }
                        console.log("[TIME] Duración del Trayecto (+ Parking (Si Aplica)): " + travelTime + " Min.");
                        timeStartTripButInMinutes = adjustedTimeEnterAirport - durationMinutes;
                        const adjustedTimeStartTrip = (timeStartTripButInMinutes + 24 * 60) % (24 * 60);
                        const timeStartTripHour = Math.floor(adjustedTimeStartTrip / 60);
                        const timeStartTripMinutes = adjustedTimeStartTrip % 60;
                        const timeStartTripHourFormatted = String(timeStartTripHour).padStart(2, '0'); // 2 DÍGITOS
                        const timeStartTripMinutesFormatted = String(timeStartTripMinutes).padStart(2, '0'); // 2 DÍGITOS
                        timeStartTrip = `${timeStartTripHourFormatted}:${timeStartTripMinutesFormatted}`;
                    } else {
                        travelTime = -1;
                    }
                } catch (error) {
                    console.error('Error Computing Travel Time: ', error);
                    travelTime = -1;
                }
            };

            await getTravelTime();
            
            if (timeStartTripButInMinutes != 0) {
                let delayFromHome = 12;
                if (marginPreferences == "low") { delayFromHome = 5; }
                if (marginPreferences == "mid") { delayFromHome = 10; }
                if (marginPreferences == "high") { delayFromHome = 15; }
                const timeExitHomeInMinutes = timeStartTripButInMinutes - delayFromHome;
                const adjustedTimeExitHome = (timeExitHomeInMinutes + 24 * 60) % (24 * 60);
                const timeExitHomeHour = Math.floor(adjustedTimeExitHome / 60);
                const timeExitHomeMinutes = adjustedTimeExitHome % 60;
                const timeExitHomeHourFormatted = String(timeExitHomeHour).padStart(2, '0'); // 2 DÍGITOS
                const timeExitHomeMinutesFormatted = String(timeExitHomeMinutes).padStart(2, '0'); // 2 DÍGITOS
                timeExitHome = `${timeExitHomeHourFormatted}:${timeExitHomeMinutesFormatted}`;
            } 

            // # # # # # # # # # # # # # # # RETURNING THE 8 RESULTS # # # # # # # # # # # # # # # 
            return `${timeExitHome}|${timeStartTrip}|${timeEnterAirport}|${timeStartCheckIn}|${timeEnterSC}|${timeEnterPassports}|${timeGate}|${timePlane}`;

            // "15:30|15:45|16:30|-|17:00|-|17:30|18:00";
        }
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

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
                                <Picker.Item label="Parking Own Car (Shuttle)" value="ownY"/>
                                <Picker.Item label="Parking Own Car (No Shuttle)" value="ownN"/>
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

const getCheckInTime = (finishTime: number, month: string, flightType: string, timeVsSTD: number) => {
    let checkInTime = 5;
    if (flightType === 'long'){
        if (month === '01'){
            if (timeVsSTD < 90)                         { checkInTime = 5 } 
            if ((timeVsSTD >= 90)&&(timeVsSTD < 190))   { checkInTime = 10 } 
            if (timeVsSTD >= 190)                       { checkInTime = 5 } 
        }
        if (month === '02'){
            if (timeVsSTD < 90)                         { checkInTime = 5 } 
            if ((timeVsSTD >= 90)&&(timeVsSTD < 190))   { checkInTime = 11 } 
            if (timeVsSTD >= 190)                       { checkInTime = 6 } 
        }
        if (month === '03'){
            if (timeVsSTD < 90)                         { checkInTime = 5 } 
            if ((timeVsSTD >= 90)&&(timeVsSTD < 190))   { checkInTime = 11 } 
            if (timeVsSTD >= 190)                       { checkInTime = 6 } 
        }
        if (month === '04'){
            if (timeVsSTD < 90)                         { checkInTime = 5 } 
            if ((timeVsSTD >= 90)&&(timeVsSTD < 190))   { checkInTime = 12 } 
            if (timeVsSTD >= 190)                       { checkInTime = 6 } 
        }
        if (month === '05'){
            if (timeVsSTD < 90)                         { checkInTime = 5 } 
            if ((timeVsSTD >= 90)&&(timeVsSTD < 190))   { checkInTime = 11 } 
            if (timeVsSTD >= 190)                       { checkInTime = 6 } 
        }
        if (month === '06'){
            if (timeVsSTD < 90)                         { checkInTime = 5 } 
            if ((timeVsSTD >= 90)&&(timeVsSTD < 190))   { checkInTime = 12 } 
            if (timeVsSTD >= 190)                       { checkInTime = 6 } 
        }
        if (month === '07'){
            if (timeVsSTD < 90)                         { checkInTime = 6 } 
            if ((timeVsSTD >= 90)&&(timeVsSTD < 190))   { checkInTime = 13 } 
            if (timeVsSTD >= 190)                       { checkInTime = 6 } 
        }
        if (month === '08'){
            if (timeVsSTD < 90)                         { checkInTime = 6 } 
            if ((timeVsSTD >= 90)&&(timeVsSTD < 190))   { checkInTime = 14 } 
            if (timeVsSTD >= 190)                       { checkInTime = 6 } 
        }
        if (month === '09'){
            if (timeVsSTD < 90)                         { checkInTime = 5 } 
            if ((timeVsSTD >= 90)&&(timeVsSTD < 190))   { checkInTime = 12 } 
            if (timeVsSTD >= 190)                       { checkInTime = 6 } 
        }
        if (month === '10'){
            if (timeVsSTD < 90)                         { checkInTime = 5 } 
            if ((timeVsSTD >= 90)&&(timeVsSTD < 190))   { checkInTime = 11 } 
            if (timeVsSTD >= 190)                       { checkInTime = 6 } 
        }
        if (month === '11'){
            if (timeVsSTD < 90)                         { checkInTime = 5 } 
            if ((timeVsSTD >= 90)&&(timeVsSTD < 190))   { checkInTime = 11 } 
            if (timeVsSTD >= 190)                       { checkInTime = 6 } 
        }
        if (month === '12'){
            if (timeVsSTD < 90)                         { checkInTime = 5 } 
            if ((timeVsSTD >= 90)&&(timeVsSTD < 190))   { checkInTime = 11 } 
            if (timeVsSTD >= 190)                       { checkInTime = 6 } 
        }
    } else {
        if (month === '01'){ // ENERO:
            if (finishTime == 0) { checkInTime = 2 }; if (finishTime == 8) { checkInTime = 3 }; if (finishTime == 16) { checkInTime = 2 };
            if (finishTime == 1) { checkInTime = 2 }; if (finishTime == 9) { checkInTime = 3 }; if (finishTime == 17) { checkInTime = 2 };
            if (finishTime == 2) { checkInTime = 2 }; if (finishTime == 10) { checkInTime = 2 }; if (finishTime == 18) { checkInTime = 2 };
            if (finishTime == 3) { checkInTime = 2 }; if (finishTime == 11) { checkInTime = 2 }; if (finishTime == 19) { checkInTime = 2 };
            if (finishTime == 4) { checkInTime = 3 }; if (finishTime == 12) { checkInTime = 2 }; if (finishTime == 20) { checkInTime = 2 };
            if (finishTime == 5) { checkInTime = 3 }; if (finishTime == 13) { checkInTime = 2 }; if (finishTime == 21) { checkInTime = 2 };
            if (finishTime == 6) { checkInTime = 2 }; if (finishTime == 14) { checkInTime = 2 }; if (finishTime == 22) { checkInTime = 2 };
            if (finishTime == 7) { checkInTime = 2 }; if (finishTime == 15) { checkInTime = 2 }; if (finishTime == 23) { checkInTime = 2 };            
        }
        if (month === '02'){ // FEBRERO:
            if (finishTime == 0) { checkInTime = 2 }; if (finishTime == 8) { checkInTime = 2 }; if (finishTime == 16) { checkInTime = 2 };
            if (finishTime == 1) { checkInTime = 2 }; if (finishTime == 9) { checkInTime = 2 }; if (finishTime == 17) { checkInTime = 2 };
            if (finishTime == 2) { checkInTime = 2 }; if (finishTime == 10) { checkInTime = 3 }; if (finishTime == 18) { checkInTime = 2 };
            if (finishTime == 3) { checkInTime = 2 }; if (finishTime == 11) { checkInTime = 3 }; if (finishTime == 19) { checkInTime = 2 };
            if (finishTime == 4) { checkInTime = 3 }; if (finishTime == 12) { checkInTime = 2 }; if (finishTime == 20) { checkInTime = 2 };
            if (finishTime == 5) { checkInTime = 3 }; if (finishTime == 13) { checkInTime = 2 }; if (finishTime == 21) { checkInTime = 2 };
            if (finishTime == 6) { checkInTime = 2 }; if (finishTime == 14) { checkInTime = 2 }; if (finishTime == 22) { checkInTime = 2 };
            if (finishTime == 7) { checkInTime = 2 }; if (finishTime == 15) { checkInTime = 2 }; if (finishTime == 23) { checkInTime = 2 };            
        }
        if (month === '03'){ // MARZO:
            if (finishTime == 0) { checkInTime = 2 }; if (finishTime == 8) { checkInTime = 2 }; if (finishTime == 16) { checkInTime = 3 };
            if (finishTime == 1) { checkInTime = 2 }; if (finishTime == 9) { checkInTime = 2 }; if (finishTime == 17) { checkInTime = 3 };
            if (finishTime == 2) { checkInTime = 2 }; if (finishTime == 10) { checkInTime = 4 }; if (finishTime == 18) { checkInTime = 2 };
            if (finishTime == 3) { checkInTime = 2 }; if (finishTime == 11) { checkInTime = 4 }; if (finishTime == 19) { checkInTime = 2 };
            if (finishTime == 4) { checkInTime = 3 }; if (finishTime == 12) { checkInTime = 2 }; if (finishTime == 20) { checkInTime = 2 };
            if (finishTime == 5) { checkInTime = 3 }; if (finishTime == 13) { checkInTime = 2 }; if (finishTime == 21) { checkInTime = 2 };
            if (finishTime == 6) { checkInTime = 2 }; if (finishTime == 14) { checkInTime = 2 }; if (finishTime == 22) { checkInTime = 2 };
            if (finishTime == 7) { checkInTime = 2 }; if (finishTime == 15) { checkInTime = 2 }; if (finishTime == 23) { checkInTime = 2 };             
        }
        if (month === '04'){ // ABRIL:
            if (finishTime == 0) { checkInTime = 2 }; if (finishTime == 8) { checkInTime = 2 }; if (finishTime == 16) { checkInTime = 4 };
            if (finishTime == 1) { checkInTime = 2 }; if (finishTime == 9) { checkInTime = 2 }; if (finishTime == 17) { checkInTime = 4 };
            if (finishTime == 2) { checkInTime = 2 }; if (finishTime == 10) { checkInTime = 5 }; if (finishTime == 18) { checkInTime = 3 };
            if (finishTime == 3) { checkInTime = 2 }; if (finishTime == 11) { checkInTime = 5 }; if (finishTime == 19) { checkInTime = 3 };
            if (finishTime == 4) { checkInTime = 6 }; if (finishTime == 12) { checkInTime = 2 }; if (finishTime == 20) { checkInTime = 2 };
            if (finishTime == 5) { checkInTime = 6 }; if (finishTime == 13) { checkInTime = 2 }; if (finishTime == 21) { checkInTime = 2 };
            if (finishTime == 6) { checkInTime = 2 }; if (finishTime == 14) { checkInTime = 2 }; if (finishTime == 22) { checkInTime = 2 };
            if (finishTime == 7) { checkInTime = 2 }; if (finishTime == 15) { checkInTime = 2 }; if (finishTime == 23) { checkInTime = 2 };             
        }
        if (month === '05'){ // MAYO:
            if (finishTime == 0) { checkInTime = 2 }; if (finishTime == 8) { checkInTime = 3 }; if (finishTime == 16) { checkInTime = 3 };
            if (finishTime == 1) { checkInTime = 2 }; if (finishTime == 9) { checkInTime = 3 }; if (finishTime == 17) { checkInTime = 3 };
            if (finishTime == 2) { checkInTime = 2 }; if (finishTime == 10) { checkInTime = 5 }; if (finishTime == 18) { checkInTime = 3 };
            if (finishTime == 3) { checkInTime = 2 }; if (finishTime == 11) { checkInTime = 5 }; if (finishTime == 19) { checkInTime = 3 };
            if (finishTime == 4) { checkInTime = 5 }; if (finishTime == 12) { checkInTime = 3 }; if (finishTime == 20) { checkInTime = 2 };
            if (finishTime == 5) { checkInTime = 5 }; if (finishTime == 13) { checkInTime = 3 }; if (finishTime == 21) { checkInTime = 2 };
            if (finishTime == 6) { checkInTime = 2 }; if (finishTime == 14) { checkInTime = 3 }; if (finishTime == 22) { checkInTime = 2 };
            if (finishTime == 7) { checkInTime = 2 }; if (finishTime == 15) { checkInTime = 3 }; if (finishTime == 23) { checkInTime = 2 };            
        }
        if (month === '06'){ // JUNIO:
            if (finishTime == 0) { checkInTime = 2 }; if (finishTime == 8) { checkInTime = 2 }; if (finishTime == 16) { checkInTime = 3 };
            if (finishTime == 1) { checkInTime = 2 }; if (finishTime == 9) { checkInTime = 2 }; if (finishTime == 17) { checkInTime = 3 };
            if (finishTime == 2) { checkInTime = 2 }; if (finishTime == 10) { checkInTime = 5 }; if (finishTime == 18) { checkInTime = 4 };
            if (finishTime == 3) { checkInTime = 2 }; if (finishTime == 11) { checkInTime = 5 }; if (finishTime == 19) { checkInTime = 4 };
            if (finishTime == 4) { checkInTime = 4 }; if (finishTime == 12) { checkInTime = 2 }; if (finishTime == 20) { checkInTime = 2 };
            if (finishTime == 5) { checkInTime = 4 }; if (finishTime == 13) { checkInTime = 2 }; if (finishTime == 21) { checkInTime = 2 };
            if (finishTime == 6) { checkInTime = 2 }; if (finishTime == 14) { checkInTime = 3 }; if (finishTime == 22) { checkInTime = 2 };
            if (finishTime == 7) { checkInTime = 2 }; if (finishTime == 15) { checkInTime = 3 }; if (finishTime == 23) { checkInTime = 2 };              
        }
        if (month === '07'){ // JULIO:
            if (finishTime == 0) { checkInTime = 2 }; if (finishTime == 8) { checkInTime = 2 }; if (finishTime == 16) { checkInTime = 3 };
            if (finishTime == 1) { checkInTime = 2 }; if (finishTime == 9) { checkInTime = 2 }; if (finishTime == 17) { checkInTime = 3 };
            if (finishTime == 2) { checkInTime = 2 }; if (finishTime == 10) { checkInTime = 4 }; if (finishTime == 18) { checkInTime = 4 };
            if (finishTime == 3) { checkInTime = 2 }; if (finishTime == 11) { checkInTime = 4 }; if (finishTime == 19) { checkInTime = 4 };
            if (finishTime == 4) { checkInTime = 6 }; if (finishTime == 12) { checkInTime = 2 }; if (finishTime == 20) { checkInTime = 2 };
            if (finishTime == 5) { checkInTime = 6 }; if (finishTime == 13) { checkInTime = 2 }; if (finishTime == 21) { checkInTime = 2 };
            if (finishTime == 6) { checkInTime = 2 }; if (finishTime == 14) { checkInTime = 3 }; if (finishTime == 22) { checkInTime = 2 };
            if (finishTime == 7) { checkInTime = 2 }; if (finishTime == 15) { checkInTime = 3 }; if (finishTime == 23) { checkInTime = 2 };        
        }
        if (month === '08'){ // AGOSTO:
            if (finishTime == 0) { checkInTime = 2 }; if (finishTime == 8) { checkInTime = 2 }; if (finishTime == 16) { checkInTime = 4 };
            if (finishTime == 1) { checkInTime = 2 }; if (finishTime == 9) { checkInTime = 2 }; if (finishTime == 17) { checkInTime = 4 };
            if (finishTime == 2) { checkInTime = 2 }; if (finishTime == 10) { checkInTime = 4 }; if (finishTime == 18) { checkInTime = 4 };
            if (finishTime == 3) { checkInTime = 2 }; if (finishTime == 11) { checkInTime = 4 }; if (finishTime == 19) { checkInTime = 4 };
            if (finishTime == 4) { checkInTime = 5 }; if (finishTime == 12) { checkInTime = 2 }; if (finishTime == 20) { checkInTime = 2 };
            if (finishTime == 5) { checkInTime = 5 }; if (finishTime == 13) { checkInTime = 2 }; if (finishTime == 21) { checkInTime = 2 };
            if (finishTime == 6) { checkInTime = 2 }; if (finishTime == 14) { checkInTime = 4 }; if (finishTime == 22) { checkInTime = 2 };
            if (finishTime == 7) { checkInTime = 2 }; if (finishTime == 15) { checkInTime = 4 }; if (finishTime == 23) { checkInTime = 2 };            
        }
        if (month === '09'){ // SEPTIEMBRE:
            if (finishTime == 0) { checkInTime = 2 }; if (finishTime == 8) { checkInTime = 2 }; if (finishTime == 16) { checkInTime = 2 };
            if (finishTime == 1) { checkInTime = 2 }; if (finishTime == 9) { checkInTime = 2 }; if (finishTime == 17) { checkInTime = 2 };
            if (finishTime == 2) { checkInTime = 2 }; if (finishTime == 10) { checkInTime = 3 }; if (finishTime == 18) { checkInTime = 4 };
            if (finishTime == 3) { checkInTime = 2 }; if (finishTime == 11) { checkInTime = 3 }; if (finishTime == 19) { checkInTime = 4 };
            if (finishTime == 4) { checkInTime = 4 }; if (finishTime == 12) { checkInTime = 2 }; if (finishTime == 20) { checkInTime = 2 };
            if (finishTime == 5) { checkInTime = 4 }; if (finishTime == 13) { checkInTime = 2 }; if (finishTime == 21) { checkInTime = 2 };
            if (finishTime == 6) { checkInTime = 2 }; if (finishTime == 14) { checkInTime = 3 }; if (finishTime == 22) { checkInTime = 2 };
            if (finishTime == 7) { checkInTime = 2 }; if (finishTime == 15) { checkInTime = 3 }; if (finishTime == 23) { checkInTime = 2 };           
        }
        if (month === '10'){ // OCTUBRE:
            if (finishTime == 0) { checkInTime = 2 }; if (finishTime == 8) { checkInTime = 2 }; if (finishTime == 16) { checkInTime = 3 };
            if (finishTime == 1) { checkInTime = 2 }; if (finishTime == 9) { checkInTime = 2 }; if (finishTime == 17) { checkInTime = 3 };
            if (finishTime == 2) { checkInTime = 2 }; if (finishTime == 10) { checkInTime = 4 }; if (finishTime == 18) { checkInTime = 4 };
            if (finishTime == 3) { checkInTime = 2 }; if (finishTime == 11) { checkInTime = 4 }; if (finishTime == 19) { checkInTime = 4 };
            if (finishTime == 4) { checkInTime = 4 }; if (finishTime == 12) { checkInTime = 2 }; if (finishTime == 20) { checkInTime = 2 };
            if (finishTime == 5) { checkInTime = 4 }; if (finishTime == 13) { checkInTime = 2 }; if (finishTime == 21) { checkInTime = 2 };
            if (finishTime == 6) { checkInTime = 2 }; if (finishTime == 14) { checkInTime = 3 }; if (finishTime == 22) { checkInTime = 2 };
            if (finishTime == 7) { checkInTime = 2 }; if (finishTime == 15) { checkInTime = 3 }; if (finishTime == 23) { checkInTime = 2 };           
        }
        if (month === '11'){ // NOVIEMBRE:
            if (finishTime == 0) { checkInTime = 2 }; if (finishTime == 8) { checkInTime = 2 }; if (finishTime == 16) { checkInTime = 2 };
            if (finishTime == 1) { checkInTime = 2 }; if (finishTime == 9) { checkInTime = 2 }; if (finishTime == 17) { checkInTime = 2 };
            if (finishTime == 2) { checkInTime = 2 }; if (finishTime == 10) { checkInTime = 4 }; if (finishTime == 18) { checkInTime = 2 };
            if (finishTime == 3) { checkInTime = 2 }; if (finishTime == 11) { checkInTime = 4 }; if (finishTime == 19) { checkInTime = 2 };
            if (finishTime == 4) { checkInTime = 6 }; if (finishTime == 12) { checkInTime = 2 }; if (finishTime == 20) { checkInTime = 2 };
            if (finishTime == 5) { checkInTime = 6 }; if (finishTime == 13) { checkInTime = 2 }; if (finishTime == 21) { checkInTime = 2 };
            if (finishTime == 6) { checkInTime = 2 }; if (finishTime == 14) { checkInTime = 2 }; if (finishTime == 22) { checkInTime = 2 };
            if (finishTime == 7) { checkInTime = 2 }; if (finishTime == 15) { checkInTime = 2 }; if (finishTime == 23) { checkInTime = 2 };             
        }
        if (month === '12'){
            if (finishTime == 0) { checkInTime = 2 }; if (finishTime == 8) { checkInTime = 2 }; if (finishTime == 16) { checkInTime = 2 };
            if (finishTime == 1) { checkInTime = 2 }; if (finishTime == 9) { checkInTime = 2 }; if (finishTime == 17) { checkInTime = 2 };
            if (finishTime == 2) { checkInTime = 2 }; if (finishTime == 10) { checkInTime = 4 }; if (finishTime == 18) { checkInTime = 3 };
            if (finishTime == 3) { checkInTime = 2 }; if (finishTime == 11) { checkInTime = 4 }; if (finishTime == 19) { checkInTime = 3 };
            if (finishTime == 4) { checkInTime = 4 }; if (finishTime == 12) { checkInTime = 2 }; if (finishTime == 20) { checkInTime = 2 };
            if (finishTime == 5) { checkInTime = 4 }; if (finishTime == 13) { checkInTime = 2 }; if (finishTime == 21) { checkInTime = 2 };
            if (finishTime == 6) { checkInTime = 2 }; if (finishTime == 14) { checkInTime = 2 }; if (finishTime == 22) { checkInTime = 2 };
            if (finishTime == 7) { checkInTime = 2 }; if (finishTime == 15) { checkInTime = 2 }; if (finishTime == 23) { checkInTime = 2 };           
        }
    }
    console.log("[TIME] ---> Check-In: " + checkInTime);
    return checkInTime;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const getSecurityControlTime = (finishHour: number, month: string) => {
    // "finishHour": Hour Exitting Security Filter.
    let securityControlTime = 5;
    if (month === '01'){ // ENERO:
        if (finishHour == 0) { securityControlTime = 3 }; if (finishHour == 8) { securityControlTime = 4 }; if (finishHour == 16) { securityControlTime = 4 };
        if (finishHour == 1) { securityControlTime = 3 }; if (finishHour == 9) { securityControlTime = 4 }; if (finishHour == 17) { securityControlTime = 4 };
        if (finishHour == 2) { securityControlTime = 3 }; if (finishHour == 10) { securityControlTime = 4 }; if (finishHour == 18) { securityControlTime = 4 };
        if (finishHour == 3) { securityControlTime = 3 }; if (finishHour == 11) { securityControlTime = 4 }; if (finishHour == 19) { securityControlTime = 4 };
        if (finishHour == 4) { securityControlTime = 3 }; if (finishHour == 12) { securityControlTime = 4 }; if (finishHour == 20) { securityControlTime = 3 };
        if (finishHour == 5) { securityControlTime = 3 }; if (finishHour == 13) { securityControlTime = 4 }; if (finishHour == 21) { securityControlTime = 3 };
        if (finishHour == 6) { securityControlTime = 4 }; if (finishHour == 14) { securityControlTime = 4 }; if (finishHour == 22) { securityControlTime = 3 };
        if (finishHour == 7) { securityControlTime = 4 }; if (finishHour == 15) { securityControlTime = 4 }; if (finishHour == 23) { securityControlTime = 3 };
    }
    if (month === '02'){ // FEBRERO:
        if (finishHour == 0) { securityControlTime = 3 }; if (finishHour == 8) { securityControlTime = 4 }; if (finishHour == 16) { securityControlTime = 4 };
        if (finishHour == 1) { securityControlTime = 3 }; if (finishHour == 9) { securityControlTime = 4 }; if (finishHour == 17) { securityControlTime = 4 };
        if (finishHour == 2) { securityControlTime = 3 }; if (finishHour == 10) { securityControlTime = 4 }; if (finishHour == 18) { securityControlTime = 4 };
        if (finishHour == 3) { securityControlTime = 3 }; if (finishHour == 11) { securityControlTime = 4 }; if (finishHour == 19) { securityControlTime = 4 };
        if (finishHour == 4) { securityControlTime = 3 }; if (finishHour == 12) { securityControlTime = 4 }; if (finishHour == 20) { securityControlTime = 3 };
        if (finishHour == 5) { securityControlTime = 3 }; if (finishHour == 13) { securityControlTime = 4 }; if (finishHour == 21) { securityControlTime = 3 };
        if (finishHour == 6) { securityControlTime = 4 }; if (finishHour == 14) { securityControlTime = 4 }; if (finishHour == 22) { securityControlTime = 3 };
        if (finishHour == 7) { securityControlTime = 4 }; if (finishHour == 15) { securityControlTime = 4 }; if (finishHour == 23) { securityControlTime = 3 };
    }
    if (month === '03'){ // MARZO:
        if (finishHour == 0) { securityControlTime = 3 }; if (finishHour == 8) { securityControlTime = 4 }; if (finishHour == 16) { securityControlTime = 4 };
        if (finishHour == 1) { securityControlTime = 3 }; if (finishHour == 9) { securityControlTime = 4 }; if (finishHour == 17) { securityControlTime = 4 };
        if (finishHour == 2) { securityControlTime = 3 }; if (finishHour == 10) { securityControlTime = 4 }; if (finishHour == 18) { securityControlTime = 4 };
        if (finishHour == 3) { securityControlTime = 3 }; if (finishHour == 11) { securityControlTime = 4 }; if (finishHour == 19) { securityControlTime = 4 };
        if (finishHour == 4) { securityControlTime = 3 }; if (finishHour == 12) { securityControlTime = 4 }; if (finishHour == 20) { securityControlTime = 3 };
        if (finishHour == 5) { securityControlTime = 4 }; if (finishHour == 13) { securityControlTime = 5 }; if (finishHour == 21) { securityControlTime = 3 };
        if (finishHour == 6) { securityControlTime = 4 }; if (finishHour == 14) { securityControlTime = 4 }; if (finishHour == 22) { securityControlTime = 3 };
        if (finishHour == 7) { securityControlTime = 4 }; if (finishHour == 15) { securityControlTime = 4 }; if (finishHour == 23) { securityControlTime = 3 };
    }
    if (month === '04'){ // ABRIL:
        if (finishHour == 0) { securityControlTime = 3 }; if (finishHour == 8) { securityControlTime = 4 }; if (finishHour == 16) { securityControlTime = 4 };
        if (finishHour == 1) { securityControlTime = 3 }; if (finishHour == 9) { securityControlTime = 4 }; if (finishHour == 17) { securityControlTime = 4 };
        if (finishHour == 2) { securityControlTime = 3 }; if (finishHour == 10) { securityControlTime = 4 }; if (finishHour == 18) { securityControlTime = 4 };
        if (finishHour == 3) { securityControlTime = 3 }; if (finishHour == 11) { securityControlTime = 4 }; if (finishHour == 19) { securityControlTime = 4 };
        if (finishHour == 4) { securityControlTime = 3 }; if (finishHour == 12) { securityControlTime = 4 }; if (finishHour == 20) { securityControlTime = 3 };
        if (finishHour == 5) { securityControlTime = 5 }; if (finishHour == 13) { securityControlTime = 6 }; if (finishHour == 21) { securityControlTime = 3 };
        if (finishHour == 6) { securityControlTime = 5 }; if (finishHour == 14) { securityControlTime = 4 }; if (finishHour == 22) { securityControlTime = 3 };
        if (finishHour == 7) { securityControlTime = 4 }; if (finishHour == 15) { securityControlTime = 4 }; if (finishHour == 23) { securityControlTime = 3 };
    }
    if (month === '05'){ // MAYO:
        if (finishHour == 0) { securityControlTime = 3 }; if (finishHour == 8) { securityControlTime = 4 }; if (finishHour == 16) { securityControlTime = 4 };
        if (finishHour == 1) { securityControlTime = 3 }; if (finishHour == 9) { securityControlTime = 4 }; if (finishHour == 17) { securityControlTime = 4 };
        if (finishHour == 2) { securityControlTime = 3 }; if (finishHour == 10) { securityControlTime = 6 }; if (finishHour == 18) { securityControlTime = 4 };
        if (finishHour == 3) { securityControlTime = 3 }; if (finishHour == 11) { securityControlTime = 4 }; if (finishHour == 19) { securityControlTime = 4 };
        if (finishHour == 4) { securityControlTime = 3 }; if (finishHour == 12) { securityControlTime = 4 }; if (finishHour == 20) { securityControlTime = 3 };
        if (finishHour == 5) { securityControlTime = 4 }; if (finishHour == 13) { securityControlTime = 7 }; if (finishHour == 21) { securityControlTime = 3 };
        if (finishHour == 6) { securityControlTime = 8 }; if (finishHour == 14) { securityControlTime = 4 }; if (finishHour == 22) { securityControlTime = 3 };
        if (finishHour == 7) { securityControlTime = 4 }; if (finishHour == 15) { securityControlTime = 4 }; if (finishHour == 23) { securityControlTime = 3 };
    }
    if (month === '06'){ // JUNIO:
        if (finishHour == 0) { securityControlTime = 3 }; if (finishHour == 8) { securityControlTime = 4 }; if (finishHour == 16) { securityControlTime = 4 };
        if (finishHour == 1) { securityControlTime = 3 }; if (finishHour == 9) { securityControlTime = 5 }; if (finishHour == 17) { securityControlTime = 4 };
        if (finishHour == 2) { securityControlTime = 3 }; if (finishHour == 10) { securityControlTime = 8 }; if (finishHour == 18) { securityControlTime = 5 };
        if (finishHour == 3) { securityControlTime = 3 }; if (finishHour == 11) { securityControlTime = 4 }; if (finishHour == 19) { securityControlTime = 4 };
        if (finishHour == 4) { securityControlTime = 3 }; if (finishHour == 12) { securityControlTime = 4 }; if (finishHour == 20) { securityControlTime = 4 };
        if (finishHour == 5) { securityControlTime = 4 }; if (finishHour == 13) { securityControlTime = 7 }; if (finishHour == 21) { securityControlTime = 4 };
        if (finishHour == 6) { securityControlTime = 9 }; if (finishHour == 14) { securityControlTime = 4 }; if (finishHour == 22) { securityControlTime = 3 };
        if (finishHour == 7) { securityControlTime = 4 }; if (finishHour == 15) { securityControlTime = 4 }; if (finishHour == 23) { securityControlTime = 3 };
    }
    if (month === '07'){ // JULIO:
        if (finishHour == 0) { securityControlTime = 3 }; if (finishHour == 8) { securityControlTime = 4 }; if (finishHour == 16) { securityControlTime = 6 };
        if (finishHour == 1) { securityControlTime = 3 }; if (finishHour == 9) { securityControlTime = 7 }; if (finishHour == 17) { securityControlTime = 7 };
        if (finishHour == 2) { securityControlTime = 3 }; if (finishHour == 10) { securityControlTime = 6 }; if (finishHour == 18) { securityControlTime = 10 };
        if (finishHour == 3) { securityControlTime = 3 }; if (finishHour == 11) { securityControlTime = 6 }; if (finishHour == 19) { securityControlTime = 6 };
        if (finishHour == 4) { securityControlTime = 3 }; if (finishHour == 12) { securityControlTime = 6 }; if (finishHour == 20) { securityControlTime = 5 };
        if (finishHour == 5) { securityControlTime = 5 }; if (finishHour == 13) { securityControlTime = 8 }; if (finishHour == 21) { securityControlTime = 4 };
        if (finishHour == 6) { securityControlTime = 17 }; if (finishHour == 14) { securityControlTime = 6 }; if (finishHour == 22) { securityControlTime = 3 };
        if (finishHour == 7) { securityControlTime = 5 }; if (finishHour == 15) { securityControlTime = 6 }; if (finishHour == 23) { securityControlTime = 3 };
    }
    if (month === '08'){ // AGOSTO:
        if (finishHour == 0) { securityControlTime = 3 }; if (finishHour == 8) { securityControlTime = 4 }; if (finishHour == 16) { securityControlTime = 5 };
        if (finishHour == 1) { securityControlTime = 3 }; if (finishHour == 9) { securityControlTime = 5 }; if (finishHour == 17) { securityControlTime = 8 };
        if (finishHour == 2) { securityControlTime = 3 }; if (finishHour == 10) { securityControlTime = 6 }; if (finishHour == 18) { securityControlTime = 8 };
        if (finishHour == 3) { securityControlTime = 3 }; if (finishHour == 11) { securityControlTime = 7 }; if (finishHour == 19) { securityControlTime = 6 };
        if (finishHour == 4) { securityControlTime = 3 }; if (finishHour == 12) { securityControlTime = 6 }; if (finishHour == 20) { securityControlTime = 5 };
        if (finishHour == 5) { securityControlTime = 6 }; if (finishHour == 13) { securityControlTime = 8 }; if (finishHour == 21) { securityControlTime = 4 };
        if (finishHour == 6) { securityControlTime = 19 }; if (finishHour == 14) { securityControlTime = 6 }; if (finishHour == 22) { securityControlTime = 3 };
        if (finishHour == 7) { securityControlTime = 6 }; if (finishHour == 15) { securityControlTime = 6 }; if (finishHour == 23) { securityControlTime = 3 };
    }
    if (month === '09'){ // SEPTIEMBRE:
        if (finishHour == 0) { securityControlTime = 3 }; if (finishHour == 8) { securityControlTime = 4 }; if (finishHour == 16) { securityControlTime = 5 };
        if (finishHour == 1) { securityControlTime = 3 }; if (finishHour == 9) { securityControlTime = 6 }; if (finishHour == 17) { securityControlTime = 6 };
        if (finishHour == 2) { securityControlTime = 3 }; if (finishHour == 10) { securityControlTime = 8 }; if (finishHour == 18) { securityControlTime = 7 };
        if (finishHour == 3) { securityControlTime = 3 }; if (finishHour == 11) { securityControlTime = 5 }; if (finishHour == 19) { securityControlTime = 5 };
        if (finishHour == 4) { securityControlTime = 3 }; if (finishHour == 12) { securityControlTime = 5 }; if (finishHour == 20) { securityControlTime = 4 };
        if (finishHour == 5) { securityControlTime = 5 }; if (finishHour == 13) { securityControlTime = 8 }; if (finishHour == 21) { securityControlTime = 4 };
        if (finishHour == 6) { securityControlTime = 11 }; if (finishHour == 14) { securityControlTime = 5 }; if (finishHour == 22) { securityControlTime = 3 };
        if (finishHour == 7) { securityControlTime = 5 }; if (finishHour == 15) { securityControlTime = 5 }; if (finishHour == 23) { securityControlTime = 3 };
    }
    if (month === '10'){ // OCTUBRE:
        if (finishHour == 0) { securityControlTime = 3 }; if (finishHour == 8) { securityControlTime = 4 }; if (finishHour == 16) { securityControlTime = 4 };
        if (finishHour == 1) { securityControlTime = 3 }; if (finishHour == 9) { securityControlTime = 5 }; if (finishHour == 17) { securityControlTime = 4 };
        if (finishHour == 2) { securityControlTime = 3 }; if (finishHour == 10) { securityControlTime = 7 }; if (finishHour == 18) { securityControlTime = 5 };
        if (finishHour == 3) { securityControlTime = 3 }; if (finishHour == 11) { securityControlTime = 4 }; if (finishHour == 19) { securityControlTime = 4 };
        if (finishHour == 4) { securityControlTime = 3 }; if (finishHour == 12) { securityControlTime = 4 }; if (finishHour == 20) { securityControlTime = 4 };
        if (finishHour == 5) { securityControlTime = 4 }; if (finishHour == 13) { securityControlTime = 7 }; if (finishHour == 21) { securityControlTime = 4 };
        if (finishHour == 6) { securityControlTime = 9 }; if (finishHour == 14) { securityControlTime = 4 }; if (finishHour == 22) { securityControlTime = 3 };
        if (finishHour == 7) { securityControlTime = 4 }; if (finishHour == 15) { securityControlTime = 4 }; if (finishHour == 23) { securityControlTime = 3 };
    }
    if (month === '11'){ // NOVIEMBRE:
        if (finishHour == 0) { securityControlTime = 3 }; if (finishHour == 8) { securityControlTime = 4 }; if (finishHour == 16) { securityControlTime = 4 };
        if (finishHour == 1) { securityControlTime = 3 }; if (finishHour == 9) { securityControlTime = 4 }; if (finishHour == 17) { securityControlTime = 4 };
        if (finishHour == 2) { securityControlTime = 3 }; if (finishHour == 10) { securityControlTime = 4 }; if (finishHour == 18) { securityControlTime = 4 };
        if (finishHour == 3) { securityControlTime = 3 }; if (finishHour == 11) { securityControlTime = 4 }; if (finishHour == 19) { securityControlTime = 4 };
        if (finishHour == 4) { securityControlTime = 3 }; if (finishHour == 12) { securityControlTime = 4 }; if (finishHour == 20) { securityControlTime = 3 };
        if (finishHour == 5) { securityControlTime = 4 }; if (finishHour == 13) { securityControlTime = 4 }; if (finishHour == 21) { securityControlTime = 3 };
        if (finishHour == 6) { securityControlTime = 4 }; if (finishHour == 14) { securityControlTime = 4 }; if (finishHour == 22) { securityControlTime = 3 };
        if (finishHour == 7) { securityControlTime = 4 }; if (finishHour == 15) { securityControlTime = 4 }; if (finishHour == 23) { securityControlTime = 3 };
    }
    if (month === '12'){ // DICIEMBRE:
        if (finishHour == 0) { securityControlTime = 3 }; if (finishHour == 8) { securityControlTime = 4 }; if (finishHour == 16) { securityControlTime = 4 };
        if (finishHour == 1) { securityControlTime = 3 }; if (finishHour == 9) { securityControlTime = 4 }; if (finishHour == 17) { securityControlTime = 4 };
        if (finishHour == 2) { securityControlTime = 3 }; if (finishHour == 10) { securityControlTime = 4 }; if (finishHour == 18) { securityControlTime = 4 };
        if (finishHour == 3) { securityControlTime = 3 }; if (finishHour == 11) { securityControlTime = 4 }; if (finishHour == 19) { securityControlTime = 4 };
        if (finishHour == 4) { securityControlTime = 3 }; if (finishHour == 12) { securityControlTime = 4 }; if (finishHour == 20) { securityControlTime = 3 };
        if (finishHour == 5) { securityControlTime = 3 }; if (finishHour == 13) { securityControlTime = 4 }; if (finishHour == 21) { securityControlTime = 3 };
        if (finishHour == 6) { securityControlTime = 4 }; if (finishHour == 14) { securityControlTime = 4 }; if (finishHour == 22) { securityControlTime = 3 };
        if (finishHour == 7) { securityControlTime = 4 }; if (finishHour == 15) { securityControlTime = 4 }; if (finishHour == 23) { securityControlTime = 3 };
    }
    console.log("[TIME] ---> Security: " + securityControlTime);
    return securityControlTime;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const getPassportControlTime = (finishHour: number, month: string) => {
    // "finishHour": Hour Being At The Gate.
    let passportControlTime = 5;
    if (month === '01'){ // ENERO:
        if (finishHour == 0) { passportControlTime = 1 }; if (finishHour == 8) { passportControlTime = 1 }; if (finishHour == 16) { passportControlTime = 1 };
        if (finishHour == 1) { passportControlTime = 1 }; if (finishHour == 9) { passportControlTime = 1 }; if (finishHour == 17) { passportControlTime = 1 };
        if (finishHour == 2) { passportControlTime = 1 }; if (finishHour == 10) { passportControlTime = 1 }; if (finishHour == 18) { passportControlTime = 1 };
        if (finishHour == 3) { passportControlTime = 1 }; if (finishHour == 11) { passportControlTime = 1 }; if (finishHour == 19) { passportControlTime = 1 };
        if (finishHour == 4) { passportControlTime = 1 }; if (finishHour == 12) { passportControlTime = 1 }; if (finishHour == 20) { passportControlTime = 1 };
        if (finishHour == 5) { passportControlTime = 1 }; if (finishHour == 13) { passportControlTime = 1 }; if (finishHour == 21) { passportControlTime = 1 };
        if (finishHour == 6) { passportControlTime = 2 }; if (finishHour == 14) { passportControlTime = 1 }; if (finishHour == 22) { passportControlTime = 1 };
        if (finishHour == 7) { passportControlTime = 1 }; if (finishHour == 15) { passportControlTime = 1 }; if (finishHour == 23) { passportControlTime = 1 };
    }
    if (month === '02'){ // FEBRERO:
        if (finishHour == 0) { passportControlTime = 1 }; if (finishHour == 8) { passportControlTime = 1 }; if (finishHour == 16) { passportControlTime = 1 };
        if (finishHour == 1) { passportControlTime = 1 }; if (finishHour == 9) { passportControlTime = 1 }; if (finishHour == 17) { passportControlTime = 1 };
        if (finishHour == 2) { passportControlTime = 1 }; if (finishHour == 10) { passportControlTime = 1 }; if (finishHour == 18) { passportControlTime = 1 };
        if (finishHour == 3) { passportControlTime = 1 }; if (finishHour == 11) { passportControlTime = 1 }; if (finishHour == 19) { passportControlTime = 1 };
        if (finishHour == 4) { passportControlTime = 1 }; if (finishHour == 12) { passportControlTime = 1 }; if (finishHour == 20) { passportControlTime = 1 };
        if (finishHour == 5) { passportControlTime = 1 }; if (finishHour == 13) { passportControlTime = 1 }; if (finishHour == 21) { passportControlTime = 1 };
        if (finishHour == 6) { passportControlTime = 2 }; if (finishHour == 14) { passportControlTime = 1 }; if (finishHour == 22) { passportControlTime = 1 };
        if (finishHour == 7) { passportControlTime = 1 }; if (finishHour == 15) { passportControlTime = 1 }; if (finishHour == 23) { passportControlTime = 1 };
    }
    if (month === '03'){ // MARZO:
        if (finishHour == 0) { passportControlTime = 1 }; if (finishHour == 8) { passportControlTime = 1 }; if (finishHour == 16) { passportControlTime = 1 };
        if (finishHour == 1) { passportControlTime = 1 }; if (finishHour == 9) { passportControlTime = 1 }; if (finishHour == 17) { passportControlTime = 1 };
        if (finishHour == 2) { passportControlTime = 1 }; if (finishHour == 10) { passportControlTime = 1 }; if (finishHour == 18) { passportControlTime = 1 };
        if (finishHour == 3) { passportControlTime = 1 }; if (finishHour == 11) { passportControlTime = 1 }; if (finishHour == 19) { passportControlTime = 1 };
        if (finishHour == 4) { passportControlTime = 1 }; if (finishHour == 12) { passportControlTime = 1 }; if (finishHour == 20) { passportControlTime = 1 };
        if (finishHour == 5) { passportControlTime = 2 }; if (finishHour == 13) { passportControlTime = 1 }; if (finishHour == 21) { passportControlTime = 1 };
        if (finishHour == 6) { passportControlTime = 3 }; if (finishHour == 14) { passportControlTime = 1 }; if (finishHour == 22) { passportControlTime = 1 };
        if (finishHour == 7) { passportControlTime = 1 }; if (finishHour == 15) { passportControlTime = 1 }; if (finishHour == 23) { passportControlTime = 1 };
    }
    if (month === '04'){ // ABRIL:
        if (finishHour == 0) { passportControlTime = 1 }; if (finishHour == 8) { passportControlTime = 1 }; if (finishHour == 16) { passportControlTime = 1 };
        if (finishHour == 1) { passportControlTime = 1 }; if (finishHour == 9) { passportControlTime = 1 }; if (finishHour == 17) { passportControlTime = 2 };
        if (finishHour == 2) { passportControlTime = 1 }; if (finishHour == 10) { passportControlTime = 1 }; if (finishHour == 18) { passportControlTime = 2 };
        if (finishHour == 3) { passportControlTime = 1 }; if (finishHour == 11) { passportControlTime = 1 }; if (finishHour == 19) { passportControlTime = 1 };
        if (finishHour == 4) { passportControlTime = 1 }; if (finishHour == 12) { passportControlTime = 1 }; if (finishHour == 20) { passportControlTime = 1 };
        if (finishHour == 5) { passportControlTime = 2 }; if (finishHour == 13) { passportControlTime = 1 }; if (finishHour == 21) { passportControlTime = 1 };
        if (finishHour == 6) { passportControlTime = 7 }; if (finishHour == 14) { passportControlTime = 1 }; if (finishHour == 22) { passportControlTime = 1 };
        if (finishHour == 7) { passportControlTime = 1 }; if (finishHour == 15) { passportControlTime = 1 }; if (finishHour == 23) { passportControlTime = 1 };
    }
    if (month === '05'){ // MAYO:
        if (finishHour == 0) { passportControlTime = 1 }; if (finishHour == 8) { passportControlTime = 1 }; if (finishHour == 16) { passportControlTime = 1 };
        if (finishHour == 1) { passportControlTime = 1 }; if (finishHour == 9) { passportControlTime = 2 }; if (finishHour == 17) { passportControlTime = 2 };
        if (finishHour == 2) { passportControlTime = 1 }; if (finishHour == 10) { passportControlTime = 2 }; if (finishHour == 18) { passportControlTime = 2 };
        if (finishHour == 3) { passportControlTime = 1 }; if (finishHour == 11) { passportControlTime = 2 }; if (finishHour == 19) { passportControlTime = 1 };
        if (finishHour == 4) { passportControlTime = 1 }; if (finishHour == 12) { passportControlTime = 2 }; if (finishHour == 20) { passportControlTime = 1 };
        if (finishHour == 5) { passportControlTime = 4 }; if (finishHour == 13) { passportControlTime = 1 }; if (finishHour == 21) { passportControlTime = 1 };
        if (finishHour == 6) { passportControlTime = 2 }; if (finishHour == 14) { passportControlTime = 2 }; if (finishHour == 22) { passportControlTime = 1 };
        if (finishHour == 7) { passportControlTime = 1 }; if (finishHour == 15) { passportControlTime = 1 }; if (finishHour == 23) { passportControlTime = 1 };
    }
    if (month === '06'){ // JUNIO:
        if (finishHour == 0) { passportControlTime = 1 }; if (finishHour == 8) { passportControlTime = 1 }; if (finishHour == 16) { passportControlTime = 1 };
        if (finishHour == 1) { passportControlTime = 1 }; if (finishHour == 9) { passportControlTime = 2 }; if (finishHour == 17) { passportControlTime = 2 };
        if (finishHour == 2) { passportControlTime = 1 }; if (finishHour == 10) { passportControlTime = 2 }; if (finishHour == 18) { passportControlTime = 2 };
        if (finishHour == 3) { passportControlTime = 1 }; if (finishHour == 11) { passportControlTime = 2 }; if (finishHour == 19) { passportControlTime = 1 };
        if (finishHour == 4) { passportControlTime = 1 }; if (finishHour == 12) { passportControlTime = 2 }; if (finishHour == 20) { passportControlTime = 1 };
        if (finishHour == 5) { passportControlTime = 5 }; if (finishHour == 13) { passportControlTime = 1 }; if (finishHour == 21) { passportControlTime = 1 };
        if (finishHour == 6) { passportControlTime = 4 }; if (finishHour == 14) { passportControlTime = 2 }; if (finishHour == 22) { passportControlTime = 1 };
        if (finishHour == 7) { passportControlTime = 1 }; if (finishHour == 15) { passportControlTime = 2 }; if (finishHour == 23) { passportControlTime = 1 };
    }
    if (month === '07'){// JULIO:
        if (finishHour == 0) { passportControlTime = 1 }; if (finishHour == 8) { passportControlTime = 1 }; if (finishHour == 16) { passportControlTime = 2 };
        if (finishHour == 1) { passportControlTime = 1 }; if (finishHour == 9) { passportControlTime = 2 }; if (finishHour == 17) { passportControlTime = 2 };
        if (finishHour == 2) { passportControlTime = 1 }; if (finishHour == 10) { passportControlTime = 2 }; if (finishHour == 18) { passportControlTime = 3 };
        if (finishHour == 3) { passportControlTime = 1 }; if (finishHour == 11) { passportControlTime = 2 }; if (finishHour == 19) { passportControlTime = 2 };
        if (finishHour == 4) { passportControlTime = 1 }; if (finishHour == 12) { passportControlTime = 2 }; if (finishHour == 20) { passportControlTime = 2 };
        if (finishHour == 5) { passportControlTime = 1 }; if (finishHour == 13) { passportControlTime = 2 }; if (finishHour == 21) { passportControlTime = 1 };
        if (finishHour == 6) { passportControlTime = 11 }; if (finishHour == 14) { passportControlTime = 2 }; if (finishHour == 22) { passportControlTime = 1 };
        if (finishHour == 7) { passportControlTime = 1 }; if (finishHour == 15) { passportControlTime = 2 }; if (finishHour == 23) { passportControlTime = 1 };
    }
    if (month === '08'){ // AGOSTO:
        if (finishHour == 0) { passportControlTime = 1 }; if (finishHour == 8) { passportControlTime = 1 }; if (finishHour == 16) { passportControlTime = 2 };
        if (finishHour == 1) { passportControlTime = 1 }; if (finishHour == 9) { passportControlTime = 2 }; if (finishHour == 17) { passportControlTime = 3 };
        if (finishHour == 2) { passportControlTime = 1 }; if (finishHour == 10) { passportControlTime = 2 }; if (finishHour == 18) { passportControlTime = 3 };
        if (finishHour == 3) { passportControlTime = 1 }; if (finishHour == 11) { passportControlTime = 2 }; if (finishHour == 19) { passportControlTime = 2 };
        if (finishHour == 4) { passportControlTime = 1 }; if (finishHour == 12) { passportControlTime = 2 }; if (finishHour == 20) { passportControlTime = 2 };
        if (finishHour == 5) { passportControlTime = 3 }; if (finishHour == 13) { passportControlTime = 2 }; if (finishHour == 21) { passportControlTime = 1 };
        if (finishHour == 6) { passportControlTime = 14 }; if (finishHour == 14) { passportControlTime = 2 }; if (finishHour == 22) { passportControlTime = 1 };
        if (finishHour == 7) { passportControlTime = 1 }; if (finishHour == 15) { passportControlTime = 2 }; if (finishHour == 23) { passportControlTime = 1 };
    }
    if (month === '09'){ // SEPTIEMBRE:
        if (finishHour == 0) { passportControlTime = 1 }; if (finishHour == 8) { passportControlTime = 1 }; if (finishHour == 16) { passportControlTime = 2 };
        if (finishHour == 1) { passportControlTime = 1 }; if (finishHour == 9) { passportControlTime = 2 }; if (finishHour == 17) { passportControlTime = 2 };
        if (finishHour == 2) { passportControlTime = 1 }; if (finishHour == 10) { passportControlTime = 2 }; if (finishHour == 18) { passportControlTime = 2 };
        if (finishHour == 3) { passportControlTime = 1 }; if (finishHour == 11) { passportControlTime = 2 }; if (finishHour == 19) { passportControlTime = 2 };
        if (finishHour == 4) { passportControlTime = 1 }; if (finishHour == 12) { passportControlTime = 2 }; if (finishHour == 20) { passportControlTime = 2 };
        if (finishHour == 5) { passportControlTime = 8 }; if (finishHour == 13) { passportControlTime = 2 }; if (finishHour == 21) { passportControlTime = 1 };
        if (finishHour == 6) { passportControlTime = 6 }; if (finishHour == 14) { passportControlTime = 2 }; if (finishHour == 22) { passportControlTime = 1 };
        if (finishHour == 7) { passportControlTime = 1 }; if (finishHour == 15) { passportControlTime = 2 }; if (finishHour == 23) { passportControlTime = 1 };
    }
    if (month === '10'){ // OCTUBRE:
        if (finishHour == 0) { passportControlTime = 1 }; if (finishHour == 8) { passportControlTime = 1 }; if (finishHour == 16) { passportControlTime = 1 };
        if (finishHour == 1) { passportControlTime = 1 }; if (finishHour == 9) { passportControlTime = 2 }; if (finishHour == 17) { passportControlTime = 2 };
        if (finishHour == 2) { passportControlTime = 1 }; if (finishHour == 10) { passportControlTime = 2 }; if (finishHour == 18) { passportControlTime = 2 };
        if (finishHour == 3) { passportControlTime = 1 }; if (finishHour == 11) { passportControlTime = 2 }; if (finishHour == 19) { passportControlTime = 1 };
        if (finishHour == 4) { passportControlTime = 1 }; if (finishHour == 12) { passportControlTime = 2 }; if (finishHour == 20) { passportControlTime = 1 };
        if (finishHour == 5) { passportControlTime = 4 }; if (finishHour == 13) { passportControlTime = 1 }; if (finishHour == 21) { passportControlTime = 1 };
        if (finishHour == 6) { passportControlTime = 4 }; if (finishHour == 14) { passportControlTime = 2 }; if (finishHour == 22) { passportControlTime = 1 };
        if (finishHour == 7) { passportControlTime = 1 }; if (finishHour == 15) { passportControlTime = 2 }; if (finishHour == 23) { passportControlTime = 1 };
    }
    if (month === '11'){ // NOVIEMBRE:
        if (finishHour == 0) { passportControlTime = 1 }; if (finishHour == 8) { passportControlTime = 1 }; if (finishHour == 16) { passportControlTime = 1 };
        if (finishHour == 1) { passportControlTime = 1 }; if (finishHour == 9) { passportControlTime = 1 }; if (finishHour == 17) { passportControlTime = 1 };
        if (finishHour == 2) { passportControlTime = 1 }; if (finishHour == 10) { passportControlTime = 1 }; if (finishHour == 18) { passportControlTime = 1 };
        if (finishHour == 3) { passportControlTime = 1 }; if (finishHour == 11) { passportControlTime = 1 }; if (finishHour == 19) { passportControlTime = 1 };
        if (finishHour == 4) { passportControlTime = 1 }; if (finishHour == 12) { passportControlTime = 1 }; if (finishHour == 20) { passportControlTime = 1 };
        if (finishHour == 5) { passportControlTime = 2 }; if (finishHour == 13) { passportControlTime = 1 }; if (finishHour == 21) { passportControlTime = 1 };
        if (finishHour == 6) { passportControlTime = 3 }; if (finishHour == 14) { passportControlTime = 1 }; if (finishHour == 22) { passportControlTime = 1 };
        if (finishHour == 7) { passportControlTime = 1 }; if (finishHour == 15) { passportControlTime = 1 }; if (finishHour == 23) { passportControlTime = 1 };
    }
    if (month === '12'){ // DICIEMBRE:
        if (finishHour == 0) { passportControlTime = 1 }; if (finishHour == 8) { passportControlTime = 1 }; if (finishHour == 16) { passportControlTime = 1 };
        if (finishHour == 1) { passportControlTime = 1 }; if (finishHour == 9) { passportControlTime = 1 }; if (finishHour == 17) { passportControlTime = 1 };
        if (finishHour == 2) { passportControlTime = 1 }; if (finishHour == 10) { passportControlTime = 1 }; if (finishHour == 18) { passportControlTime = 1 };
        if (finishHour == 3) { passportControlTime = 1 }; if (finishHour == 11) { passportControlTime = 1 }; if (finishHour == 19) { passportControlTime = 1 };
        if (finishHour == 4) { passportControlTime = 1 }; if (finishHour == 12) { passportControlTime = 1 }; if (finishHour == 20) { passportControlTime = 1 };
        if (finishHour == 5) { passportControlTime = 2 }; if (finishHour == 13) { passportControlTime = 1 }; if (finishHour == 21) { passportControlTime = 1 };
        if (finishHour == 6) { passportControlTime = 2 }; if (finishHour == 14) { passportControlTime = 1 }; if (finishHour == 22) { passportControlTime = 1 };
        if (finishHour == 7) { passportControlTime = 1 }; if (finishHour == 15) { passportControlTime = 1 }; if (finishHour == 23) { passportControlTime = 1 };
    }
    console.log("[TIME] ---> Passport: " + passportControlTime);
    return passportControlTime;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


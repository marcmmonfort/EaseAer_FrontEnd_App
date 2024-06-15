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
import { PredictionService } from "../../services/prediction/prediction.service";
import { PredictionEntity } from "../../../domain/prediction/prediction.entity";

async function loadFonts() {
  await Font.loadAsync({
    'Corporate': require('../../../../assets/easeaer_fonts/Corporate_Font.ttf'), 
    'Emirates': require('../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
    'SFNS': require('../../../../assets/easeaer_fonts/SF_Font.ttf'),
  });
}

export default function PredictionsMine() {
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

    const [listPredictions, setListPredictions] = useState<PredictionEntity[]>([]);
    const [flightInfo, setFlightInfo] = useState<{ [key: string]: { name: string, logo: string, ICAO: string, std: Date, terminal: string } }>({});

    const updateCompanyInfo = async (companyId: string, flightUuid: string, flightDestination: string, flightStd: Date, flightTerminal: string) => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
            try {
                await CRUDService.getUserById(companyId).then(async (response) => {
                    // Si se pide el UUID de una compañía que no existe falla el BackEnd.
                    if (response?.data && response?.data != undefined && response?.data.nameUser) {
                        setFlightInfo(prevInfo => ({
                            ...prevInfo,
                            [flightUuid]: {
                                name: `${response.data.nameUser} ${response.data.surnameUser}`,
                                logo: response.data.photoUser,
                                ICAO: flightDestination,
                                std: flightStd,
                                terminal: flightTerminal,
                            }
                        }));
                    } else {
                        setFlightInfo(prevInfo => ({
                            ...prevInfo,
                            [flightUuid]: {
                                name: "Unknown",
                                logo: "Unknown",
                                ICAO: "Unknown",
                                std: new Date(),
                                terminal: "Unknown",
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

        const getOwnPredictions = async () => {
            const userId = await SessionService.getCurrentUser();
            if (userId) {
                try {
                    const response = await PredictionService.getPredictionsByUser(userId);
                    console.log("Respuesta Predicciones: " + JSON.stringify(response?.data));
                    if (response?.data && response.data[0].idFlightPrediction) {
                        setListPredictions(response.data);

                        for (let i = 0; i < response.data.length; i++){
                            console.log("PIDO EL VUELO CON ID " + response.data[i].idFlightPrediction);
                            const flightResponse = await FlightService.getFlightById(response.data[i].idFlightPrediction);
                            if (flightResponse?.data) {
                                updateCompanyInfo(flightResponse.data.companyFlight, flightResponse.data.uuid, flightResponse.data.destinationFlight, flightResponse.data.stdFlight, flightResponse.data.depTerminalFlight);
                            }
                        }
                    }
                } catch (error) {
                    Alert.alert("EaseAer", "Error Loading Predictions");
                }
            }
        };

        getOwnPredictions();

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

    const renderPredictionItem = (predictionItem: PredictionEntity) => (
            
        <View style={styles.flightContainer} key={predictionItem.uuid}>
            <View style={styles.flightPack}>
                <View style={styles.flightHeader}>
                    <Image source={{uri: flightInfo[predictionItem.idFlightPrediction]?.logo} || require('../../../../assets/easeaer_icons/EaseAer_Logo_2_Png.png') } style={styles.image} />
                </View>
                <View style={styles.flightContent}>
                    <View style={styles.flightDetails}>
                        <Text style={styles.companyText}>{flightInfo[predictionItem.idFlightPrediction]?.name}</Text>
                    </View>
                    <View style={styles.flightDetails}>
                        <Text style={styles.detailsText}>{predictionItem.exitHomeTimePrediction}</Text>
                        <Text style={styles.detailsText}>{predictionItem.transportTimePrediction}</Text>
                        <Text style={styles.detailsText}>{predictionItem.entranceTimePrediction}</Text>
                        <Text style={styles.detailsText}>{predictionItem.checkInTimePrediction}</Text>
                        <Text style={styles.detailsText}>{predictionItem.securityTimePrediction}</Text>
                        <Text style={styles.detailsText}>{predictionItem.passportTimePrediction}</Text>
                        <Text style={styles.detailsText}>{predictionItem.gateTimePrediction}</Text>
                        <Text style={styles.detailsText}>{predictionItem.planeTimePrediction}</Text>
                    </View>
                    <View style={styles.flightDetails}>
                        <Text style={styles.dayText}>{flightInfo[predictionItem.idFlightPrediction]?.ICAO}</Text>
                    </View>
                    <Text style={styles.terminalText}>{flightInfo[predictionItem.idFlightPrediction]?.terminal}</Text>
                </View>
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
                <Text style={styles.pageTitle}>My Predictions</Text>
            </View>
            <View style={styles.airportContainer}>
                <View style={styles.airportTitle}>
                    <Text style={styles.nameTitle}>Barcelona</Text>
                </View>
            </View>
        </View>

        <ScrollView style={styles.scrollStyle}>
        {listPredictions
            ? (listPredictions
                .length === 0
                ? <Text style={styles.noNewsText}>
                    No Flights Available
                </Text>
                : listPredictions
                    .sort((a, b) => {
                        const dateA = new Date(a.datePrediction);
                        const dateB = new Date(b.datePrediction);
                        return dateA.getTime() - dateB.getTime();
                    })
                    .map(renderPredictionItem))
            : <Text style={styles.noNewsText}>No Flights</Text>
            }
        </ScrollView>
    </ImageBackground>
  );
}
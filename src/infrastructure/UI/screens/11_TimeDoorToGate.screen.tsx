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
    noNewsText: {
        color: '#875a31',
        fontFamily: bodyFont,
        textAlign: 'center',
        fontSize: 18,
        marginTop: 14,
    },
    scrollStyle: {
        alignContent: 'center',
    },
    nameTitle: {
        color: 'white',
        fontFamily: bodyFont,
        fontSize: 20,
        marginTop: 5,
        marginLeft: 12,
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
    headerContainer: {
        position: 'relative',
        height: 40,
        marginBottom: 0,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    flightContainer: {
        marginBottom: -2,
        marginTop: 26,
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: 'transparent',
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
        backgroundColor: '#321e29',
        shadowColor: '#000',
        shadowOpacity: 0,
        shadowRadius: 10,
        alignItems: 'center',
        zIndex: 5,
    },
    image: {
        margin: 6,
        marginBottom: 0,
        height: 55,
        width: 55,
        borderRadius: 12,
    },
    flightDetails: {
        marginTop: 0,
        backgroundColor: "white",
        width: 288,
        marginLeft: -12,
        paddingLeft: 18,
        paddingBottom: 5.5,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
    },
    hourSTDText: {
        color: 'white',
        fontFamily: subtitleFont,
        fontSize: 20,
        marginTop: 0,
        marginBottom: -4,
        marginRight: 0,
        textAlign: 'justify',
    },
    dateSTDText: {
        color: '#b3b0a1',
        fontFamily: subtitleFont,
        fontSize: 16,
        marginTop: 4,
        marginBottom: 0,
        marginRight: 0,
        textAlign: 'justify',
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
    terminalText: {
        color: '#d8131b',
        fontFamily: bodyFont,
        fontSize: 16,
        marginTop: 0,
        marginBottom: 0,
        marginRight: 2,
        textAlign: 'justify',
    },
    airlineText: {
        color: '#d0871e',
        fontFamily: titleFont,
        fontSize: 20,
        marginTop: 4,
        marginBottom: 0,
        marginRight: 2,
        textAlign: 'justify',
    },
    ICAOText: {
        color: '#875a31',
        fontFamily: titleFont,
        fontSize: 20,
        marginTop: 4,
        marginBottom: 0,
        marginRight: 2,
        textAlign: 'justify',
    },
    arrowText: {
        color: '#321e29',
        fontFamily: titleFont,
        fontSize: 20,
        marginTop: 4,
        marginBottom: 0,
        marginRight: 2,
        textAlign: 'justify',
    },
    rowView: {
        flexDirection: "row",
        marginBottom: -4,
    },
    predictionTimeBox: {
        marginTop: 2,
        marginBottom: 5,
        height: 40,
        backgroundColor: "transparent",
        flexDirection: "row",
    },
    titleBox: {
        marginTop: 4,
        marginLeft: 0,
        marginRight: 0,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        height: 40,
        width: 220,
        backgroundColor: "#b3b0a1",
    },
    timeBox: {
        marginTop: 4,
        marginLeft: -12,
        marginRight: 0,
        borderRadius: 12,
        height: 40,
        width: 56,
        backgroundColor: "#321e29",
    },
    titleTimeText: {
        color: '#321e29',
        fontFamily: bodyFont,
        fontSize: 16,
        marginTop: 4,
        marginBottom: 0,
        marginLeft: 8,
        textAlign: 'justify',
    },
    descriptionText: {
        color: 'white',
        fontFamily: bodyFont,
        fontSize: 14,
        marginTop: 0,
        marginLeft: 8,
        textAlign: 'justify',
    },
    hourPrediction: {
        color: 'white',
        fontFamily: bodyFont,
        fontSize: 16,
        marginTop: 12,
        marginLeft: 0,
        textAlign: 'center',
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

    const renderPredictionItem = (predictionItem: PredictionEntity) => (
            
        <View style={styles.flightContainer} key={predictionItem.uuid}>
            <View style={styles.flightPack}>
                <View style={styles.flightHeader}>
                    <Image source={{uri: flightInfo[predictionItem.idFlightPrediction]?.logo} || require('../../../../assets/easeaer_icons/EaseAer_Logo_2_Png.png') } style={styles.image} />
                    <Text style={styles.dateSTDText}>{formatDayV3(predictionItem.datePrediction.toString())}</Text>
                    <Text style={styles.hourSTDText}>{predictionItem.planeTimePrediction}H</Text>
                    <Text style={styles.dateSTDText}>{formatDayV2(predictionItem.datePrediction.toString())}</Text>
                </View>
                <View style={styles.flightDetails}>
                    <View style={styles.rowView}>
                        <Text style={styles.airlineText}>{flightInfo[predictionItem.idFlightPrediction]?.name}</Text>
                        <Text style={styles.arrowText}>→</Text>
                        <Text style={styles.ICAOText}>{truncateText(formatICAO(flightInfo[predictionItem.idFlightPrediction]?.ICAO), 18)}</Text>
                    </View>
                    <Text style={styles.detailsText}>{formatDayV1(predictionItem.datePrediction.toString())}, {predictionItem.planeTimePrediction}</Text>
                    <Text style={styles.terminalText}>{formatTerminal(flightInfo[predictionItem.idFlightPrediction]?.terminal)}</Text>
                    <View style={styles.predictionTimeBox}>
                        <View style={styles.titleBox}> 
                            <Text style={styles.titleTimeText}>Exit Home</Text>
                            <Text style={styles.descriptionText}>~ Time to leave home.</Text>
                        </View>
                        <View style={styles.timeBox}> 
                            <Text style={styles.hourPrediction}>{predictionItem.exitHomeTimePrediction}</Text>
                        </View>
                    </View>
                    <View style={styles.predictionTimeBox}>
                        <View style={styles.titleBox}> 
                            <Text style={styles.titleTimeText}>Transport</Text>
                            <Text style={styles.descriptionText}>~ Time to get into the vehicle.</Text>
                        </View>
                        <View style={styles.timeBox}> 
                            <Text style={styles.hourPrediction}>{predictionItem.transportTimePrediction}</Text>
                        </View>
                    </View>
                    <View style={styles.predictionTimeBox}>
                        <View style={styles.titleBox}> 
                            <Text style={styles.titleTimeText}>Airport</Text>
                            <Text style={styles.descriptionText}>~ Time to enter the airport.</Text>
                        </View>
                        <View style={styles.timeBox}> 
                            <Text style={styles.hourPrediction}>{predictionItem.entranceTimePrediction}</Text>
                        </View>
                    </View>
                    <View style={styles.predictionTimeBox}>
                        <View style={styles.titleBox}> 
                            <Text style={styles.titleTimeText}>Check-In</Text>
                            <Text style={styles.descriptionText}>~ Time to check your luggage.</Text>
                        </View>
                        <View style={styles.timeBox}> 
                            <Text style={styles.hourPrediction}>{predictionItem.checkInTimePrediction}</Text>
                        </View>
                    </View>
                    <View style={styles.predictionTimeBox}>
                        <View style={styles.titleBox}> 
                            <Text style={styles.titleTimeText}>Security Control</Text>
                            <Text style={styles.descriptionText}>~ Time to pass throught the filter.</Text>
                        </View>
                        <View style={styles.timeBox}> 
                            <Text style={styles.hourPrediction}>{predictionItem.securityTimePrediction}</Text>
                        </View>
                    </View>
                    <View style={styles.predictionTimeBox}>
                        <View style={styles.titleBox}> 
                            <Text style={styles.titleTimeText}>Passport Control</Text>
                            <Text style={styles.descriptionText}>~ Time to check your passport.</Text>
                        </View>
                        <View style={styles.timeBox}> 
                            <Text style={styles.hourPrediction}>{predictionItem.passportTimePrediction}</Text>
                        </View>
                    </View>
                    <View style={styles.predictionTimeBox}>
                        <View style={styles.titleBox}> 
                            <Text style={styles.titleTimeText}>Gate</Text>
                            <Text style={styles.descriptionText}>~ Time to be near the gate.</Text>
                        </View>
                        <View style={styles.timeBox}> 
                            <Text style={styles.hourPrediction}>{predictionItem.gateTimePrediction}</Text>
                        </View>
                    </View>
                    <View style={styles.predictionTimeBox}>
                        <View style={styles.titleBox}> 
                            <Text style={styles.titleTimeText}>Plane Take-Off</Text>
                            <Text style={styles.descriptionText}>~ Time for the plane to take-off.</Text>
                        </View>
                        <View style={styles.timeBox}> 
                            <Text style={styles.hourPrediction}>{predictionItem.planeTimePrediction}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

    const formatDayV1 = (dateString: string | undefined) => {
        if (dateString != undefined) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            let monthName = "January";
            if (month == "01"){ monthName = "January"; } if (month == "07"){ monthName = "July"; }
            if (month == "02"){ monthName = "February"; } if (month == "08"){ monthName = "August"; }
            if (month == "03"){ monthName = "March"; } if (month == "09"){ monthName = "September"; }
            if (month == "04"){ monthName = "April"; } if (month == "10"){ monthName = "October"; }
            if (month == "05"){ monthName = "May"; } if (month == "11"){ monthName = "November"; }
            if (month == "06"){ monthName = "June"; } if (month == "12"){ monthName = "December"; }
            const year = String(date.getFullYear()).slice(0);
            return `${monthName} ${day}, ${year}`;
        } else {
            return `Not Available`;
        }
    };

    const formatDayV2 = (dateString: string | undefined) => {
        if (dateString != undefined) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(0);
            const lastTwoDigits = year.slice(-2);
            return `${day}.${month}.${lastTwoDigits}`;
        } else {
            return `Not Available`;
        }
    };

    const formatDayV3 = (dateString: string | undefined) => {
        if (dateString != undefined) {
            const date = new Date(dateString);
            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dayOfWeek = daysOfWeek[date.getDay()];
            return `${dayOfWeek}`;
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
                    No Predictions Created
                </Text>
                : listPredictions
                    .sort((a, b) => {
                        const dateA = new Date(a.datePrediction);
                        const dateB = new Date(b.datePrediction);
                        return dateA.getTime() - dateB.getTime();
                    })
                    .map(renderPredictionItem))
            : <Text style={styles.noNewsText}>No Predictions Created</Text>
            }
        </ScrollView>
    </ImageBackground>
  );
}
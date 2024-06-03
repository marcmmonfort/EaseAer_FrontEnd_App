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

export default function LuggageMine() {
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
    const [typeFlights, setTypeFlights] = useState("arrivals");

    const [listLuggage, setListLuggage] = useState<LuggageEntity[] | null>(null);
    const [companyInfo, setCompanyInfo] = useState<{ [key: string]: { name: string, logo: string, number: string, origin: string, destination: string, std: Date, sta: Date } }>({});

    const updateCompanyInfo = async (flightId: string, luggageId: string) => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
            try {
                await FlightService.getFlightById(flightId).then(async (flightResponse) => {
                    if (flightResponse?.data && flightResponse?.data != undefined && flightResponse?.data.companyFlight) {
                        await CRUDService.getUserById(flightResponse?.data.companyFlight).then(async (response) => {
                            if (response?.data && response?.data != undefined && response?.data.nameUser) {
                                setCompanyInfo(prevInfo => ({
                                    ...prevInfo,
                                    [luggageId]: {
                                        name: `${response.data.nameUser} ${response.data.surnameUser}`,
                                        logo: response.data.photoUser,
                                        number: flightResponse?.data.numberFlight,
                                        origin: flightResponse?.data.originFlight,
                                        destination: flightResponse?.data.destinationFlight,
                                        std: flightResponse?.data.stdFlight,
                                        sta: flightResponse?.data.staFlight,
                                    }
                                }));
                            } else {
                                setCompanyInfo(prevInfo => ({
                                    ...prevInfo,
                                    [flightResponse?.data.uuid]: {
                                        name: "Unknown",
                                        logo: "Unknown",
                                        number: "Unknown",
                                        origin: "Unknown",
                                        destination: "Unknown",
                                        std: new Date(),
                                        sta: new Date(),
                                    }
                                }));
                            }
                        })
                    } else {
                        // No se tiene ningún vuelo con ese ID.
                    }
                })
            } catch (error) {
                console.error("Error Getting Flight Companies", error);
            }
        }
    };

    useFocusEffect(
        React.useCallback(() => {
        const getMyLuggage = async () => {
            const userId = await SessionService.getCurrentUser();
            if (userId) {
            try {
                console.log("QUIERO OBTENER EL LUGGAGE DEL USUARIO: " + userId);
                const response = await LuggageService.getLuggageByUser(userId);
                console.log("OBTENGO " + response?.data.length + " MALETAS");
                if (response?.data && response.data[0]?.idFlightLuggage) {
                    setListLuggage(response.data);
                    console.log("GUARDO: " + JSON.stringify(response.data));
                    response.data.forEach((luggage: LuggageEntity) => {
                        updateCompanyInfo(luggage.idFlightLuggage, luggage.uuid);
                    });
                } else {
                    Alert.alert("EaseAer", "No Luggage Available");
                }
            } catch (error) {
                Alert.alert("EaseAer", "Error Loading Luggage");
            }
            }
        };
        getMyLuggage();
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
    scrollStyle: {
        alignContent: 'center',
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
        width: '85%',
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
        width: '87%',
        height: 200,
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
        color: 'white',
        fontFamily: titleFont,
        fontSize: 20,
        marginTop: 0,
        marginBottom: 0,
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

    // name: string, logo: string, origin: string, destination: string, std: Date, sta: Date

    const renderFlightItem = (luggageItem: LuggageEntity) => (
            
        <View style={styles.flightContainer} key={luggageItem.uuid}>
            <View style={styles.flightPack}>
                <View style={styles.flightHeader}>
                    <Image source={{uri: companyInfo[luggageItem.uuid]?.logo} || require('../../../../assets/easeaer_icons/EaseAer_Logo_2_Png.png') } style={styles.image} />
                </View>
                <View style={styles.flightContent}>
                    <Text style={styles.companyText}>{companyInfo[luggageItem.uuid]?.name}</Text>
                    <Text style={styles.companyText}>{companyInfo[luggageItem.uuid]?.number}</Text>
                    <Text style={styles.companyText}>{companyInfo[luggageItem.uuid]?.origin}</Text>
                    <Text style={styles.companyText}>{companyInfo[luggageItem.uuid]?.destination}</Text>
                    <Text style={styles.companyText}>{formatDate(companyInfo[luggageItem.uuid].std.toString())}</Text>
                    <Text style={styles.companyText}>{formatDate(companyInfo[luggageItem.uuid].sta.toString())}</Text>
                    <Text style={styles.companyText}>{luggageItem.uuid}</Text>
                    <QRCode value={luggageItem.uuid} size={56} color="#321e29" />
                    <Text style={styles.companyText}>{luggageItem.statusLuggage}</Text>
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
                <Text style={styles.pageTitle}>My {listLuggage?.length} Bags</Text>
            </View>
            <View style={styles.airportContainer}>
                <View style={styles.airportTitle}>
                    <Text style={styles.nameTitle}>Barcelona</Text>
                </View>
            </View>
        </View>

        <ScrollView style={styles.scrollStyle}>
            {listLuggage
            ? (listLuggage
                .filter(luggage => {
                    if (luggage.deletedLuggage) {
                        return false;
                    }
                    return true;
                })
                .length === 0
                ? <Text style={styles.noNewsText}>
                    No Luggage Available
                </Text>
                : listLuggage
                    .sort((a, b) => {
                        const dateA = new Date(companyInfo[a.uuid]?.std);
                        const dateB = new Date(companyInfo[b.uuid]?.std);
                        return dateA.getTime() - dateB.getTime();
                    })
                    .map(renderFlightItem))
            : <Text style={styles.noNewsText}>No Flights</Text>
            }
        </ScrollView>
    </ImageBackground>
  );
}


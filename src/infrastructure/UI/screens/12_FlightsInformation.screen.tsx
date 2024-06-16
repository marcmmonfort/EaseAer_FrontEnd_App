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
import DateTimePicker from "@react-native-community/datetimepicker";
import ButtonGradientBirthdate from "../components/buttons/Button_Type_Birthdate";

async function loadFonts() {
  await Font.loadAsync({
    'Corporate': require('../../../../assets/easeaer_fonts/Corporate_Font.ttf'), 
    'Emirates': require('../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
    'SFNS': require('../../../../assets/easeaer_fonts/SF_Font.ttf'),
  });
}

export default function FlightsInformation() {
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

    const [listFlights, setListFlights] = useState<FlightEntity[] | null>(null);
    const [companyInfo, setCompanyInfo] = useState<{ [key: string]: { name: string, logo: string } }>({});

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [birthdateUser, setbirthdateUser] = useState("");

    const getTodayDay = () => {
        const currentDate = new Date();
        const day = String(currentDate.getDate());
        return day;
    };

    const getTodayMonth = () => {
        const currentDate = new Date();
        const month = String(currentDate.getMonth() + 1);
        return month;
    };

    const getTodayYear = () => {
        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        return year;
    };

    const [searchDay, setSearchDay] = useState(getTodayDay());
    const [searchMonth, setSearchMonth] = useState(getTodayMonth());
    const [searchYear, setSearchYear] = useState(getTodayYear());

    const updateCompanyInfo = async (companyId: string, flightUuid: string) => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
            try {
                console.log("---> ID Vuelo: " + flightUuid);
                console.log("---> Busco Compañía Con ID: <" + companyId + ">");
                
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
      const getMyFlights = async () => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
            try {
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);

                const response = await FlightService.getFlightsByAirportAndInterval("LEBL", startOfDay, endOfDay);
                if (response?.data && response.data[0]?.numberFlight) {
                setListFlights(response.data);

                response.data.forEach((flight: FlightEntity) => {
                    console.log("> Flight ID: " + flight.uuid);
                    updateCompanyInfo(flight.companyFlight, flight.uuid);
                });
                } else {
                Alert.alert("EaseAer", "No Flights Available");
                }
            } catch (error) {
                Alert.alert("EaseAer", "Error Loading Flights");
            }
        }
      };
      getMyFlights();
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
        width: 160,
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
        marginBottom: 0,
        marginTop: 20,
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
    dateTimePickerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 0,
      },
      dateTimePicker: {
        backgroundColor: 'transparent',
      },
      buttonContainerB: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
      },
      input: {
        marginRight: 4,
        marginLeft: 4,
        width: 80,
        height: 40,
        backgroundColor: "white",
        color: "black",
        alignItems: 'center',
        textAlign: 'center',
        paddingRight: 12,
    },
      dateInput: {
        flexDirection: "row",
        marginLeft: 55,
        marginRight: 55,
      },
      splitBarText: {
        color: 'white',
        fontFamily: titleFont,
        fontSize: 20,
        marginTop: 30,
        marginLeft: 2,
        marginRight: 2,
        textAlign: 'justify',
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

    const renderFlightItem = (flightItem: FlightEntity) => (
            
        <View style={styles.flightContainer} key={flightItem.uuid}>
            <View style={styles.flightPack}>
                <View style={styles.flightHeader}>
                    <Image source={{uri: companyInfo[flightItem.uuid]?.logo} || require('../../../../assets/easeaer_icons/EaseAer_Logo_2_Png.png') } style={styles.image} />
                    <Text style={styles.statusText}>{formatStatus(flightItem.statusFlight)}</Text>
                </View>
                <View style={styles.flightContent}>
                    {typeFlights == "departures" && (
                        <View style={styles.locationContent}>
                            <Text style={styles.flightICAO}>{flightItem.destinationFlight}</Text>
                            <Text style={styles.flightLocationName}>{truncateText(formatICAO(flightItem.destinationFlight), 24)}</Text>
                        </View>
                    )}
                    {typeFlights == "arrivals" && (
                        <View style={styles.locationContent}>
                            <Text style={styles.flightICAO}>{flightItem.originFlight}</Text>
                            <Text style={styles.flightLocationName}>{truncateText(formatICAO(flightItem.originFlight), 24)}</Text>
                        </View>
                    )}
                    <View style={styles.flightDetails}>
                        <Text style={styles.flightNumberText}>{flightItem.numberFlight}</Text>
                        <Text style={styles.companyText}>{companyInfo[flightItem.uuid]?.name}</Text>
                    </View>
                    <View style={styles.flightDetails}>
                        <Text style={styles.detailsText}>Departure Hour</Text>
                        <Text style={styles.scheduledText}>{formatDate(flightItem.stdFlight.toString())}</Text>
                        <Text style={styles.estimatedText}>{formatDate(flightItem.etdFlight.toString())}</Text>
                    </View>
                    <View style={styles.flightDetails}>
                        <Text style={styles.detailsText}>Arrival Hour</Text>
                        <Text style={styles.scheduledText}>{formatDate(flightItem.staFlight.toString())}</Text>
                        <Text style={styles.estimatedText}>{formatDate(flightItem.etaFlight.toString())}</Text>
                    </View>
                    <Text style={styles.terminalText}>{formatTerminal(flightItem.depTerminalFlight)}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.addFlightLink} onPress={() => addFlight(flightItem.uuid)}>
                <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
        </View>
    );

    const addFlight = async (newFlightId: string) => {
        const thisUserId = await SessionService.getCurrentUser();
        if (thisUserId) {
            await CRUDService.getUserById(thisUserId).then(async (userResponse) => {
                if (userResponse?.data) {                
                    setCurrentUser(userResponse.data);
                    console.log("| | | | | Se va a actualizar el usuario: " + JSON.stringify(userResponse.data));
                    
                    let updatedVectorFlights: string[] = [];

                    if (userResponse.data.flightsUser!=undefined){
                        let alreadyAdded = false;
                        for (let e = 0; e < userResponse.data.flightsUser.length; e++){
                            updatedVectorFlights.push(userResponse.data.flightsUser[e]);
                            if (updatedVectorFlights[e] === newFlightId){
                                alreadyAdded = true;
                            }
                        }
                        if (alreadyAdded == false){
                            updatedVectorFlights.push(newFlightId);

                            console.log(">>> ASÍ QUEDA VECTOR VUELOS: " + JSON.stringify(updatedVectorFlights));

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
        
                            console.log("UPDATE: Quiere hacer el update con estos datos: " + JSON.stringify(user));
        
                            CRUDService.updateUser(thisUserId, user).then((response)=>{
                                if (response?.status===200){
                                    Alert.alert("EaseAer", "New Flight Added");
                                };
                            })

                        } else {
                            Alert.alert("EaseAer", "Flight Already Added");
                        }
                    }
                    else {
                        updatedVectorFlights.push(newFlightId);

                        console.log(">>> ASÍ QUEDA VECTOR VUELOS: " + JSON.stringify(updatedVectorFlights));

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
    
                        console.log("UPDATE: Quiere hacer el update con estos datos: " + JSON.stringify(user));
    
                        CRUDService.updateUser(thisUserId, user).then((response)=>{
                            if (response?.status===200){
                                Alert.alert("EaseAer", "New Flight Added");
                            };
                        })

                    }
                }
            })
        }
    }

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

    const handleDateChange = (event: any, selectedDate: any) => {
        setShowDatePicker(false);
        if (selectedDate) {
          setSelectedDate(selectedDate);
          setbirthdateUser(selectedDate.toISOString());
        }
      };

      const handleShowDatePicker = () => {
        setShowDatePicker(true);
      };    

      const getFlightsByDate = async () => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
          try {
            const daySearch = searchDay;
            const monthSearch = searchMonth;
            const yearSearch = searchYear;
            if ((parseInt(daySearch, 10)>0) && (parseInt(daySearch, 10)<32) && (parseInt(monthSearch, 10)>0) && (parseInt(monthSearch, 10)<=12) && (parseInt(yearSearch, 10)>2000) && (parseInt(yearSearch, 10)<2030)){
                
                const searchDate = new Date(parseInt(yearSearch, 10), parseInt(monthSearch, 10) - 1, parseInt(daySearch, 10));
                const endOfDay = new Date(parseInt(yearSearch, 10), parseInt(monthSearch, 10) - 1, parseInt(daySearch, 10));
                endOfDay.setHours(23, 59, 59, 999);

                console.log("BUSCO VUELOS PARA EL: " + searchDate + "/" + endOfDay);
    
                const response = await FlightService.getFlightsByAirportAndInterval("LEBL", searchDate, endOfDay);
                if (response?.data && response.data[0]?.numberFlight) {
                  setListFlights(response.data);
    
                  response.data.forEach((flight: FlightEntity) => {
                    console.log("> Flight ID: " + flight.uuid);
                    updateCompanyInfo(flight.companyFlight, flight.uuid);
                  });
                } else {
                  Alert.alert("EaseAer", "No Flights Available");
                }
            } else {
                Alert.alert("EaseAer","Incorrect Date");
            }
          } catch (error) {
            Alert.alert("EaseAer", "Error Loading Flights");
          }
        }
      };

  return (
    <ImageBackground style={[styles.backgroundImage, { backgroundColor: '#e9e8e6' }]}>
        <View style={styles.headerContainer}>
            <View style={styles.sectionTitle}>
                <Text style={styles.pageTitle}>Flights</Text>
            </View>
            <View style={styles.airportContainer}>
                <View style={styles.airportTitle}>
                    <Text style={styles.nameTitle}>Barcelona</Text>
                </View>
            </View>
        </View>

        <Picker selectedValue={typeFlights} style={styles.picker} itemStyle={styles.pickerItem} onValueChange={(itemValue) => setTypeFlights(itemValue)}>
            <Picker.Item label="Arrivals" value="arrivals"/>
            <Picker.Item label="Departures" value="departures"/> 
        </Picker>

        <ScrollView style={styles.scrollStyle}>
            <View style={styles.dateInput}>
                <StyledTextInputs style={styles.input} placeholder="Day" value={searchDay} onChangeText={setSearchDay}/>
                <Text style={styles.splitBarText}>/</Text>
                <StyledTextInputs style={styles.input} placeholder="Month" value={searchMonth} onChangeText={setSearchMonth}/>
                <Text style={styles.splitBarText}>/</Text>
                <StyledTextInputs style={styles.input} placeholder="Year" value={searchYear} onChangeText={setSearchYear}/>
            </View>
            <View style={styles.formContainer}>
                <TouchableOpacity onPress={() => { getFlightsByDate() }} style={styles.submitReportButton}>
                    <Text style={styles.submitReportText}>Update Search</Text>
                </TouchableOpacity>
            </View>
            {listFlights
            ? (listFlights
                .filter(flight => {
                    if (typeFlights === "departures") {
                        return flight.originFlight.toLowerCase().includes("lebl");
                    } else if (typeFlights === "arrivals") {
                        return flight.destinationFlight.toLowerCase().includes("lebl");
                    }
                    return true;
                })
                .length === 0
                ? <Text style={styles.noNewsText}>
                    No Flights Available
                </Text>
                : listFlights
                    .filter(flight => {
                        if (typeFlights === "departures") {
                            return flight.originFlight.toLowerCase().includes("lebl");
                        } else if (typeFlights === "arrivals") {
                            return flight.destinationFlight.toLowerCase().includes("lebl");
                        }
                        return true;
                    })
                    .sort((a, b) => {
                        if (typeFlights === "departures") {
                            const dateA = new Date(a.stdFlight);
                            const dateB = new Date(b.stdFlight);
                            return dateA.getTime() - dateB.getTime();
                        } else {
                            const dateA = new Date(a.staFlight);
                            const dateB = new Date(b.staFlight);
                            return dateA.getTime() - dateB.getTime();
                        }
                    })
                    .map(renderFlightItem))
            : <Text style={styles.noNewsText}>No Flights</Text>
            }
        </ScrollView>
    </ImageBackground>
  );
}


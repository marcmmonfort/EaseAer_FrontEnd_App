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
import { ProductEntity } from "../../../domain/product/product.entity";
import { ProductService } from "../../services/product/product.service";
import QRCode from 'react-native-qrcode-svg';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FlightEntity } from "../../../domain/flight/flight.entity";
import { FlightService } from "../../services/flight/flight.service";

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

  const [userDetails, setUserDetails] = useState<{ [key: string]: string }>({});
  const [searchText, setSearchText] = useState("");
  const [typeFlights, setTypeFlights] = useState("arrivals");

  const [listFlights, setListFlights] = useState<FlightEntity[] | null>(null);
  const [companyInfo, setCompanyInfo] = useState<{ [key: string]: { name: string, logo: string } }>({});

    const updateCompanyInfo = async (companyId: string, flightUuid: string) => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
            try {
                console.log("---> ID Vuelo: " + flightUuid);
                console.log("---> Busco Compañía Con ID: <" + companyId + ">");
                
                await CRUDService.getUserById(companyId).then(async (response) => {
                    if (response?.data && response?.data != undefined && response?.data.nameUser) {
                        console.log("---> He Encontrado Compañía: " + response.data.nameUser);
                        setCompanyInfo(prevInfo => ({
                            ...prevInfo,
                            [flightUuid]: {
                            name: `${response.data.nameUser} ${response.data.surnameUser}`,
                            logo: response.data.photoUser
                            }
                        }));
                    } else {
                        console.log("---> No He Encontrado Compañía");
                        setCompanyInfo(prevInfo => ({
                            ...prevInfo,
                            [flightUuid]: {
                            name: "Unknown",
                            logo: "Unknown"
                            }
                        }));
                    }
                    console.log("---> Así Queda El Vector: " + JSON.stringify(companyInfo));
                })
            } catch (error) {
                console.error("Error Getting Company Information:", error);
            }
        }
    };

  useFocusEffect(
    React.useCallback(() => {
      const getFlights = async () => {
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
      getFlights();
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
      productContainer: {
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
    productHeader: {
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
        zIndex: 5,
    },
    productContent: {
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
        zIndex: 4,
    },
    titleNewsText: {
        color: 'white',
        fontFamily: subtitleFont,
        fontSize: 22,
        marginTop: 6,
        marginBottom: 6,
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
    arrowText: {
        color: 'white',
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
        color: '#b3b0a1',
        fontFamily: bodyFont,
        fontSize: 16,
        marginTop: 8,
        marginBottom: 12,
        textAlign: 'justify',
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
        alignItems: 'center',
    },
    noNewsText: {
        color: '#875a31',
        fontFamily: bodyFont,
        textAlign: 'center',
        fontSize: 18,
        marginTop: 14,
    },
    productPack: {
        marginLeft: 0,
        width: '85%',
        zIndex: 2,
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
    offersLink: {
        width: '8.5%',
        marginLeft: 8,
        marginRight: 0,
        borderRadius: 12,
        backgroundColor: '#875a31',
        alignItems: 'center',
        justifyContent: 'center',
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
  });

  if (!fontsLoaded) {
    return null;
  }


  function showOffers(productId: string): void {
    /*
    navigation.navigate('Shopping', {
      screen: 'Offers',
      params: {
        productIdTransfer: productId
      }
    });
    // navigation.navigate('Shopping' as never, { screen: 'ManagerShop' } as never, { screen: 'ScreenOffers' } as never, { productIdTransfer:productId } as never);
    */
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

    const renderFlightItem = (flightItem: FlightEntity) => (
        
        <View style={styles.productContainer} key={flightItem.uuid}>
            <View style={styles.productPack}>
                <View style={styles.productHeader}>
                    <Text style={styles.titleNewsText}>{flightItem.numberFlight}</Text>
                </View>
                <View style={styles.productContent}>
                    <Text style={styles.detailsText}>{flightItem.numberFlight}</Text>
                    <Text style={styles.detailsText}>{companyInfo[flightItem.uuid]?.name || "Cargando..."}</Text>
                    <Image source={{uri: companyInfo[flightItem.uuid]?.logo} || require('../../../../assets/easeaer_icons/EaseAer_Logo_2_Png.png') } style={styles.image} />
                    <Text style={styles.detailsText}>{flightItem.originFlight}</Text>
                    <Text style={styles.detailsText}>{flightItem.destinationFlight}</Text>
                    <Text style={styles.detailsText}>{formatDate(flightItem.stdFlight.toString())} {formatDate(flightItem.etdFlight.toString())}</Text>
                    <Text style={styles.detailsText}>{formatDate(flightItem.staFlight.toString())} {formatDate(flightItem.etaFlight.toString())}</Text>
                    <Text style={styles.detailsText}>{formatTerminal(flightItem.depTerminalFlight)}</Text>
                    <Text style={styles.detailsText}>{formatStatus(flightItem.statusFlight)}</Text>

                </View>
            </View>
            <TouchableOpacity style={styles.offersLink} onPress={() => showOffers(flightItem.uuid)}>
                <Text style={styles.arrowText}>+</Text>
            </TouchableOpacity>
        </View>
    );

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
            <Picker.Item label="Today's Arrivals" value="arrivals"/>
            <Picker.Item label="Today's Departures" value="departures"/> 
        </Picker>

        <ScrollView style={styles.scrollStyle}>
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
                    .map(renderFlightItem))
            : <Text style={styles.noNewsText}>Not Flights</Text>
            }
        </ScrollView>
    </ImageBackground>
  );
}


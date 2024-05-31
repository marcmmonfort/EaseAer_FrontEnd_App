import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
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
import { Platform, StatusBar, TouchableOpacity, StyleSheet, ImageBackground, Image, View, Text, Alert, ScrollView, Button } from "react-native";
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
import { OfferService } from "../../services/offer/offer.service";
import { OfferEntity } from "../../../domain/offer/offer.entity";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { ShopService } from "../../services/shop/shop.service";
import { LocationService } from "../../services/location/location.service";
import { GameEntity } from "../../../domain/game/game.entity";
import { GameService } from "../../services/game/game.service";

async function loadFonts() {
  await Font.loadAsync({
    'Corporate': require('../../../../assets/easeaer_fonts/Corporate_Font.ttf'), 
    'Emirates': require('../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
    'SFNS': require('../../../../assets/easeaer_fonts/SF_Font.ttf'),
  });
}

export default function EntertainmentGameHome() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const [listGames, setListGames] = useState<GameEntity[] | null>(null);
  const [gameId, setGameId] = useState("");
  const [locationGame, setLocationGame] = useState("LESU");

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

  useFocusEffect(
    React.useCallback(() => {
      const getMyGames = async () => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
            try {
                await GameService.getGamesByUser(userId).then(async (response) => {
                    if (response?.data && response.data[0].pointsGame) {
                        setListGames(response.data);
                    }
                    else {
                        Alert.alert("EaseAer", "No Games Played");
                    }
                });
            } catch (error) {
                console.error("Error Getting Offers: ", error);
                Alert.alert("EaseAer", "Error Getting Games");
            }
        }
      };
      getMyGames();
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
    submitReportText: {
        fontFamily: subtitleFont,
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
      },
      productContainer: {
        marginBottom: 0,
        marginTop: 0,
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        zIndex: 1,
    },
    button: {
        height: 40,
        borderRadius: 12,
        padding: 10,
        justifyContent: 'center',
        backgroundColor: '#321e29',
        zIndex: 2,
        width: 240,
    },
    productContent: {
        borderWidth: 0,
        backgroundColor: 'white',
        alignItems: 'center',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        zIndex: 1,
        marginLeft: -12,
        paddingLeft: 10,
        justifyContent: 'center',
        paddingTop: 0,
        paddingBottom: 0,
        width: 112,
    },
    titleNewsText: {
        color: 'white',
        fontFamily: titleFont,
        fontSize: 20,
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
        marginTop: 18,
    },
    scrollStyle: {
        alignContent: 'center',
    },
    searcherContainer: {
        height: 40,
        marginBottom: 0,
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
    slideContainer: {
        height: 40,
        marginBottom: 0,
        backgroundColor: '#b3b0a1',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    minValueText: {
        color: 'white',
        fontFamily: subtitleFont,
        fontSize: 20,
        position: 'absolute',
        left: 10,
    },
    maxValueText: {
        color: 'white',
        fontFamily: subtitleFont,
        fontSize: 20,
        position: 'absolute',
        right: 10,
    },
    filterContainer: {
        height: 38,
        marginTop: 18,
        marginBottom: 18,
        marginRight: 120,
        marginLeft: 120,
        borderRadius: 12,
        backgroundColor: '#321e29',
        justifyContent: 'center',
    },
    filterTextButton: {
        color: 'white',
        fontFamily: subtitleFont,
        fontSize: 20,
        textAlign: 'center',
    },
      loadAllText: {
        fontFamily: subtitleFont,
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        marginTop: 3.5,
      },
      showOfferButton: {
        marginLeft: 120,
        marginRight: 120,
        borderRadius: 12,
        backgroundColor: '#875a31',
        alignItems: 'center',
        justifyContent: 'center',
    },
    generalProductContainer: {
        alignContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 26,
        marginBottom: -12,
        marginLeft: 0,
        marginRight: 0,
    },
    offerCodeText: {
        color: '#e9e8e6',
        fontFamily: bodyFont,
        fontSize: 12,
        marginTop: 6,
    },
    showAllButton: {
        padding: 6,
        backgroundColor: "#d8131b",
        borderRadius: 12,
        height: 38,
        alignItems: 'center',
        marginTop: 26,
        marginLeft: 112,
        marginRight: 112,
    },
    showOfferText: {
        fontFamily: subtitleFont,
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        marginBottom: -2,
        marginLeft: 2,
    },
    productNameText: {
        color: '#b3b0a1',
        fontFamily: bodyFont,
        fontSize: 14,
        marginTop: 0,
        marginBottom: 0,
        textAlign: 'justify',
        marginLeft: 2,
    },
    detailsText: {
        color: '#d0871e',
        fontFamily: bodyFont,
        fontSize: 16,
        marginTop: 0,
        marginBottom: 0,
    },
    detailsTextPlus: {
        color: '#d0871e',
        fontFamily: bodyFont,
        fontSize: 18,
        marginTop: 0,
        marginBottom: -4,
    },
  });

  if (!fontsLoaded) {
    return null;
  }

    interface GameComponentProps {
        gameItem: any;
    }

    const formatDestination = (icaoDestination: string) => {
        if (!icaoDestination) return null;
        if (icaoDestination==="EGKK") return "Londres Gatwick";
        if (icaoDestination==="EGLL") return "Londres Heathrow";
        if (icaoDestination==="EGSS") return "Londres Stansted";
        if (icaoDestination==="EDDF") return "Fráncfort del Meno - Frankfurt";
        if (icaoDestination==="EDDM") return "Múnich Franz Josef Strauss";
        if (icaoDestination==="EHAM") return "Ámsterdam Schiphol";
        if (icaoDestination==="EKCH") return "Copenhague Kastrup";
        if (icaoDestination==="EIDW") return "Dublín";
        if (icaoDestination==="ENGM") return "Oslo Gardermoen";
        if (icaoDestination==="EPWA") return "Varsovia Chopin";
        if (icaoDestination==="ESSA") return "Estocolmo Arlanda";
        if (icaoDestination==="GCRR") return "Lanzarote";
        if (icaoDestination==="GCGM") return "La Gomera";
        if (icaoDestination==="GCXO") return "Tenerife Norte - Los Rodeos";
        if (icaoDestination==="GCHI") return "El Hierro";
        if (icaoDestination==="GCFV") return "Fuerteventura";
        if (icaoDestination==="GCLA") return "La Palma";
        if (icaoDestination==="GCLP") return "Gran Canaria";
        if (icaoDestination==="LEBL") return "Barcelona - El Prat";
        if (icaoDestination==="LEAL") return "Alicante - Elche";
        if (icaoDestination==="LEGE") return "Girona - Costa Brava";
        if (icaoDestination==="LELL") return "Sabadell";
        if (icaoDestination==="LEMD") return "Madrid - Barajas Adolfo Suárez";
        if (icaoDestination==="LEZG") return "Zaragoza";
        if (icaoDestination==="LESO") return "San Sebastián";
        if (icaoDestination==="LERJ") return "Logroño";
        if (icaoDestination==="LEDA") return "Lleida - Alguaire";
        if (icaoDestination==="LEHC") return "Huesca - Pirineos";
        if (icaoDestination==="LESU") return "La Seu d'Urgell";
        if (icaoDestination==="LERS") return "Reus - Tarragona";
        if (icaoDestination==="LGSR") return "Santorini";
        else return "Unknown";
    };

    const OfferComponent: React.FC<GameComponentProps> = ({ gameItem }) => {
        return (
            <View style={styles.generalProductContainer}> 
                <View style={styles.productContainer} key={gameItem.uuid}>
                    <View style={styles.button}> 
                        <Text style={styles.showOfferText}>{gameItem.destinationGame}</Text>
                        <Text style={styles.productNameText}>{formatDestination(gameItem.destinationGame)}</Text>
                    </View>
                    <View style={styles.productContent}>
                        <Text style={styles.detailsTextPlus}>{gameItem.pointsGame}</Text>
                        <Text style={styles.detailsText}>Points</Text>
                    </View>
                </View>
            </View>
        );
    };

    function createGame(): void {
        console.log("Game Created");
    }

    return (
        <ImageBackground style={[styles.backgroundImage, { backgroundColor: '#e9e8e6' }]}>
            <View style={styles.headerContainer}>
                <View style={styles.sectionTitle}>
                    <Text style={styles.pageTitle}>Games</Text>
                </View>
                <View style={styles.airportContainer}>
                    <View style={styles.airportTitle}>
                        <Text style={styles.nameTitle}>Barcelona</Text>
                    </View>
                </View>
            </View>
            <Picker selectedValue={locationGame} style={styles.picker} itemStyle={styles.pickerItem} onValueChange={(itemValue) => setLocationGame(itemValue)}>
                <Picker.Item label="Alicante - Elche" value="LEAL"/>
                <Picker.Item label="Ámsterdam Schiphol" value="EHAM"/> 
                <Picker.Item label="Barcelona - El Prat" value="LEBL"/>
                <Picker.Item label="Copenhague Kastrup" value="EKCH"/>
                <Picker.Item label="Dublín" value="EIDW"/>
                <Picker.Item label="El Hierro" value="GCHI"/>
                <Picker.Item label="Estocolmo Arlanda" value="ESSA"/>
                <Picker.Item label="Fráncfort del Meno - Frankfurt" value="EDDF"/>
                <Picker.Item label="Fuerteventura" value="GCFV"/>
                <Picker.Item label="Girona - Costa Brava" value="LEGE"/>
                <Picker.Item label="Gran Canaria" value="GCLP"/>
                <Picker.Item label="Huesca - Pirineos" value="LEHC"/>
                <Picker.Item label="La Gomera" value="GCGM"/>
                <Picker.Item label="La Palma" value="GCLA"/>
                <Picker.Item label="La Seu d'Urgell" value="LESU"/>
                <Picker.Item label="Lanzarote" value="GCRR"/>
                <Picker.Item label="Lleida - Alguaire" value="LEDA"/>
                <Picker.Item label="Logroño" value="LERJ"/>
                <Picker.Item label="Londres Gatwick" value="EGKK"/>
                <Picker.Item label="Londres Heathrow" value="EGLL"/>
                <Picker.Item label="Londres Stansted" value="EGSS"/>
                <Picker.Item label="Madrid - Barajas Adolfo Suárez" value="LEMD"/>
                <Picker.Item label="Múnich Franz Josef Strauss" value="EDDM"/>
                <Picker.Item label="Oslo Gardermoen" value="ENGM"/>
                <Picker.Item label="Reus - Tarragona" value="LERS"/>
                <Picker.Item label="Sabadell" value="LELL"/>
                <Picker.Item label="San Sebastián" value="LESO"/>
                <Picker.Item label="Santorini" value="LGSR"/>
                <Picker.Item label="Tenerife Norte - Los Rodeos" value="GCXO"/>
                <Picker.Item label="Varsovia Chopin" value="EPWA"/>
                <Picker.Item label="Zaragoza" value="LEZG"/>
            </Picker>

            <ScrollView style={styles.scrollStyle}>
                <TouchableOpacity style={styles.showAllButton} onPress={() => createGame()}>
                    <Text style={styles.loadAllText}>New Game</Text>
                </TouchableOpacity>
                {listGames
                ? (listGames
                    .filter(game => 
                        game.destinationGame === locationGame
                    )
                    .length === 0 ? <Text style={styles.noNewsText}>0 Games Played Here</Text>
                    : listGames
                        .filter(game => 
                            game.destinationGame === locationGame
                        )
                        .sort((a, b) => Number(b.pointsGame) - Number(a.pointsGame))
                        .map((gameItem) => <OfferComponent key={gameItem.uuid} gameItem={gameItem} />))
                    : <Text style={styles.noNewsText}>Not Available</Text>
                }
            </ScrollView>
        </ImageBackground>
    );
}
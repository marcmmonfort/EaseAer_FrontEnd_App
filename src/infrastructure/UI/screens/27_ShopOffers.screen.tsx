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

async function loadFonts() {
  await Font.loadAsync({
    'Corporate': require('../../../../assets/easeaer_fonts/Corporate_Font.ttf'), 
    'Emirates': require('../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
    'SFNS': require('../../../../assets/easeaer_fonts/SF_Font.ttf'),
  });
}

export default function ShopOffers() {
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

  const [listOffers, setListOffers] = useState<OfferEntity[] | null>(null);
  const [userDetails, setUserDetails] = useState<{ [key: string]: string }>({});
  const [searchText, setSearchText] = useState("");
  const [values, setValues] = useState([0, 1000]);

  useFocusEffect(
    React.useCallback(() => {
      const getOffers = async () => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
            try {
                await OfferService.listOffer().then(async (response) => {
                    if (response?.data && response.data[0].priceOffer) {
                        setListOffers(response.data);
                    }
                    else {
                        Alert.alert("EaseAer", "No Offers Available");
                    }
                });
            } catch (error) {
                console.error("Error Getting Offers: ", error);
                Alert.alert("EaseAer", "Error Getting Offers");
            }
        }
      };
      getOffers();
    }, [])
  );

    const getDetailsOffer = async (offerId: string) => {
        let offerDetails = ["web", "nameProduct", offerId, "price", "dateEnd", "terminalShop", "floorShop"];
        try {
            const currentOffer = await OfferService.getOfferById(offerId);
            if (currentOffer) {
                offerDetails[3] = currentOffer.data.priceOffer?.toString()+"€" ?? "price";
                offerDetails[4] = currentOffer.data.dateEndOffer?.toString() ?? "dateEnd";
                const shopResponse = await ShopService.getShopById(currentOffer.data.idShopOffer);
                if (shopResponse?.data?.webShop) {
                    offerDetails[0] = shopResponse.data.webShop;
                    const locationResponse = await LocationService.getLocationById(shopResponse.data.idLocationShop);
                    if (locationResponse?.data?.nameLocation) {
                        offerDetails[5] = locationResponse.data.terminalLocation;
                        if (offerDetails[5]==="t1"){ offerDetails[5] = "Terminal 1"; }
                        if (offerDetails[5]==="t2"){ offerDetails[5] = "Terminal 2"; }
                        offerDetails[6] = locationResponse.data.floorLocation;
                        if (offerDetails[6]==="p00"){ offerDetails[6] = "Floor 0"; }
                        if (offerDetails[6]==="p10"){ offerDetails[6] = "Floor 1"; }
                        if (offerDetails[6]==="p20"){ offerDetails[6] = "Floor 2"; }
                        if (offerDetails[6]==="p30"){ offerDetails[6] = "Floor 3"; }
                    }
                }
                const productResponse = await ProductService.getProductById(currentOffer.data.idProductOffer);
                if (productResponse?.data?.nameProduct) {
                    offerDetails[1] = productResponse.data.nameProduct;
                }
            }
        } catch (error) {
            console.error("Error Getting Details Of Offer: ", error);
        }
        return offerDetails;
    };

  // AsyncStorage.getItem("uuid");

    const getProductsByName = async (productName: string) => {
        
    }

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
        borderRadius: 12,
        color: "black",
        backgroundColor: 'transparent',
        marginTop: 10,
        marginBottom: 0,
        width: 320,
    },
    pickerItem:{
        fontSize: 16,
        color: "black",
        fontFamily: subtitleFont,
        height: 60,
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
        marginBottom: 18,
        marginTop: 0,
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOpacity: 0,
        shadowRadius: 10,
        flexDirection: 'row',
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
        width: '100%',
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
    button: {
        height: 120,
        width: '100%',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#321e29',
      },
      showOfferText: {
        fontFamily: subtitleFont,
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        marginBottom: 4,
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
        marginLeft: 26,
        marginRight: 26,
    },
    offerCodeText: {
        color: '#e9e8e6',
        fontFamily: bodyFont,
        fontSize: 12,
        marginTop: 6,
    },
  });

  if (!fontsLoaded) {
    return null;
  }

    interface OfferComponentProps {
        offerItem: any;
    }

    const OfferComponent: React.FC<OfferComponentProps> = ({ offerItem }) => {
        const [details, setDetails] = useState(["...", "...", offerItem.uuid, "...", "...", "...", "..."]);
        // const [details, setDetails] = useState(["web", "nameProduct", offerItem.uuid, "price", "dateEnd", "terminal", "floor"]);
        const [visible, setVisible] = useState(false);

        const fetchDetails = async () => {
            const offerDetails = await getDetailsOffer(offerItem.uuid);
            setDetails(offerDetails);
            setVisible(true);
        };

        return (
            <View style={styles.generalProductContainer}> 
                <TouchableOpacity style={styles.button} onPress={fetchDetails}> 
                    <Text style={styles.showOfferText}>UnLock Offer</Text>
                    <QRCode value={offerItem.uuid} size={56} color="#b3b0a1" backgroundColor="transparent" />
                    <Text style={styles.offerCodeText}>{details[2]}</Text>
                </TouchableOpacity>
                {visible && (
                <View style={styles.productContainer} key={offerItem.uuid}>
                    <View style={styles.productPack}>
                        <View style={styles.productHeader}>
                            <Text style={styles.titleNewsText}>{details[1]}</Text>
                        </View>
                        <View style={styles.productContent}>
                            <Text style={styles.detailsText}>{details[0]}</Text>
                            <Text style={styles.detailsText}>{details[3]}</Text>
                            <Text style={styles.detailsText}>{details[4]}</Text>
                            <Text style={styles.detailsText}>{details[5]}</Text>
                            <Text style={styles.detailsText}>{details[6]}</Text>
                        </View>
                    </View>
                </View>
                )}
            </View>
        );
    };

    return (
        <ImageBackground style={[styles.backgroundImage, { backgroundColor: '#e9e8e6' }]}>
            <View style={styles.headerContainer}>
                <View style={styles.sectionTitle}>
                    <Text style={styles.pageTitle}>Products</Text>
                </View>
                <View style={styles.airportContainer}>
                    <View style={styles.airportTitle}>
                        <Text style={styles.nameTitle}>Barcelona</Text>
                    </View>
                </View>
            </View>

            <View style={styles.slideContainer}>
                <Text style={styles.minValueText}>{values[0]}</Text>
                <MultiSlider values={values} sliderLength={268} onValuesChange={(newValues) => setValues(newValues.map(val => Math.round(val)))} 
                selectedStyle={{ backgroundColor: '#875a31' }}
                unselectedStyle={{ backgroundColor: '#e9e8e6' }}
                markerStyle={{ backgroundColor: 'white', height: 20, width: 20, borderRadius: 12, borderWidth: 0, shadowOpacity: 0 }}
                min={0} max={1000} step={1} allowOverlap={false} />
                <Text style={styles.maxValueText}>{values[1]}</Text>
            </View>

            <ScrollView style={styles.scrollStyle}>
                {listOffers
                ? (listOffers
                    .filter(offer => 
                        offer.priceOffer.valueOf() >= values[0] &&
                        offer.priceOffer.valueOf() <= values[1]
                    )
                    .length === 0
                    ? <Text style={styles.noNewsText}>
                        No Offers Available
                    </Text>
                    : listOffers
                        .sort((a, b) => a.idProductOffer.localeCompare(b.idProductOffer))
                        .map((offerItem) => <OfferComponent key={offerItem.uuid} offerItem={offerItem} />))
                    : <Text style={styles.noNewsText}>Not Available</Text>
                }
            </ScrollView>
        </ImageBackground>
    );
}
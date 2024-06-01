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
import { Platform, StatusBar, TouchableOpacity, StyleSheet, ImageBackground, Image, View, Text, Alert, ScrollView, Button, Modal } from "react-native";
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
import { QuestionEntity } from "../../../domain/question/question.entity";
import { QuestionService } from "../../services/question/question.service";

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
  const [questionsLocation, setQuestionsLocation] = useState<QuestionEntity[] | null>(null);
  const [indexes, setIndexes] = useState<number[] | null>(null);
  const [quizPage, setQuizPage] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [pointsGame, setPointsGame] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(["incorrect", "incorrect", "incorrect", "incorrect", "incorrect", "incorrect", "incorrect", "incorrect", "incorrect", "incorrect"]);
  const [bgAnsA, setBgAnsA] = useState('white');
  const [bgAnsB, setBgAnsB] = useState('white');
  const [bgAnsC, setBgAnsC] = useState('white');
  const [bgAnsD, setBgAnsD] = useState('white');
  const [txtAnsA, setTxtAnsA] = useState('#321e29');
  const [txtAnsB, setTxtAnsB] = useState('#321e29');
  const [txtAnsC, setTxtAnsC] = useState('#321e29');
  const [txtAnsD, setTxtAnsD] = useState('#321e29');

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

  useFocusEffect(
    React.useCallback(() => {
      getMyGames();
    }, [])
  );

    function updateHistory(): void {
      getMyGames();
    }

    async function createGame(): Promise<void> {
        setBgAnsA("white"); setTxtAnsA("#321e29"); setBgAnsB("white"); setTxtAnsB("#321e29"); setBgAnsC("white"); setTxtAnsC("#321e29"); setBgAnsD("white"); setTxtAnsD("#321e29");
        setSelectedAnswers(["incorrect", "incorrect", "incorrect", "incorrect", "incorrect", "incorrect", "incorrect", "incorrect", "incorrect", "incorrect"]);
        try {
            if (locationGame) {
                let questionsResponse = await QuestionService.getQuestionsByDestination(locationGame);
                if (questionsResponse?.data) {
                    const questions = questionsResponse.data;
                    setQuestionsLocation(questions);
                    if (questions.length === 0) {
                        console.log("No Questions Available For This Destination");
                        Alert.alert("EaseAer", "Sorry, Questions Are Unavailable. Try Another Destination!");
                    } else if (questions.length < 10) {
                        console.log("Not Enough Questions Available To Start A Game");
                        Alert.alert("EaseAer", "Sorry, Questions Are Unavailable. Try Another Destination!");
                    } else {
                        console.log("¡Cumple Los Criterios!");
                        const randomIndexes = generateRandomNumbers(0, questions.length-1, 10);
                        setIndexes(randomIndexes);
                        console.log("Índices: " + randomIndexes);
                        if (questionsLocation){
                            console.log("Todas Las Preguntas: " + questionsLocation);
                            console.log("Pregunta 1: (Index " + randomIndexes[0] + ") - Answer:" + questionsLocation[randomIndexes[0]].ansAQuestion);
                            console.log("Pregunta 2: (Index " + randomIndexes[1] + ") - Answer:" + questionsLocation[randomIndexes[1]].ansAQuestion);
                            console.log("Pregunta 3: (Index " + randomIndexes[2] + ") - Answer:" + questionsLocation[randomIndexes[2]].ansAQuestion);
                            console.log("Pregunta 4: (Index " + randomIndexes[3] + ") - Answer:" + questionsLocation[randomIndexes[3]].ansAQuestion);
                            console.log("Pregunta 5: (Index " + randomIndexes[4] + ") - Answer:" + questionsLocation[randomIndexes[4]].ansAQuestion);
                            console.log("Pregunta 6: (Index " + randomIndexes[5] + ") - Answer:" + questionsLocation[randomIndexes[5]].ansAQuestion);
                            console.log("Pregunta 7: (Index " + randomIndexes[6] + ") - Answer:" + questionsLocation[randomIndexes[6]].ansAQuestion);
                            console.log("Pregunta 8: (Index " + randomIndexes[7] + ") - Answer:" + questionsLocation[randomIndexes[7]].ansAQuestion);
                            console.log("Pregunta 9: (Index " + randomIndexes[8] + ") - Answer:" + questionsLocation[randomIndexes[8]].ansAQuestion);
                            console.log("Pregunta 10: (Index " + randomIndexes[9] + ") - Answer:" + questionsLocation[randomIndexes[9]].ansAQuestion);
                        }
                        setModalVisible(true);
                    }
                }
            }
        } catch (error) {
            console.error("Error Creating Game: ", error);
        }
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
    modalText: {
        marginBottom: 0,
        textAlign: 'center',
    },

    quizButton: {
        padding: 6,
        backgroundColor: "#875a31",
        borderRadius: 12,
        height: 38,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 20,
        width: 120,
    },
    questionNumber: {
        color: '#321e29',
        fontFamily: subtitleFont,
        textAlign: 'center',
        fontSize: 20,
        marginTop: 18,
    },
    generalQuestionContainer: {
        alignContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 18,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
    },
    questionContainer: {
        marginBottom: 0,
        marginTop: 0,
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: 'transparent',
        zIndex: 1,
    },
    questionHeader: {
        borderRadius: 12,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 6,
        paddingBottom: 6,
        justifyContent: 'center',
        backgroundColor: '#b3b0a1',
        zIndex: 2,
        width: 320,
        marginBottom: 18,
    },
    statementText: {
        color: 'white',
        fontFamily: bodyFont,
        fontSize: 16,
        textAlign: 'justify',
    },
    questionContent: {
        borderRadius: 12, paddingLeft: 10, paddingRight: 10, paddingTop: 4, paddingBottom: 4, marginBottom: 10,
    },
    answerText: {
        fontFamily: subtitleFont, fontSize: 18,
    },
    updateHistoryButton: {
        padding: 6,
        backgroundColor: "transparent",
        height: 38,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: -18,
    },
    updateText: {
        fontFamily: subtitleFont,
        fontSize: 20,
        color: '#875a31',
        marginTop: 0,
    },
  });

  if (!fontsLoaded) {
    return null;
  }

    interface QuestionComponentProps {
        questionItem: any;
    }

    const QuestionComponent: React.FC<QuestionComponentProps> = ({ questionItem }) => {
        if (!questionItem) {
            return null;
        }

        function submitAnswer(selectedAns: string): void {
            // Marcar Selección:
            if (selectedAns === "a"){
                setBgAnsA("#321e29"); setTxtAnsA("white"); setBgAnsB("white"); setTxtAnsB("#321e29"); setBgAnsC("white"); setTxtAnsC("#321e29"); setBgAnsD("white"); setTxtAnsD("#321e29");
            }
            if (selectedAns === "b"){
                setBgAnsA("white"); setTxtAnsA("#321e29"); setBgAnsB("#321e29"); setTxtAnsB("white"); setBgAnsC("white"); setTxtAnsC("#321e29"); setBgAnsD("white"); setTxtAnsD("#321e29");
            }
            if (selectedAns === "c"){
                setBgAnsA("white"); setTxtAnsA("#321e29"); setBgAnsB("white"); setTxtAnsB("#321e29"); setBgAnsC("#321e29"); setTxtAnsC("white"); setBgAnsD("white"); setTxtAnsD("#321e29");
            }
            if (selectedAns === "d"){
                setBgAnsA("white"); setTxtAnsA("#321e29"); setBgAnsB("white"); setTxtAnsB("#321e29"); setBgAnsC("white"); setTxtAnsC("#321e29"); setBgAnsD("#321e29"); setTxtAnsD("white");
            }

            // Guardar Resultado (Correcto / Incorrecto):
            const correctAns = questionItem.correctAnsQuestion;
            let actualResults = selectedAnswers;
            if (selectedAns === correctAns){
                actualResults[quizPage] = "correct";
            } else {
                actualResults[quizPage] = "incorrect";
            }
            setSelectedAnswers(actualResults);

            console.log("Respuesta: " + selectedAnswers);
        }

        return (
            <View style={styles.generalQuestionContainer}> 
                <View style={styles.questionContainer} key={questionItem.uuid}>
                    <View style={styles.questionHeader}> 
                        <Text style={styles.statementText}>{questionItem.statementQuestion}</Text>
                    </View>
                    <TouchableOpacity style={[styles.questionContent, { backgroundColor: bgAnsA }]} onPress={() => submitAnswer("a")}>
                        <Text style={[styles.answerText, { color: txtAnsA }]}>{questionItem.ansAQuestion}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.questionContent, { backgroundColor: bgAnsB }]} onPress={() => submitAnswer("b")}>
                        <Text style={[styles.answerText, { color: txtAnsB }]}>{questionItem.ansBQuestion}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.questionContent, { backgroundColor: bgAnsC }]} onPress={() => submitAnswer("c")}>
                        <Text style={[styles.answerText, { color: txtAnsC }]}>{questionItem.ansCQuestion}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.questionContent, { backgroundColor: bgAnsD }]} onPress={() => submitAnswer("d")}>
                        <Text style={[styles.answerText, { color: txtAnsD }]}>{questionItem.ansDQuestion}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

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

    interface GameComponentProps {
        gameItem: any;
    }

    const GameComponent: React.FC<GameComponentProps> = ({ gameItem }) => {
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

    const getRandomNumber = (min: number, max: number | undefined) => {
        if (max!=undefined){
            return Math.floor(Math.random() * (max - min + 1)) + min;
        } else {
            return 0;
        }
    };
      
    const generateRandomNumbers = (min: number, max: number | undefined, count: number) => {
        const randomNumbers: any[] = [];
        let i = 0;
        while (i < count) {
            let newNumber = getRandomNumber(min, max);
            let isAlreadyUsed = false;
            for (let j = 0; j < randomNumbers.length; j++){
                if (randomNumbers[j] === newNumber){
                    isAlreadyUsed = true;
                }
            }
            if (isAlreadyUsed===false){
                randomNumbers.push(newNumber);
                i+=1;
            }
        }
        return randomNumbers;
    };      

    const submitGame = async () => {
        const finalAnwers = selectedAnswers;

        let totalPoints = 0;

        for (let m = 0; m < finalAnwers.length; m++) {
            if (finalAnwers[m] === "correct"){
                totalPoints+=10;
            } else {
                totalPoints-=5;
                if (totalPoints < 0){
                    totalPoints = 0;
                }
            }
        }

        // Creamos la entidad de la partida para guardarla.
        const idUserGameRaw = await AsyncStorage.getItem("uuid");
        const idUserGame = idUserGameRaw ? idUserGameRaw.replace(/"/g, '') : "";
        const destinationGame = locationGame;
        const questionsGame: string[] = []; 
        if ((questionsLocation?.length != 0) && (questionsLocation != undefined) && (indexes?.length != 0) && (indexes != null)){
            questionsGame[0] = questionsLocation[indexes[0]].uuid;
            questionsGame[1] = questionsLocation[indexes[1]].uuid;
            questionsGame[2] = questionsLocation[indexes[2]].uuid;
            questionsGame[3] = questionsLocation[indexes[3]].uuid;
            questionsGame[4] = questionsLocation[indexes[4]].uuid;
            questionsGame[5] = questionsLocation[indexes[5]].uuid;
            questionsGame[6] = questionsLocation[indexes[6]].uuid;
            questionsGame[7] = questionsLocation[indexes[7]].uuid;
            questionsGame[8] = questionsLocation[indexes[8]].uuid;
            questionsGame[9] = questionsLocation[indexes[9]].uuid;
        }
        const pointsGame = totalPoints;

        console.log(">> TODO PREPARADO");

        try {
            const game: GameEntity = {
                uuid: " " ?? "",
                idUserGame: idUserGame ?? "",
                destinationGame: destinationGame ?? "",
                questionsGame: questionsGame ?? [],
                pointsGame: pointsGame ?? 0,
                deletedGame: false,
            };

            console.log(">> HACE EL PEDIDO: " + idUserGame + "/" + destinationGame + "/" + questionsGame + "/" + pointsGame);
        
            GameService.createGame(game).then((response)=>{
                if (response.status===200){
                    Alert.alert("EaseAer", "Game Saved! You Got " + pointsGame +" / 100.");
                };
            }).catch((error)=>{
                Alert.alert("EaseAer", "Error Saving Game");
            })  
        } catch (error) {
            Alert.alert("EaseAer", "Error Saving Game");
        }        

        // Dejamos todo de inicio.
        setModalVisible(false);
        setQuizPage(0);
        setIndexes(null);
    }

    function nextQuestion(): void {
        setBgAnsA("white"); setTxtAnsA("#321e29"); setBgAnsB("white"); setTxtAnsB("#321e29"); setBgAnsC("white"); setTxtAnsC("#321e29"); setBgAnsD("white"); setTxtAnsD("#321e29");
        setQuizPage(quizPage+1);
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

            <Modal animationType="none" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(false) }}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        {indexes && indexes.length === 10 && questionsLocation?.length !== undefined && questionsLocation?.length >= 10 ? (
                            <View>
                                <Text style={styles.questionNumber}>Question {quizPage+1}</Text>
                                <QuestionComponent key={questionsLocation[indexes[quizPage]].uuid} questionItem={questionsLocation[indexes[quizPage]]}/>
                            </View>
                        ) : (
                            <Text style={styles.noNewsText}>Error Loading Questions</Text>
                        )}
                        {quizPage < 9 && (
                            <TouchableOpacity style={styles.quizButton} onPress={() => nextQuestion()}>
                                <Text style={styles.loadAllText}>Next</Text>
                            </TouchableOpacity>
                        )}
                        {quizPage === 9 && (
                            <TouchableOpacity style={styles.quizButton} onPress={() => submitGame()}>
                                <Text style={styles.loadAllText}>Send Answers</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>

            <ScrollView style={styles.scrollStyle}>
                <TouchableOpacity style={styles.showAllButton} onPress={() => createGame()}>
                    <Text style={styles.loadAllText}>New Game</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.updateHistoryButton} onPress={() => updateHistory()}>
                    <Text style={styles.updateText}>Update History</Text>
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
                        .map((gameItem) => <GameComponent key={gameItem.uuid} gameItem={gameItem} />))
                    : <Text style={styles.noNewsText}>Not Available</Text>
                }
            </ScrollView>
        </ImageBackground>
    );
}
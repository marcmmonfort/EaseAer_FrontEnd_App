import axios from "axios";
import { AuthHeaderService } from "../user/authHeaders.service";

// ENTITIES:
import { BookingEntity } from "../../../domain/booking/booking.entity";
import { CardEntity } from "../../../domain/card/card.entity";
import { FlightEntity } from "../../../domain/flight/flight.entity";
import { GameEntity } from "../../../domain/game/game.entity";
import { IncidentEntity } from "../../../domain/incident/incident.entity";
import { LocationEntity } from "../../../domain/location/location.entity";
import { LuggageEntity } from "../../../domain/luggage/luggage.entity";
import { MatchEntity } from "../../../domain/match/match.entity";
import { NewsEntity } from "../../../domain/news/news.entity";
import { OfferEntity } from "../../../domain/offer/offer.entity";
import { PredictionEntity } from "../../../domain/prediction/prediction.entity";
import { PreferencesEntity } from "../../../domain/preferences/preferences.entity";
import { PrizeEntity } from "../../../domain/prize/prize.entity";
import { ProductEntity } from "../../../domain/product/product.entity";
import { QuestionEntity } from "../../../domain/question/question.entity";
import { RatingsEntity } from "../../../domain/rating/rating.entity";
import { ServiceEntity } from "../../../domain/service/service.entity";
import { ShopEntity } from "../../../domain/shop/shop.entity";
import { UserEntity } from "../../../domain/user/user.entity";
import { AuthEntity, UserAuthEntity } from "../../../domain/user/user.entity";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { environment } from '../../../../env';

// BACKEND API URL:
// const API_URL = "https://api.lplan.es:443/";
// const API_URL = "http://147.83.7.158:5432/";
const API_URL = environment.API_URL;

export class SessionService {

  // (1) CREATE / REGISTER USER: [routeUser.post("/user/register", userCtrl.registerUserCtrl)]
  static async registerUser(user: UserEntity) {
    const token = await AuthHeaderService.authHeader();
    try {
        const response = await axios.post(API_URL + "user/register", user, { headers: token });
        return response;
    } catch (error) {
        console.error('Error Creating User (Register)', error);
        throw error;
    }
  }

  // (2) LOGIN USER: [routeUser.post("/user/login", userCtrl.loginUserCtrl)]
  static async loginUser(auth: AuthEntity) {
    try {
      console.log(API_URL + "user/login");
      const response = await axios.post(API_URL + "user/login", auth);
      return response;
    } catch (error) {
      console.error("Error During LogIn", error);
      throw error;
    }
  }

  // (3) LOGIN USER FRONTEND: [routeUser.post("/user/loginfrontend", userCtrl.loginFrontEndUserCtrl)]

  // (4) LOGOUT:
  static logOut() {
    try {
      AsyncStorage.removeItem("userId");
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("nameUser");
    } catch (error) {}
  }

  // (5) GET VOICE CONTROL:
  static getVoiceControl() {
      throw new Error("Method Not Implemented");
  }

  // (6) SAVE CURRENT USER (IN ASYNC STORAGE):
  static setCurrentUser(userId: string, token: string, nameUser: string) {
    try {
      console.log("Saving User ID In Async Storage: ", userId);
      AsyncStorage.setItem("uuid", userId);
      AsyncStorage.setItem("token", token);
      AsyncStorage.setItem("nameUser", nameUser);
    } catch (error) {
      console.error("Error Saving User ID To Async Storage: ", error);
    }
  }

  // (7) GET CURRENT USER (BY SAVED ID IN ASYNC STORAGE):
    static async getCurrentUser() {
    try {
      const userId = await AsyncStorage.getItem('uuid');  
      if (userId) {
        return JSON.parse(userId);
      }
      else(console.log("User ID Not Found"));
    } catch (error) {
      console.error("Error Getting Actual User: ", error);
    }
  }

  // (8) SET IF AUDIO DESCRIPTION IS ENABLED:
  static setAudioDescription(isAudioDescription: string) {
    try {
      AsyncStorage.setItem("voiceRecognitionEnabled", isAudioDescription);
    } catch (error) {
      console.error("Error Setting Audio Description: ", error);
    }
  }

  // (9) GET IF AUDIO DESCRIPTION IS ENABLED:
  static async getAudioDescription() {
    try {
      const AudioDescription = await AsyncStorage.getItem('voiceRecognitionEnabled');
      if (AudioDescription) {
        return AudioDescription;
      } else {
        console.log("User ID Not Found");
      }
    } catch (error) {
      console.error("Error Getting Status Description: ", error);
    }
  }
}

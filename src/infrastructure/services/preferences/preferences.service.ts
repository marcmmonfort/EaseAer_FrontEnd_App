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
import { UserAuthEntity } from "../../../domain/user/user.entity";

// BACKEND API URL:
// const API_URL = "https://api.lplan.es:443/";
// const API_URL = "http://147.83.7.158:5432/";
const API_URL = "http://localhost:5432/";

export class PreferencesService{

    // CASE 1: routePreferences.post("/preferences/create", preferencesCtrl.createPreferencesCtrl);
    static async createPreferences(preferences: PreferencesEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "preferences/create", preferences, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating Preferences: ', error);
            throw error;
        }
    }

    // CASE 2: routePreferences.get("/preferences/getbyid/:uuid", checkJwt, preferencesCtrl.getPreferencesByIdCtrl);
    static async getPreferencesById(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "preferences/getbyid/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Preferences By ID: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Preferences By ID (Token Problems)");
        }
    }

    // CASE 3: routePreferences.get("/preferences/getdelta/:uuid", checkJwt, preferencesCtrl.getDeltaOfPreferencesCtrl);
    static async getDeltaOfPreferences(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "preferences/getdelta/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Delta Of Preferences: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Delta Of Preferences (Token Problems)");
        }
    }

    // CASE 4: routePreferences.get("/preferences/all/count/docs", checkJwt, preferencesCtrl.getNumPreferencesCtrl);
    static async getNumPreferences() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "preferences/all/count/docs", { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Number Of Preferences: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Number Of Preferences (Token Problems)");
        }
    }

    // CASE 5: routePreferences.put("/preferences/update/:uuid", checkJwt, preferencesCtrl.updatePreferencesByIdCtrl);
    static async updatePreferencesById(preferences: PreferencesEntity) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
            try {  
                const response = await axios.put(API_URL + "preferences/update/" + preferences.uuid, preferences, {headers: token});
                return response;
            } catch (error) {
                console.error("Error Editing Preferences: ", error);
                throw error;
            }
        }
    }

    // CASE 6: routePreferences.delete("/preferences/delete/:uuid", checkJwt, preferencesCtrl.deletePreferencesCtrl);
    
}
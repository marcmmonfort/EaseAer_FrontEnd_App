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

export class LuggageService{

    // CASE 1: routeLuggage.post("/luggage/create", luggageCtrl.createLuggageCtrl);
    static async createLuggage(luggage: LuggageEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "luggage/create", luggage, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating Luggage: ', error);
            throw error;
        }
    }

    // CASE 2: routeLuggage.get("/luggage/getbyid/:uuid", checkJwt, luggageCtrl.getLuggageByIdCtrl);
    static async getLuggageById(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "luggage/getbyid/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Luggage By ID: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Luggage By ID (Token Problems)");
        }
    }

    // CASE 3: routeLuggage.get("/luggage/getbyflight/:flight", luggageCtrl.getLuggageByFlightCtrl);
    static async getLuggageByFlight(flight: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "luggage/getbyflight/" + flight, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Luggage By Flight: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Luggage By Flight (Token Problems)");
        }
    }

    // CASE 4: routeLuggage.get("/luggage/getbyuser/:user", luggageCtrl.getLuggageByUserCtrl);
    static async getLuggageByUser(user: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "luggage/getbyuser/" + user, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Luggage By User: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Luggage By User (Token Problems)");
        }
    }

    // CASE 5: routeLuggage.get("/luggage/all/count/docs", checkJwt, luggageCtrl.getNumLuggageCtrl);
    static async getNumLuggage() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "luggage/all/count/docs", { headers: token});
                return response;
            } catch (error) {
                console.error("Error Getting Number Of Luggage: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Number Of Luggage (Token Problems)");
        }
    }

    // CASE 6: routeLuggage.put("/luggage/update/:uuid", checkJwt, luggageCtrl.updateLuggageByIdCtrl);
    static async updateLuggageById(luggage: LuggageEntity) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
        try {  
            const response = await axios.put(API_URL + "user/update/" + luggage.uuid, luggage, {headers: token});
            return response;
        } catch (error) {
            console.error("Error Editing Luggage: ", error);
            throw error;
        }
        }
    }

    // CASE 7: routeLuggage.delete("/luggage/delete/:uuid", checkJwt, luggageCtrl.deleteLuggageCtrl);

}
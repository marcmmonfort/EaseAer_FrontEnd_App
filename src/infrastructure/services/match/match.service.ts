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
import { environment } from '../../../../env';

// BACKEND API URL:
// const API_URL = "https://api.lplan.es:443/";
// const API_URL = "http://147.83.7.158:5432/";
const API_URL = environment.API_URL;

export class MatchService{

    // CASE 1: routeMatch.post("/match/create", matchCtrl.createMatchCtrl);
    static async createMatch(match: MatchEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "match/create", match, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating Match: ', error);
            throw error;
        }
    }

    // CASE 2: routeMatch.get("/match/getbyid/:uuid", checkJwt, matchCtrl.getMatchByIdCtrl);
    static async getMatchById(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "match/getbyid/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Match By ID: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Match By ID (Token Problems)");
        }
    }

    // CASE 3: routeMatch.get("/match/getmymatches/:idUser", checkJwt, matchCtrl.getMyMatchesCtrl),
    static async getMyMatches(idUser: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "match/getmymatches/" + idUser, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Matches By User: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Matches By User (Token Problems)");
        }
    }

    // CASE 4: routeMatch.get("/match/getallnum", checkJwt, matchCtrl.getTotalNumMatchesCtrl);
    static async getTotalNumMatches() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "match/getallnum", { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Number Of Matches: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Number Of Matches (Token Problems)");
        }
    }

    // CASE 5: routeMatch.put("/match/update/:uuid", checkJwt, matchCtrl.updateMatchCtrl);
    static async updateMatch(match: MatchEntity) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
            try {  
                const response = await axios.put(API_URL + "match/update/" + match.uuid, match, {headers: token});
                return response;
            } catch (error) {
                console.error("Error Editing Match: ", error);
                throw error;
            }
        }
    }

    // CASE 6: routeMatch.delete("/match/delete/:uuid", checkJwt, matchCtrl.deleteMatchCtrl);

}
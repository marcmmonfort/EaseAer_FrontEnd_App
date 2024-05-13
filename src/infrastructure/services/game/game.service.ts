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

export class GameService{

    // CASE 1: routeGame.post("/game/create", gameCtrl.createGameCtrl);
    static async createGame(game: GameEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "game/create", game, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating Game: ', error);
            throw error;
        }
    }

    // CASE 2: routeGame.get("/game/getbyid/:uuid", checkJwt, gameCtrl.getGameByIdCtrl);
    static async getGameById(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "game/getbyid/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Game By ID: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Game By ID (Token Problems)");
        }
    }

    // CASE 3: routeGame.get("/game/getgamesbyuser/:user", checkJwt, gameCtrl.getGamesByUserCtrl);
    static async getGamesByUser(user: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "game/getgamesbyuser/" + user, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Game By User: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Game By User (Token Problems)");
        }
    }

    // CASE 4: routeGame.get("/game/getgamesbydestination/:destination", checkJwt, gameCtrl.getGamesByDestinationCtrl);
    static async getGamesByDestination(destination: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "game/getgamesbydestination/" + destination, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Game By Destination: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Game By Destination (Token Problems)");
        }
    }

    // CASE 5: routeGame.get("/game/getquestionsofgame/:uuid", checkJwt, gameCtrl.getIdQuestionsOfGameCtrl);
    static async getIdQuestionsOfGame(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "game/getquestionsofgame/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Questions Of Game: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Questions Of Game (Token Problems)");
        }
    }

    // CASE 6: routeGame.get("/game/all/count/docs", checkJwt, gameCtrl.getNumGamesCtrl);
    static async getNumGames() {
        const token = await AuthHeaderService.authHeader()
        if(token){
        try {
            const response = await axios.get(API_URL + "game/all/count/docs", { headers:  token});
            return response;
        } catch (error) {
            console.error("Error Getting Number Of Games: ", error);
            throw error;
        }
        } else {
        console.log("Error Getting Number Of Games (Token Problems)");
        }
    }

    // CASE 7: routeGame.put("/game/update/:uuid", checkJwt, gameCtrl.updateGameCtrl);
    static async updateGame(game: GameEntity) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
        try {  
            const response = await axios.put(API_URL + "game/update/" + game.uuid, game, {headers: token});
            return response;
        } catch (error) {
            console.error("Error Editing Game: ", error);
            throw error;
        }
        }
    }

    // CASE 8: routeGame.delete("/game/delete/:uuid", checkJwt, gameCtrl.deleteGameCtrl);

}
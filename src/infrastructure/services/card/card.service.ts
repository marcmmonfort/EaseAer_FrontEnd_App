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

export class CardService{

    // CASE 1: routeCard.post("/card/create", cardCtrl.createCardCtrl);
    static async createCard(card: CardEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "card/create", card, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating Card: ', error);
            throw error;
        }
    }
        
    // CASE 2: routeCard.get("/card/getbyid/:uuid", checkJwt, cardCtrl.getCardByIdCtrl);
    static async getCardById(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "card/getbyid/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Card By ID: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Card By ID (Token Problems)");
        }
    }

    // CASE 3: routeCard.get("/card/getbyuser/:user", cardCtrl.getCardByUserCtrl)
    static async getCardByUser(user: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "card/getbyuser/" + user, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Card By User: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Card By User (Token Problems)");
        }
    }

    // CASE 4: routeCard.get("/card/getall", checkJwt, cardCtrl.listCardsCtrl);
    static async listCards() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "card/getall", { headers: token });
                return response;
            } catch (error) {
                console.error("Error Getting All Cards: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting All Cards (Token Problems)");
        }
    }

    // CASE 5: routeCard.get("/card/getallpag/:numPage", checkJwt, cardCtrl.listCardsPagCtrl);
    static async listCardsPag(numPage: string) {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "card/getallpag/" + numPage, { headers: token });
                return response;
            } catch (error) {
                console.error("Error Getting Paginated Cards: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Paginated Cards (Token Problems)");
        }
    }

    // CASE 6: routeCard.put("/card/update/:uuid", checkJwt, cardCtrl.updateCardCtrl);
    static async updateCard(card: CardEntity) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
            try {  
                const response = await axios.put(API_URL + "card/update/" + card.uuid, card, {headers: token});
                return response;
            } catch (error) {
                console.error("Error Editing Card: ", error);
                throw error;
            }
        }
    }

    // CASE 7: routeCard.delete("/card/delete/:uuid", checkJwt, cardCtrl.deleteCardCtrl);

    // CASE 8: routeCard.get("/card/all/count/docs", checkJwt, cardCtrl.getNumCardsCtrl);
    static async getNumCards() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "card/all/count/docs", { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Number Of Cards: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Number Of Cards (Token Problems)");
        }
    }

}
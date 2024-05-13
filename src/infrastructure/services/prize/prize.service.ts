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

export class PrizeService{

    // CREATE 1: routePrize.post("/prize/create", prizeCtrl.createPrizeCtrl);
    static async createPrize(prize: PrizeEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "prize/create", prize, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating Prize: ', error);
            throw error;
        }
    }

    // CREATE 2: routePrize.get("/prize/getbyid/:uuid", checkJwt, prizeCtrl.getPrizeByIdCtrl);
    static async getPrizeById(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "prize/getbyid/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Prize By ID: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Prize By ID (Token Problems)");
        }
    }

    // CREATE 3: routePrize.get("/prize/getavailable/:points", checkJwt, prizeCtrl.getPrizesAvailableCtrl);
    static async getPrizesAvailable(points: number) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "prize/getavailable/" + points, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Prizes Available By Points: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Prizes Available By Points (Token Problems)");
        }
    }

    // CREATE 4: routePrize.get("/prize/getbyshop/:shop", checkJwt, prizeCtrl.getPrizesByShopCtrl);
    static async getPrizesByShop(shop: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "prize/getbyshop/" + shop, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Prizes Available By Shop: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Prizes Available By Shop (Token Problems)");
        }
    }

    // CREATE 5: routePrize.get("/prize/listall", checkJwt, prizeCtrl.listPrizesCtrl);
    static async listPrizes() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "prize/listall", { headers: token });
                return response;
            } catch (error) {
                console.error("Error Getting All Prizes: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting All Prizes (Token Problems)");
        }
    }

    // CREATE 6: routePrize.get("/prize/all/count/docs", checkJwt, prizeCtrl.getNumPrizesCtrl);
    static async getNumPrizes() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "prize/all/count/docs", { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Number Of Prizes: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Number Of Prizes (Token Problems)");
        }
    }

    // CREATE 7: routePrize.put("/prize/update/:uuid", checkJwt, prizeCtrl.updatePrizeCtrl);
    static async updateUser(prize: PrizeEntity) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
            try {  
                const response = await axios.put(API_URL + "prize/update/" + prize.uuid, prize, {headers: token});
                return response;
            } catch (error) {
                console.error("Error Editing Prize: ", error);
                throw error;
            }
        }
    }

    // CREATE 8: routePrize.delete("/prize/delete/:uuid", checkJwt, prizeCtrl.deletePrizeCtrl);

}
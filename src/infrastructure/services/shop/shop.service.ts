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

export class ShopService{

    // CASE 1: routeShop.post("/shop/create", shopCtrl.createShopCtrl);
    static async createShop(shop: ShopEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "shop/create", shop, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating Shop: ', error);
            throw error;
        }
    }

    // CASE 2: routeShop.get("/shop/getbyid/:uuid", checkJwt, shopCtrl.getShopByIdCtrl);
    static async getShopById(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "shop/getbyid/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Shop By ID: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Shop By ID (Token Problems)");
        }
    }

    // CASE 3: routeShop.get("/shop/getbylocation/:location", checkJwt, shopCtrl.getShopByLocationCtrl);
    static async getShopByLocation(location: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "shop/getbylocation/" + location, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Shop By Location: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Shop By Location (Token Problems)");
        }
    }

    // CASE 4: routeShop.get("/shop/all", checkJwt, shopCtrl.listShopCtrl);
    static async listShop() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "shop/all", { headers: token });
                return response;
            } catch (error) {
                console.error("Error Getting All Shops: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting All Shops (Token Problems)");
        }
    }

    // CASE 5: routeShop.get("/shop/opened/:time", checkJwt, shopCtrl.listOpenedShopsCtrl);
    static async listOpenedShops(time: Date) {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "shop/opened/" + time, { headers: token });
                return response;
            } catch (error) {
                console.error("Error Getting Opened Shops: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Opened Shops (Token Problems)");
        }
    }

    // CASE 6: routeShop.put("/shop/update/:uuid", checkJwt, shopCtrl.updateShopCtrl);
    static async updateShop(shop: ShopEntity) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
            try {  
                const response = await axios.put(API_URL + "shop/update/" + shop.uuid, shop, {headers: token});
                return response;
            } catch (error) {
                console.error("Error Editing Shop: ", error);
                throw error;
            }
        }
    }

    // CASE 7: routeShop.delete("/shop/delete/:uuid", checkJwt, shopCtrl.deleteShopCtrl);

}
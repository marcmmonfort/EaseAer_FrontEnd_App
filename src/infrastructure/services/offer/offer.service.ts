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

export class OfferService{

    // CASE 1: routeOffer.post("/offer/create", offerCtrl.createOfferCtrl);
    static async createOffer(offer: OfferEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "offer/create", offer, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating Offer: ', error);
            throw error;
        }
    }

    // CASE 2: routeOffer.get("/offer/getbyid/:uuid", checkJwt, offerCtrl.getOfferByIdCtrl);
    static async getOfferById(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "offer/getbyid/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Offer By ID: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Offer By ID (Token Problems)");
        }
    }

    // CASE 3: routeOffer.get("/offer/getbyproduct/:product", checkJwt, offerCtrl.getOffersByProductCtrl);
    static async getOffersByProduct(product: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "offer/getbyproduct/" + product, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Offer By Product: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Offer By Product (Token Problems)");
        }
    }

    // CASE 4: routeOffer.get("/offer/getbyshop/:shop", checkJwt, offerCtrl.getOffersByShopCtrl);
    static async getOffersByShop(shop: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "offer/getbyshop/" + shop, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Offer By Shop: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Offer By Shop (Token Problems)");
        }
    }

    // CASE 5: routeOffer.get("/offer/listall", checkJwt, offerCtrl.listOfferCtrl);
    static async listOffer() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "offer/listall", { headers: token });
                return response;
            } catch (error) {
                console.error("Error Getting All Offer: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting All Offer (Token Problems)");
        }
    }

    // CASE 6: routeOffer.put("/offer/update/:uuid", checkJwt, offerCtrl.updateOfferCtrl);
    static async updateOffer(offer: OfferEntity) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
            try {  
                const response = await axios.put(API_URL + "offer/update/" + offer.uuid, offer, {headers: token});
                return response;
            } catch (error) {
                console.error("Error Editing Offer: ", error);
                throw error;
            }
        }
    }

    // CASE 7: routeOffer.delete("/offer/delete/:uuid", checkJwt, offerCtrl.deleteOfferCtrl);

}
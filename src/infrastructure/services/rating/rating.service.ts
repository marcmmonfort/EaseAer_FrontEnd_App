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

export class RatingService{

    // CASE 1: routeRatings.get("/ratings/all", checkJwt, ratingsCtrl.getAllRatingsCtrl);
    static async getAllRatings() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "ratings/all", { headers: token });
                return response;
            } catch (error) {
                console.error("Error Getting All Ratings: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting All Ratings (Token Problems)");
        }
    }

    // CASE 2: routeRatings.get("/rating/getraters/:uuid", checkJwt, ratingsCtrl.getUsersWhoHaveRatedCtrl);
    static async getUsersWhoHaveRated(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "rating/getraters/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting The ID Of The Raters: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting The ID Of The Raters (Token Problems)");
        }
    }

    // CASE 3: routeRatings.post("/rating/add", checkJwt, ratingsCtrl.insertRatingCtrl);
    static async insertRating(rating: RatingsEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "rating/add", rating, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating Rating: ', error);
            throw error;
        }
    }

    // CASE 4: routeRatings.put("/rating/update/:uuid", checkJwt, ratingsCtrl.updateRatingCtrl);
    static async updateRating(rating: RatingsEntity) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
            try {  
                const response = await axios.put(API_URL + "rating/update/" + rating.uuid, rating, {headers: token});
                return response;
            } catch (error) {
                console.error("Error Editing Rating: ", error);
                throw error;
            }
        }
    }

    // CASE 5: routeRatings.get("/rating/getaverage/:idRatedObject/:ratingType", checkJwt, ratingsCtrl.getAverageValueRatingCtrl); // No acaba de ir.
    static async getAverageValueRating(idRatedObject: string, ratingType: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "rating/getaverage/" + idRatedObject + "/" + ratingType, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Average Of Rating: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Average Of Rating (Token Problems)");
        }
    } 

    // CASE 6: routeRatings.get("/rating/get/:idRatedObject/:ratingType", checkJwt, ratingsCtrl.getRatingCtrl);
    static async getRatingCtrl(idRatedObject: string, ratingType: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "rating/get/" + idRatedObject + "/" + ratingType, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Rating By ID And Type: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Rating By ID And Type (Token Problems)");
        }
    }

}
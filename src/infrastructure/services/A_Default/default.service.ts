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

export class XService{



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // ---> (1) CREATE:
    /*
    static async createActivity(activity: ActivityEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "activity/add", activity, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating X', error);
            throw error;
        }
    }
    */

    // ---> (2) GET BY ID:
    /*
    static async getActivityById(uuid: string){
        const token = await AuthHeaderService.authHeader();
        try{
            const response=await axios.get(API_URL + "activity/" + uuid,{headers:token});
            return response;
        } catch(error){
            console.error('Error Getting X By ID'+error);
            throw error;
        }
    }
    */

    // ---> (3) GET BY PARAMETERS:
    /*
    static async getOtherSchedule(uuid: string, numPage:string, date: string) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.get(API_URL + "activity/following/" + uuid + "/" + numPage + "/" + date, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Getting X By Different Parameters', error);
            throw error;
        }
    }
    */

    // ---> (4) UPDATE:
    /*
    static async updateActivity(uuid: string, updatedActivity: any) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.put(API_URL + "activity/" + uuid, updatedActivity, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Updating X' + error);
            throw error;
        }
    }
    */

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}
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

export class LocationService{

    // CASE 1: locationRoute.post("/location/add", checkJwt, locationCtrl.insertLocationCtrl);
    static async insertLocation(location: LocationEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "location/add", location, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating Location: ', error);
            throw error;
        }
    }

    // CASE 2: locationRoute.get("/locations/all", logMiddleware, locationCtrl.listLocationCtrl);
    static async listLocation() {
        const token = await AuthHeaderService.authHeader()
        if(token){
        try {
            const response = await axios.get(API_URL + "locations/all", { headers: token });
            return response;
        } catch (error) {
            console.error("Error Getting All Locations: ", error);
            throw error;
        }
        } else {
        console.log("Error Getting All Locations (Token Problems)");
        }
    }

    // CASE 3: locationRoute.get("/location/all/:numPage", checkJwt, locationCtrl.listLocationPagCtrl);
    static async listLocationPag(numPage: string) {
        const token = await AuthHeaderService.authHeader()
        if(token){
        try {
            const response = await axios.get(API_URL + "location/all/" + numPage, { headers: token });
            return response;
        } catch (error) {
            console.error("Error Getting Locations Paginated: ", error);
            throw error;
        }
        } else {
        console.log("Error Getting Locations Paginated (Token Problems)");
        }
    }

    // CASE 4: locationRoute.get("/location/getbyid/:uuid", checkJwt, locationCtrl.getLocationByIdCtrl);
    static async getLocationById(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "location/getbyid/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Location By ID: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Location By ID (Token Problems)");
        }
    }

    // CASE 5: locationRoute.put("/location/update/:uuid", checkJwt, locationCtrl.updateLocationCtrl);
    static async updateLocation(location: LocationEntity) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
            try {  
                const response = await axios.put(API_URL + "location/update/" + location.uuid, location, {headers: token});
                return response;
            } catch (error) {
                console.error("Error Editing Location: ", error);
                throw error;
            }
        }
    }

    // CASE 6: locationRoute.delete("/location/delete/:uuid", checkAdmin, locationCtrl.deleteLocationCtrl);

    // CASE 7: locationRoute.get("/location/all/count/docs", checkJwt, locationCtrl.getNumLocationsCtrl);
    static async getNumLocations() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "location/all/count/docs", { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Number Of Locations: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Number Of Locations (Token Problems)");
        }
    }

}
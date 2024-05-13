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

export class ServiceService{

    // CASE 1: routeService.post("/service/create", serviceCtrl.createServiceCtrl);
    static async createService(service: ServiceEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "service/create", service, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating Service: ', error);
            throw error;
        }
    }

    // CASE 2: routeService.get("/service/getbyid/:uuid", checkJwt, serviceCtrl.getServiceByIdCtrl);
    static async getServiceById(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "service/getbyid/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Service By ID: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Service By ID (Token Problems)");
        }
    }

    // CASE 3: routeService.get("/service/getbylocation/:location", checkJwt, serviceCtrl.getServiceByLocationCtrl);
    static async getServiceByLocation(location: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "service/getbylocation/" + location, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Service By Location: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Service By Location (Token Problems)");
        }
    }

    // CASE 4: routeService.get("/service/all", checkJwt, serviceCtrl.listServicesCtrl);
    static async listServices() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "service/all", { headers: token });
                return response;
            } catch (error) {
                console.error("Error Getting All Services: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting All Services (Token Problems)");
        }
    }

    // CASE 5: routeService.get("/service/getbytype/:type", checkJwt, serviceCtrl.listServicesByTypeCtrl);
    static async listServicesByType(type: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "service/getbytype/" + type, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Service By Type: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Service By Type (Token Problems)");
        }
    }

    // CASE 6: routeService.get("/service/opened/:time", checkJwt, serviceCtrl.listOpenedServicesCtrl);
    static async listOpenedServices(time: Date) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "service/opened/" + time, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Service By Schedule: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Service By Schedule (Token Problems)");
        }
    }

    // CASE 7: routeService.put("/service/update/:uuid", checkJwt, serviceCtrl.updateServiceCtrl);
    static async updateService(service: ServiceEntity) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
            try {  
                const response = await axios.put(API_URL + "service/update/" + service.uuid, service, {headers: token});
                return response;
            } catch (error) {
                console.error("Error Editing Service: ", error);
                throw error;
            }
        }
    }

    // CASE 8: routeService.delete("/service/delete/:uuid", checkJwt, serviceCtrl.deleteServiceCtrl);

}
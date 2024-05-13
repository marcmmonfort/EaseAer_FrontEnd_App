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

export class IncidentService{

    // CASE 1: routeIncident.post("/incident/create", incidentCtrl.createIncidentCtrl);
    static async createIncident(incident: IncidentEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "incident/create", incident, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating Incident: ', error);
            throw error;
        }
    }

    // CASE 2: routeIncident.get("/incident/getbyid/:uuid", checkJwt, incidentCtrl.getIncidentByIdCtrl);
    static async getIncidentByIdCtrl(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "incident/getbyid/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Incident By ID: ", error);
                throw error;
            }
        } else {
        console.log("Error Getting Incident By ID (Token Problems)");
        }
    }

    // CASE 3: routeIncident.get("/incident/getall", checkJwt, incidentCtrl.listIncidentsCtrl);
    static async listIncidents() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "incident/getall", { headers: token });
                return response;
            } catch (error) {
                console.error("Error Getting All Incidents: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting All Incidents (Token Problems)");
        }
    }

    // CASE 4: routeIncident.get("/incident/getpaginated/:numPage", checkJwt, incidentCtrl.listIncidentsPagCtrl);
    static async listIncidentsPag(numPage: string) {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "incident/getpaginated/" + numPage, { headers: token });
                return response;
            } catch (error) {
                console.error("Error Getting Incidents Paginated: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Incidents Paginated (Token Problems)");
        }
    }

    // CASE 5: routeIncident.get("/incident/getnumincidents", checkJwt, incidentCtrl.getNumIncidentsCtrl);
    static async getNumIncidents() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "incident/getnumincidents", { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Number Of Incidents: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Number Of Incidents (Token Problems)");
        }
    }

    // CASE 6: routeIncident.get("/incident/getnumbystatus/:status", checkJwt, incidentCtrl.getNumIncidentsStatusCtrl);
    static async getNumIncidentsStatus(status: string) {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "incident/getnumbystatus/" + status, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Number Of Incidents By Status: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Number Of Incidents By Status (Token Problems)");
        }
    }

    // CASE 7: routeIncident.put("/incident/update/:uuid", checkJwt, incidentCtrl.updateIncidentCtrl);
    static async updateIncident(incident: IncidentEntity) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
            try {  
                const response = await axios.put(API_URL + "incident/update/" + incident.uuid, incident, {headers: token});
                return response;
            } catch (error) {
                console.error("Error Editing Incident: ", error);
                throw error;
            }
        }
    }

    // CASE 8: routeIncident.delete("/incident/delete/:uuid", checkJwt, incidentCtrl.deleteIncidentCtrl);

}
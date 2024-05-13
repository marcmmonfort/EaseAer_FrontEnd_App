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

export class FlightService{

    // CASE 1: routeFlight.get("/flight/getbyid/:uuid", checkJwt, flightCtrl.getFlightByIdCtrl);
    static async getFlightById(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "flight/getbyid/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Flight By ID: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Flight By ID (Token Problems)");
        }
    }

    // CASE 2: routeFlight.get("/flight/flightsby/:airport/:startDate/:endDate", flightCtrl.getFlightsByAirportAndIntervalCtrl);
    static async getFlightsByAirportAndInterval(airport: string, startDate: Date, endDate: Date) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "flight/flightsby/" + airport + "/" + startDate + "/" + endDate, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Flights By Airport And Interval: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Flights (Token Problems)");
        }
    }

    // CASE 3: routeFlight.get("/flight/departuresby/:originFlight/:startDate/:endDate", flightCtrl.getDeparturesByAirportAndIntervalCtrl);
    static async getDeparturesByAirportAndInterval(originFlight: string, startDate: Date, endDate: Date) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "flight/departuresby/" + originFlight + "/" + startDate + "/" + endDate, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Departures By Airport And Interval: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Departures (Token Problems)");
        }
    }

    // CASE 4: routeFlight.get("/flight/arrivalsby/:destinationFlight/:startDate/:endDate", flightCtrl.getArrivalsByAirportAndIntervalCtrl);
    static async getArrivalsByAirportAndInterval(destinationFlight: string, startDate: Date, endDate: Date) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "flight/arrivalsby/" + destinationFlight + "/" + startDate + "/" + endDate, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Arrivals By Airport And Interval: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Arrivals (Token Problems)");
        }
    }

    // CASE 5: routeFlight.get("/flight/all/count/docs", checkJwt, flightCtrl.getNumFlightsCtrl);
    static async getNumFlights() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "flight/all/count/docs", { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Number Of Flights: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Number Of Flights (Token Problems)");
        }
    }

    // CASE 6: routeFlight.get("/flight/bycompany/:companyName/:startDate/:endDate", flightCtrl.getFlightsByCompanyCtrl);
    static async getFlightsByCompany(companyName: string, startDate: Date, endDate: Date) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "flight/bycompany/" + companyName + "/" + startDate + "/" + endDate, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Flights By Company: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Flights (Token Problems)");
        }
    }

    // CASE 7: routeFlight.post("/flight/createflight", flightCtrl.createFlightCtrl);
    static async createFlight(flight: FlightEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "flight/createflight", flight, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating Flight: ', error);
            throw error;
        }
    }

    // CASE 8: routeFlight.put("/flight/update/:uuid", checkJwt, flightCtrl.updateFlightByIdCtrl);
    static async updateFlightById(flight: FlightEntity) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
        try {  
            const response = await axios.put(API_URL + "flight/update/" + flight.uuid, flight, {headers: token});
            return response;
        } catch (error) {
            console.error("Error Editing Flight: ", error);
            throw error;
        }
        }
    }

    // CASE 9: routeFlight.delete("/flight/delete/:uuid", checkJwt, flightCtrl.deleteFlightCtrl);

}
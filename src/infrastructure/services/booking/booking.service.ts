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

export class BookingService{

    // CASE 1: routeBooking.post("/booking/create", bookingCtrl.createBookingCtrl);
    static async createBooking(booking: BookingEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "booking/create", booking, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating Booking: ', error);
            throw error;
        }
    }

    // CASE 2: routeBooking.get("/booking/getbyid/:uuid", checkJwt, bookingCtrl.getBookingByIdCtrl);
    static async getBookingById(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "booking/getbyid/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Booking By ID: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Booking By ID (Token Problems)");
        }
    }

    // CASE 3: routeBooking.get("/booking/getbyuser/:user", checkJwt, bookingCtrl.getBookingsByUserCtrl);
    static async getBookingsByUser(user: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "booking/getbyuser/" + user, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Booking By User: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Booking By User (Token Problems)");
        }
    }

    // CASE 4: routeBooking.get("/booking/getbycompany/:company", checkJwt, bookingCtrl.getBookingsByCompanyCtrl);
    static async getBookingsByCompany(company: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "booking/getbycompany/" + company, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Booking By Company: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Booking By Company (Token Problems)");
        }
    }

    // CASE 5: routeBooking.get("/booking/getbyservice/:service", checkJwt, bookingCtrl.getBookingsByServiceCtrl);
    static async getBookingsByService(service: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "booking/getbyservice/" + service, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Booking By Service: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Booking By Service (Token Problems)");
        }
    }

    // CASE 6: routeBooking.get("/booking/all/count/docs", checkJwt, bookingCtrl.getNumBookingsCtrl);
    static async getNumBookings() {
        const token = await AuthHeaderService.authHeader()
        if(token){
        try {
            const response = await axios.get(API_URL + "booking/all/count/docs", { headers:  token});
            return response;
        } catch (error) {
            console.error("Error Getting Number Of Bookings: ", error);
            throw error;
        }
        } else {
        console.log("Error Getting Number Of Bookings (Token Problems)");
        }
    }

    // CASE 7: routeBooking.put("/booking/update/:uuid", checkJwt, bookingCtrl.updateBookingCtrl);
    static async updateBooking(booking: any) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
            try {  
                const response = await axios.put(API_URL + "booking/update/" + booking.uuid, booking, {headers: token});
                return response;
            } catch (error) {
                console.error("Error Editing Booking: ", error);
                throw error;
            }
        }
    }

    // CASE 8: routeBooking.delete("/booking/delete/:uuid", checkJwt, bookingCtrl.deleteBookingCtrl);

}
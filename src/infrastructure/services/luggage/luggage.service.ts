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

export class LuggageService{

    

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

    /*
    // (1) GET USER BY ID: routeUser.get("/user/:uuid", checkJwt, userCtrl.getUserByIdCtrl)]
    static async getUserById(userId: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
        try {
            const response = await axios.get(API_URL + "user/" + userId, { headers:  token});
            return response;
        } catch (error) {
            console.error("Error Getting User By ID: ", error);
            throw error;
        }
        } else {
        console.log("Error Getting User By ID (Token Problems)");
        }
    }

    // (2) GET USER BY MAIL: [routeUser.get("/user/getByEmail/:mailUser", userCtrl.getUserByEmailCtrl)]
    static async getUserByEmail(mailUser: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
        try {
            const response = await axios.get(API_URL + "user/getByEmail/" + mailUser, { headers:  token});
            return response;
        } catch (error) {
            console.error("Error Getting User By EMail: ", error);
            throw error;
        }
        } else {
        console.log("Error Getting User By EMail (Token Problems)");
        }
    }

    // (3) GET SEARCHED USERS: [routeUser.get("/user/search/:search", checkJwt, userCtrl.getSearchUsersCtrl)]
    static async getSearchUsers(searchQuery: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
        try {
            const response = await axios.get(API_URL + "user/search/" + searchQuery, { headers:  token});
            return response;
        } catch (error) {
            console.error("Error Searching Users: ", error);
            throw error;
        }
        } else {
        console.log("Error Searching Users (Token Problems)");
        }
    }

    // (4) GET NUM USERS: [routeUser.get("/user/all/count/docs", checkJwt, userCtrl.getNumUsersCtrl)]
    static async getNumUsers() {
        const token = await AuthHeaderService.authHeader()
        if(token){
        try {
            const response = await axios.get(API_URL + "user/all/count/docs", { headers:  token});
            return response;
        } catch (error) {
            console.error("Error Getting Number Of Users: ", error);
            throw error;
        }
        } else {
        console.log("Error Getting Number Of Users (Token Problems)");
        }
    }

    // (5) LIST USERS (ALL): [routeUser.get("/users/all", checkJwt, userCtrl.listUserCtrl)]
    static async listUser() {
        const token = await AuthHeaderService.authHeader()
        if(token){
        try {
            const response = await axios.get(API_URL + "users/all", { headers: token });
            return response;
        } catch (error) {
            console.error("Error Getting All Users: ", error);
            throw error;
        }
        } else {
        console.log("Error Getting All Users (Token Problems)");
        }
    }

    // (6) LIST USERS (PAGINATE): [routeUser.get("/user/all/:numPage", checkJwt, userCtrl.listUserPagCtrl)]
    static async listUserPag(numPage: string) {
        const token = await AuthHeaderService.authHeader()
        if(token){
        try {
            const response = await axios.get(API_URL + "users/all/" + numPage, { headers: token });
            return response;
        } catch (error) {
            console.error("Error Getting Users Paginated: ", error);
            throw error;
        }
        } else {
        console.log("Error Getting Users Paginated (Token Problems)");
        }
    }

    // (7) UPDATE USER: [routeUser.put("/user/update/:uuid", checkJwt, userCtrl.updateUserCtrl)]
    static async updateUser(user: any) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
        try {  
            const response = await axios.put(API_URL + "user/update/" + user.uuid, user, {headers: token});
            return response;
        } catch (error) {
            console.error("Error Editing User: ", error);
            throw error;
        }
        }
    }

    // (8) DELETE USER: [routeUser.delete("/user/delete/:uuid", checkJwt, userCtrl.deleteUserCtrl)]
    */

}
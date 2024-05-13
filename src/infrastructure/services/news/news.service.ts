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

export class NewsService{

    // CASE 1: routeNews.post("/news/create", newsCtrl.createNewsCtrl);
    static async createNews(news: NewsEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "news/create", news, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating News: ', error);
            throw error;
        }
    }

    // CASE 2: routeNews.get("/news/getbyid/:uuid", checkJwt, newsCtrl.getNewsByIdCtrl);
    static async getNewsById(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "news/getbyid/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting News By ID: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting News By ID (Token Problems)");
        }
    }

    // CASE 3: routeNews.get("/news/all/count/docs", checkJwt, newsCtrl.getNumNewsCtrl);
    static async getNumNews() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "news/all/count/docs", { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Number Of News: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Number Of News (Token Problems)");
        }
    }

    // CASE 4: routeNews.get("/news/listall", checkJwt, newsCtrl.listNewsCtrl);
    static async listNews() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "news/listall", { headers: token });
                return response;
            } catch (error) {
                console.error("Error Getting All News: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting All News (Token Problems)");
        }
    }

    // CASE 5: routeNews.get("/news/listpag/:numPage", checkJwt, newsCtrl.listNewsPagCtrl);
    static async listNewsPag(numPage: string) {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "news/listpag/" + numPage, { headers: token });
                return response;
            } catch (error) {
                console.error("Error Getting News Paginated: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting News Paginated (Token Problems)");
        }
    }

    // CASE 6: routeNews.put("/news/update/:uuid", checkJwt, newsCtrl.updateNewsCtrl);
    static async updateNews(news: NewsEntity) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
            try {  
                const response = await axios.put(API_URL + "news/update/" + news.uuid, news, {headers: token});
                return response;
            } catch (error) {
                console.error("Error Editing News: ", error);
                throw error;
            }
        }
    }

    // CASE 7: routeNews.delete("/news/delete/:uuid", checkJwt, newsCtrl.deleteNewsCtrl);

}
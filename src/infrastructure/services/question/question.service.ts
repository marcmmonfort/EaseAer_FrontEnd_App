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

export class QuestionService{

    // CASE 1: routeQuestion.post("/question/create", questionCtrl.createQuestionCtrl);
    static async createQuestion(question: QuestionEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "question/create", question, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating Question: ', error);
            throw error;
        }
    }

    // CASE 2: routeQuestion.get("/question/getbyid/:uuid", checkJwt, questionCtrl.getQuestionByIdCtrl);
    static async getQuestionById(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "question/getbyid/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Question By ID: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Question By ID (Token Problems)");
        }
    }

    // CASE 3: routeQuestion.get("/question/getbydestination/:destination", checkJwt, questionCtrl.getQuestionsByDestinationCtrl);
    static async getQuestionsByDestination(destination: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "question/getbydestination/" + destination, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Question By Destination: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Question By Destination (Token Problems)");
        }
    }

    // CASE 4: routeQuestion.get("/question/getans/:uuid", checkJwt, questionCtrl.getAnsToQuestionCtrl);
    static async getAnsToQuestion(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "question/getans/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Answer To Question: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Answer To Question (Token Problems)");
        }
    }

    // CASE 5: routeQuestion.get("/question/all/count/docs", checkJwt, questionCtrl.getNumQuestionsCtrl);
    static async getNumQuestions() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "question/all/count/docs", { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Number Of Questions: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Number Of Questions (Token Problems)");
        }
    }

    // CASE 6: routeQuestion.put("/question/update/:uuid", checkJwt, questionCtrl.updateQuestionCtrl);
    static async updateQuestion(question: QuestionEntity) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
            try {  
                const response = await axios.put(API_URL + "question/update/" + question.uuid, question, {headers: token});
                return response;
            } catch (error) {
                console.error("Error Editing Question: ", error);
                throw error;
            }
        }
    }

    // CASE 7: routeQuestion.delete("/question/delete/:uuid", checkJwt, questionCtrl.deleteQuestionCtrl);

}
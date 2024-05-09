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

export class PredictionService{

    // CASE 1: routePrediction.post("/prediction/create", predictionCtrl.createPredictionCtrl);
    static async createPrediction(prediciton: PredictionEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "prediction/create", prediciton, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating Prediction: ', error);
            throw error;
        }
    }

    // CASE 2: routePrediction.get("/prediction/getbyid/:uuid", checkJwt, predictionCtrl.getPredictionByIdCtrl);
    static async getPredictionById(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "prediction/getbyid/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Prediction By ID: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Prediction By ID (Token Problems)");
        }
    }

    // CASE 3: routePrediction.get("/prediction/all/count/docs", checkJwt, predictionCtrl.getNumPredictionsCtrl);
    static async getNumPredictions() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "prediction/all/count/docs", { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Number Of Predictions: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Number Of Predictions (Token Problems)");
        }
    }

    // CASE 4: routePrediction.get("/prediction/gettraveltime/:uuid", checkJwt, predictionCtrl.getTravelTimeOfPredictionCtrl);
    static async getTravelTimeOfPrediction(uuid: string) {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "prediction/gettraveltime/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Travel Time Of Prediction: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Travel Time Of Prediction (Token Problems)");
        }
    }

    // CASE 5: routePrediction.put("/prediction/update/:uuid", checkJwt, predictionCtrl.updatePredictionByIdCtrl);
    static async updatePredictionById(prediction: PredictionEntity) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
            try {  
                const response = await axios.put(API_URL + "prediction/update/" + prediction.uuid, prediction, {headers: token});
                return response;
            } catch (error) {
                console.error("Error Editing Prediction: ", error);
                throw error;
            }
        }
    }

    // CASE 6: routePrediction.delete("/prediction/delete/:uuid", checkJwt, predictionCtrl.deletePredictionCtrl);

}
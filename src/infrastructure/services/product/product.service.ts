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

export class ProductService{

    // CASE 1: routeProduct.post("/product/create", productCtrl.createProductCtrl);
    static async createProduct(product: ProductEntity) {
        const token = await AuthHeaderService.authHeader();
        try {
            const response = await axios.post(API_URL + "product/create", product, { headers: token });
            return response;
        } catch (error) {
            console.error('Error Creating Product: ', error);
            throw error;
        }
    }

    // CASE 2: routeProduct.get("/product/getbyid/:uuid", checkJwt, productCtrl.getProductByIdCtrl);
    static async getProductById(uuid: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "product/getbyid/" + uuid, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Product By ID: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Product By ID (Token Problems)");
        }
    }

    // CASE 3: routeProduct.get("/product/getbyname/:name", productCtrl.getProductsByNameCtrl);
    static async getProductsByName(name: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "product/getbyname/" + name, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Product By Name: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Product By Name (Token Problems)");
        }
    }

    // CASE 4: routeProduct.get("/product/getbycode/:code", productCtrl.getProductByCodeCtrl);
    static async getProductByCode(code: string) {
        const token=await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "product/getbycode/" + code, { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Product By Code: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Product By Code (Token Problems)");
        }
    }

    // CASE 5: routeProduct.put("/product/update/:uuid", checkJwt, productCtrl.updateProductCtrl);
    static async updateProduct(product: ProductEntity) {
        const token = await AuthHeaderService.authHeader();
        if (token) {
        try {  
            const response = await axios.put(API_URL + "product/update/" + product.uuid, product, {headers: token});
            return response;
        } catch (error) {
            console.error("Error Editing Product: ", error);
            throw error;
        }
        }
    }

    // CASE 6: routeProduct.delete("/product/delete/:uuid", checkJwt, productCtrl.deleteProductCtrl);

    // CASE 7: routeProduct.get("/product/all/count/docs", checkJwt, productCtrl.getNumProductsCtrl);
    static async getNumProducts() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "product/all/count/docs", { headers:  token});
                return response;
            } catch (error) {
                console.error("Error Getting Number Of Products: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Number Of Products (Token Problems)");
        }
    }

    // CASE 8: routeProduct.get("/product/listproducts/all", checkJwt, productCtrl.listProductsCtrl);
    static async listProducts() {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "product/listproducts/all", { headers: token });
                return response;
            } catch (error) {
                console.error("Error Getting All Products: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting All Products (Token Problems)");
        }
    }

    // CASE 9: routeProduct.get("/product/listproductspag/:numPage", checkJwt, productCtrl.listProductsPagCtrl);
    static async listUserPag(numPage: string) {
        const token = await AuthHeaderService.authHeader()
        if(token){
            try {
                const response = await axios.get(API_URL + "product/listproductspag/" + numPage, { headers: token });
                return response;
            } catch (error) {
                console.error("Error Getting Products Paginated: ", error);
                throw error;
            }
        } else {
            console.log("Error Getting Products Paginated (Token Problems)");
        }
    }

}
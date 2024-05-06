import { PreferencesEntity  } from "./preferences.entity";

export class PreferencesValue implements PreferencesEntity {
    uuid: string;
    idPredPreferences: string; // idPrediction
    foodPreferences: "none" | "lightmeal" | "fullmeal";
    shopPreferences: "none" | "look" | "search";
    carParkPreferences: "none" | "own" | "rentacar";
    luggagePreferences: "none" | "one" | "multiple" | "special";
    marginPreferences: "none" | "low" | "mid" | "high";
    deletedPreferences: boolean;
    constructor({
        uuid,
        idPredPreferences,
        foodPreferences,
        shopPreferences,
        carParkPreferences,
        luggagePreferences,
        marginPreferences,
        deletedPreferences
    }: {
        uuid: string;
        idPredPreferences: string; // idPrediction
        foodPreferences: "none" | "lightmeal" | "fullmeal";
        shopPreferences: "none" | "look" | "search";
        carParkPreferences: "none" | "own" | "rentacar";
        luggagePreferences: "none" | "one" | "multiple" | "special";
        marginPreferences: "none" | "low" | "mid" | "high";
        deletedPreferences: boolean;
    }) {
        this.uuid = uuid,
        this.idPredPreferences = idPredPreferences,
        this.foodPreferences = foodPreferences,
        this.shopPreferences = shopPreferences,
        this.carParkPreferences = carParkPreferences,
        this.luggagePreferences = luggagePreferences,
        this.marginPreferences = marginPreferences,
        this.deletedPreferences = deletedPreferences
    }
}
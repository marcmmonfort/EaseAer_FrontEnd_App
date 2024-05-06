export interface PreferencesEntity {
    uuid: string;
    idPredPreferences: string; // idPrediction
    foodPreferences: "none" | "lightmeal" | "fullmeal";
    shopPreferences: "none" | "look" | "search";
    carParkPreferences: "none" | "own" | "rentacar";
    luggagePreferences: "none" | "one" | "multiple" | "special";
    marginPreferences: "none" | "low" | "mid" | "high";
    deletedPreferences: boolean;
}
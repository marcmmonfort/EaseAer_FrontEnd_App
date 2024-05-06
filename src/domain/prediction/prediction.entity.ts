export interface PredictionEntity {
    uuid: string;
    idUserPrediction: string; // idUser
    idFlightPredition: string;
    datePrediction: Date;
    exitHomeTimePrediction?: string;
    transportTimePrediction?: string;
    entranceTimePrediction?: string;
    checkInTimePrediction?: string;
    securityTimePrediction: string;
    passportTimePrediction?: string;
    gateTimePrediction?: string;
    planeTimePrediction?: string;
    deletedPrediction: boolean;
}
  
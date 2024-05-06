import { PredictionEntity  } from "./prediction.entity";

export class PredictionValue implements PredictionEntity {
    uuid: string;
    idUserPrediction: string;
    idFlightPredition: string;
    datePrediction: Date;
    exitHomeTimePrediction: string;
    transportTimePrediction: string;
    entranceTimePrediction: string;
    checkInTimePrediction: string;
    securityTimePrediction: string;
    passportTimePrediction: string;
    gateTimePrediction: string;
    planeTimePrediction: string;
    deletedPrediction: boolean;
    constructor({
        uuid,
        idUserPrediction,
        idFlightPredition,
        datePrediction,
        exitHomeTimePrediction,
        transportTimePrediction,
        entranceTimePrediction,
        checkInTimePrediction,
        securityTimePrediction,
        passportTimePrediction,
        gateTimePrediction,
        planeTimePrediction,
        deletedPrediction
    }: {
        uuid: string;
        idUserPrediction: string;
        idFlightPredition: string;
        datePrediction: Date;
        exitHomeTimePrediction: string;
        transportTimePrediction: string;
        entranceTimePrediction: string;
        checkInTimePrediction: string;
        securityTimePrediction: string;
        passportTimePrediction: string;
        gateTimePrediction: string;
        planeTimePrediction: string;
        deletedPrediction: boolean;
    }) {
        this.uuid = uuid,
        this.idUserPrediction = idUserPrediction,
        this.idFlightPredition = idFlightPredition,
        this.datePrediction = datePrediction,
        this.exitHomeTimePrediction = exitHomeTimePrediction,
        this.transportTimePrediction = transportTimePrediction,
        this.entranceTimePrediction = entranceTimePrediction,
        this.checkInTimePrediction = checkInTimePrediction,
        this.securityTimePrediction = securityTimePrediction,
        this.passportTimePrediction = passportTimePrediction,
        this.gateTimePrediction = gateTimePrediction,
        this.planeTimePrediction = planeTimePrediction,
        this.deletedPrediction = deletedPrediction
    }
}
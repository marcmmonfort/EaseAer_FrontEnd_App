import { FlightEntity  } from "./flight.entity";

export class FlightValue implements FlightEntity {

    uuid: string;
    numberFlight: string;
    companyFlight: string;
    originFlight: string;
    destinationFlight: string;    
    stdFlight: Date;
    etdFlight: Date;
    staFlight: Date;
    etaFlight: Date;
    depTerminalFlight?: string;
    statusFlight: "ontime" | "delayed" | "cancelled";

    constructor({
        uuid,
        numberFlight,
        companyFlight,
        originFlight,
        destinationFlight,
        stdFlight,
        etdFlight,
        staFlight,
        etaFlight,
        depTerminalFlight,
        statusFlight,
  
    }: {

        uuid: string;
        numberFlight: string;
        companyFlight: string;
        originFlight: string;
        destinationFlight: string;    
        stdFlight: Date;
        etdFlight: Date;
        staFlight: Date;
        etaFlight: Date;
        depTerminalFlight?: string;
        statusFlight: "ontime" | "delayed" | "cancelled";
    
    }) {

        this.uuid = uuid,
        this.numberFlight = numberFlight,
        this.companyFlight = companyFlight,
        this.originFlight = originFlight,
        this.destinationFlight = destinationFlight,
        this.stdFlight = stdFlight,
        this.etdFlight = etdFlight,
        this.staFlight = staFlight,
        this.etaFlight = etaFlight,
        this.depTerminalFlight = depTerminalFlight,
        this.statusFlight = statusFlight
    
    }

}
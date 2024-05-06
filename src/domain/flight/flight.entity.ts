export interface FlightEntity {
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
  }
  
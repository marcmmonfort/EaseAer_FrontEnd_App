export interface LocationEntity {
    uuid: string;
    nameLocation: string;
    latLocation: string;
    lonLocation: string;
    terminalLocation: string;
    floorLocation: string;
    typeLocation: "shop" | "service";
    deletedLocation: boolean;
  }
  
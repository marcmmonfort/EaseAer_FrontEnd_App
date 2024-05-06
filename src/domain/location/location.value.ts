import { LocationEntity } from "./location.entity";

export class LocationValue implements LocationEntity {
  uuid: string;
  nameLocation: string;
  latLocation: string;
  lonLocation: string;
  terminalLocation: string;
  floorLocation: string;
  typeLocation: "shop" | "service";
  deletedLocation: boolean;

  constructor({
    uuid,
    nameLocation,
    latLocation,
    lonLocation,
    terminalLocation,
    floorLocation,
    typeLocation,
    deletedLocation
  }: {
    uuid: string;
    nameLocation: string;
    latLocation: string;
    lonLocation: string;
    terminalLocation: string;
    floorLocation: string;
    typeLocation: "shop" | "service";
    deletedLocation: boolean;
  }) {
    this.uuid = uuid,
    this.nameLocation = nameLocation,
    this.latLocation = latLocation,
    this.lonLocation = lonLocation,
    this.terminalLocation = terminalLocation,
    this.floorLocation = floorLocation,
    this.typeLocation = typeLocation,
    this.deletedLocation = deletedLocation
  }
}

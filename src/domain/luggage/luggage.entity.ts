export interface LuggageEntity {
    uuid: string;
    idUserLuggage: string;
    idFlightLuggage: string;
    infoLuggage: string;
    statusLuggage: "waiting" | "admitted" | "security" | "presorting" | "finalsorting" | "handling" | "plane";
    deletedLuggage: boolean;
}
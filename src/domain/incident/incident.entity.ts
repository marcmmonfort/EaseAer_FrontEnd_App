export interface IncidentEntity {
    uuid: string;
    idUserIncident: string;
    descriptionIncident: string;
    collectivesIncident: "security" | "medical" | "fire" | "cleaning" | "assistance" | "tech" | "other";
    statusIncident: "new" | "received" | "managed" | "solved" | "unsolved";
    deletedIncident: boolean;
}
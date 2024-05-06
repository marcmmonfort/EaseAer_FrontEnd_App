import { IncidentEntity } from "./incident.entity";

export class IncidentValue implements IncidentEntity {
    uuid: string;
    idUserIncident: string;
    descriptionIncident: string;
    collectivesIncident: "security" | "medical" | "fire" | "cleaning" | "assistance" | "tech" | "other";
    statusIncident: "new" | "received" | "managed" | "solved" | "unsolved";
    deletedIncident: boolean;
    constructor({
        uuid,
        idUserIncident,
        descriptionIncident,
        collectivesIncident,
        statusIncident,
        deletedIncident
    }: {
        uuid: string;
        idUserIncident: string;
        descriptionIncident: string;
        collectivesIncident: "security" | "medical" | "fire" | "cleaning" | "assistance" | "tech" | "other";
        statusIncident: "new" | "received" | "managed" | "solved" | "unsolved";
        deletedIncident: boolean;
    }) {
        this.uuid = uuid,
        this.idUserIncident = idUserIncident,
        this.descriptionIncident = descriptionIncident,
        this.collectivesIncident = collectivesIncident,
        this.statusIncident = statusIncident,
        this.deletedIncident = deletedIncident
    }
}
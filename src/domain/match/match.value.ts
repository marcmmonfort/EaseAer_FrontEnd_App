import { MatchEntity } from "./match.entity";

export class MatchValue implements MatchEntity {
    uuid: string;
    idUserAMatch: string;
    idUserBMatch?: string;
    dateMatch?: Date;
    showMatch: boolean;
    deletedMatch: boolean;
    constructor({
        uuid,
        idUserAMatch,
        idUserBMatch,
        dateMatch,
        showMatch,
        deletedMatch
    }: {
        uuid: string;
        idUserAMatch: string;
        idUserBMatch?: string;
        dateMatch?: Date;
        showMatch: boolean;
        deletedMatch: boolean;
    }) {
        this.uuid = uuid,
        this.idUserAMatch = idUserAMatch,
        this.idUserBMatch = idUserBMatch,
        this.dateMatch = dateMatch,
        this.showMatch = showMatch,
        this.deletedMatch = deletedMatch
    }
}
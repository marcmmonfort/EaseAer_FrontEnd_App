export interface MatchEntity {
    uuid: string;
    idUserAMatch: string; // Primero por orden alfabético.
    idUserBMatch?: string; // Segundo por orden alfabético.
    dateMatch?: Date; // Se va a dejar la fecha en la que "showMatch" se pone a TRUE.
    showMatch: boolean;
    deletedMatch: boolean;
}
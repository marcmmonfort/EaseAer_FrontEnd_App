export interface GameEntity {
    uuid: string;
    idUserGame: string;
    destinationGame: string;
    questionsGame: [string];
    pointsGame: Number;
    deletedGame: boolean;
}
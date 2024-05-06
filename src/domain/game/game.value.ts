import { GameEntity } from "./game.entity";

export class GameValue implements GameEntity {
    uuid: string;
    idUserGame: string;
    destinationGame: string;
    questionsGame: [string];
    pointsGame: Number;
    deletedGame: boolean;
    constructor({
        uuid,
        idUserGame,
        destinationGame,
        questionsGame,
        pointsGame,
        deletedGame
    }: {
        uuid: string;
        idUserGame: string;
        destinationGame: string;
        questionsGame: [string];
        pointsGame: Number;
        deletedGame: boolean;
    }) {
        this.uuid = uuid,
        this.idUserGame = idUserGame,
        this.destinationGame = destinationGame,
        this.questionsGame = questionsGame,
        this.pointsGame = pointsGame,
        this.deletedGame = deletedGame
    }
}
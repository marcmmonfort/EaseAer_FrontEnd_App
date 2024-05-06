import { CardEntity } from "./card.entity";

export class CardValue implements CardEntity {
    uuid: string;
    idUserCard: string;
    numberCard: string;
    pointsCard: Number;
    levelCard: "rookie" | "explorer" | "captain" | "elite";
    deletedCard: boolean;
    constructor({
        uuid,
        idUserCard,
        numberCard,
        pointsCard,
        levelCard,
        deletedCard
    }: {
        uuid: string;
        idUserCard: string;
        numberCard: string;
        pointsCard: Number;
        levelCard: "rookie" | "explorer" | "captain" | "elite";
        deletedCard: boolean;
    }) {
        this.uuid = uuid,
        this.idUserCard = idUserCard,
        this.numberCard = numberCard,
        this.pointsCard = pointsCard,
        this.levelCard = levelCard,
        this.deletedCard = deletedCard
    }
}
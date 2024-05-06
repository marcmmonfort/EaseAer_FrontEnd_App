export interface CardEntity {
    uuid: string;
    idUserCard: string;
    numberCard: string;
    pointsCard: Number;
    levelCard: "rookie" | "explorer" | "captain" | "elite";
    deletedCard: boolean;
}
  
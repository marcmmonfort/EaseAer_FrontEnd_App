import { PrizeEntity } from "./prize.entity";

export class PrizeValue implements PrizeEntity {
    uuid: string;
    pointsPrize: Number;
    namePrize: string;
    descriptionPrize: string;
    idShopPrize: string;
    dateEndPrize: Date;
    codePrize: string;
    deletedPrize: boolean;
    constructor({
        uuid,
        pointsPrize,
        namePrize,
        descriptionPrize,
        idShopPrize,
        dateEndPrize,
        codePrize,
        deletedPrize,
    }: {
        uuid: string;
        pointsPrize: Number;
        namePrize: string;
        descriptionPrize: string;
        idShopPrize: string;
        dateEndPrize: Date;
        codePrize: string;
        deletedPrize: boolean;
    }) {
        this.uuid = uuid,
        this.pointsPrize = pointsPrize,
        this.namePrize = namePrize,
        this.descriptionPrize = descriptionPrize,
        this.idShopPrize = idShopPrize,
        this.dateEndPrize = dateEndPrize,
        this.codePrize = codePrize,
        this.deletedPrize = deletedPrize
    }
}
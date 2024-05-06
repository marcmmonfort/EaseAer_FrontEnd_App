import { OfferEntity } from "./offer.entity";

export class OfferValue implements OfferEntity {
    uuid: string;
    idShopOffer: string;
    priceOffer: Number;
    idProductOffer: string;
    dateEndOffer: Date;

    constructor({
        uuid,
        idShopOffer,
        priceOffer,
        idProductOffer,
        dateEndOffer
    }: {

        uuid: string;
        idShopOffer: string;
        priceOffer: Number;
        idProductOffer: string;
        dateEndOffer: Date;

    }) {
        this.uuid = uuid,
        this.idShopOffer = idShopOffer,
        this.priceOffer = priceOffer,
        this.idProductOffer = idProductOffer,
        this.dateEndOffer = dateEndOffer
    }
}
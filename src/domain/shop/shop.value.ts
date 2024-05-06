import { ShopEntity } from "./shop.entity";

export class ShopValue implements ShopEntity {
    uuid: string;
    idCompanyShop: string;
    idLocationShop: string;
    descriptionShop: string;
    webShop: string;
    scheduleShop: string;
    deletedShop: boolean;
    constructor({
        uuid,
        idCompanyShop,
        idLocationShop,
        descriptionShop,
        webShop,
        scheduleShop,
        deletedShop
    }: {
        uuid: string;
        idCompanyShop: string;
        idLocationShop: string;
        descriptionShop: string;
        webShop: string;
        scheduleShop: string;
        deletedShop: boolean;
    }) {
        this.uuid = uuid,
        this.idCompanyShop = idCompanyShop,
        this.idLocationShop = idLocationShop,
        this.descriptionShop = descriptionShop,
        this.webShop = webShop,
        this.scheduleShop = scheduleShop,
        this.deletedShop = deletedShop
    }
}
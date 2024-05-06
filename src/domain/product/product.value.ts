import { ProductEntity } from "./product.entity";

export class ProductValue implements ProductEntity {
    uuid: string;
    nameProduct: string;
    descriptionProduct: string;
    codeProduct: string;
    deletedProduct: boolean;
  
    constructor({
        uuid,
        nameProduct,
        descriptionProduct,
        codeProduct,
        deletedProduct,
    }: {
        uuid: string;
        nameProduct: string;
        descriptionProduct: string;
        codeProduct: string;
        deletedProduct: boolean;
    }) {
        this.uuid = uuid,
        this.nameProduct = nameProduct,
        this.descriptionProduct = descriptionProduct,
        this.codeProduct = codeProduct,
        this.deletedProduct = deletedProduct
    }
}
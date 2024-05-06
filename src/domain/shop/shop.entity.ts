export interface ShopEntity {
    uuid: string;
    idCompanyShop: string; // idUser
    idLocationShop: string; // idLocation
    descriptionShop: string;
    webShop: string;
    scheduleShop: string; // "Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday" ...
    // ... "09:00_20:30|09:00_20:30|09:00_20:30|09:00_20:30|09:00_22:00|09:00_22:00|09:00_22:00"
    deletedShop: boolean;
  }
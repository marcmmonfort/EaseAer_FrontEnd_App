export interface RatingsEntity {
    uuid: string;
    typeRating: "news" | "service" | "shop" | "product";
    idObjectRating: string;
    averageRating: number;
    idsUsersRating?: [string];
    commentRating: string;
  }
  
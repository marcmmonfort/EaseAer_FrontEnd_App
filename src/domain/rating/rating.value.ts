import { RatingsEntity } from "./rating.entity";

export class RatingsValue implements RatingsEntity {
  uuid: string;
  typeRating: "news" | "service" | "shop" | "product";
  idObjectRating: string;
  averageRating: number;
  idsUsersRating?: [string];
  commentRating: string;

  constructor({
    uuid,
    typeRating,
    idObjectRating,
    averageRating,
    idsUsersRating,
    commentRating
  }: {
    uuid: string;
    typeRating: "news" | "service" | "shop" | "product";
    idObjectRating: string;
    averageRating: number;
    idsUsersRating?: [string];
    commentRating: string;
  }) {
    this.uuid = uuid;
    this.typeRating = typeRating;
    this.idObjectRating = idObjectRating;
    this.averageRating = averageRating;
    this.idsUsersRating = idsUsersRating;
    this.commentRating = commentRating;
  }
}

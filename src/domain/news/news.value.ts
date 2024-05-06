import { NewsEntity } from "./news.entity";

export class NewsValue implements NewsEntity {
    uuid: string;
    idUserAuthorNews: string;
    titleNews: string;
    subtitleNews: string;
    descriptionNews: string;
    dateNews: Date;
    deletedNews: boolean;
    constructor({
        uuid,
        idUserAuthorNews,
        titleNews,
        subtitleNews,
        descriptionNews,
        dateNews,
        deletedNews
    }: {
        uuid: string;
        idUserAuthorNews: string;
        titleNews: string;
        subtitleNews: string;
        descriptionNews: string;
        dateNews: Date;
        deletedNews: boolean;
    }) {
        this.uuid = uuid,
        this.idUserAuthorNews = idUserAuthorNews,
        this.titleNews = titleNews,
        this.subtitleNews = subtitleNews,
        this.descriptionNews = descriptionNews,
        this.dateNews = dateNews,
        this.deletedNews = deletedNews
    }
}
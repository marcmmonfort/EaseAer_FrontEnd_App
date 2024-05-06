export interface NewsEntity {
    uuid: string;
    idUserAuthorNews: string;
    titleNews: string;
    subtitleNews: string;
    descriptionNews: string;
    dateNews: Date;
    deletedNews: boolean;
}
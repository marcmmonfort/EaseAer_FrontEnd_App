import { QuestionEntity } from "./question.entity";

export class QuestionValue implements QuestionEntity {
    uuid: string;
    destinationQuestion: string;
    statementQuestion: string;
    ansAQuestion: string;
    ansBQuestion: string;
    ansCQuestion: string;
    ansDQuestion: string;
    correctAnsQuestion: string;
    constructor({
        uuid,
        destinationQuestion,
        statementQuestion,
        ansAQuestion,
        ansBQuestion,
        ansCQuestion,
        ansDQuestion,
        correctAnsQuestion
    }: {
        uuid: string;
        destinationQuestion: string;
        statementQuestion: string;
        ansAQuestion: string;
        ansBQuestion: string;
        ansCQuestion: string;
        ansDQuestion: string;
        correctAnsQuestion: string;
    }) {
        this.uuid = uuid,
        this.destinationQuestion = destinationQuestion,
        this.statementQuestion = statementQuestion,
        this.ansAQuestion = ansAQuestion,
        this.ansBQuestion = ansBQuestion,
        this.ansCQuestion = ansCQuestion,
        this.ansDQuestion = ansDQuestion,
        this.correctAnsQuestion = correctAnsQuestion
    }
}
export interface QuestionEntity {
    uuid: string;
    destinationQuestion: string;
    statementQuestion: string;
    ansAQuestion: string;
    ansBQuestion: string;
    ansCQuestion: string;
    ansDQuestion: string;
    correctAnsQuestion: string; // "a" | "b" | "c" | "d"
}
export interface UserEntity {
    uuid: string;
    appUser: string;
    nameUser: string;
    surnameUser: string;
    mailUser: string;
    photoUser: string;
    birthdateUser: Date;
    genderUser: "male" | "female" | "other";
    descriptionUser: string;
    roleUser: "pax" | "company" | "admin" | "tech";
    privacyUser: boolean;
    recordGameUser?: number;
    flightsUser: string[];
    deletedUser: boolean;
  }
  
  export interface AuthEntity {
    mailUser: string;
    passwordUser: string;
  }
  
  export interface UserAuthEntity extends UserEntity {
    passwordUser: string;
  }
  
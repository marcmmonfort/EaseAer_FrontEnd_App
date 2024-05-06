import { AuthEntity, UserAuthEntity, UserEntity } from "./user.entity";

export class UserValue implements UserEntity {
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
  recordGameUser: number;
  flightsUser: [string];
  deletedUser: boolean;
  constructor({
    uuid,
    appUser,
    nameUser,
    surnameUser,
    mailUser,
    photoUser,
    birthdateUser,
    genderUser,
    descriptionUser,
    roleUser,
    privacyUser,
    recordGameUser,
    flightsUser,
    deletedUser,
  }: {
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
    recordGameUser: number;
    flightsUser: [string];
    deletedUser: boolean;
  }) {
    this.uuid = uuid,
    this.appUser = appUser,
    this.nameUser = nameUser,
    this.surnameUser = surnameUser,
    this.mailUser = mailUser,
    this.photoUser = photoUser,
    this.birthdateUser = birthdateUser,
    this.genderUser = genderUser,
    this.descriptionUser = descriptionUser,
    this.roleUser = roleUser,
    this.privacyUser = privacyUser,
    this.recordGameUser = recordGameUser,
    this.flightsUser = flightsUser,
    this.deletedUser = deletedUser
  }
}

export class AuthValue implements AuthEntity {
  mailUser: string;
  passwordUser: string;

  constructor({
    mailUser,
    passwordUser,
  }: {
    mailUser: string;
    passwordUser: string;
  }) {
    this.mailUser = mailUser;
    this.passwordUser = passwordUser;
  }
}

export class UserAuthValue implements UserAuthEntity {
  uuid: string;
  appUser: string;
  nameUser: string;
  surnameUser: string;
  mailUser: string;
  passwordUser: string;
  photoUser: string;
  birthdateUser: Date;
  genderUser: "male" | "female" | "other";
  descriptionUser: string;
  roleUser: "pax" | "company" | "admin" | "tech";
  privacyUser: boolean;
  recordGameUser: number;
  flightsUser: [string];
  deletedUser: boolean;
  constructor({
    uuid,
    appUser,
    nameUser,
    surnameUser,
    mailUser,
    passwordUser,
    photoUser,
    birthdateUser,
    genderUser,
    descriptionUser,
    roleUser,
    privacyUser,
    recordGameUser,
    flightsUser,
    deletedUser,
  }: {
    uuid: string;
    appUser: string;
    nameUser: string;
    surnameUser: string;
    mailUser: string;
    passwordUser: string;
    photoUser: string;
    birthdateUser: Date;
    genderUser: "male" | "female" | "other";
    descriptionUser: string;
    roleUser: "pax" | "company" | "admin" | "tech";
    privacyUser: boolean;
    recordGameUser: number;
    flightsUser: [string];
    deletedUser: boolean;
  }) {
    (this.uuid = uuid), (this.appUser = appUser);
    this.nameUser = nameUser,
    this.surnameUser = surnameUser,
    this.mailUser = mailUser,
    this.passwordUser = passwordUser,
    this.photoUser = photoUser,
    this.birthdateUser = birthdateUser,
    this.genderUser = genderUser,
    this.descriptionUser = descriptionUser,
    this.roleUser = roleUser,
    this.privacyUser = privacyUser,
    this.recordGameUser = recordGameUser,
    this.flightsUser = flightsUser,
    this.deletedUser = deletedUser
  }
}

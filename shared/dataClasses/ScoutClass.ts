import { prop } from '@typegoose/typegoose';

export enum LoginResult {
    Successful,
    WrongPassword,
    NoUser,
    Unverified,
    NoOrg
}

export default class ScoutClass {
    @prop() name: string;
    @prop() login: string;
    @prop() passwordHash: string;
    @prop() org: string;
    @prop() admin: boolean;
}

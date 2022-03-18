export declare enum LoginResult {
    Successful = 0,
    WrongPassword = 1,
    NoUser = 2,
    Unverified = 3,
    NoOrg = 4
}
export default class ScoutClass {
    name: string;
    login: string;
    passwordHash: string;
    org: string;
    admin: boolean;
}

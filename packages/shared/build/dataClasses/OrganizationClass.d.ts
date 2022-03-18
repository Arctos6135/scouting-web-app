export declare enum RegisterResult {
    Successful = 0,
    EmailTaken = 1,
    Invalid = 2,
    LoginTaken = 3
}
export default class OrganizationClass {
    email: string;
    orgName?: string;
    verified: boolean;
    orgID: string;
}

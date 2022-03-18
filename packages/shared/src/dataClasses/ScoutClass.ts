import { prop } from '@typegoose/typegoose';

export enum LoginResult {
    Successful,
    WrongPassword,
    NoUser,
    Unverified,
    NoOrg
}

export default class ScoutClass {
    @prop({ required: true }) 
	public name: string;
    @prop({ required: true }) 
	public login: string;
    @prop({ required: true }) 
	public passwordHash: string;
    @prop({ required: true }) 
	public org: string;
    @prop({ required: true }) 
	public admin: boolean;
}

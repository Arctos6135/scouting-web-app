//import * as mongoose from 'mongoose';
import * as users from './models/User';
import { Scout } from './models/Scouting';
import { Form } from './models/Form';
import { Response } from './models/Response';
import * as mongodb from 'mongodb';

export const mongoUrl = process.env.MONGO_URL + '/' + process.env.DB_NAME;
const client = new mongodb.MongoClient(mongoUrl);
class models {
	static Team = users.Team;
	static VerificationCode = users.VerificationCode;
	static Scout = Scout;
	static Form = Form;
	static Response = Response;
	static scoutEvents: mongodb.ChangeStream;
	static formEvents: mongodb.ChangeStream;
	static responseEvents: mongodb.ChangeStream;
}

(async function() {
	await client.connect().catch(console.error);
	const db = client.db('scouting');
	models.Team.collection = db.collection('teams');
	models.VerificationCode.collection = db.collection('verification-codes');
	models.Scout.collection = db.collection('scouts');
	models.Form.collection = db.collection('forms');
	models.Response.collection = db.collection('response');
	models.scoutEvents = models.Scout.collection.watch();
	models.formEvents = models.Form.collection.watch();
	models.responseEvents = models.Response.collection.watch();
	models.responseEvents.setMaxListeners(Infinity);
	models.scoutEvents.setMaxListeners(Infinity);
	models.formEvents.setMaxListeners(Infinity);
})();

export default models;
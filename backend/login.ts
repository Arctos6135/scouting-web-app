import * as socketio from 'socket.io';
import models from './db';
import {RegisterResult} from './db/models/User';
import {LoginResult} from './db/models/Scouting';
export default async function addListeners(socket: socketio.Socket, io: socketio.Server) {
	const req: any = socket.handshake;
	if (req.session.scout) {
		const scout = await models.Scout.findOne({_id: req.session.scout._id}).exec();
		if (!scout) {
			delete req.session.scout;
			req.session.save();
		}
		else {
			scout.connections++;
			await scout.save();
		}
	}

	const syncStatus = async () => {
		socket.emit('status', { scout: req.session.scout });
	};

	socket.on('login', async (data) => {
		let org: string;
		if (data.org) org = data.org;
		else {
			const organization = await models.Organization.findOne({ email: data.login }).exec();
			if (organization) org = organization.orgID;
			else {
				socket.emit('login:failed');
				return;
			}
		}
		const result = await models.Scout.login(org, data.login, data.password);
		switch (result) {
			case LoginResult.Successful:
				const scout = await models.Scout.findOne({ login: data.login, org }).exec();
				scout.connections++;
				await scout.save();
				req.session.scout = await models.Scout.findOne({ login: data.login, org }).lean().exec();
				
				req.session.save();
				break;

			case LoginResult.Unverified:
				socket.emit('login:unverified');
				break;
			default:
				socket.emit('login:failed', );
				break;
		}
		syncStatus();
	});

	socket.on('register', async (data) => {
		const result = await models.Organization.register(data.email, data.password, data.name);
		switch (result) {
			case RegisterResult.Successful:
				socket.emit('register', true);
				break;

			case RegisterResult.EmailTaken:
				socket.emit('register:email taken');
				break;

			default:
				socket.emit('register:failed');
				break;
		}
	});

	syncStatus();
	socket.on('status', syncStatus);

	const cleanup = async () => {
		req.session.loggedIn = false;
		if (req.session.scout) {
			//const scout = await models.Scout.findOne({_id: req.session.scout._id}).exec();
			//scout.connections--;
			//await scout.save();
			await models.Scout.updateOne({_id: req.session.scout._id}, { $inc: { 'connections': -1 } }).exec();
		}

		setTimeout(syncStatus, 10);

	};
	
	socket.on('logout', async (data) => {
		await cleanup();
		delete req.session.scout;
		req.session.save();
	});

	socket.on('disconnect', async (data) => {
		await cleanup();
	});
}

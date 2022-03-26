import * as socketio from 'socket.io';
import models from './db';
import { LoginResult } from '../shared/dataClasses/ScoutClass';
import { IOServer, Socket } from './server';
import { RegisterResult } from '../shared/dataClasses/OrganizationClass';
export default async function addListeners(socket: Socket, io: IOServer) {
	const req = socket.request;
	if (req.session.scout) {
		const scout = await models.Scout.findOne({login: req.session.scout.login, org: req.session.scout.org}).exec();
		if (!scout) {
			delete req.session.scout;
			req.session.save();
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
		const scout = await models.Scout.findOne({ login: data.login, org }).exec();
		switch (result) {
		case LoginResult.Successful:
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
		setTimeout(syncStatus, 10);

	};
	
	socket.on('logout', async () => {
		await cleanup();
		delete req.session.scout;
		req.session.save();
	});

	socket.on('disconnect', async () => {
		await cleanup();
	});
}

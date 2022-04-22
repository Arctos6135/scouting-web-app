import * as socketio from 'socket.io';
import models from './db';
import { LoginResult } from 'shared/dataClasses/Scout';
import { IOServer, Socket } from './server';
import { RegisterResult } from 'shared/dataClasses/Team';
import { getLogger } from './logging';

const logger = getLogger('login');

export default async function addListeners(socket: Socket, io: IOServer) {
	const req = socket.request;
	if (req.session?.scout) {
		const scout = await models.Scout.collection.findOne({login: req.session?.scout.login, team: req.session?.scout.team});
		if (!scout) {
			delete req.session?.scout;
			req.session?.save();
		}
		logger.info('Connection made from scout', { scout: req.session?.scout, ip: socket.handshake.address });
	}
	logger.info('Connection made from ip', { ip: socket.handshake.address });


	const syncStatus = async () => {
		if (req.session && req.session.scout) 
			req.session.scout = await models.Scout.collection.findOne({ login: req.session.scout?.login, team: req.session.scout.team }) ?? undefined;
		socket.emit('status', { scout: req.session?.scout });
		req.session?.save();
	};

	socket.on('login', async (data) => {
		logger.info('Scout login', { data, ip: socket.handshake.address });
		let teamID: string;
		if (data.team) teamID = data.team;
		else {
			const team = await models.Team.collection.findOne({ email: data.login });
			if (team) teamID = team.teamID;
			else {
				logger.warn('No team found', { data, ip: socket.handshake.address });
				socket.emit('alert', { message: 'This team does not exist.', page: 'login', type: 'danger' });
				return;
			}
		}
		const result = await models.Scout.login(teamID, data.login, data.password);
		switch (result) {
		case LoginResult.Successful:
			if (!req.session) {
				socket.emit('alert', { message: 'Unable to login', page: 'login', type: 'danger' });
				break;
			}
			req.session.scout = await models.Scout.collection.findOne({ login: data.login, team: teamID }) ?? undefined;
			req.session.save();
			break;
		case LoginResult.Unverified:
			socket.emit('alert', { message: 'You are attempting to login with an unverified email address.', page: 'login', type: 'danger' });
			logger.verbose('Unverified login attempt', { data: { ...data, password: '' }, ip: socket.handshake.address });
			break;
		//TODO: Add alerts for more types of message
		default:
			socket.emit('alert', { message: 'Unable to login.', page: 'login', type: 'danger' });
			console.log(result);
			logger.verbose('Failed login attempt', { data: { ...data, password: '' }, result, ip: socket.handshake.address });
			break;
		}
		syncStatus();
	});

	socket.on('register', async (data) => {
		logger.verbose('Register team', { data, ip: socket.handshake.address });
		const result = await models.Team.register(data.email, data.password, data.name);
		switch (result) {
		case RegisterResult.Successful:
			socket.emit('register', true);
			socket.emit('alert', { message: 'Register successful', type: 'success', page: 'register' });
			break;

		case RegisterResult.EmailTaken:
			logger.verbose('Email taken', { data, ip: socket.handshake.address });
			socket.emit('alert', { message: 'That email address is already in use.', type: 'warning', page: 'register' });
			break;

		default:
			logger.verbose('Register failed', { data, result, ip: socket.handshake.address });
			socket.emit('alert', { message: 'Unable to register.', type: 'warning', page: 'register' });
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
		logger.verbose('Scout logout', { scout: req.session?.scout, ip: socket.handshake.address });
		delete req.session?.scout;
		req.session?.save();
		await syncStatus();
	});

	socket.on('disconnect', async () => {
		await cleanup();
	});
}

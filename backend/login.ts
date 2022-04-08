import * as socketio from 'socket.io';
import models from './db';
import { LoginResult } from '../shared/dataClasses/ScoutClass';
import { IOServer, Socket } from './server';
import { RegisterResult } from '../shared/dataClasses/OrganizationClass';
import { getLogger } from './logging';

const logger = getLogger('login');

export default async function addListeners(socket: Socket, io: IOServer) {
	const req = socket.request;
	if (req.session.scout) {
		const scout = await models.Scout.findOne({login: req.session.scout.login, org: req.session.scout.org}).exec();
		if (!scout) {
			delete req.session.scout;
			req.session.save();
		}
		logger.info('Connection made from scout', { scout: req.session.scout, ip: socket.handshake.address });
	}
	logger.info('Connection made from ip', { ip: socket.handshake.address });


	const syncStatus = async () => {
		socket.emit('status', { scout: req.session.scout });
	};

	socket.on('login', async (data) => {
		logger.verbose('Scout login', { data, ip: socket.handshake.address });
		let org: string;
		if (data.org) org = data.org;
		else {
			const organization = await models.Organization.findOne({ email: data.login }).exec();
			if (organization) org = organization.orgID;
			else {
				logger.warn('No org found', { data, ip: socket.handshake.address });
				socket.emit('alert', { message: 'This team does not exist.', page: 'login', type: 'danger' });
				return;
			}
		}
		const result = await models.Scout.login(org, data.login, data.password);
		switch (result) {
		case LoginResult.Successful:
			req.session.scout = await models.Scout.findOne({ login: data.login, org }).lean().exec();
			req.session.save();
			break;
		case LoginResult.Unverified:
			socket.emit('alert', { message: 'You are attempting to login with an unverified email address.', page: 'login', type: 'danger' });
			logger.verbose('Unverified login attempt', { data, ip: socket.handshake.address });
			break;
		default:
			socket.emit('alert', { message: 'Unable to login.', page: 'login', type: 'danger' });
			logger.verbose('Failed login attempt', { data, result, ip: socket.handshake.address });
			break;
		}
		syncStatus();
	});

	socket.on('register', async (data) => {
		logger.verbose('Register organization', { data, ip: socket.handshake.address });
		const result = await models.Organization.register(data.email, data.password, data.name);
		switch (result) {
		case RegisterResult.Successful:
			socket.emit('register', true);
			break;

		case RegisterResult.EmailTaken:
			logger.verbose('Email taken', { data, ip: socket.handshake.address });
			socket.emit('register:error', 'That email address is already in use.');
			break;

		default:
			logger.verbose('Register failed', { data, result, ip: socket.handshake.address });
			socket.emit('register:error', 'Unable to register.');
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
		logger.verbose('Scout logout', { scout: req.session.scout, ip: socket.handshake.address });
		delete req.session.scout;
		req.session.save();
	});

	socket.on('disconnect', async () => {
		await cleanup();
	});
}

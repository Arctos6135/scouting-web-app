import * as socketio from 'socket.io';
import models from './db';
import {RegisterResult} from './db/models/User';
import {LoginResult, Scout} from './db/models/Scouting';
export default async function addListeners(socket: socketio.Socket, io: socketio.Server) {
	const req: any = socket.handshake;

	socket.on('organization:get url', async () => {
		if (req.session.scout) {
			const code = (await models.Organization.findOne({ orgID: req.session.scout.org })).orgID;
			//TODO: Maybe change to https
			socket.emit('organization:get url', 'http://' + req.headers.host + '/login?orgID=' + code);
		}
	});

	const sendScouts = async () => {
		if (!req.session.scout?.admin) {
			socket.emit('organization:get scouts', []);
			return;
		}

		const scouts = await Scout.find({ org: req.session.scout.org }).exec();
		socket.emit('organization:get scouts', scouts);
	}


	socket.on('organization:get scouts', sendScouts);

	socket.on('organization:update password', (update: {pin: string; newPassword: string;}) => {
		socket.emit('organization:update password', false);
	});

	socket.on('organization:create scout', (update: {pin: string; name: string; password: string;}) => {
		socket.emit('organization:create scout', false);
	});

	socket.on('organization:delete scout', () => {
		socket.emit('organization:delete scout', false);
	});

	const scoutEvents = Scout.watch();
	scoutEvents.on('change', change => {
		if (!req.session.scout?.admin) return;
		sendScouts();
	});


	socket.on('disconnect', () => {
		scoutEvents.close();
	});
}

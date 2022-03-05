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

		const scouts = await Scout.find({ org: req.session.scout.org });
		socket.emit('organization:get scouts', scouts);
	}

	const admin = () => !!req.session.scout?.admin;


	socket.on('organization:get scouts', sendScouts);

	socket.on('organization:update password', async ({login, newPassword}: {login: string; newPassword: string;}) => {
		// Don't allow operation for non-admins
		// TODO: This method of controlling permissions is super scuffed
		if (!admin()) return socket.emit('organization:update password', false);
		
		const scout = await Scout.findOne({ org: req.session.scout.org, login }).exec();
		socket.emit('organization:update password', !!(await scout?.updatePassword?.(newPassword)));
	});

	socket.on('organization:create scout', async ({login, name}: {login: string; name: string}) => {
		if (!admin()) return socket.emit('organization:create scout', false);

		const result = await Scout.register(login, '', req.session.scout.org, name);

		if (result != RegisterResult.Successful) socket.emit('organization:create scout', false);
		else socket.emit('organization:create scout', true);
	});

	socket.on('organization:delete scout', async (login) => {
		if (!admin()) return socket.emit('organization:delete scout', false);
		const scout = await Scout.findOne({org: req.session.scout.org, login}).exec();
		if (scout && !scout.admin) if (await scout.delete()) return socket.emit('organization:delete scout', true); 
		socket.emit('organization:delete scout', false);
	})

	const scoutEvents = Scout.watch();
	scoutEvents.on('change', async (change: any) => {
		if (!req.session.scout?.admin) return;
		sendScouts();
	});

	socket.on('disconnect', () => {
		scoutEvents.close();
	});
}

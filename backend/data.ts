import {getLogger} from './logging';
import models from './db';
import { IOServer, Socket } from './server';
import { Response } from 'shared/dataClasses/Response';
import { Filter } from 'mongodb';

const logger = getLogger('data');

export default async function addListeners(socket: Socket, io: IOServer) {
	const req = socket.request;
	const sendResponses = async () => {
		if (!req.session?.scout) {
			socket.emit('data:get responses', []);
			return;
		}
		const query: Filter<Response> = { team: req.session?.scout.team };
		if (!req.session?.scout.admin) query.scout = req.session?.scout.login;
		const scouts = await models.Response.collection.find(query).toArray();
		if (scouts) socket.emit('data:get responses', scouts);
	};
	socket.on('data:respond', async (response) => {
		if (!req.session?.scout) {
			logger.warn('Response received when not logged in', { ip: socket.handshake.address });
			return;
		}
		try {
			if (response.scout != req.session?.scout.login && !req.session?.scout.admin) {
				logger.warn('Scout submitted for another scout', { response, scout: req.session?.scout, ip: socket.handshake.address });
				return;
			}
			await models.Response.collection.deleteOne({
				team: req.session?.scout.team,
				scout: response.scout,
				form: response.form,
				id: response.id
			});
			const res = Response.parse({
				team: req.session?.scout.team,
				scout: response.scout,
				form: response.form,
				data: response.data,
				id: response.id,
				name: response.name
			});
			logger.verbose('Response received', { response, scout: req.session?.scout, ip: socket.handshake.address });
			await models.Response.collection.findOneAndUpdate({ id: response.id, }, { $set: res }, {upsert: true});
		}
		catch (e) {
			// do nothing
			console.log(e, response);
		}
	});
	socket.on('data:get responses', async () => {
		await sendResponses();
	});
	models.responseEvents.on('change', () => {
		sendResponses();
	});
}

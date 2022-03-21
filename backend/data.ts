import models from './db';
import { IOServer, Socket } from './server';

const responseEvents = models.Response.watch();
responseEvents.setMaxListeners(Infinity);
export default async function addListeners(socket: Socket, io: IOServer) {
	const req = socket.request;
	const sendResponses = async () => {
		if (!req.session.scout) {
			socket.emit('data:get responses', []);
			return;
		}
		const scouts = await models.Response.find({ org: req.session.scout.org, scout: req.session.scout.login }).lean().exec();
		socket.emit('data:get responses', scouts);
	};
	socket.on('data:respond', async (response) => {
		if (!req.session.scout) return;
		try {
			if (response.scout != req.session.scout.login && !req.session.scout.admin) return;
			await models.Response.deleteOne({
				org: req.session.scout.org,
				scout: response.scout,
				form: response.form,
				id: response.id
			}).exec();
			const res = new models.Response({
				org: req.session.scout.org,
				scout: response.scout,
				form: response.form,
				data: response.data,
				id: response.id,
				name: response.name
			});
			await res.save();
		}
		catch (e) {
			// do nothing
			console.log(e, response);
		}
	});
	socket.on('data:get responses', async () => {
		await sendResponses();
	});
	responseEvents.on('change', (change) => {
		sendResponses();
	});
}

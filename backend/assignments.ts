import models from './db';
import { IOServer, Socket } from './server';

const assignmentResponseEvents = models.AssignmentResponse.watch();
assignmentResponseEvents.setMaxListeners(Infinity);
export default async function addListeners(socket: Socket, io: IOServer) {
	const req = socket.request;
	const sendResponses = async () => {
		if (!req.session.scout) {
			socket.emit('assignment:get responses', []);
			return;
		}
		const scouts = await models.AssignmentResponse.find({ org: req.session.scout.org, scout: req.session.scout.login }).lean().exec();
		socket.emit('assignment:get responses', scouts);
	};
	socket.on('assignment:respond', async (response) => {
		if (!req.session.scout) return;
		console.log(response);
		try {
			if (response.scout != req.session.scout.login && !req.session.scout.admin) return;
			await models.AssignmentResponse.deleteOne({
				org: req.session.scout.org,
				scout: response.scout,
				assignment: response.assignment
			}).exec();
			const res = new models.AssignmentResponse({
				org: req.session.scout.org,
				scout: response.scout,
				assignment: response.assignment,
				data: response.data
			});
			await res.save();
		}
		catch (e) {
			// do nothing
			console.log(e);
		}
	});
	socket.on('assignment:get responses', async () => {
		await sendResponses();
	});
	assignmentResponseEvents.on('change', (change) => {
		sendResponses();
	});
}

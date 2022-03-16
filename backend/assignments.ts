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
			const res = new models.AssignmentResponse({
				org: req.session.scout.org,
				scout: req.session.scout.login,
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
	assignmentResponseEvents.on('change', (change) => {
		sendResponses();
	});
}

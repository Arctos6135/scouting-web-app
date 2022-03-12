import { IOServer, Socket } from './server';

export default async function addListeners(socket: Socket, io: IOServer) {
	const req = socket.request;
	socket.on('assignment:respond', async (response) => {
		if (!req.session.loggedIn) return;

	});
}

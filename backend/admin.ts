import AssignmentClass from '../shared/dataClasses/AssignmentClass';
import { RegisterResult } from '../shared/dataClasses/OrganizationClass';
import models from './db';
import { IOServer, Socket } from './server';

const scoutEvents = models.Scout.watch();
const formEvents = models.Form.watch();
const assignmentEvents = models.Assignment.watch();

scoutEvents.setMaxListeners(Infinity);
formEvents.setMaxListeners(Infinity);
assignmentEvents.setMaxListeners(Infinity);

export default async function addListeners(socket: Socket, io: IOServer) {
	const session = socket.request.session;
	socket.on('organization:get url', async () => {
		if (session.scout) {
			const code = (await models.Organization.findOne({ orgID: session.scout.org })).orgID;
			//TODO: Maybe change to https
			socket.emit('organization:get url', 'http://' + socket.request.headers.host + '/login?orgID=' + code);
		}
	});

	const admin = () => !!session.scout?.admin;

	const sendScouts = async () => {
		if (!admin()) {
			socket.emit('organization:get scouts', []);
			return;
		}
		const scouts = await models.Scout.find({ org: session.scout.org }).lean().exec();
		socket.emit('organization:get scouts', scouts);
	};

	const sendForms = async () => {
		if (!session.scout) return;
		const forms = await models.Form.find({ ownerOrg: session.scout.org }).lean().exec();
		socket.emit('organization:get forms', forms);
	};

	const sendAssignments = async () => {
		if (!session.scout) return;
		const query: Record<string, any> = { org: session.scout.org };
		if (!session.scout.admin) query.scouts = session.scout.login;
		const assignments = await models.Assignment.find(query).lean().exec();
		socket.emit('organization:get assignments', assignments);
	};

	socket.on('organization:get scouts', sendScouts);
	socket.on('organization:get forms', sendForms);

	socket.on('organization:update password', async ({login, newPassword}: {login: string; newPassword: string;}) => {
		// Don't allow operation for non-admins
		// TODO: This method of controlling permissions is super scuffed
		if (!admin()) return socket.emit('organization:update password', false);
		
		const scout = await models.Scout.findOne({ org: session.scout.org, login }).exec();
		socket.emit('organization:update password', !!(await scout?.updatePassword?.(newPassword)));
	});

	socket.on('organization:create scout', async ({login, name}: {login: string; name: string}) => {
		if (!admin()) return socket.emit('organization:create scout', false);

		const result = await models.Scout.register(login, '', session.scout.org, name);

		if (result != RegisterResult.Successful) socket.emit('organization:create scout', false);
		else socket.emit('organization:create scout', true);
	});

	socket.on('organization:delete scout', async (login) => {
		if (!admin()) return socket.emit('organization:delete scout', false);
		const scout = await models.Scout.findOne({org: session.scout.org, login}).exec();
		if (scout && !scout.admin) if (await scout.delete()) return socket.emit('organization:delete scout', true); 
		socket.emit('organization:delete scout', false);
	});
	
	socket.on('organization:update form', async (form) => {
		if (!admin()) return socket.emit('organization:update form', false);
		let oldForm = await models.Form.findOne({id: form.id, ownerOrg: session.scout.org});
		if (!oldForm) oldForm = new models.Form({id: form.id, ownerOrg: session.scout.org});
		oldForm.sections = form.sections;
		oldForm.name = form.name;
		try {
			await oldForm.validate();
			await oldForm.save();
		}
		catch (e) {
			// ignore errors
		}
	});

	socket.on('organization:delete form', async (form: { id: string }) => {
		if (!admin()) return socket.emit('organization:update form', false);
		const current = await models.Form.findOne({ id: form.id, org: session.scout.org }).exec();
		if (current) await current.delete();
	});

	socket.on('organization:assign', async (assignment: AssignmentClass) => {
		if (!admin()) return socket.emit('organization:update form', false);
		const prev = await models.Assignment.findOne({id: assignment.id}).exec();
		if (prev && assignment.id) {
			for (const k in assignment) prev[k] = assignment[k];
			try {
				await prev.save();
			}
			catch (e) {
				socket.emit('organization:assign', false);
			}
		}
		else {
			const obj = new models.Assignment(assignment);
			try {
				await obj.save();
			}
			catch (e) {
				socket.emit('organization:assign', false);
			}
		}
	});

	socket.on('organization:get assignments', async () => {
		await sendAssignments();
	});

	socket.on('organization:delete assignment', async (id) => {
		if (!admin()) return;
		await models.Assignment.findOneAndDelete({ id }).exec();
	});

	// TODO: There should only be one set of these listeners in the server
	// New connections can subscribe to relevant listeners
	const scoutListener = async (change: any) => {
		if (!session.scout?.admin) return;
		sendScouts();
	};
	scoutEvents.on('change', scoutListener);

	const formListener = async () => {
		//if (!session.scout?.admin) return;
		sendForms();
	};
	formEvents.on('change', formListener);

	const assignmentListener = async () => {
		sendAssignments();
	};
	assignmentEvents.on('change', assignmentListener);

	socket.on('disconnect', () => {
		console.log('disconnect');
		scoutEvents.off('change', scoutListener);
		formEvents.off('change', formListener);
	});
}

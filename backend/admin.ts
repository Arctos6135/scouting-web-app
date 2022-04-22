import { RegisterResult } from 'shared/dataClasses/Team';
import models from './db';
import { IOServer, Socket } from './server';
import { getLogger } from './logging';
import { Scout } from 'shared/dataClasses/Scout';
import { Form } from 'shared/dataClasses/Form';

const logger = getLogger('admin');


export async function admin(team: string, login: string): Promise<boolean> {
	return await models.Scout.collection.findOne({team, login}).then(scout => scout?.admin) ?? false;
}

export default async function addListeners(socket: Socket, io: IOServer) {
	const session = socket.request.session;
	socket.on('team:get url', async () => {
		if (session?.scout) {
			const code = (await models.Team.collection.findOne({ teamID: session?.scout.team }))?.teamID;
			//TODO: Maybe change to https
			socket.emit('team:get url', 'http://' + socket.request.headers.host + '/login?teamID=' + code);
		}
	});

	const sendScouts = async () => {
		if (!session?.scout) return;
		if (!await admin(session?.scout.team, session?.scout.login)) {
			socket.emit('team:get scouts', []);
			return;
		}
		const scouts = await models.Scout.collection.find({ team: session?.scout.team }).toArray();
		if (scouts) socket.emit('team:get scouts', scouts);
	};

	const sendForms = async () => {
		if (!session?.scout) return;
		const forms = await models.Form.collection.find({ ownerTeam: session?.scout.team }).toArray();
		if (forms) socket.emit('team:get forms', forms);
	};

	socket.on('team:get scouts', sendScouts);
	socket.on('team:get forms', sendForms);

	socket.on('team:update password', async ({login, newPassword}: {login: string; newPassword: string;}) => {
		if (!session?.scout) return;
		// Don't allow operation for non-admins
		// TODO: This method of controlling permissions is super scuffed
		if (!await admin(session?.scout.team, session?.scout.login)) {
			logger.warn('Non-admin attempt to change password', { login, scout: session?.scout, ip: socket.handshake.address });
			return socket.emit('team:update password', false);
		}
		
		const scout = await models.Scout.collection.findOne({ team: session?.scout.team, login });
		if (!scout) {
			socket.emit('alert', {page: 'admin', message: 'Scout does not exist. Unable to update password', type: 'danger'});
			return;
		}
		logger.verbose('Changing password', { login, scout: session?.scout, ip: socket.handshake.address });
		socket.emit('team:update password', !!(await models.Scout.updatePassword(scout, newPassword)));
	});

	socket.on('team:create scout', async ({login, name}: {login: string; name: string}) => {
		if (!session?.scout) return;
		if (!await admin(session?.scout.team, session?.scout.login)) {
			logger.warn('Non-admin attempt to create scout', { login, name, scout: session?.scout, ip: socket.handshake.address });
			return socket.emit('team:create scout', false);
		}

		const result = await models.Scout.register(login, '', session?.scout.team, name);

		logger.info('Create scout', { login, name, scout: session?.scout, ip: socket.handshake.address });
		if (result != RegisterResult.Successful) socket.emit('team:create scout', false);
		else socket.emit('team:create scout', true);
	});

	socket.on('team:delete scout', async (login) => {
		if (!session?.scout) return;
		if (!await admin(session?.scout.team, session?.scout.login)) {
			logger.warn('Non-admin attempt to delete scout', { login, scout: session?.scout, ip: socket.handshake.address });
			return socket.emit('team:delete scout', false);
		}
		const scout = await models.Scout.collection.findOne({team: session?.scout.team, login});
		if (scout && !scout.admin) if (await models.Scout.collection.deleteOne(scout)) return socket.emit('team:delete scout', true); 
		logger.info('Delete scout', { login, scout: session?.scout, ip: socket.handshake.address });
		socket.emit('team:delete scout', false);
	});
	
	socket.on('team:update form', async (form) => {
		if (!session?.scout) return;
		if (!await admin(session?.scout.team, session?.scout.login)) {
			logger.warn('Non-admin attempt to update form', { form, scout: session?.scout, ip: socket.handshake.address });
			return socket.emit('team:update form', false);
		}
		logger.info('Update form', { scout: session?.scout, ip: socket.handshake.address });
		logger.silly('Update form', { form, scout: session?.scout, ip: socket.handshake.address });
		let oldForm: Form | null = await models.Form.collection.findOne({id: form.id, ownerTeam: session?.scout.team});
		try {
			if (!oldForm) oldForm = Form.parse({id: form.id, ownerTeam: session?.scout.team});
			oldForm.sections = form.sections;
			oldForm.name = form.name;
			try {
				models.Form.collection.findOneAndUpdate({ id: form.id, ownerTeam: session.scout.team }, {$set: Form.parse(oldForm)}, {upsert: true});
			}
			catch (e) {
				console.log(e);
				logger.warn('Unable to update form', { form, scout: session?.scout, error: e, ip: socket.handshake.address });
			}
		}
		catch (e) {
			console.log(e);
			//TODO: Send alert
		}
	});

	socket.on('team:delete form', async (form: { id: string }) => {
		if (!session?.scout) return;
		if (!await admin(session?.scout.team, session?.scout.login)) {
			logger.warn('Non-admin attempt to delete form', { form, scout: session?.scout, ip: socket.handshake.address });
			return socket.emit('team:update form', false);
		}
		logger.info('Delete form', { form, scout: session?.scout, ip: socket.handshake.address });
		await models.Form.collection.deleteOne({ id: form.id, ownerTeam: session?.scout.team });
	});

	socket.on('team:set admin', async (data: {scout: Scout, admin: boolean}) => {
		if (!session?.scout) return;
		if (!await admin(session?.scout.team, session?.scout.login)) {
			logger.warn('Non-admin attempt set admin', { data, scout: session?.scout, ip: socket.handshake.address });
		}
		logger.info('Set admin', { target: data.scout, newValue: data.admin, scout: session?.scout, ip: socket.handshake.address });
		await models.Scout.collection.findOneAndUpdate({ ...data.scout, team: session?.scout.team }, { $set: { admin: data.admin } });
	});

	// TODO: There should only be one set of these listeners in the server
	// New connections can subscribe to relevant listeners
	const scoutListener = async (change: any) => {
		if (!session?.scout?.admin) return;
		sendScouts();
	};
	models.scoutEvents.on('change', scoutListener);

	const formListener = async () => {
		//if (!session?.scout?.admin) return;
		sendForms();
	};
	models.formEvents.on('change', formListener);

	socket.on('disconnect', () => {
		models.scoutEvents.off('change', scoutListener);
		models.formEvents.off('change', formListener);
	});
}

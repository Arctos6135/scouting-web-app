import { RegisterResult } from '../shared/dataClasses/OrganizationClass';
import models from './db';
import { IOServer, Socket } from './server';
import { getLogger } from './logging';
import ScoutClass from '../shared/dataClasses/ScoutClass';

const logger = getLogger('admin');

const scoutEvents = models.Scout.watch();
const formEvents = models.Form.watch();

scoutEvents.setMaxListeners(Infinity);
formEvents.setMaxListeners(Infinity);

export async function admin(org: string, login: string): Promise<boolean> {
	return await models.Scout.findOne({org, login}).then(scout => scout?.admin);
}

export default async function addListeners(socket: Socket, io: IOServer) {
	const session = socket.request.session;
	socket.on('organization:get url', async () => {
		if (session.scout) {
			const code = (await models.Organization.findOne({ orgID: session.scout.org })).orgID;
			//TODO: Maybe change to https
			socket.emit('organization:get url', 'http://' + socket.request.headers.host + '/login?orgID=' + code);
		}
	});

	const sendScouts = async () => {
		if (!await admin(session.scout.org, session.scout.login)) {
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

	socket.on('organization:get scouts', sendScouts);
	socket.on('organization:get forms', sendForms);

	socket.on('organization:update password', async ({login, newPassword}: {login: string; newPassword: string;}) => {
		// Don't allow operation for non-admins
		// TODO: This method of controlling permissions is super scuffed
		if (!await admin(session.scout.org, session.scout.login)) {
			logger.warn('Non-admin attempt to change password', { login, scout: session.scout, ip: socket.handshake.address });
			return socket.emit('organization:update password', false);
		}
		
		const scout = await models.Scout.findOne({ org: session.scout.org, login }).exec();
		console.log(scout);
		logger.verbose('Changing password', { login, scout: session.scout, ip: socket.handshake.address });
		socket.emit('organization:update password', !!(await scout?.updatePassword?.(newPassword)));
	});

	socket.on('organization:create scout', async ({login, name}: {login: string; name: string}) => {
		if (!await admin(session.scout.org, session.scout.login)) {
			logger.warn('Non-admin attempt to create scout', { login, name, scout: session.scout, ip: socket.handshake.address });
			return socket.emit('organization:create scout', false);
		}

		const result = await models.Scout.register(login, '', session.scout.org, name);

		logger.info('Create scout', { login, name, scout: session.scout, ip: socket.handshake.address });
		if (result != RegisterResult.Successful) socket.emit('organization:create scout', false);
		else socket.emit('organization:create scout', true);
	});

	socket.on('organization:delete scout', async (login) => {
		if (!await admin(session.scout.org, session.scout.login)) {
			logger.warn('Non-admin attempt to delete scout', { login, scout: session.scout, ip: socket.handshake.address });
			return socket.emit('organization:delete scout', false);
		}
		const scout = await models.Scout.findOne({org: session.scout.org, login}).exec();
		if (scout && !scout.admin) if (await scout.delete()) return socket.emit('organization:delete scout', true); 
		logger.info('Delete scout', { login, scout: session.scout, ip: socket.handshake.address });
		socket.emit('organization:delete scout', false);
	});
	
	socket.on('organization:update form', async (form) => {
		if (!await admin(session.scout.org, session.scout.login)) {
			logger.warn('Non-admin attempt to update form', { form, scout: session.scout, ip: socket.handshake.address });
			return socket.emit('organization:update form', false);
		}
		logger.info('Update form', { scout: session.scout, ip: socket.handshake.address });
		logger.silly('Update form', { form, scout: session.scout, ip: socket.handshake.address });
		let oldForm = await models.Form.findOne({id: form.id, ownerOrg: session.scout.org});
		if (!oldForm) oldForm = new models.Form({id: form.id, ownerOrg: session.scout.org});
		oldForm.sections = form.sections;
		oldForm.name = form.name;
		try {
			await oldForm.validate();
			await oldForm.save();
		}
		catch (e) {
			logger.warn('Unable to update form', { form, scout: session.scout, error: e, ip: socket.handshake.address });
		}
	});

	socket.on('organization:delete form', async (form: { id: string }) => {
		if (!await admin(session.scout.org, session.scout.login)) {
			logger.warn('Non-admin attempt to delete form', { form, scout: session.scout, ip: socket.handshake.address });
			return socket.emit('organization:update form', false);
		}
		logger.info('Delete form', { form, scout: session.scout, ip: socket.handshake.address });
		const current = await models.Form.findOne({ id: form.id, org: session.scout.org }).exec();
		if (current) await current.delete();
	});

	socket.on('organization:set admin', async (data: {scout: ScoutClass, admin: boolean}) => {
		if (!await admin(session.scout.org, session.scout.login)) {
			logger.warn('Non-admin attempt set admin', { data, scout: session.scout, ip: socket.handshake.address });
		}
		logger.info('Set admin', { target: data.scout, newValue: data.admin, scout: session.scout, ip: socket.handshake.address });
		await models.Scout.updateOne({ ...data.scout, org: session.scout.org }, { $set: {admin: data.admin } }).exec();
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

	socket.on('disconnect', () => {
		scoutEvents.off('change', scoutListener);
		formEvents.off('change', formListener);
	});
}

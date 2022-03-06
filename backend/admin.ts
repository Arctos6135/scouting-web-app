import * as socketio from 'socket.io';
import models from './db';
import {RegisterResult} from './db/models/User';
import {LoginResult, Scout} from './db/models/Scouting';
import { Form } from './db/models/Form';
import FormClass, { Section } from '../formSchema/Form';

export default async function addListeners(socket: socketio.Socket, io: socketio.Server) {
	const req: any = socket.handshake;

	socket.on('organization:get url', async () => {
		if (req.session.scout) {
			const code = (await models.Organization.findOne({ orgID: req.session.scout.org })).orgID;
			//TODO: Maybe change to https
			socket.emit('organization:get url', 'http://' + req.headers.host + '/login?orgID=' + code);
		}
	});

	const admin = () => !!req.session.scout?.admin;

	const sendScouts = async () => {
		if (!admin()) {
			socket.emit('organization:get scouts', []);
			return;
		}

		const scouts = await Scout.find({ org: req.session.scout.org });
		socket.emit('organization:get scouts', scouts);
	};

	const sendForms = async () => {
		if (!admin()) {
			socket.emit('organization:get forms', []);
			return;
		}

		const forms = await Form.find({ ownerOrg: req.session.scout.org });
		console.log(forms);
		socket.emit('organization:get forms', forms);
	};

	socket.on('organization:get scouts', sendScouts);
	socket.on('organization:get forms', sendForms);

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
	});
	
	socket.on('organization:update form', async (form: {id: string; name: string; sections: Section[]}) => {
		if (!admin()) return socket.emit('organization:update form', false);
		console.log(form);
		let oldForm = await Form.findOne({id: form.id, ownerOrg: req.session.scout.org});
		if (!oldForm) oldForm = new Form({id: form.id, ownerOrg: req.session.scout.org});
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
		const current = await Form.findOne({ id: form.id, org: req.session.scout.org }).exec();
		console.log(form, req.session.scout.org);
		if (current) await current.delete();
	});

	// TODO: There should only be one set of these listeners in the server
	// New connections can subscribe to relevant listeners
	const scoutEvents = Scout.watch();
	scoutEvents.on('change', async (change: any) => {
		if (!req.session.scout?.admin) return;
		sendScouts();
	});

	const formEvents = Form.watch();
	formEvents.on('change', async () => {
		if (!req.session.scout?.admin) return;
		sendForms();
	});

	socket.on('disconnect', () => {
		scoutEvents.close();
	});
}

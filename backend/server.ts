import 'dotenv/config';
import assert from 'assert';
assert(process.env.SECRET && process.env.MONGO_URL && process.env.DB_NAME);
import express from 'express';
import * as path from 'path';
import session, { Session, SessionData } from 'express-session';
import MongoStore from 'connect-mongo';
import socketio from 'socket.io';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import login from './login';
import admin from './admin';
import data from './data';
import { ClientToServerEvents, ServerToClientEvents } from '../shared/eventTypes';
import {IncomingMessage} from 'http';
import { Scout } from 'shared/dataClasses/Scout';
import models, { mongoUrl } from './db';

// Add browser crypto to globalThis
import { webcrypto } from 'crypto';
globalThis.crypto = webcrypto as unknown as Crypto;

const sess = session({
	secret: process.env.SECRET,
	store: MongoStore.create({ mongoUrl }),
	cookie: {
		maxAge: 30 * 24 * 60 * 60 * 1000
	}
});

const app = express();

const server = http.createServer(app);
const io = new socketio.Server<ClientToServerEvents, ServerToClientEvents>(server);

app.use(express.static('./dist'));
app.use(sess);
app.use(bodyParser.urlencoded());

io.use((socket, next) => {
	const req = socket.request as any;
	sess(req, req.res || {}, next as any);
});

io.on('connection', (socket: Socket) => {
	login(socket, io);
	admin(socket, io);
	data(socket, io);
	if (socket.request.session?.justVerified) {
		console.log('sending verification');
		socket.emit('alert', {
			type: 'success',
			message: 'Email verified',
			page: 'login',
		});
		socket.request.session.justVerified = false;
		socket.request.session.save();
	}
});

server.listen(parseInt(process.env.PORT ?? '8080'), '0.0.0.0');

export default app;
export type Socket = socketio.Socket<ClientToServerEvents, ServerToClientEvents> & {
	get request(): IncomingMessage & {
		session?: Session & Partial<SessionData>;
	}
};
export type IOServer = typeof io;

declare module 'express-session' {
	interface SessionData {
		scout: Scout;
		loggedIn: boolean;
		justVerified: boolean;
	}
}

app.get('/verify/:code', (req, res) => {
	console.log(req.params);
	models.Team.verify(req.params['code']).then(res => {
		if (res) req.session.justVerified = true;
		req.session.save();
	});
	res.redirect('/login');
	console.log(req.sessionID);
});
app.get('*', function (req, res) {
	res.sendFile(path.resolve(process.cwd(), './dist/index.html'));
});

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
	'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach(function (sig) {
	process.on(sig, async () => {
		server.close();
		process.exit(0);
	});
});

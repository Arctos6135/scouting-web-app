import 'dotenv/config';
import express from 'express';
import * as path from 'path';
import session, { Session, SessionData } from 'express-session';
import MongoStore from 'connect-mongo';
import socketio from 'socket.io';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';
import login from './login';
import admin from './admin';
import assignments from './assignments';
import {ScoutModel} from './db/models/Scouting';
import { ClientToServerEvents, ServerToClientEvents } from '../shared/eventTypes';
import ScoutClass from '../shared/dataClasses/ScoutClass';
import {IncomingMessage} from 'http';

const mongoUrl = process.env.MONGO_URL + '/' + process.env.DB_NAME;
mongoose.connect(mongoUrl);

const sess = session({
	secret: process.env.SECRET,
	store: MongoStore.create({ mongoUrl }),
	cookie: {
		maxAge: 60000*60*24
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

io.on('connection', (socket) => {
	login(socket, io);
	admin(socket, io);
	assignments(socket, io);
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
		scout: ScoutClass;
		loggedIn: boolean;
	}
}

app.get('*', function (req, res) {
	res.sendFile(path.resolve(process.cwd(), './dist/index.html'));
});

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
	'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach(function (sig) {
	process.on(sig, async () => {
		server.close();
		await ScoutModel.updateMany({}, {connections: 0}).exec();
		process.exit(0);
	});
});

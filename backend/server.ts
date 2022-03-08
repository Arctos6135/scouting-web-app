import 'dotenv/config';
import express from 'express';
import * as path from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import socketio from 'socket.io';
import sharedsession from 'express-socket.io-session';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';
import login from './login';
import admin from './admin';
import {ScoutModel} from './db/models/Scouting';
import { ClientToServerEvents, ServerToClientEvents } from '../shared/eventTypes';

const mongoUrl = process.env.MONGO_URL + '/' + process.env.DB_NAME;
console.log(mongoUrl);
mongoose.connect(mongoUrl);

const sess = session({
	secret: process.env.SECRET,
	store: MongoStore.create({ mongoUrl })
});

const app = express();

const server = http.createServer(app);
const io = new socketio.Server<ClientToServerEvents, ServerToClientEvents>(server);
app.use(express.static('./dist'));
app.use(sess);
app.use(bodyParser.urlencoded());

io.use(sharedsession(sess, {
	autoSave: true
}));

io.on('connection', (socket) => {
	login(socket, io);
	admin(socket, io);
});

server.listen(8080, '0.0.0.0');

export default app;
export type Socket = socketio.Socket<ClientToServerEvents, ServerToClientEvents>;
export type IOServer = typeof io;

app.get('*', function(req, res) {
	res.sendFile(path.resolve(process.cwd(), './dist/index.html'));
});

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
	'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach(function (sig) {
	process.on(sig, async () => {
		server.close();
		console.log('removing connections');
		await ScoutModel.updateMany({}, {connections: 0}).exec();
		console.log('removed connections');
		process.exit(0);
	});
});
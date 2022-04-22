import { configureStore } from '@reduxjs/toolkit';
import io, { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from 'shared/eventTypes';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
socket.connect();

import * as user from './reducers/user';
import * as alerts from './reducers/alerts';
import * as admin from './reducers/admin';
import debounce from 'lodash.debounce';

export const store = configureStore({
	reducer: {
		user: user.default.reducer,
		alerts: alerts.default.reducer,
		admin: admin.default.reducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

socket.on('connect', () => store.dispatch(user.setOnline(true)));
socket.on('disconnect', () => store.dispatch(user.setOnline(false)));

store.subscribe(debounce(() => {
	localStorage.setItem('user', JSON.stringify(store.getState().user));
	localStorage.setItem('admin', JSON.stringify(store.getState().admin));
}, 100));

socket.on('data:get responses', (resps) => {
	store.dispatch(user.setResponses(resps));
});

socket.on('team:get forms', f => store.dispatch(user.setForms(f)));

socket.on('team:get scouts', scouts => store.dispatch(admin.setScouts(scouts)));
socket.on('team:get url', url => store.dispatch(admin.setURL(url)));

socket.on('status', (data) => {
	if (data.scout?.team != store.getState().user?.scout?.team) socket.emit('team:get forms');
	console.log(data);
	store.dispatch(user.setScout(data.scout));
});

socket.emit('team:get forms');
socket.emit('data:get responses');

socket.on('alert', (alert) => {
	store.dispatch(alerts.addAlert(alert));
});

socket.emit('status');
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

socket.on('organization:get forms', f => store.dispatch(user.setForms(f)));

socket.on('organization:get scouts', scouts => store.dispatch(admin.setScouts(scouts)));
socket.on('organization:get url', url => store.dispatch(admin.setURL(url)));

socket.on('status', (data) => {
	store.dispatch(user.setScout(data.scout));
});

socket.emit('organization:get forms');
socket.emit('data:get responses');

socket.emit('status');
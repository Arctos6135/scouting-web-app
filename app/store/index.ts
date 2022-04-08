import { configureStore } from '@reduxjs/toolkit';
import io, { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from 'shared/eventTypes';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
socket.connect();

import * as user from './reducers/user';
import * as forms from './reducers/forms';
import * as alerts from './reducers/alerts';
import * as responses from './reducers/responses';
import * as admin from './reducers/admin';
import debounce from 'lodash.debounce';
import { throttle } from 'lodash';

export const store = configureStore({
	reducer: {
		user: user.default.reducer,
		forms: forms.default.reducer,
		alerts: alerts.default.reducer,
		responses: responses.default.reducer,
		admin: admin.default.reducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

socket.on('connect', () => store.dispatch(user.setOnline(true)));
socket.on('disconnect', () => store.dispatch(user.setOnline(false)));

store.subscribe(throttle(() => {
	localStorage.setItem('scout', JSON.stringify(store.getState().user));
	localStorage.setItem('responses', JSON.stringify(store.getState().responses));
	localStorage.setItem('admin', JSON.stringify(store.getState().admin));
	localStorage.setItem('forms', JSON.stringify(store.getState().forms));
	console.log(JSON.stringify(store.getState().responses));
}, 0));

socket.on('data:get responses', (resps) => {
	store.dispatch(responses.setResponses(resps));
});

socket.on('organization:get forms', f => store.dispatch(forms.setForms(f)));

socket.on('organization:get scouts', scouts => store.dispatch(admin.setScouts(scouts)));
socket.on('organization:get url', url => store.dispatch(admin.setURL(url)));

socket.on('status', (data) => {
	store.dispatch(user.setScout(data.scout));
});

socket.emit('organization:get forms');
socket.emit('data:get responses');
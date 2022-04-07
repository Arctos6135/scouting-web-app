import io, { Socket } from 'socket.io-client';
import { atom, useRecoilState, useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import * as React from 'react';
import { ClientToServerEvents, ServerToClientEvents } from '../shared/eventTypes';
import ScoutClass from '../shared/dataClasses/ScoutClass';
import ResponseClass from '../shared/dataClasses/ResponseClass';
import FormClass from '../shared/dataClasses/FormClass';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
socket.connect();

class LocalStorageEffect {
	private user = '';
	listeners: Set<(id: string) => void> = new Set();
	constructor() {
		this.user = localStorage.getItem('currentScoutId') ?? '';
	}
	setUser(id: string) {
		this.user = id;
		localStorage.setItem('currentScoutId', this.user);
		for (const listener of this.listeners) listener(id);
	}

	getUser() {
		return this.user;
	}

	effect(key: string, config: { default: any, static?: boolean }) {
		return ({setSelf, onSet}) => {
			const listener = () => {
				const fullKey = (config.static ? '' : this.user) + '/' + key;
				const savedValue = localStorage.getItem(fullKey);
				if (savedValue != null && savedValue != 'undefined') {
					setSelf(JSON.parse(savedValue) ?? config.default);
				}
				else {
					setSelf(config.default);
				}
			};
			listener();
			if (!config.static) this.listeners.add(listener);
			
			onSet((newValue, _, isReset) => {
				const fullKey = (config.static ? '' : this.user) + '/' + key;
				if (this.user == '' && !config.static) return;
				isReset
					? localStorage.setItem(fullKey, JSON.stringify(config.default))
					: localStorage.setItem(fullKey, JSON.stringify(newValue));
			});
		}
	}
}
const localStorageEffect = new LocalStorageEffect();

export const signedIn = atom<boolean>({
	key: 'loggedIn',
	default: false,
	effects: [localStorageEffect.effect('loggedIn', { default: false, static: true })]
});
// Store whether or not the currently logged in account is a scout or an admin
export const scout = atom<ScoutClass>({
	key: 'scout',
	default: new ScoutClass(), 
	effects: [localStorageEffect.effect('scout', { default: new ScoutClass(), static: true })]
});

export const scouts = atom<ScoutClass[]>({
	key: 'scouts',
	default: [], 
	effects: [localStorageEffect.effect('scouts', { default: [] })]
});

export const forms = atom<FormClass[]>({
	key: 'forms',
	default: [], 
	effects: [localStorageEffect.effect('forms', { default: [] })]
});

export const online = atom<boolean>({
	key: 'online',
	default: false
});

// Forms that are being worked on
export const activeForms = atom<ResponseClass[]>({
	key: 'activeReponses',
	default: [],
	effects: [localStorageEffect.effect('activeResponses', { default: [] })]
});

export const submitQueue = atom<ResponseClass[]>({
	key: 'submitQueue',
	default: [],
	effects: [localStorageEffect.effect('submitQueue', { default: [] })]
});

export const responses = atom<ResponseClass[]>({
	key: 'responses',
	default: [],
	effects: [localStorageEffect.effect('responses', { default: [] })]
});

export const useSocketEffect = (event: string, listener: any, ...args: any[]) => {
	return useEffect(() => {
		socket.on(event as any, listener);
		return () => {
			socket.off(event as any, listener);
		};
	}, ...args);
};

// Get status from server every ten seconds
// This is useful in case the session expires or something
setInterval((() => socket.emit('status')), 10000);
socket.emit('organization:get forms');
socket.emit('data:get responses');

// Invisible component that listens for changes
export default function LoginSitter() {
	const setSignedIn = useSetRecoilState(signedIn);
	const [scoutValue, setScout] = useRecoilState(scout);
	const setScouts = useSetRecoilState(scouts);
	const setForms = useSetRecoilState(forms);
	const setOnline = useSetRecoilState(online);
	const setResponses = useSetRecoilState(responses);

	useEffect(() => {
		const lis = (val: any) => {
			setSignedIn(!!val.scout);
			setScout(val.scout ?? {});
			socket.emit('organization:get forms');
			socket.emit('data:get responses');
		};
		socket.on('status', lis);
		return () => {
			socket.off('status', lis);
		};
	});

	const scoutPath = (scoutValue?.org ?? '') + '/' + (scoutValue?.login ?? '');
	useEffect(() => {
		localStorageEffect.setUser(scoutPath);
	}, [scoutPath]);

	useSocketEffect('connect', () => {
		setOnline(true);
	});

	useSocketEffect('disconnect', () => {
		setOnline(false);
	});

	useSocketEffect('data:get responses', (responses) => {
		setResponses(responses);
	});
	useSocketEffect('organization:get scouts', (scouts: ScoutClass[]) => {
		setScouts(scouts);
	});
	useSocketEffect('organization:get forms', (forms: FormClass[]) => {
		setForms(forms);
	});
	return <></>;
}

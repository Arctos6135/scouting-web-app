import io, { Socket } from 'socket.io-client';
import { atom, useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import * as React from 'react';
import { ClientToServerEvents, ServerToClientEvents } from '@scouting-app/shared/eventTypes';
import ScoutClass from '@scouting-app/shared/dataClasses/ScoutClass';
import AssignmentResponseClass from '@scouting-app/shared/dataClasses/AssignmentResponseClass';
import AssignmentClass from '@scouting-app/shared/dataClasses/AssignmentClass';
import FormClass from '@scouting-app/shared/dataClasses/FormClass';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
socket.connect();

const localStorageEffect = key => ({setSelf, onSet}) => {
	const savedValue = localStorage.getItem(key);
	if (savedValue != null && savedValue != 'undefined') {
		setSelf(JSON.parse(savedValue));
	}

	onSet((newValue, _, isReset) => {
		isReset
			? localStorage.removeItem(key)
			: localStorage.setItem(key, JSON.stringify(newValue));
	});
};

export const signedIn = atom<boolean>({
	key: 'loggedIn',
	default: false,
	effects: [localStorageEffect('loggedIn')]
});
// Store whether or not the currently logged in account is a scout or an admin
export const scout = atom<ScoutClass>({
	key: 'scout',
	default: new ScoutClass(), 
	effects: [localStorageEffect('scout')]
});

export const assignments = atom<AssignmentClass[]>({
	key: 'assignments',
	default: [],
	effects: [localStorageEffect('assignments')]
});

export const scouts = atom<ScoutClass[]>({
	key: 'scouts',
	default: [], 
	effects: [localStorageEffect('scouts')]
});

export const forms = atom<FormClass[]>({
	key: 'forms',
	default: [], 
	effects: [localStorageEffect('forms')]
});

export const online = atom<boolean>({
	key: 'online',
	default: false
});

export const submitQueue = atom<AssignmentResponseClass[]>({
	key: 'submitQueue',
	default: [],
	effects: [localStorageEffect('submitQueue')]
});

export const responses = atom<AssignmentResponseClass[]>({
	key: 'assignmentResponses',
	default: [],
	effects: [localStorageEffect('assignmentResponses')]
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
socket.emit('organization:get assignments');
socket.emit('organization:get forms');
socket.emit('assignment:get responses');

// Invisible component that listens for changes
export default function LoginSitter() {
	const setSignedIn = useSetRecoilState(signedIn);
	const setScout = useSetRecoilState(scout);
	const setAssignments = useSetRecoilState(assignments);
	const setScouts = useSetRecoilState(scouts);
	const setForms = useSetRecoilState(forms);
	const setOnline = useSetRecoilState(online);
	const setResponses = useSetRecoilState(responses);

	useEffect(() => {
		const lis = (val: any) => {
			setSignedIn(!!val.scout);
			setScout(val.scout);
			socket.emit('organization:get assignments');
			socket.emit('organization:get forms');
			socket.emit('assignment:get responses');
		};
		socket.on('status', lis);
		return () => {
			socket.off('status', lis);
		};
	});


	useSocketEffect('connect', () => {
		setOnline(true);
	});

	useSocketEffect('disconnect', () => {
		setOnline(false);
	});

	useSocketEffect('organization:get assignments', (assignments) => {
		setAssignments(assignments);
	});
	useSocketEffect('assignment:get responses', (responses) => {
		setResponses(responses);
	});
	useSocketEffect('organization:get scouts', (scouts: ScoutClass[]) => {
		setScouts(scouts);
	});
	useSocketEffect('organization:get forms', (forms: FormClass[]) => {
		console.log(forms);
		setForms(forms);
	});
	return <></>;
}

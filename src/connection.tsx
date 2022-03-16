import io, { Socket } from 'socket.io-client';
import { atom, useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import * as React from 'react';
import { ClientToServerEvents, ServerToClientEvents } from '../shared/eventTypes';
import ScoutClass from '../shared/dataClasses/ScoutClass';
import AssignmentResponseClass from '../shared/dataClasses/AssignmentResponseClass';
import AssignmentClass from '../shared/dataClasses/AssignmentClass';
import FormClass from '../shared/dataClasses/FormClass';

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

export const submitQueue = atom<AssignmentClass[]>({
	key: 'submitQueue',
	default: [],
	effects: [localStorageEffect('submitQueue')]
});

export const responses = atom<AssignmentResponseClass[]>({
	key: 'assignmentResponses',
	default: [],
	effects: [localStorageEffect('assignmentResponses')]
});

export const useSocketEffect = (event: keyof ServerToClientEvents, listener: ServerToClientEvents[typeof event], ...args: any[]) => {
	return useEffect(() => {
		socket.on(event, listener);
		return () => {
			socket.off(event, listener);
		};
	}, ...args);
};

// Get status from server every ten seconds
// This is useful in case the session expires or something
setInterval((() => socket.emit('status')), 10000);
socket.emit('organization:get assignments');
socket.emit('organization:get forms');

// Invisible component that listens for changes
export default function LoginSitter() {
	const setSignedIn = useSetRecoilState(signedIn);
	const setScout = useSetRecoilState(scout);
	const setAssignments = useSetRecoilState(assignments);
	const setScouts = useSetRecoilState(scouts);
	const setForms = useSetRecoilState(forms);
	useEffect(() => {
		const lis = (val: any) => {
			setSignedIn(!!val.scout);
			setScout(val.scout);
		};
		socket.on('status', lis);
		return () => {
			socket.off('status', lis);
		};
	});

	useSocketEffect('organization:get assignments', (assignments) => {
		setAssignments(assignments);
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

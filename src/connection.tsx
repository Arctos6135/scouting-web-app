import io from 'socket.io-client';
import { atom, useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import * as React from 'react';

export const socket = io();
socket.connect();

const localStorageEffect = key => ({setSelf, onSet}) => {
	const savedValue = localStorage.getItem(key)
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
export const scout = atom<any>({
	key: 'scout',
	default: {},
	effects: [localStorageEffect('scout')]
});

export const useSocketEffect = (event: string, listener: (...args: any) => void, ...args: any[]) => {
	return useEffect(() => {
		socket.on(event, listener);
		return () => {
			socket.off(event, listener);
		}
	}, ...args);
};

// Get status from server every ten seconds
// This is useful in case the session expires or something
setInterval((() => socket.emit('status')), 10000);

// Invisible component that listens for changes
export default function () {
	const setSignedIn = useSetRecoilState(signedIn);
	const setScout = useSetRecoilState(scout);
	useEffect(() => {
		const lis = (val: any) => {
			console.log(val);
			setSignedIn(!!val.scout);
			setScout(val.scout);
			console.log(val);
		}
		socket.on('status', lis);
		return () => {
			socket.off('status', lis);
		}
	});

	return <></>
}

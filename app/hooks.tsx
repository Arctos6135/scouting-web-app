import { useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch as useDispatchNoTypes, useSelector as useSelectorNoTypes } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import {socket} from './store';
import { ServerToClientEvents } from 'shared/eventTypes';

export const useDispatch = () => useDispatchNoTypes<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorNoTypes;

export const useSocketEffect: typeof socket.on = (event, listener, ...args: any[]): any => {
	return useEffect(() => {
		socket.on(event as any, listener);
		return () => {
			socket.off(event as any, listener);
		};
	}, ...args);
};

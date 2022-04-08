import { useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch as useDispatchNoTypes, useSelector as useSelectorNoTypes } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import {socket} from './store';

export const useDispatch = () => useDispatchNoTypes<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorNoTypes;

export const useSocketEffect = (event: string, listener: any, ...args: any[]) => {
	return useEffect(() => {
		socket.on(event as any, listener);
		return () => {
			socket.off(event as any, listener);
		};
	}, ...args);
};

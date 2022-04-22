import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'; 
import { AlertType } from 'shared/eventTypes';

type Alert = AlertType & { id: string };

const initialState: {[key: string]: Alert[]} = {};

const alerts = createSlice({
	name: 'alerts',
	initialState,
	reducers: {
		closeAlert(state, alert: PayloadAction<Alert>) {
			if (!state[alert.payload.page]) return;
			const index = state[alert.payload.page].findIndex(a => a.id == alert.payload.id);
			if (index > -1) state[alert.payload.page].splice(index, 1);
		},
		addAlert(state, alert: PayloadAction<AlertType>) {
			const newAlert: Alert = {...alert.payload, id: nanoid()};
			if (!state[alert.payload.page]) state[alert.payload.page] = [];
			state[alert.payload.page].push(newAlert);
			console.log(alert);
		}
	}
});

export const { closeAlert, addAlert } = alerts.actions;

export default alerts;
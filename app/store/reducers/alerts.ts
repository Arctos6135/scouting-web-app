import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { AlertType } from 'shared/eventTypes';

type Alert = AlertType & { id: string };

const initialState: {[key: string]: Alert[]} = {};

const alerts = createSlice({
	name: 'alerts',
	initialState,
	reducers: {
		closeAlert(state, alert: PayloadAction<Alert>) {
			state[alert.payload.type].splice(state[alert.payload.type].findIndex(a => a.id == alert.payload.id), 1);
		}
	}
});

export const { closeAlert } = alerts.actions;

export default alerts;
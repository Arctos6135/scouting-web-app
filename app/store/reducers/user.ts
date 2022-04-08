import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ScoutClass from 'shared/dataClasses/ScoutClass';

const initialState: {
	scout?: ScoutClass;
	online: boolean;
	lastUpdate: number;
} = {
	scout: undefined,
	online: false,
	lastUpdate: 0
};

const stored = localStorage.getItem('scout');
if (stored) {
	try {
		const val = JSON.parse(stored);
		if (Date.now() - val.lastUpdate < 3600*24*1000 * 30) initialState.scout = val.scout;
	}
	catch (e) {
		localStorage.removeItem('user');
	}
}

const user = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setScout(state, action: PayloadAction<ScoutClass>) {
			state.scout = action.payload;
			state.lastUpdate = Date.now();
		},
		setOnline(state, action: PayloadAction<boolean>) {
			state.online = action.payload;
		}
	}
});

export const { setScout, setOnline } = user.actions;
export default user;
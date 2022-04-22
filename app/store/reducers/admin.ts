import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Scout } from 'shared/dataClasses/Scout';

let initialState: {
	scouts: Scout[];
	teamURL: string;
} = { scouts: [], teamURL: '' };

const stored = localStorage.getItem('admin');
if (stored) {
	try {
		const val = JSON.parse(stored);
		initialState = val;
	}
	catch (e) {
		localStorage.removeItem('admin');
	}
}

const forms = createSlice({
	name: 'forms',
	initialState,
	reducers: {
		setScouts(state, action: PayloadAction<Scout[]>) {
			state.scouts = action.payload;
		},
		setURL(state, action: PayloadAction<string>) {
			state.teamURL = action.payload;
		}
	}
});

export const { setScouts, setURL } = forms.actions;
export default forms;
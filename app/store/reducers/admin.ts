import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { socket, store } from '..';
import debounce from 'lodash.debounce';
import ScoutClass from 'shared/dataClasses/ScoutClass';

let initialState: {
	scouts: ScoutClass[];
	orgURL: string;
} = { scouts: [], orgURL: '' };

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
		setScouts(state, action: PayloadAction<ScoutClass[]>) {
			state.scouts = action.payload;
		},
		setURL(state, action: PayloadAction<string>) {
			state.orgURL = action.payload;
		}
	}
});

export const { setScouts, setURL } = forms.actions;
export default forms;
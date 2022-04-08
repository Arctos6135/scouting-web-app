import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import debounce from 'lodash.debounce';
import FormClass from 'shared/dataClasses/FormClass';

let initialState: {
	schemas: {
		map: { [key: string]: FormClass };
		list: FormClass[]
	},
	data: {
		[formID: string]: {
			[key: string]: number | string
		}
	}
} = { 
	schemas: {
		map: {}, list: []
	},
	data: {}
};

const stored = localStorage.getItem('forms');
if (stored) {
	try {
		const val = JSON.parse(stored);
		initialState = val;
	}
	catch (e) {
		localStorage.removeItem('forms');
	}
}

const forms = createSlice({
	name: 'forms',
	initialState,
	reducers: {
		setForms(state, action: PayloadAction<FormClass[]>) {
			state.schemas.list = action.payload;
			state.schemas.map = {};
			for (let i = 0; i < action.payload.length; i++) {
				state.schemas.map[action.payload[i].id] = action.payload[i];
			}
		},
		setFormData(state, action: PayloadAction<{form: string, valueID: string, value: string | number}>) {
			if (!state.data[action.payload.form]) state.data[action.payload.form] = {};
			state.data[action.payload.form][action.payload.valueID] = action.payload.value;
		}
	}
});

export const { setForms, setFormData } = forms.actions;
export default forms;
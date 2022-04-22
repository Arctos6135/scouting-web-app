import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Scout } from 'shared/dataClasses/Scout';
import { Response } from 'shared/dataClasses/Response';
import { socket } from '..';
import { Form } from 'shared/dataClasses/Form';

const defaultForms: () => {
	schemas: {
		map: { [key: string]: Form };
		list: Form[]
	},
	data: {
		[formID: string]: {
			[key: string]: number | string
		}
	}
} = () => ({
	schemas: {
		map: {}, list: []
	},
	data: {}
});

const defaultResponses: () => {
	submitQueue: Response[];
	activeResponses: Response[];
	all: Response[];
} = () => ({
	submitQueue: [],
	activeResponses: [],
	all: []
});

let initialState: {
	scout: Scout | undefined;
	online: boolean;
	responses: ReturnType<typeof defaultResponses>;
	forms: ReturnType<typeof defaultForms>;
	storedResponses: {
		[key: string]: ReturnType<typeof defaultResponses>;
	},
	storedForms: {
		[team: string]: ReturnType<typeof defaultForms>;
	}
} = {
	scout: undefined,
	online: false,
	responses: defaultResponses(),
	storedResponses: {},
	forms: defaultForms(),
	storedForms: {}
};

const stored = localStorage.getItem('user');
if (stored) {
	try {
		const val = JSON.parse(stored);
		initialState = val;
	}
	catch (e) {
		localStorage.removeItem('user');
	}
}

const user = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setScout(state, action: PayloadAction<Scout | undefined>) {
			if (state.scout) {
				state.storedResponses[state.scout.team + '-' + state.scout.login] = state.responses;
				state.storedForms[state.scout.team] = state.forms;
			}
			state.scout = action.payload;
			state.responses = (state.scout && 
				state.storedResponses[state.scout.team + '-' + state.scout.login]) || defaultResponses();
			state.forms = (state.scout && state.storedForms[state.scout.team]) || defaultForms();
		},
		setOnline(state, action: PayloadAction<boolean>) {
			state.online = action.payload;
		},
		moveToSubmitQueue(state, id: PayloadAction<string>) {
			const idx = state.responses.activeResponses.findIndex(resp => resp.id == id.payload);
			if (idx > -1) {
				state.responses.activeResponses[idx].data = state.forms.data[id.payload];
				state.responses.submitQueue.push(state.responses.activeResponses[idx]);
				state.responses.activeResponses.splice(idx, 1);
			}
		},
		addToSubmitQueue(state, response: PayloadAction<Response>) {
			state.responses.submitQueue.push(response.payload);
		},
		submit(state) {
			for (const resp of state.responses.submitQueue) {
				socket.emit('data:respond', resp);
			}
			state.responses.submitQueue = [];
		},
		createResponse(state, response: PayloadAction<Response>) {
			state.responses.activeResponses.push(response.payload);
		},
		setResponses(state, responses: PayloadAction<Response[]>) {
			state.responses.all = responses.payload;
		},
		deleteResponse(state, id: PayloadAction<string>) {
			const idx = state.responses.activeResponses.findIndex(resp => resp.id == id.payload);
			if (idx > -1) state.responses.activeResponses.splice(idx, 1);
		},
		updateResponse(state, action: PayloadAction<{id: string, update: Response}>) {
			const idx = state.responses.activeResponses.findIndex(resp => resp.id == action.payload.id);
			if (idx > -1) state.responses.activeResponses[idx] = action.payload.update;
		},
		setForms(state, action: PayloadAction<Form[]>) {
			state.forms.schemas.list = action.payload;
			state.forms.schemas.map = {};
			for (let i = 0; i < action.payload.length; i++) {
				state.forms.schemas.map[action.payload[i].id] = action.payload[i];
			}
		},
		setFormData(state, action: PayloadAction<{form: string, valueID: string, value: string | number}>) {
			if (!state.forms.data[action.payload.form]) state.forms.data[action.payload.form] = {};
			state.forms.data[action.payload.form][action.payload.valueID] = action.payload.value;
		}
	}
});

export const { 
	setScout, 
	setOnline,
	moveToSubmitQueue, 
	submit, 
	createResponse, 
	setResponses, 
	addToSubmitQueue,
	deleteResponse,
	updateResponse,
	setForms,
	setFormData
} = user.actions;
export default user;
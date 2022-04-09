import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ScoutClass from 'shared/dataClasses/ScoutClass';
import ResponseClass from 'shared/dataClasses/ResponseClass';
import { socket } from '..';
import FormClass from 'shared/dataClasses/FormClass';

const defaultForms: () => {
	schemas: {
		map: { [key: string]: FormClass };
		list: FormClass[]
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
	submitQueue: ResponseClass[];
	activeResponses: ResponseClass[];
	all: ResponseClass[];
} = () => ({
	submitQueue: [],
	activeResponses: [],
	all: []
});

let initialState: {
	scout?: ScoutClass;
	online: boolean;
	responses: ReturnType<typeof defaultResponses>;
	forms: ReturnType<typeof defaultForms>;
	storedResponses: {
		[key: string]: ReturnType<typeof defaultResponses>;
	},
	storedForms: {
		[org: string]: ReturnType<typeof defaultForms>;
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
		setScout(state, action: PayloadAction<ScoutClass>) {
			if (state.scout) {
				state.storedResponses[state.scout.org + '-' + state.scout.login] = state.responses;
				state.storedForms[state.scout.org] = state.forms;
			}
			state.scout = action.payload;
			state.responses = (state.scout && 
				state.storedResponses[state.scout.org + '-' + state.scout.login]) || defaultResponses();
			state.forms = (state.scout && state.storedForms[state.scout.org]) || defaultForms();
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
		addToSubmitQueue(state, response: PayloadAction<ResponseClass>) {
			state.responses.submitQueue.push(response.payload);
		},
		submit(state) {
			for (const resp of state.responses.submitQueue) {
				socket.emit('data:respond', resp);
			}
			state.responses.submitQueue = [];
		},
		createResponse(state, response: PayloadAction<ResponseClass>) {
			state.responses.activeResponses.push(response.payload);
		},
		setResponses(state, responses: PayloadAction<ResponseClass[]>) {
			state.responses.all = responses.payload;
		},
		deleteResponse(state, id: PayloadAction<string>) {
			const idx = state.responses.activeResponses.findIndex(resp => resp.id == id.payload);
			if (idx > -1) state.responses.activeResponses.splice(idx, 1);
		},
		updateResponse(state, action: PayloadAction<{id: string, update: ResponseClass}>) {
			const idx = state.responses.activeResponses.findIndex(resp => resp.id == action.payload.id);
			if (idx > -1) state.responses.activeResponses[idx] = action.payload.update;
		},
		setForms(state, action: PayloadAction<FormClass[]>) {
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
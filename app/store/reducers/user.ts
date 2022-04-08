import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ScoutClass from 'shared/dataClasses/ScoutClass';
import ResponseClass from 'shared/dataClasses/ResponseClass';
import { socket } from '..';

let initialState: {
	scout?: ScoutClass;
	online: boolean;
	responses: {
		submitQueue: ResponseClass[];
		activeResponses: ResponseClass[];
		all: ResponseClass[];
	},
	storedResponses: {
		[key: string]: {
			submitQueue: ResponseClass[];
			activeResponses: ResponseClass[];
			all: ResponseClass[];
		}
	}
} = {
	scout: undefined,
	online: false,
	responses: {
		submitQueue: [],
		activeResponses: [],
		all: []
	},
	storedResponses: {}
};

const stored = localStorage.getItem('scout');
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
			if (state.scout) state.storedResponses[state.scout.org + '-' + state.scout.login] = state.responses;
			state.scout = action.payload;
			state.responses = (state.scout && 
				state.storedResponses[state.scout.org + '-' + state.scout.login]) || {
				submitQueue: [],
				activeResponses: [],
				all: []
			};
		},
		setOnline(state, action: PayloadAction<boolean>) {
			state.online = action.payload;
		},
		moveToSubmitQueue(state, id: PayloadAction<string>) {
			const idx = state.responses.activeResponses.findIndex(resp => resp.id == id.payload);
			if (idx > -1) {
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
	addToSubmitQueue
} = user.actions;
export default user;
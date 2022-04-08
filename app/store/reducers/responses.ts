import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import ResponseClass from 'shared/dataClasses/ResponseClass';
import { socket } from '..';

let initialState: {
	submitQueue: ResponseClass[];
	activeResponses: ResponseClass[];
	responses: ResponseClass[];
} = {
	submitQueue: [],
	activeResponses: [],
	responses: []
};
const stored = localStorage.getItem('responses');
try {
	// TODO: Proper validation of parsed data
	initialState = JSON.parse(stored);
}
catch (e) {
	localStorage.removeItem('responses');
}

const alerts = createSlice({
	name: 'responses',
	initialState,
	reducers: {
		moveToSubmitQueue(state, id: PayloadAction<string>) {
			const idx = state.activeResponses.findIndex(resp => resp.id == id.payload);
			if (idx > -1) {
				state.submitQueue.push(state.activeResponses[idx]);
				state.activeResponses.splice(idx, 1);
			}
		},
		addToSubmitQueue(state, response: PayloadAction<ResponseClass>) {
			state.submitQueue.push(response.payload);
		},
		submit(state) {
			for (const resp of state.submitQueue) {
				socket.emit('data:respond', resp);
			}
			state.submitQueue = [];
		},
		createResponse(state, response: PayloadAction<ResponseClass>) {
			state.activeResponses.push(response.payload);
		},
		setResponses(state, responses: PayloadAction<ResponseClass[]>) {
			state.responses = responses.payload;
		}
	}
});

export const { moveToSubmitQueue, submit, createResponse, setResponses, addToSubmitQueue } = alerts.actions;
export default alerts;